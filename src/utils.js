import { Position, MarkerType } from 'reactflow';
import { tree } from "./Model/Parse"
import { JavaClass } from "./Model/JavaClass"

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode, targetNode) {
    // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
    const {
        width: intersectionNodeWidth,
        height: intersectionNodeHeight,
        positionAbsolute: intersectionNodePosition,
    } = intersectionNode;
    const targetPosition = targetNode.positionAbsolute;

    const w = intersectionNodeWidth / 2;
    const h = intersectionNodeHeight / 2;

    const x2 = intersectionNodePosition.x + w;
    const y2 = intersectionNodePosition.y + h;
    const x1 = targetPosition.x + w;
    const y1 = targetPosition.y + h;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node, intersectionPoint) {
    const n = { ...node.positionAbsolute, ...node };
    const nx = Math.round(n.x);
    const ny = Math.round(n.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1) {
        return Position.Left;
    }
    if (px >= nx + n.width - 1) {
        return Position.Right;
    }
    if (py <= ny + 1) {
        return Position.Top;
    }
    if (py >= n.y + n.height - 1) {
        return Position.Bottom;
    }

    return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, target) {
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);

    const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
    const targetPos = getEdgePosition(target, targetIntersectionPoint);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos,
        targetPos,
    };
}

function calculateBarycenters(nodes, edges) {
    const barycenters = nodes.map((node) => {
      const connectedEdges = edges.filter((edge) => edge.source === node.id || edge.target === node.id);
      const sum = connectedEdges.reduce((acc, edge) => {
        const otherNodeId = edge.source === node.id ? edge.target : edge.source;
        const otherNodeIndex = nodes.findIndex((n) => n.id === otherNodeId);
        return acc + otherNodeIndex;
      }, 0);
      const average = sum / connectedEdges.length;
      return { nodeId: node.id, barycenter: average };
    });
  
    return barycenters;
}

function getNestedMembers(packageName) {
    const node = tree.getNode(packageName);
    const nestedMembers = [];
  
    node.children.forEach(child => {
      if (child instanceof JavaClass) {
        nestedMembers.push(child.pack);
      } else {
        nestedMembers.push(...getNestedMembers(child.pack));
      }
    });
  
    return nestedMembers;
  }

export function createNodesAndEdges(param, useBarycenter) {
    const nodes = [];
    const edges = [];

    // Create nodes for each class
    const myNodes = tree.getPackageContent(param)

    myNodes.forEach(cls => {
        const nodeId = cls.pack
        const nestedMembers = getNestedMembers(nodeId);
        const weight = nestedMembers.length;
        if(tree.getNode(nodeId).children.size === 0) {
            // Create node for class/interface
            if (tree.getNode(nodeId) instanceof (JavaClass)) {
                const nodeTmp = tree.getNode(nodeId);
                let nodeType;
                if (nodeTmp.type === "class") {
                    nodeType = 'classNode';
                } else if (nodeTmp.type === "interface") {
                    nodeType = 'interfaceNode';
                }
                const node = {
                    id: nodeId,
                    type: nodeType,
                    data: {
                        id: nodeId,
                        label: cls.name,
                        isSelected: false,
                        weight: weight,
                    },
                    position: { x: 0, y: 0}
                }
                nodes.push(node)
            }
        } else {
            // Create node for package
            const node = {
                id: nodeId,
                type: 'packageNode',
                data: {
                    id: nodeId,
                    label: cls.name,
                    isSelected: false,
                    weight: weight,
                },
                position: { x: 0, y: 0}
            }
            nodes.push(node)
        }
    })

    myNodes.forEach(cls => {
        const node = nodes.find(n => n.id === cls.pack);
        const nestedMembers = getNestedMembers(cls.pack);
        cls.classInvokation.forEach(invokedClass => {
            const inheritedNode = nodes.find(n => n.id === invokedClass);
            if (inheritedNode === undefined) return;
            const edgeWeight = nestedMembers.length + getNestedMembers(invokedClass).length;
            edges.push({
                id: `${node.id}-invokes-${inheritedNode.id}`,
                source: node.id,
                target: inheritedNode.id,
                type: "floating",
                animated: false,
                label: "invokes",
                labelStyle: { width: "50px", height: "20px", fill: "#f6ab6c", fontWeight: 700 },
                markerEnd: {
                    type: MarkerType.Arrow,
                },
                data: {
                    isSelected : false,
                    nonSelected : true,
                    weight: edgeWeight,
                }
            })
        })
        cls.classImplements.forEach(implementedClass => {
            const implementedNode = nodes.find(n => n.id === implementedClass);
            if (implementedNode === undefined) return;
            const edgeWeight = nestedMembers.length + getNestedMembers(implementedClass).length;
            edges.push({
                id: `${node.id}-implements-${implementedNode.id}`,
                source: node.id,
                target: implementedNode.id,
                type: "floating",
                animated: false,
                label: "implements",
                labelStyle: { fill: "#0000FF", fontWeight: 900 },
                markerEnd: {
                    type: MarkerType.Arrow,
                },
                data: {
                    isSelected : false,
                    nonSelected : true,
                    weight: edgeWeight,
                }
            })
        })
        cls.classInherits.forEach(inheritedClass => {
            const inheritedNode = nodes.find(n => n.id === inheritedClass);
            if (inheritedNode === undefined) return;
            const edgeWeight = nestedMembers.length + getNestedMembers(inheritedClass).length;
            edges.push({
                id: `${node.id}-inherits-${inheritedNode.id}`,
                source: node.id,
                target: inheritedNode.id,
                type: "floating",
                animated: false,
                label: "inherits",
                labelStyle: { fill: "#00FFFF", fontWeight: 900 },
                markerEnd: {
                    type: MarkerType.Arrow,
                },
                data: {
                    isSelected : false,
                    nonSelected : true,
                    weight: edgeWeight,
                }
            })
        })
    })

     // Calculate the positions of the nodes in a circular layout
     const numNodes = nodes.length;
     const barycenters = calculateBarycenters(nodes, edges);
     nodes.sort((a, b) => {
         const aBarycenter = barycenters.find((bc) => bc.nodeId === a.id).barycenter;
         const bBarycenter = barycenters.find((bc) => bc.nodeId === b.id).barycenter;
         return aBarycenter - bBarycenter;
     });
     const radius = 200 + (numNodes - 5) * 20;
     nodes.forEach((node, index) => {
         const angle = (index / numNodes) * 2 * Math.PI;
         node.position = {
             x: Math.cos(angle) * radius + 400,
             y: Math.sin(angle) * radius + 300
         };
     });
    return { nodes, edges };
}


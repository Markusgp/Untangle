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

function calculateEdges(nodes) {
    let edges = []
    nodes.forEach(node => {
        if (node.type === 'openedPackageNode') return
        const cls = tree.getNode(node.id)
        if (cls === undefined) return
        cls.classInvokation.forEach(invokedClass => {
            const invokedNode = nodes.find(n => n.id === invokedClass)
            if (invokedNode == undefined) return
            if (invokedNode.type === 'openedPackageNode') return
            edges.push({
                id: `${node.id}-invokes-${invokedNode.id}`,
                source: node.id,
                target: invokedNode.id,
                type: "floating",
                animated: false,
                label: "invokes",
                labelStyle: { fill: "#f6ab6c", fontWeight: 700 },
                markerEnd: {
                    type: MarkerType.Arrow,
                },
                data: {
                    isSelected : false,
                    nonSelected : true
                }
            })
        })
        cls.classImplements.forEach(implementedClass => {
            const implementedNode = nodes.find(n => n.id === implementedClass)
            if (implementedNode == undefined) return
            if (implementedNode.type === 'openedPackageNode') return
            edges.push({
                id: `${node.id}-implements-${implementedNode.id}`,
                source: node.id,
                target: implementedNode.id,
                type: "floating",
                animated: false,
                label: "implements",
                labelStyle: { fill: "#f6ab6c", fontWeight: 700 },
                markerEnd: {
                    type: MarkerType.Arrow,
                },
                data: {
                    isSelected : false,
                    nonSelected : true
                }
            })
        })
        cls.classInherits.forEach(inheritedClass => {
            const inheritedNode = nodes.find(n => n.id === inheritedClass)
            if (inheritedNode == undefined) return
            if (inheritedNode.type === 'openedPackageNode') return
            edges.push({
                id: `${node.id}-inherits-${inheritedNode.id}`,
                source: node.id,
                target: inheritedNode.id,
                type: "floating",
                animated: false,
                label: "inherits",
                labelStyle: { fill: "#f6ab6c", fontWeight: 700 },
                markerEnd: {
                    type: MarkerType.Arrow,
                },
                data: {
                    isSelected : false,
                    nonSelected : true
                }
            })
        })
    })
    return edges
}

export function createNodesAndEdges(prevNodes,prevEdges,param, useBarycenter) {
    let nodes = [];
    let edges = [];
    let oldNodes = prevNodes
    let oldEdges = prevEdges
    // Create nodes for each class
    const myNodes = tree.getPackageContent(param)

    myNodes.forEach(cls => {
        const nodeId = cls.pack
        if(tree.getNode(nodeId).children.size === 0) {

            if (tree.getNode(nodeId) instanceof (JavaClass)) {

                const nodeTmp = tree.getNode(nodeId);
                if (nodeTmp.type === "class") {
                    const node = {
                        id: nodeId,
                        type: 'classNode',
                        data: {
                            id: nodeId,
                            label: cls.name,
                            isSelected: false
                        },
                        position: { x: 0, y: 0}
                    }
                    if (prevNodes.length > 0) node.parentNode = param
                    nodes.push(node)

                } else if (nodeTmp.type === "interface") {
                    const node = {
                        id: nodeId,
                        type: 'interfaceNode',
                        data: {
                            id: nodeId,
                            label: cls.name,
                            isSelected: false
                        },
                        position: { x: 0, y: 0},
                    }
                    if (oldNodes.length > 0) node.parentNode = param
                    nodes.push(node)
                }
            }
        } else {
            const node = {
                id: nodeId,
                type: 'packageNode',
                data: {
                    id: nodeId,
                    label: cls.name,
                    isSelected: false
                },
                position: { x: 0, y: 0}
            }
            if (oldNodes.length > 0) node.parentNode = param
            nodes.push(node)
        }

      })
      edges = calculateEdges(nodes)

    // Calculate the positions of the nodes in a circular layout
    if (useBarycenter) {
        const barycenters = calculateBarycenters(nodes, edges);
        nodes.sort((a, b) => {
            const aBarycenter = barycenters.find((bc) => bc.nodeId === a.id).barycenter;
            const bBarycenter = barycenters.find((bc) => bc.nodeId === b.id).barycenter;
            return aBarycenter - bBarycenter;
        });
    }
    const numNodes = nodes.length;

    let radius = 0
    let totalWidth = 0
    let totalCircumference = 0
    let angleSoFar = 0
    if (oldNodes.length > 0){
        let packageNode = oldNodes.find(n => n.id === param)
        packageNode.type = "openedPackageNode"

        totalWidth = nodes.reduce((sum, node) => sum + 110, 0);
        totalCircumference = totalWidth * 130 / 100
        radius = totalCircumference / (2*Math.PI)
        packageNode.width = radius*2+150
        packageNode.height = radius*2+150
        packageNode.style = {backgroundColor: 'rgba(111, 168, 255, 0.4)',width: radius*2+150, height: radius*2+150}
        
        let tempNode = packageNode
        while (tempNode.parentNode !== undefined){

            totalWidth = oldNodes.reduce((sum, node) => {
                if (node.parentNode === tempNode.parentNode){
                    return sum + node.width
                } 
                else return sum 
            }, 0);
            totalCircumference = totalWidth * 130 / 100
            radius = totalCircumference / (2*Math.PI)
            angleSoFar = 0
            tempNode = oldNodes.find(n => n.id == tempNode.parentNode)

            tempNode.width = radius*2 + 150
            tempNode.height = radius*2 + 150
            tempNode.style = {backgroundColor: 'rgba(111, 168, 255, 0.2)',width: radius*2+150, height: radius*2+150}

            oldNodes.forEach((node) => {
                if (node.parentNode === tempNode.id){
                    const angle = (node.width / totalCircumference) * (2 * Math.PI) * 1.3;
                    angleSoFar += angle/2
                    const xPos = 75+radius + radius * Math.cos(angleSoFar) - node.width/2;
                    const yPos = 50+radius + radius * Math.sin(angleSoFar) - node.height/2;
                    angleSoFar += angle/2;
                    node.position = {
                        x: xPos,
                        y: yPos
                    }
                }
            });

        }

        totalWidth = oldNodes.reduce((sum, node) => {
            if (node.parentNode === undefined) return sum + node.width
            else return sum 
        }, 0);
        totalCircumference = totalWidth * 130 / 100
        radius = totalCircumference / (2*Math.PI)
        angleSoFar = 0

        oldNodes.forEach((node) => {
            if (node.parentNode === undefined){
                const angle = (node.width / totalCircumference) * (2 * Math.PI) * 1.3;
                angleSoFar += angle/2
                const xPos = 400 + radius * Math.cos(angleSoFar) - node.width/2;
                const yPos = 300 + radius * Math.sin(angleSoFar) - node.height/2;
                angleSoFar += angle/2;
    
                node.position = {
                    x: xPos,
                    y: yPos
                }
            }
            
        });

    }
    totalWidth = nodes.reduce((sum, node) => sum + 110 , 0);
    totalCircumference = totalWidth * 1.3

    radius = totalCircumference / (2*Math.PI)
    angleSoFar = 0
    nodes.forEach((node) =>{
        const angle = (110/ totalCircumference) * (2 * Math.PI) * 1.3;
        angleSoFar += angle/2
        const xPos =  200+radius + radius * Math.cos(angleSoFar) - 55-100;
        const yPos =  50+radius + radius * Math.sin(angleSoFar) - 20;
        angleSoFar += angle/2;
        node.position = {
            x: xPos,
            y: yPos
        }
    })
   
    if (oldNodes.length > 0){
        nodes = oldNodes.concat(nodes)
        edges = calculateEdges(nodes)
        return { nodes, edges}
    }
    return { nodes, edges };
}

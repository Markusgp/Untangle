import { Position, MarkerType } from 'reactflow';
import { tree } from "./Parse"
import { JavaClass } from "./JavaClass"
import { forceSimulation, forceManyBody, forceCenter, forceCollide } from 'd3-force';


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

function dependencyForce(nodes, edges, strength = 50) {
    const nodeById = new Map(nodes.map((node) => [node.id, node]));

    function force(alpha) {
        edges.forEach((edge) => {
            const source = nodeById.get(edge.source);
            const target = nodeById.get(edge.target);

            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance === 0) return;

            const k = (strength * alpha) / distance;

            const fx = dx * k;
            const fy = dy * k;

            source.vx += fx;
            source.vy += fy;
            target.vx -= fx;
            target.vy -= fy;
        });
    }

    return force;
}

function simulateForceLayout(nodes, edges) {
    const simulation = forceSimulation(nodes)
        .force("charge", forceManyBody())
        .force("center", forceCenter(400, 300))
        .force("collide", forceCollide(150))
        .force("dependency", dependencyForce(nodes, edges))
        .stop();

    // Run simulation for a fixed number of iterations
    const numIterations = 100; // Increase the number of iterations for better convergence
    for (let i = 0; i < numIterations; ++i) {
        simulation.tick();
    }

    // Update node positions based on simulation results
    nodes.forEach((node, index) => {
        node.position = { x: nodes[index].x, y: nodes[index].y };
    });

    return { nodes, edges };
}

export function createNodesAndEdges(param, useBarycenter, layout = 'force') {
    const nodes = [];
    const edges = [];

    // Create nodes for each class
    const myNodes = tree.getPackageContent(param)

    myNodes.forEach(cls => {
        const nodeId = cls.pack
        if (tree.getNode(nodeId).children.size === 0) {

            if (tree.getNode(nodeId) instanceof (JavaClass)) {

                const nodeTmp = tree.getNode(nodeId);
                if (nodeTmp.type === "class") {
                    const node = {
                        id: nodeId,
                        type: 'classNode',
                        data: {
                            id: nodeId,
                            label: cls.name
                        },
                        position: { x: 0, y: 0 }
                    }
                    nodes.push(node)

                } else if (nodeTmp.type === "interface") {
                    const node = {
                        id: nodeId,
                        type: 'interfaceNode',
                        data: {
                            id: nodeId,
                            label: cls.name
                        },
                        position: { x: 0, y: 0 }
                    }
                    nodes.push(node)
                }
            }
        } else {
            const node = {
                id: nodeId,
                type: 'packageNode',
                data: {
                    id: nodeId,
                    label: cls.name
                },
                position: { x: 0, y: 0 }
            }
            nodes.push(node)
        }

    })

    myNodes.forEach(cls => {
        const node = nodes.find(n => n.id == cls.pack)
        cls.classInvokation.forEach(invokedClass => {
            const inheritedNode = nodes.find(n => n.id === invokedClass)
            if (inheritedNode === undefined) return
            edges.push({
                id: `${node.id}-invokes-${inheritedNode.id}`,
                source: node.id,
                target: inheritedNode.id,
                type: "floating",
                animated: false,
                label: "invokes",
                labelStyle: { fill: "#f6ab6c", fontWeight: 700 },
                markerEnd: {
                    type: MarkerType.Arrow,
                }
            })
        })
        cls.classImplements.forEach(implementedClass => {
            const implementedNode = nodes.find(n => n.id == implementedClass)
            if (implementedNode === undefined) return
            edges.push({
                id: `${node.id}-implements-${implementedNode.id}`,
                source: node.id,
                target: implementedNode.id,
                type: "floating",
                animated: true,
                label: "implements",
                labelStyle: { fill: "#0000FF", fontWeight: 900 },
                markerEnd: {
                    type: MarkerType.Arrow,
                }
            })
        })
        cls.classInherits.forEach(inheritedClass => {
            const inheritedNode = nodes.find(n => n.id == inheritedClass)
            if (inheritedNode === undefined) return
            edges.push({
                id: `${node.id}-inherits-${inheritedNode.id}`,
                source: node.id,
                target: inheritedNode.id,
                type: "floating",
                animated: true,
                label: "inherits",
                labelStyle: { fill: "#FF0000", fontWeight: 900 },
                markerEnd: {
                    type: MarkerType.Arrow,
                }
            })
        })

    })
    if (layout === 'force') {
        const { nodes: forceNodes, edges: forceEdges } = simulateForceLayout(nodes, edges);
        return { nodes: forceNodes, edges: forceEdges };
    } else {
        // Calculate the positions of the nodes in a circular layout
        const numNodes = nodes.length;
        if (useBarycenter) {
            const barycenters = calculateBarycenters(nodes, edges);
            nodes.sort((a, b) => {
                const aBarycenter = barycenters.find((bc) => bc.nodeId === a.id).barycenter;
                const bBarycenter = barycenters.find((bc) => bc.nodeId === b.id).barycenter;
                return aBarycenter - bBarycenter;
            });
        }
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
}

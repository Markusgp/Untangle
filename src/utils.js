import { MarkerType, StepEdge } from 'reactflow';
//TODO Markus bruger vi dem her?
import { forceSimulation, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import {DepLabelTypes} from "./Types/DepLabelTypes";
import {NodeTypes} from "./Types/NodeTypes";


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

function calculateEdges(nodes, tree) {
    let edges = [];

    function createEdge(node, invokedNode, typeString, edgeWeight) {
        return {
            id : `${node.id}-${typeString}-${invokedNode.id}`,
            source: node.id,
            target: invokedNode.id,
            type: "floating",
            animated: false,
            label: typeString,
            //labelStyle: { fill: "#f6ab6c", fontWeight: 700 }, //Todo not used is redundant
            markerEnd: {
                type: MarkerType.Arrow,
                width: 15
            },
            data: {
                isSelected: false,
                nonSelected: true,
                weight: edgeWeight
            }
        }
    }

    nodes.forEach(node => {
        if (node.type === NodeTypes.OpenedPackageNode) return
        const cls = tree.getNode(node.id)
        if (cls === undefined) return

        cls.classInvocation.forEach(invokedClass => {
            const invokedNode = nodes.find(n => n.id === invokedClass)
            if (invokedNode === undefined || invokedNode.type === NodeTypes.OpenedPackageNode) return
            const edgeWeight = tree.getNumInvocations(node.id) * 2 - 15;
            edges.push(createEdge(node, invokedNode, DepLabelTypes.Invokes, edgeWeight));
        })

        cls.classImplements.forEach(implementedClass => {
            const implementedNode = nodes.find(n => n.id === implementedClass)
            if (implementedNode === undefined || implementedNode.type === NodeTypes.OpenedPackageNode) return
            const edgeWeight = tree.getNumImplementations(node.id) * 2 - 15;
            edges.push(createEdge(node, implementedNode, DepLabelTypes.Implements, edgeWeight))
        })

        cls.classInherits.forEach(inheritedClass => {
            const inheritedNode = nodes.find(n => n.id === inheritedClass)
            if (inheritedNode === undefined ||inheritedNode.type === NodeTypes.OpenedPackageNode) return
            const edgeWeight = tree.getNumInheritances(node.id) * 2 - 15;
            edges.push(createEdge(node, inheritedNode, DepLabelTypes.Inherits, edgeWeight));
        })
    })
    return edges
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

function simulateForceLayout(nodes, edges, hiddenNodes) {
    //Reset position of nodes to 0
    nodes.forEach((node) => {
        node.position = { x: 0, y: 0 };
        if (node.parentNode !== null) node.parent = node.parentNode
        node.parentNode = null
    });
    const simulationNodes = nodes.filter(node => !hiddenNodes.find(hiddenNode => hiddenNode.id === node.id));
    const simulationEdges = edges.filter(edge => !hiddenNodes.find(hiddenNode => hiddenNode.id === edge.source) && !hiddenNodes.find(hiddenNode => hiddenNode.id === edge.target));
    const simulation = forceSimulation(simulationNodes)
        .force("collide", forceCollide(150))
        .force("dependency", dependencyForce(simulationNodes, simulationEdges))
        .stop();


    // Run simulation for a fixed number of iterations
    //TODO This should definitely be a property
    const numIterations = 600; // Increase the number of iterations for better convergence
    for (let i = 0; i < numIterations; ++i) {
        simulation.tick();
    }



    // Update node positions based on simulation results
    simulationNodes.forEach((node, index) => {
        node.position = { x: simulationNodes[index].x, y: simulationNodes[index].y };
    });

    return { nodes, edges };
}

function filterNodes(nodes, parent) {
    let filteredNodes = []

    filteredNodes = nodes.filter(node => node.parentNode === parent.id || node.parent === parent.id)
    if (filteredNodes.length <= 0) return []
    filteredNodes.forEach(node => filteredNodes.push(...filterNodes(nodes, node)))

    return filteredNodes
}

//Todo have not used NodeTypes Enum
function distrubuteNodes(oldNodes, packageNode,totalWidth,radius,totalCircumference) {
    let tempNode = packageNode
    let angleSoFar = 0
    while (tempNode.parentNode !== undefined) {
        totalWidth = oldNodes.reduce((sum, node) => {
            if (node.parentNode === tempNode.parentNode) {
                return sum + Math.max(node.width, node.height)
            }
            else return sum
        }, 0);
        totalCircumference = totalWidth * 130 / 100
        radius = totalCircumference / (2 * Math.PI)
        angleSoFar = 0
        tempNode = oldNodes.find(n => n.id == tempNode.parentNode)

        tempNode.width = radius * 2 + 155
        tempNode.height = radius * 2 + 155
        tempNode.style = { backgroundColor: 'rgba(111, 168, 255, 0.2)', width: radius * 2 + 155, height: radius * 2 + 155 }

        let adjustedLeftX = Number.MAX_VALUE
        let adJustedRightX = Number.MIN_VALUE
        let adjustedLeftY = Number.MAX_VALUE
        let adJustedRightY = Number.MIN_VALUE

        oldNodes.forEach((node) => {
            if (node.parentNode === tempNode.id) {
                const angle = ((Math.max(node.width, node.height)) / totalCircumference) * (2 * Math.PI) * 1.3;
                angleSoFar += angle / 2
                const xPos = 75 + radius + radius * Math.cos(angleSoFar) - node.width / 2;
                const yPos = 50 + radius + radius * Math.sin(angleSoFar) - node.height / 2;
                angleSoFar += angle / 2;
                node.position = {
                    x: xPos,
                    y: yPos
                }
                adjustedLeftX = Math.min(adjustedLeftX, node.position.x, 0)
                adJustedRightX = Math.max(adJustedRightX, node.position.x + node.width, tempNode.width)
                adjustedLeftY = Math.min(adjustedLeftY, node.position.y, 0)
                adJustedRightY = Math.max(adJustedRightY, node.position.y + node.height, tempNode.height)
            }
        });
        oldNodes.forEach((node) => {
            if (node.parentNode === tempNode.id) {
                node.position.x += Math.abs(adjustedLeftX)
                node.position.y += Math.abs(adjustedLeftY)
            }
        })

        tempNode.width = Math.abs(adJustedRightX - adjustedLeftX)
        tempNode.height = Math.abs(adJustedRightY - adjustedLeftY)
        tempNode.style = { backgroundColor: 'rgba(111, 168, 255, 0.2)', width: Math.abs(adJustedRightX - adjustedLeftX), height: Math.abs(adJustedRightY - adjustedLeftY) }

    }
    totalWidth = oldNodes.reduce((sum, node) => {
        if (node.parentNode === undefined) return sum + Math.max(node.width, node.height)
        else return sum
    }, 0);
    totalCircumference = totalWidth * 130 / 100
    radius = totalCircumference / (2 * Math.PI)
    angleSoFar = 0
    oldNodes.forEach((node) => {
        if (node.parentNode === undefined) {
            const angle = ((Math.max(node.width, node.height)) / totalCircumference) * (2 * Math.PI) * 1.3;
            angleSoFar += angle / 2
            const xPos = 400 + radius * Math.cos(angleSoFar) - node.width / 2;
            const yPos = 300 + radius * Math.sin(angleSoFar) - node.height / 2;
            angleSoFar += angle / 2;

            node.position = {
                x: xPos,
                y: yPos
            }
        }

    });


}

export function createNodesAndEdges(prevNodes, prevEdges, param, useBarycenter, layout, tree) {
    let nodes = [];
    let edges = [];
    let oldNodes = prevNodes
    let oldEdges = prevEdges

    const myNodes = tree.getPackageContent(param);

    myNodes.forEach(cls => {
        //Filter out all nodes marked as invisible in tree
        if (cls.visible === true) {
            const nodeId = cls.pack
            const nodeTmp = tree.getNode(nodeId);
            const node = {
                id: nodeId,
                type: nodeTmp.type + "Node",
                data: {
                    id: nodeId,
                    label: cls.name,
                    isSelected: false,
                    visible: true
                },
                position: { x: 0, y:0 },
                width: 110,
                height: 100,
            }
            if (prevNodes.length > 0) node.parentNode = param
            nodes.push(node);
        }
    })
    edges = calculateEdges(nodes, tree)


    if (layout === 'force') {
        let packageNode = oldNodes.find(n => n.id === param);
        let updatedNodes = nodes;
        let updatedEdges = edges;
        let hiddenNodes = []
        if (packageNode) {
            if (packageNode.type === "packageNode") {
                hiddenNodes.push(packageNode)
                packageNode.type = "openedPackageNode";
                const childNodes = nodes.filter(node => node.parentNode === packageNode.id || node.parent === packageNode.id)
                updatedNodes = prevNodes.concat(childNodes);
            } else if (packageNode.type === "openedPackageNode") {
                hiddenNodes = [];
                packageNode.type = "packageNode";
                const childNodes = filterNodes(oldNodes, packageNode)
                updatedNodes = oldNodes.filter(node => !childNodes.find(childNode => childNode.id === node.id));
            }
        } else {
            updatedNodes = nodes;
            updatedEdges = edges;
        }
        const simulationNodes = updatedNodes.filter(node => !hiddenNodes.find(hiddenNode => hiddenNode.id === node.id));
        updatedEdges = calculateEdges(simulationNodes, tree);
        return simulateForceLayout(updatedNodes, updatedEdges, hiddenNodes);

    }

    else {
        if (useBarycenter) {
            const barycenters = calculateBarycenters(nodes, edges);
            nodes.sort((a, b) => {
                const aBarycenter = barycenters.find((bc) => bc.nodeId === a.id).barycenter;
                const bBarycenter = barycenters.find((bc) => bc.nodeId === b.id).barycenter;
                return aBarycenter - bBarycenter;
            });
        }

        let radius = 0
        let totalWidth = 0
        let totalCircumference = 0
        let angleSoFar = 0
        if (oldNodes.length > 0) {
            let packageNode = oldNodes.find(n => n.id === param)
            if (packageNode.type === "packageNode") {
                packageNode.type = "openedPackageNode"

                totalWidth = nodes.reduce((sum, node) => sum + node.width, 0);
                totalCircumference = totalWidth * 1.3
                radius = totalCircumference / (2 * Math.PI)
                packageNode.width = radius * 2 + 155
                packageNode.height = radius * 2 + 155
                packageNode.style = { backgroundColor: 'rgba(111, 168, 255, 0.4)', width: radius * 2 + 155, height: radius * 2 + 155 }
                distrubuteNodes(oldNodes, packageNode,totalWidth,radius,totalCircumference)

            }
            else {
                packageNode.type = "packageNode"
                packageNode.style = {}
                packageNode.width = 110
                packageNode.height = 100

                const childNodes = filterNodes(oldNodes, packageNode)

                oldNodes = oldNodes.filter(node => !childNodes.includes(node))
                distrubuteNodes(oldNodes,packageNode,totalWidth,radius,totalCircumference)
                edges = calculateEdges(oldNodes)
                nodes = oldNodes
                return { nodes, edges }
            }

        }
        totalWidth = nodes.reduce((sum, node) => sum + node.width, 0);
        totalCircumference = totalWidth * 1.3

        radius = totalCircumference / (2 * Math.PI)
        angleSoFar = 0
        nodes.forEach((node) => {
            const angle = (110 / totalCircumference) * (2 * Math.PI) * 1.3;
            angleSoFar += angle / 2
            const xPos = 25 + radius + radius * Math.cos(angleSoFar);
            const yPos = 40 + radius + radius * Math.sin(angleSoFar);
            angleSoFar += angle / 2;
            node.position = {
                x: xPos,
                y: yPos
            }

        })

        if (oldNodes.length > 0) {
            nodes = oldNodes.concat(nodes)
            edges = calculateEdges(nodes, tree)
            return { nodes, edges }
        }

        return { nodes, edges };
    }
}


import { MarkerType, StepEdge } from 'reactflow';
//import { tree } from "./Model/Parse";
//TODO Markus bruger vi dem her?
import { forceSimulation, forceManyBody, forceCenter, forceCollide } from 'd3-force';


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
    nodes.forEach(node => {
        if (node.type === 'openedPackageNode') return
        const cls = tree.getNode(node.id)
        if (cls === undefined) return
        cls.classInvokation.forEach(invokedClass => {
            const invokedNode = nodes.find(n => n.id === invokedClass)
            if (invokedNode === undefined) return
            if (invokedNode.type === 'openedPackageNode') return
            const edgeWeight = tree.getNumInvocations(node.id) * 2 - 15;
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
                    width: 15,
                },
                data: {
                    isSelected: false,
                    nonSelected: true,
                    weight: edgeWeight,
                }
            })
        })
        cls.classImplements.forEach(implementedClass => {
            const implementedNode = nodes.find(n => n.id === implementedClass)
            if (implementedNode === undefined) return
            if (implementedNode.type === 'openedPackageNode') return
            const edgeWeight = tree.getNumImplementations(node.id) * 2 - 15;
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
                    width: 15,
                },
                data: {
                    isSelected: false,
                    nonSelected: true,
                    weight: edgeWeight,
                }
            })
        })
        cls.classInherits.forEach(inheritedClass => {
            const inheritedNode = nodes.find(n => n.id === inheritedClass)
            if (inheritedNode === undefined) return
            if (inheritedNode.type === 'openedPackageNode') return
            const edgeWeight = tree.getNumInheritances(node.id) * 2 - 15;
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
                    width: 15,
                },
                data: {
                    isSelected: false,
                    nonSelected: true,
                    weight: edgeWeight,
                }
            })
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

function filterNodes(nodes, parent){
    let filteredNodes = []

    filteredNodes = nodes.filter(node => node.parentNode === parent.id || node.parent === parent.id)
    if (filteredNodes.length <= 0 ) return []
    filteredNodes.forEach(node => filteredNodes.push(...filterNodes(nodes,node)))

    return filteredNodes
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
                packageNode.type = "packageNode";
                const childNodes = filterNodes(oldNodes,packageNode)
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
                    tempNode = oldNodes.find(n => n.id === tempNode.parentNode)

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
                radius = totalCircumference / (2 * Math.PI)
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
            else {
                packageNode.type = "packageNode"
                packageNode.style = {}
                packageNode.width = 110
                packageNode.height = 100

                const childNodes = filterNodes(oldNodes,packageNode)

                oldNodes = oldNodes.filter(node => !childNodes.includes(node))
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
                    tempNode = oldNodes.find(n => n.id === tempNode.parentNode)

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
                edges = calculateEdges(oldNodes, tree)
                nodes = oldNodes
                return {nodes, edges}
            }
    
        }
        totalWidth = nodes.reduce((sum, node) => sum + 110, 0);
        totalCircumference = totalWidth * 1.3

        radius = totalCircumference / (2 * Math.PI)
        angleSoFar = 0
        nodes.forEach((node) => {
            const angle = (110 / totalCircumference) * (2 * Math.PI) * 1.3;
            angleSoFar += angle / 2
            const xPos = 200 + radius + radius * Math.cos(angleSoFar) - 55 - 100;
            const yPos = 50 + radius + radius * Math.sin(angleSoFar) - 20;
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


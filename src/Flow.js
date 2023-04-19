import React, {useState, useEffect} from 'react';
import ReactFlow, {
    Background,
    Controls,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import './index.css';

//TODO Can we remove simulate force layout here?
import { createNodesAndEdges, /*simulateForceLayout*/ } from './utils.js';

import PackageNode from './FlowElements/Nodes/PackageNode.js';
import ClassNode from './FlowElements/Nodes/ClassNode'
import InterfaceNode from "./FlowElements/Nodes/InterfaceNode";
import OpenedPackageNode from "./FlowElements/Nodes/OpenedPackageNode";

import FloatingEdge from './FloatingEdge.js';

import LayoutPanel from "./FlowElements/Panels/LayoutPanel";
import InformationPanel from "./FlowElements/Panels/InformationPanel";
import TogglePanel from "./FlowElements/Panels/TogglePanel";
import ToggleSwitch from './FlowElements/Panels/ToggleSwitch.js';
import HiddenPanel from "./FlowElements/Panels/HiddenPanel";

import {tree} from "./Model/Parse"
import {DepLabelTypes} from "./Types/DepLabelTypes.js";
import {NodeTypes} from "./Types/NodeTypes.js";
import { LayoutTypes } from "./Types/LayoutTypes.js";

const useBaryCenter = true;
const layout = LayoutTypes.Circular;

let { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges([], [], tree.getTopLevelPackages()[0].name, useBaryCenter, layout, tree, []);

const nodeTypes = {
    packageNode: PackageNode,
    classNode: ClassNode,
    interfaceNode: InterfaceNode,
    openedPackageNode: OpenedPackageNode
};

const edgeTypes = {floating: FloatingEdge};

//TODO Why are we keeping two states here? Is it necessary? Is this not only invoked once?
let { nodes: oldNodes, edges: oldEdges } = createNodesAndEdges([], [], tree.getTopLevelPackages()[0].name, useBaryCenter, LayoutTypes.Force, tree, []);


function Flow() {
    const flowInstance = useReactFlow();

    let [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    let [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [classesToggled, setClassesToggled] = useState(true);
    const [interfacesToggled, setInterfacesToggled] = useState(true);
    const [modulesToggled, setModulesToggled] = useState(true);
    const [abstractionsToggled, setAbstractionsToggled] = useState(true);
    const [invocationsToggled, setInvocationsToggled] = useState(true);
    const [implementationsToggled, setImplementationsToggled] = useState(true);
    const [circularToggled, setCircularToggled] = useState(true);

    const [selectedNode, setSelectNode] = useState(null);
    const [firstRender, setFirstRender] = useState(true);

    const [viewShouldFit, setViewShouldFit] = useState(false);
    const [layout, setLayout] = useState(null);

    const [hiddenNodes, setHiddenNodes] = useState([]);

    function nodeShouldBeDrawn(node) {
        if (!node.data.visible) return false;
        else if (node.type === NodeTypes.ClassNode && classesToggled)  return true;
        else if (node.type === NodeTypes.InterfaceNode && interfacesToggled) return true;
        else if (node.type === NodeTypes.PackageNode && modulesToggled) return true;
        else if (node.type === NodeTypes.OpenedPackageNode) return true;
        return false;
    }

    function edgeShouldBeDrawn(edge) {
        if (edge.label === DepLabelTypes.Invokes && invocationsToggled) return true;
        else if (edge.label === DepLabelTypes.Inherits && abstractionsToggled) return true;
        else if (edge.label === DepLabelTypes.Implements && implementationsToggled) return true;
        else if (edge.label === "circular" && circularToggled) return true;
        return false;
    }

    function toggleHiddenNode(node) {
        let tmpHidden = hiddenNodes;
        let index = tmpHidden.findIndex(n => n.id === node.id);
        if (index !== -1) {
            tmpHidden.splice(index, 1);
            nodes[nodes.findIndex(n => n.id === node.id)].data.visible = true;
        } else {
            tmpHidden.push(node);
            nodes[nodes.findIndex(n => n.id === node.id)].data.visible = false;
        }
        setHiddenNodes(tmpHidden);
        setNodes(nodes);
        onNodesChange([]);
        onPaneClicked();
    }

    const updateData = () => {
        if (selectedNode !== null) {
            let prevSelectNode = nodes.find(e => e.id === selectedNode.id);
            redrawSelectedNodes(prevSelectNode);
            redrawSelectedEdges(prevSelectNode, true)
            setSelectNode(null);
            resetNodeOpacity(nodes);
        }

        resetNodeOpacity(oldNodes);
        setEdges(oldEdges);
        oldNodes = nodes; //TODO why is oldNodes used here? What is the purpose?
        oldEdges = edges; //TODO why is oldEdges used here? What is the purpose?
        setViewShouldFit(true); // Set viewShouldFit to true when layout changes or a package is expanded
    };

    useEffect(() => {
        if (firstRender) setFirstRender(false)
        else updateData();
    }, [layout]);

    useEffect(() => {
        if (nodes !== oldNodes || edges !== oldEdges) {
            if (viewShouldFit) {
                flowInstance.fitView();
                setViewShouldFit(false); // Reset viewShouldFit after fitView is called
            }
        }
    }, [nodes, edges, viewShouldFit]);

    const expandPackage = (_, nd) => {
        const tempNodes = nodes
        const tempEdges = edges
        if (nd.type === NodeTypes.PackageNode || nd.type === NodeTypes.OpenedPackageNode) {
            const {nodes, edges} = createNodesAndEdges(tempNodes, tempEdges, nd.id, useBaryCenter, layout, tree);
            setNodes(nodes);
            setEdges(edges);
            setTimeout(() => {
                resetNodeOpacity(nodes);
                flowInstance.fitView();
            }, 0);
        }
        setSelectNode(null);
    }

    const redrawSelectedNodes = (node) => {
        let selectNode = nodes.find(e => e.id === node.id)
        selectNode.data.isSelected = !selectNode.data.isSelected
        onNodesChange([]);
    }

    const redrawSelectedEdges = (node, unselect) => {
        if (unselect) {
            edges.forEach(function (e) {
                e.data.isSelected = false;
                e.data.nonSelected = true;
                e.animated = false;
            });
        } else if (!unselect) {
            edges.forEach(function (e) {
                const sourceSplit = e.source.split(".");
                const targetSplit = e.target.split(".");
                const nodeName = node.id.split(".");
                if (sourceSplit.includes(nodeName[nodeName.length - 1]) || targetSplit.includes(nodeName[nodeName.length - 1])) {
                    e.data.isSelected = !e.data.isSelected;
                    e.animated = !e.animated;
                }
                e.data.nonSelected = false;
            });
        }
        setEdges(edges);
        onEdgesChange([]);
    }

    const updateNodeOpacity = (selectedNode) => {
        const updatedNodes = nodes.map((node) => {
            let edgeExists = false;
            let isChild = false;

            if (selectedNode.type !== NodeTypes.OpenedPackageNode) {
                edgeExists = edges.some(
                    (edge) =>
                        (edge.source === selectedNode.id && edge.target === node.id) ||
                        (edge.target === selectedNode.id && edge.source === node.id)
                );
            }

            if (selectedNode.type === NodeTypes.OpenedPackageNode) {
                const childNodes = tree.getPackageContent(selectedNode.id);
                isChild = childNodes.some(
                    (child) => node.id.startsWith(child.pack)
                );
                edgeExists = edges.some((edge) => {
                    return childNodes.some((child) => {
                        const childId = child.pack;
                        return (
                            (edge.source === childId && edge.target === node.id) ||
                            (edge.target === childId && edge.source === node.id)
                        );
                    });
                });
            }

            const shouldHighlight = edgeExists || isChild || node.id === selectedNode.id;
            const opacity = shouldHighlight ? 0.90 : 0.2;
            //Code to set color of open packages to blue
            //const color = isChild && selectedNode.type === NodeTypes.OpenedPackageNode ? "rgba(135, 206, 250)" : node.style.color;

            return {
                ...node,
                style: {...node.style, opacity},
            };
        });
        setNodes(updatedNodes);
    }

    const resetNodeOpacity = (nodes) => {
        const updatedNodes = nodes.map((node) => {
            return {
                ...node,
                style: {...node.style, opacity: 1},
            };
        });
        setNodes(updatedNodes);
    };


    const onNodeClicked = (_, node) => {
        resetNodeOpacity(nodes);
        if (selectedNode !== null) {
            const selNode = nodes.find(e => e.id === selectedNode.id)
            redrawSelectedNodes(selNode);
            redrawSelectedEdges(selNode, true);
            setSelectNode(null);
            updateNodeOpacity(node);
        }
        redrawSelectedNodes(node);
        redrawSelectedEdges(node, false)
        setSelectNode(node);
        updateNodeOpacity(node);
    };

    const onPaneClicked = () => {
        if (selectedNode !== null) {
            let prevSelectNode = nodes.find(e => e.id === selectedNode.id);
            redrawSelectedNodes(prevSelectNode);
            redrawSelectedEdges(prevSelectNode, true)
            setSelectNode(null);
            resetNodeOpacity(nodes);
        }
    }

    return (<>
            <div className="panelHolder" id="leftFloat">
                <div className="panelStyle">
                    <LayoutPanel>
                        <ToggleSwitch layout={layout} setLayout={setLayout}/>
                    </LayoutPanel>
                </div>
                <div className="panelStyle">
                    <TogglePanel classesToggled={setClassesToggled}
                                 interfacesToggled={setInterfacesToggled}
                                 moduleToggled={setModulesToggled}
                                 implementationsToggled={setImplementationsToggled}
                                 abstractionsToggled={setAbstractionsToggled}
                                 invocationsToggled={setInvocationsToggled}
                                 circularToggled={setCircularToggled} />
                </div>
                {hiddenNodes.length > 0 && (
                    <div className="panelStyle">
                        <HiddenPanel hiddenElements={hiddenNodes} hideFunc={toggleHiddenNode} />
                    </div>
                )}
            </div>
            <div className="panelHolder" id="rightFloat">
                {selectedNode != null && (
                    <div className="panelStyleInformation">
                        <InformationPanel treeNode={tree.getNode(selectedNode.id)}
                                          node={selectedNode}
                                          expandFunc={expandPackage}
                                          hideFunc={toggleHiddenNode} />
                    </div>
                )}
            </div>
        <ReactFlow
            nodes={nodes.filter(nodeShouldBeDrawn)}
            edges={edges.filter(edgeShouldBeDrawn)}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClicked}
            onNodeDoubleClick={expandPackage}
            onPaneClick={onPaneClicked}
            fitView
            edgeTypes={edgeTypes}
            minZoom={0.1}
            nodeTypes={nodeTypes}
            nodesConnectable={false}
            nodesDraggable={false}
            zoomOnDoubleClick={false}
        >
            <Background/>
            <Controls/>
        </ReactFlow></>
    );
}

let NodeAsHandleFlow = () => {
  return (
      <div className="FlowWrapper">
        <ReactFlowProvider>
          <Flow/>
        </ReactFlowProvider>
      </div>
  );
};

export default NodeAsHandleFlow;
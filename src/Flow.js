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

import {createNodesAndEdges} from './utils.js';

import PackageNode from './FlowElements/Nodes/PackageNode.js';
import ClassNode from './FlowElements/Nodes/ClassNode'
import InterfaceNode from "./FlowElements/Nodes/InterfaceNode";
import OpenedPackageNode from "./FlowElements/Nodes/OpenedPackageNode";

import FloatingEdge from './FloatingEdge.js';

import LayoutPanel from "./FlowElements/Panels/LayoutPanel";
import InformationPanel from "./FlowElements/Panels/InformationPanel";
import TogglePanel from "./FlowElements/Panels/FilterPanel.js";
import ToggleSwitch from './FlowElements/Panels/ToggleSwitch.js';
import HiddenPanel from "./FlowElements/Panels/HiddenPanel";
import ExpandedPackagePanel from "./FlowElements/Panels/ExpandedPackagePanel.js";

import {tree} from "./Model/Parse"
import {DepLabelTypes} from "./Types/DepLabelTypes.js";
import {NodeTypes} from "./Types/NodeTypes.js";
import {LayoutTypes} from "./Types/LayoutTypes.js";

const useBaryCenter = true;
const layout = LayoutTypes.Circular;

let {
    nodes: initialNodesCircular,
    edges: initialEdgesCircular
} = createNodesAndEdges([], [], tree.getTopLevelPackages()[0].name, useBaryCenter, layout, tree, []);

let {
    nodes: initialNodesForce,
    edges: initialEdgesForce
} = createNodesAndEdges([], [], tree.getTopLevelPackages()[0].name, useBaryCenter, LayoutTypes.Force, tree, []);

const nodeTypes = {
    packageNode: PackageNode,
    classNode: ClassNode,
    interfaceNode: InterfaceNode,
    openedPackageNode: OpenedPackageNode
};

const edgeTypes = {floating: FloatingEdge};


function Flow() {
    const flowInstance = useReactFlow();

    let [nodes, setNodes, onNodesChange] = useNodesState(initialNodesCircular);
    let [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesCircular);

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
    const [openedPackageNodes, setOpenedPackageNodes] = useState([]);

    function nodeShouldBeDrawn(node) {
        if (!node.data.visible) return false;
        else if (node.type === NodeTypes.ClassNode && classesToggled) return true;
        else if (node.type === NodeTypes.InterfaceNode && interfacesToggled) return true;
        else if (node.type === NodeTypes.PackageNode && modulesToggled) return true;
        else if (node.type === NodeTypes.OpenedPackageNode) return true;
        return false;
    }

    function edgeShouldBeDrawn(edge) {
        if (edge.label === DepLabelTypes.Invokes && invocationsToggled) return true;
        else if (edge.label === DepLabelTypes.Inherits && abstractionsToggled) return true;
        else if (edge.label === DepLabelTypes.Implements && implementationsToggled) return true;
        else if (edge.label === DepLabelTypes.Circular && circularToggled) return true;
        return false;
    }

    //Load in state of nodes upon nodes changed.
    useEffect(() => {
        setOpenedPackageNodes(nodes.filter(n => n.type === NodeTypes.OpenedPackageNode));
        if (layout === LayoutTypes.Force) setHiddenNodes(nodes.filter(n => n.data.visible === false && n.type !== NodeTypes.OpenedPackageNode));
        else setHiddenNodes(nodes.filter(n => n.data.visible === false));
    }, [nodes]);

    //Avoid force-layout to override default circular layout
    useEffect(() => {
        if (firstRender) setFirstRender(false);
        else resetLayout();
    }, [layout]);

    //fitView whenever nodes, edges are changed or fit is invoked
    useEffect(() => {
        if (viewShouldFit) {
            flowInstance.fitView();
            setViewShouldFit(false);
        }
    }, [viewShouldFit]);

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
        resetSelectedNode();
    }

    function resetSelectedNode() {
        if (selectedNode !== null) {
            let prevSelect = nodes.find(e => e.id === selectedNode.id);
            toggleSelectForNode(prevSelect);
            redrawSelectedEdges(prevSelect, true);
            setSelectNode(null);
            resetAllNodesOpacity(nodes);
        }
    }

    function resetLayout() {
        resetSelectedNode();
        resetAllNodesOpacity(initialNodesForce);
        setEdges(initialEdgesForce);
        initialNodesForce = nodes;
        initialEdgesForce = edges;
        setViewShouldFit(true);
    }

    function expandPackage(_, nd) {
        resetSelectedNode();
        const tempNodes = nodes;
        const tempEdges = edges;
        if (nd.type === NodeTypes.PackageNode || nd.type === NodeTypes.OpenedPackageNode) {
            if (layout === LayoutTypes.Force) nd.data.visible = !nd.data.visible;
            const {nodes, edges} = createNodesAndEdges(tempNodes, tempEdges, nd.id, useBaryCenter, layout, tree);
            setNodes(nodes);
            setEdges(edges);
            resetAllNodesOpacity(nodes);
            setViewShouldFit(true);
        }
        setSelectNode(null);
    }

    function toggleSelectForNode(node) {
        let selectNode = nodes.find(e => e.id === node.id)
        selectNode.data.isSelected = !selectNode.data.isSelected
    }

    function redrawSelectedEdges(node, unselect) {
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
    }

    function updateDependingNodesOpacity(selNode) {
        const updatedNodes = nodes.map(node => {
            let edgeExists = false, isChild = false;

            if (selNode.type !== NodeTypes.OpenedPackageNode) {
                edgeExists = edges.some(edge => (edge.source === selNode.id && edge.target === node.id) || (edge.target === selNode.id && edge.source === node.id));
            } else if (selNode.type === NodeTypes.OpenedPackageNode) {
                const childNodes = tree.getPackageContent(selNode.id);
                isChild = childNodes.some(child => node.id.startsWith(child.pack));
                edgeExists = edges.some(edge => {
                    return childNodes.some(child => {
                        return ((edge.source === child.pack && edge.target === node.id) || (edge.target === child.pack && edge.source === node.id));
                    });
                });
            }
            const shouldHighlight = edgeExists || isChild || node.id === selNode.id;
            const opacity = shouldHighlight ? 0.90 : 0.2;
            return {...node, style: {...node.style, opacity}};
        });
        setNodes(updatedNodes);
    }

    function resetAllNodesOpacity(nodes) {
        const updatedNodes = nodes.map(node => {
            return {...node, style: {...node.style, opacity: 1}};
        });
        setNodes(updatedNodes);
    }

    function onNodeClicked(_, node) {
        resetSelectedNode();
        toggleSelectForNode(node);
        redrawSelectedEdges(node, false)
        setSelectNode(node);
        updateDependingNodesOpacity(node);
    }

    return (<>
            <div className="panelHolder" id="leftFloat">
                <div className="panelStyle">
                    <LayoutPanel>
                        <ToggleSwitch layout={layout} setLayout={setLayout}/>
                    </LayoutPanel>
                </div>
                <div>
                    <div className="panelStyle">
                        <TogglePanel classesToggled={setClassesToggled}
                                     interfacesToggled={setInterfacesToggled}
                                     moduleToggled={setModulesToggled}
                                     implementationsToggled={setImplementationsToggled}
                                     abstractionsToggled={setAbstractionsToggled}
                                     invocationsToggled={setInvocationsToggled}
                                     circularToggled={setCircularToggled}/>
                    </div>
                    {hiddenNodes.length > 0 && (
                        <div className="panelStyle">
                            <HiddenPanel hiddenElements={hiddenNodes} hideFunc={toggleHiddenNode}>
                            </HiddenPanel>
                        </div>
                    )}
                    {openedPackageNodes.length > 0 && (
                        <div className="panelStyle">
                            <ExpandedPackagePanel
                                expandedNodes={openedPackageNodes}
                                node={selectedNode}
                                expandFunc={expandPackage}
                                selectFunc={onNodeClicked}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="panelHolder" id="rightFloat">
                {selectedNode != null && (
                    <div className="panelStyleInformation">
                        <InformationPanel treeNode={tree.getNode(selectedNode.id)}
                                          node={selectedNode}
                                          expandFunc={expandPackage}
                                          hideFunc={toggleHiddenNode}/>
                    </div>
                )}
            </div>
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
                                 circularToggled={setCircularToggled}/>
                </div>
                {hiddenNodes.length > 0 && (
                    <div className="panelStyle">
                        <HiddenPanel hiddenElements={hiddenNodes} hideFunc={toggleHiddenNode}/>
                    </div>
                )}
            </div>
            <div className="panelHolder" id="rightFloat">
                {selectedNode != null && (
                    <div className="panelStyleInformation">
                        <InformationPanel treeNode={tree.getNode(selectedNode.id)}
                                          node={selectedNode}
                                          expandFunc={expandPackage}
                                          hideFunc={toggleHiddenNode}/>
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
                onPaneClick={resetSelectedNode}
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
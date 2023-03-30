import React, { useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';

import FloatingEdge from './FloatingEdge.js';
import { createNodesAndEdges } from './utils.js';
import PackageNode from './FlowElements/Nodes/PackageNode.js';
import ClassNode from './FlowElements/Nodes/ClassNode'
import InterfaceNode from "./FlowElements/Nodes/InterfaceNode";
import OpenedPackageNode from "./FlowElements/Nodes/OpenedPackageNode";

import './index.css';
import ExamplePanel from "./FlowElements/Panels/ExamplePanel";
import InformationPanel from "./FlowElements/Panels/InformationPanel";

import { tree } from "./Model/Parse"
import TogglePanel from "./FlowElements/Panels/TogglePanel";

const useBaryCenter = true;

let { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges([], [], tree.getTopLevelPackages()[0].name, useBaryCenter, "Circle");

const nodeTypes = {
  packageNode: PackageNode,
  classNode: ClassNode,
  interfaceNode: InterfaceNode,
  openedPackageNode: OpenedPackageNode
};

const edgeTypes = {
  floating: FloatingEdge,
};

function Flow() {
  const flowinstance = useReactFlow();
  let [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  let [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [classesToggled, setClassesToggled] = useState(true);
  const [interfacesToggled, setInterfacesToggled] = useState(true);
  const [modulesToggled, setModulesToggled] = useState(true);
  const [abstractionsToggled, setAbstractionsToggled] = useState(true);
  const [invocationsToggled, setInvocationsToggled] = useState(true);
  const [implementationsToggled, setImplementationsToggled] = useState(true);


  function nodeShouldBeDrawn(node) {
    if (node.type === "classNode" && classesToggled) {
      return true;
    } else if (node.type === "interfaceNode" && interfacesToggled) {
      return true;
    } else if (node.type === "packageNode" && modulesToggled) {
      return true;
    } else if (node.type === "openedPackageNode") return true;
    return false;
  }

  function edgeShouldBeDrawn(edge) {
    if (edge.label === "invokes" && invocationsToggled) {
      return true;
    } else if (edge.label === "inherits" && abstractionsToggled) {
      return true;
    } else if (edge.label === "implements" && implementationsToggled) {
      return true;
    }
    return false;
  }
  const [selectedNode, setSelectNode] = useState(null);

  const expandPackage = (_, nd) => {
    let tempNodes = nodes
    let tempEdges = edges
    if (nd.type === "packageNode") {
      const { nodes, edges } = createNodesAndEdges(tempNodes, tempEdges, nd.id, useBaryCenter, 'Circle');
      console.log(nodes, edges)
      setSelectNode(null);
      setNodes(nodes);
      setEdges(edges);
      setTimeout(() => {
        flowinstance.fitView();
      }, 0);
      
      console.log(flowinstance.fitView())
    }
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

  const onNodeClicked = (_, node) => {
    if (selectedNode !== null) {
      const selNode = nodes.find(e => e.id === selectedNode.id)
      redrawSelectedNodes(selNode);
      redrawSelectedEdges(selNode, true);
      setSelectNode(null);
    }
    redrawSelectedNodes(node);
    redrawSelectedEdges(node, false)
    setSelectNode(node);
  };

  const onPaneClicked = () => {
    if (selectedNode !== null) {
      let prevSelectNode = nodes.find(e => e.id === selectedNode.id);
      redrawSelectedNodes(prevSelectNode);
      redrawSelectedEdges(prevSelectNode, true)
      setSelectNode(null);
    }
  }
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  return (<><div className="panelHolder" id="leftFloat">
    <div className="panelStyle">
      <TogglePanel classesToggled={setClassesToggled} interfacesToggled={setInterfacesToggled} moduleToggled={setModulesToggled} implementationsToggled={setImplementationsToggled} abstractionsToggled={setAbstractionsToggled} invocationsToggled={setInvocationsToggled} />
    </div>
    <div className="panelStyle">
      <ExamplePanel />
    </div>
  </div><div className="panelHolder" id="rightFloat">
      {selectedNode != null && (
        <div className="panelStyleInformation">
          <InformationPanel {...tree.getNode(selectedNode.id)} />
        </div>
      )}
    </div><ReactFlow
      nodes={nodes.filter(nodeShouldBeDrawn)}
      edges={edges.filter(edgeShouldBeDrawn)}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClicked}
      onNodeDoubleClick={expandPackage}
      onPaneClick={onPaneClicked}
      fitView
      onLoad={(_reactFlowInstance) => setReactFlowInstance(_reactFlowInstance)}
      edgeTypes={edgeTypes}
      minZoom={0.1}
      nodeTypes={nodeTypes}
      nodesConnectable={false}
      nodesDraggable={false}
      zoomOnDoubleClick={false}
      ref={flowinstance}
    >
      <Background />
      <Controls />
    </ReactFlow></>);
}
let NodeAsHandleFlow = () => {

  return (
    <>
      <div className="FlowWrapper">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default NodeAsHandleFlow;
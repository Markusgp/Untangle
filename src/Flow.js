import React, {useState} from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';

import 'reactflow/dist/style.css';

import FloatingEdge from './FloatingEdge.js';
import { createNodesAndEdges } from './utils.js';
import PackageNode from './FlowElements/Nodes/PackageNode.js';
import ClassNode from './FlowElements/Nodes/ClassNode'
import InterfaceNode from "./FlowElements/Nodes/InterfaceNode";

import './index.css';
import ExamplePanel from "./FlowElements/Panels/ExamplePanel";
import InformationPanel from "./FlowElements/Panels/InformationPanel";

import { tree } from "./Model/Parse"

const useBaryCenter = true;

let { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges(tree.getTopLevelPackages()[0].name, useBaryCenter);

const nodeTypes = {
  packageNode: PackageNode,
  classNode: ClassNode,
  interfaceNode: InterfaceNode
};

const edgeTypes = {
  floating: FloatingEdge,
};

let NodeAsHandleFlow = () => {
  let [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  let [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const expandPackage = (evt,nd) => {
    if (nd.type === "packageNode") {
      const {nodes, edges} = createNodesAndEdges(nd.id, useBaryCenter);
      setSelectNode(null);
      setNodes(nodes);
      setEdges(edges);
    }
  }

  const [selectedNode, setSelectNode] = useState(null);


  const redrawSelected = (node) => {
    let selectNode = nodes.splice(nodes.findIndex(e => e.id === node.id), 1)[0];
    selectNode.data.isSelected = !selectNode.data.isSelected;
    nodes.push(selectNode);
    setNodes(nodes);
    onNodesChange([]);
  }

  const onNodeClicked = (_, node) => {
    if (selectedNode !== null) {
      redrawSelected(nodes.find(e => e.id === selectedNode.id));
      setSelectNode(null);
    }
    redrawSelected(node);
    setSelectNode(node);
  };

  const onPaneClicked = () => {
    if (selectedNode !== null) {
      let prevSelectNode = nodes.find(e => e.id === selectedNode.id);
      redrawSelected(prevSelectNode);
      setSelectNode(null);
    }
  }

  return (
    <>
      <div className="panelHolder" id="leftFloat">
        <div className="panelStyle">
          <ExamplePanel/>
        </div>
        <div className="panelStyle">
          <ExamplePanel/>
        </div>
      </div>
      <div className="panelHolder" id="rightFloat">
          { selectedNode != null && (
            <div className="panelStyleInformation">
              <InformationPanel {... tree.getNode(selectedNode.id)}/>
            </div>
            )
          }
      </div>
    <div className="FlowWrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClicked}
        onNodeDoubleClick={expandPackage}
        onPaneClick={onPaneClicked}
        fitView
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        nodesDraggable={false}
        zoomOnDoubleClick={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
    </>
  );
};

export default NodeAsHandleFlow;
import React, {useCallback, useState} from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
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


  const drawSelect = (node) => {
    let indexOfNode = nodes.findIndex(e => e.id === node.id);
    nodes.splice(indexOfNode, 1);
    const newNode = {
      id: node.id,
      type: node.type,
      data: {
        id: node.data.id,
        label: node.data.label,
        isSelected: !node.data.isSelected
      },
      position: node.position
    }
    let tmp = nodes
    tmp.push(newNode);
    setNodes(tmp);
    onNodesChange([]);
  }

  const onNodeClicked = (event, node) => {
    if (selectedNode !== null) {
      let nd = nodes.find(e => e.id === selectedNode.pack);
      drawSelect(nd);
      setSelectNode(null);
    }
    drawSelect(node);
    setSelectNode(tree.getNode(node.id));
  };

  const onPaneClicked = () => {
    if (selectedNode !== null) {
      let nd = nodes.find(e => e.id === selectedNode.pack);
      drawSelect(nd);
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
              <InformationPanel {... tree.getNode(selectedNode.pack)}/>
            </div>
            )
          }
      </div>
    <div className="floatingedges">
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
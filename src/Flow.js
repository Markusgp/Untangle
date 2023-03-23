import React, {useCallback, useState} from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';

import 'reactflow/dist/style.css';

import FloatingEdge from './FloatingEdge.js';
import { createNodesAndEdges } from './utils.js';
import PackageNode from './FlowElements/PackageNode.js';
import ClassNode from './FlowElements/ClassNode'
import InterfaceNode from "./FlowElements/InterfaceNode";
import OpenedPackageNode from "./FlowElements/OpenedPackageNode";

import './index.css';
import ExamplePanel from "./FlowElements/Panels/ExamplePanel";
import InformationPanel from "./FlowElements/Panels/InformationPanel";

import { tree } from "./Parse"

const useBaryCenter = true;

let { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges([],[],"BFST21Group6", useBaryCenter);

const nodeTypes = {
  packageNode: PackageNode,
  classNode: ClassNode,
  interfaceNode: InterfaceNode,
  openedPackageNode: OpenedPackageNode
};

const edgeTypes = {
  floating: FloatingEdge,
};

let NodeAsHandleFlow = () => {
  let [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  let [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const expandPackage = (evt,nd) => {
    console.log(nd.type);
    console.log(nodes)
    let tempNodes = nodes
    let tempEdges = edges
    if (nd.type === "packageNode") {
      const {nodes, edges} = createNodesAndEdges(tempNodes,tempEdges,nd.id, useBaryCenter);
      setSelectNode(null);
      console.log("after cacll")
      console.log(nodes)
      console.log("next time")
      console.log("l",createNodesAndEdges(tempNodes,tempEdges,nd.id, useBaryCenter))
      setNodes(nodes);
      setEdges(edges);
    }
  }

  const [selectedNode, setSelectNode] = useState(null);

  const onNodeClicked = (event, node) => {
    setSelectNode(tree.getNode(node.id));
  }
  const onPaneClicked = () => setSelectNode(null);

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
            <InformationPanel name={selectedNode.name} pack={selectedNode.pack} visible={selectedNode.visible}/>
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
        minZoom={0.1}
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
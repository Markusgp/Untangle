import React, {useCallback, useState} from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import FloatingEdge from './FloatingEdge.js';
import FloatingConnectionLine from './FloatingConnectionLine.js';
import { createNodesAndEdges } from './utils.js';
import PackageNode from './FlowElements/PackageNode.js';
import ClassNode from './FlowElements/ClassNode'
import InterfaceNode from "./FlowElements/InterfaceNode";

import './index.css';
import Collapsible from "./FlowElements/Panels/Collapsible";

let { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges("BFST21Group6");

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

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: 'floating', markerEnd: { type: MarkerType.Arrow } }, eds)
      ),
    [setEdges]
  );

  const onClick = useCallback(
    (param) => ({nodes, edges } = createNodesAndEdges(param.target.id), setNodes(nodes),setEdges(edges))
    )
   */



  const [selectedNodeId, setSelectNode] = useState("none");

  const onNodeClicked = (event, node) => {
    console.log("clicked node" + node.id)
    setSelectNode(node.id);
  }
  const onPaneClicked = () => setSelectNode("none");


  const panelStyle = {
    position: "absolute",
    left: "20px",
    top: "20px",
    width: "300px",
    height: "400px",
    backgroundColor: "#FFFFFF",
    zIndex: "20"
  }

  return (
    <>
      <div className="panelHolder" id="leftFloat">
        <div className="panelStyle">
          <Collapsible/>
        </div>
        <div className="panelStyle">
          <Collapsible/>
        </div>
      </div>
      <div className="panelHolder" id="rightFloat">
        <div className="panelStyle">
          <Collapsible/>
        </div>
        <div className="panelStyle">
          <Collapsible/>
        </div>
      </div>
    <div className="floatingedges">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        /*onNodeClick={onNodeClicked}
        onPaneClick={onPaneClicked}*/
          //onConnect={onConnect}
        onClick={onClick}
        fitView
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        connectionLineComponent={FloatingConnectionLine}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
    </>
  );
};

export default NodeAsHandleFlow;
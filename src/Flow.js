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
//import FloatingConnectionLine from './FloatingConnectionLine.js';
import { createNodesAndEdges } from './utils.js';
import PackageNode from './FlowElements/PackageNode.js';
import ClassNode from './FlowElements/ClassNode'
import InterfaceNode from "./FlowElements/InterfaceNode";

import './index.css';
import Collapsible from "./FlowElements/Panels/Collapsible";
import InformationPanel from "./FlowElements/Panels/InformationPanel";

import { tree } from "./Parse"

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

  /*
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: 'floating', markerEnd: { type: MarkerType.Arrow } }, eds)
      ),
    [setEdges]
  );
   */

  const expandPackage = (evt,nd) => {
    if (nd.type === "packageNode") {
      const {nodes, edges} = createNodesAndEdges(nd.id);
      setSelectNode(null);
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
          <Collapsible/>
        </div>
        <div className="panelStyle">
          <Collapsible/>
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
          /*onConnect={onConnect}
          onClick={onClick}*/
        fitView
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        //connectionLineComponent={FloatingConnectionLine}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
    </>
  );
};

export default NodeAsHandleFlow;
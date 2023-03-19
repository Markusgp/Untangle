import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import FloatingEdge from './FloatingEdge.js';
import FloatingConnectionLine from './FloatingConnectionLine.js';
import { createNodesAndEdges } from './utils.js';
import RectangularNode from './RectangularNode.js';

import './index.css';

let { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges("BFST21Group6");

const nodeTypes = {
  rectangularNode: RectangularNode,
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

  return (
    <div className="floatingedges">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onClick={onClick}
        fitView
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        connectionLineComponent={FloatingConnectionLine}
      >
        <Background />
        
      </ReactFlow>
    </div>
  );
};

export default NodeAsHandleFlow;
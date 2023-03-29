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
import OpenedPackageNode from "./FlowElements/Nodes/OpenedPackageNode";

import './index.css';
import ExamplePanel from "./FlowElements/Panels/ExamplePanel";
import InformationPanel from "./FlowElements/Panels/InformationPanel";

import { tree } from "./Model/Parse"

const useBaryCenter = true;

let { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges([],[],tree.getTopLevelPackages()[0].name, useBaryCenter);

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

  const expandPackage = (_,nd) => {
    let tempNodes = nodes
    let tempEdges = edges
    if (nd.type === "packageNode") {
      const {nodes, edges} = createNodesAndEdges(tempNodes,tempEdges,nd.id, useBaryCenter);
      setSelectNode(null);
      setNodes(nodes);
      setEdges(edges);
    }
  }

  const [selectedNode, setSelectNode] = useState(null);


  const redrawSelectedNodes = (node) => {
    let selectNode = nodes.find(e => e.id === node.id)
    selectNode.data.isSelected = !selectNode.data.isSelected
    // let selectNode = nodes.splice(nodes.findIndex(e => e.id === node.id), 1)[0]; ?????????????????????????????????????????????????????????
    // selectNode.data.isSelected = !selectNode.data.isSelected;
    // nodes.push(selectNode);
    // setNodes(nodes);
    onNodesChange([]);
  }

  const redrawSelectedEdges = (node, unselect) => {
    if (unselect) {
      edges.forEach(function(e) {
        e.data.isSelected = false;
        e.data.nonSelected = true;
        e.animated = false;
      });
    } else if (!unselect) {
      edges.forEach(function(e) {
        const sourceSplit = e.source.split(".");
        const targetSplit = e.target.split(".");
        const nodeName = node.id.split(".");
        if (sourceSplit.includes(nodeName[nodeName.length-1]) || targetSplit.includes(nodeName[nodeName.length-1])) {
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
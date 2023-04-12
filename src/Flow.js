import React, { useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './FlowElements/Panels/ToggleSwitch.js';
import FloatingEdge from './FloatingEdge.js';
import { createNodesAndEdges, simulateForceLayout } from './utils.js';
import PackageNode from './FlowElements/Nodes/PackageNode.js';
import ClassNode from './FlowElements/Nodes/ClassNode'
import InterfaceNode from "./FlowElements/Nodes/InterfaceNode";
import OpenedPackageNode from "./FlowElements/Nodes/OpenedPackageNode";

import './index.css';
import ExamplePanel from "./FlowElements/Panels/ExamplePanel";
import InformationPanel from "./FlowElements/Panels/InformationPanel";

import { tree } from "./Model/Parse"
import TogglePanel from "./FlowElements/Panels/TogglePanel";
import ToggleSwitch from './FlowElements/Panels/ToggleSwitch.js';


const useBaryCenter = true;
const layout = 'force';

let { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges([], [], tree.getTopLevelPackages()[0].name, useBaryCenter, layout);

const nodeTypes = {
  packageNode: PackageNode,
  classNode: ClassNode,
  interfaceNode: InterfaceNode,
  openedPackageNode: OpenedPackageNode
};

const edgeTypes = {
  floating: FloatingEdge,
};

let { nodes: oldNodes, edges: oldEdges } = createNodesAndEdges([], [], tree.getTopLevelPackages()[0].name, useBaryCenter, 'Circle');


function Flow() {
  const [layout, setLayout] = useState(null);
  const flowinstance = useReactFlow();
  let [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  let [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [classesToggled, setClassesToggled] = useState(true);
  const [interfacesToggled, setInterfacesToggled] = useState(true);
  const [modulesToggled, setModulesToggled] = useState(true);
  const [abstractionsToggled, setAbstractionsToggled] = useState(true);
  const [invocationsToggled, setInvocationsToggled] = useState(true);
  const [implementationsToggled, setImplementationsToggled] = useState(true);

  const [selectedNode, setSelectNode] = useState(null);


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

  const [viewShouldFit, setViewShouldFit] = useState(false);

const updateData = () => {
  setSelectNode(null);
  setNodes(oldNodes);
  setEdges(oldEdges);
  oldNodes = nodes;
  oldEdges = edges;
  setViewShouldFit(true); // Set viewShouldFit to true when layout changes or a package is expanded
};

useEffect(() => {
  updateData();
}, [layout]);

useEffect(() => {
  if (nodes !== oldNodes || edges !== oldEdges) {
    if (viewShouldFit) {
      flowinstance.fitView();
      setViewShouldFit(false); // Reset viewShouldFit after fitView is called
    }
  }
}, [nodes, edges, viewShouldFit]);



  const expandPackage = (_, nd) => {
    let tempNodes = nodes
    let tempEdges = edges
    if (nd.type === "packageNode" || nd.type === "openedPackageNode") {
      const { nodes, edges } = createNodesAndEdges(tempNodes, tempEdges, nd.id, useBaryCenter, layout);
      setNodes(nodes);
      setEdges(edges);
      setTimeout(() => {
        resetNodeOpacity(nodes);
        flowinstance.fitView();
      }, 0);
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

  const updateNodeOpacity = (selectedNode) => {
    const updatedNodes = nodes.map((node) => {
      let edgeExists = false;
      let isChild = false;

      if (selectedNode.type !== "openedPackageNode") {
        edgeExists = edges.some(
          (edge) =>
            (edge.source === selectedNode.id && edge.target === node.id) ||
            (edge.target === selectedNode.id && edge.source === node.id)
        );
      }

      if (selectedNode.type === "openedPackageNode") {
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
      //const color = isChild && selectedNode.type === "openedPackageNode" ? "rgba(135, 206, 250)" : node.style.color;

      return {
        ...node,
        style: { ...node.style, opacity },
      };
    });
    setNodes(updatedNodes);
  }

  const resetNodeOpacity = (nodes) => {
    const updatedNodes = nodes.map((node) => {
      return {
        ...node,
        style: { ...node.style, opacity: 1 },
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

  

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  return (<><div className="panelHolder" id="leftFloat">
    <div className="panelStyle">
      <TogglePanel classesToggled={setClassesToggled} interfacesToggled={setInterfacesToggled} moduleToggled={setModulesToggled} implementationsToggled={setImplementationsToggled} abstractionsToggled={setAbstractionsToggled} invocationsToggled={setInvocationsToggled} />
    </div>
    <div className="panelStyle">
    <ExamplePanel>
        <ToggleSwitch layout={layout} setLayout={setLayout} />
      </ExamplePanel>

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
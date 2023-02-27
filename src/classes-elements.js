import React from "react";
import { MarkerType } from "reactflow";

// Import data from .json files
import classes from "./data/classes.json";
import classesInherited from "./data/classesInherited.json";
import classesInvoked from "./data/classesInvoked.json";
import interfacesInvoked from "./data/interfacesInvoked.json";

const nodes = [];
const edges = [];

// Create nodes for each class
classes.forEach(cls => {
  const nodeId = cls.class.Name.toLowerCase();

  const node = {
    id: nodeId,
    data: {
      label: cls.class.Name
    },
    
  };

  nodes.push(node);
});

// Calculate the total number of nodes
const numNodes = nodes.length;

// Calculate the radius of the circle based on the number of nodes
const radius = 200 + (numNodes - 5) * 20;

// Loop through each node and calculate its position on the circle
nodes.forEach((node, index) => {
  const angle = (index / numNodes) * 2 * Math.PI;
  node.position = {
    x: Math.cos(angle) * radius + 400,
    y: Math.sin(angle) * radius + 300
  };
});

// Create edges for inheritance relationships
classesInherited.forEach(cls => {
  const node = nodes.find(n => n.id === cls.class.toLowerCase());

  cls.inherits.forEach(inheritedClass => {
    const inheritedNode = nodes.find(n => n.id === inheritedClass.toLowerCase());

    const edge = {
      id: `${node.id}-inherits-${inheritedNode.id}`,
      source: node.id,
      target: inheritedNode.id,
      type: "smoothstep",
      animated: true,
      label: "inherits",
      labelStyle: { fill: "#f6ab6c", fontWeight: 700 }
    };

    edges.push(edge);
  });
});

// Create edges for invocation relationships
classesInvoked.forEach(cls => {
  const node = nodes.find(n => n.id === cls.class.toLowerCase());

  cls.invokes.forEach(invokedClass => {
    const invokedNode = nodes.find(n => n.id === invokedClass.toLowerCase());

    const edge = {
      id: `${node.id}-invokes-${invokedNode.id}`,
      source: node.id,
      target: invokedNode.id,
      type: "step",
      animated: true,
      label: "invokes",
      labelStyle: { fill: "#f6ab6c", fontWeight: 700 }
    };

    edges.push(edge);
  });
});

// Add interfaces to nodes
interfacesInvoked.forEach(cls => {
  const node = nodes.find(n => n.id === cls.class.toLowerCase());

  cls.interfaces.forEach(iface => {
    node.data.label = (
      <>
        {node.data.label} <br /> <small>({iface})</small>
      </>
    );
  });
});

export { nodes, edges };
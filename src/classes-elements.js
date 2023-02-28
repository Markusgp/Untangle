import { MarkerType } from "reactflow";
import classes from "./data/classes.json";
import classesInherited from "./data/classesInherited.json";
import classesInvoked from "./data/classesInvoked.json";
import interfacesInvoked from "./data/interfacesInvoked.json";

// Initialize nodes and edges arrays
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
    position: { x: 0, y: 0 }
  };

  nodes.push(node);
});

// Calculate the positions of the nodes in a circular layout
const numNodes = nodes.length;
const radius = 200 + (numNodes - 5) * 20;
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

    edges.push({
      id: `${node.id}-inherits-${inheritedNode.id}`,
      source: node.id,
      target: inheritedNode.id,
      type: "smoothstep",
      animated: true,
      label: "inherits",
      labelStyle: { fill: "#f6ab6c", fontWeight: 700 }
    });
  });
});

// Create edges for invocation relationships
classesInvoked.forEach(cls => {
  const node = nodes.find(n => n.id === cls.class.toLowerCase());

  cls.invokes.forEach(invokedClass => {
    const invokedNode = nodes.find(n => n.id === invokedClass.toLowerCase());

    edges.push({
      id: `${node.id}-invokes-${invokedNode.id}`,
      source: node.id,
      target: invokedNode.id,
      type: "step",
      animated: true,
      label: "invokes",
      labelStyle: { fill: "#f6ab6c", fontWeight: 700 }
    });
  });
});

// Add interface names to node labels
interfacesInvoked.forEach(cls => {
  const node = nodes.find(n => n.id === cls.class.toLowerCase());

  cls.interfaces.forEach(iface => {
    // Append the interface name to the node label
    node.data.label = (
      <>
        {node.data.label} <br /> <small>({iface})</small>
      </>
    );
  });
});

// Export the nodes and edges arrays for use in the ReactFlow component
export { nodes, edges };

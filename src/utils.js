import { Position, MarkerType } from 'reactflow';
import classes from "./data/classes.json";
import classesInherited from "./data/classesInherited.json";
import classesInvoked from "./data/classesInvoked.json";
import interfacesInvoked from "./data/interfacesInvoked.json";

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode, targetNode) {
    // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
    const {
        width: intersectionNodeWidth,
        height: intersectionNodeHeight,
        positionAbsolute: intersectionNodePosition,
    } = intersectionNode;
    const targetPosition = targetNode.positionAbsolute;

    const w = intersectionNodeWidth / 2;
    const h = intersectionNodeHeight / 2;

    const x2 = intersectionNodePosition.x + w;
    const y2 = intersectionNodePosition.y + h;
    const x1 = targetPosition.x + w;
    const y1 = targetPosition.y + h;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node, intersectionPoint) {
    const n = { ...node.positionAbsolute, ...node };
    const nx = Math.round(n.x);
    const ny = Math.round(n.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1) {
        return Position.Left;
    }
    if (px >= nx + n.width - 1) {
        return Position.Right;
    }
    if (py <= ny + 1) {
        return Position.Top;
    }
    if (py >= n.y + n.height - 1) {
        return Position.Bottom;
    }

    return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, target) {
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);

    const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
    const targetPos = getEdgePosition(target, targetIntersectionPoint);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos,
        targetPos,
    };
}

export function createNodesAndEdges() {
    const nodes = [];
    const edges = [];

    // Create nodes for each class
    classes.forEach(cls => {
        const nodeId = cls.class.Name.toLowerCase();

        const node = {
            id: nodeId,
            type: "rectangularNode",
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
                type: "floating",
                animated: true,
                label: "inherits",
                labelStyle: { fill: "#f6ab6c", fontWeight: 700 },
                markerEnd: {
                    type: MarkerType.Arrow,
                }
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
                type: "floating",
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

    return { nodes, edges };
}
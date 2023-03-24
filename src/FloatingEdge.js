import { useCallback } from 'react';
import { useStore, getStraightPath } from 'reactflow';

import { getEdgeParams } from './utils.js';

function FloatingEdge({ id, source, target, markerEnd, data }) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

    const { isSelected, nonSelected } = data;
    if (!sourceNode || !targetNode) {
        return null;
    }

    const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

    const [edgePath] = getStraightPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sx,
        targetPosition: sy,
        targetX: tx,
        targetY: ty,
    });

    const edgeStyle = {
        stroke: isSelected ?  "black" : "#b1b1b7",
        strokeWidth: "2px",
        opacity: isSelected ? "100%" : (nonSelected ? "75%" : "10%")
    }

    return (
        <path
            id={id}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEnd}
            style={edgeStyle}
        />
    );
}

export default FloatingEdge;
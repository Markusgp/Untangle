import { useCallback } from 'react';
import { useStore, getStraightPath } from 'reactflow';
import { getEdgeParams } from './EdgeCalculations.js';

function FloatingEdge({id, source, target, markerEnd, data}) {
    const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
    const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

    const { isSelected, nonSelected, weight, isCircular } = data;
    if (!sourceNode || !targetNode)  return null;

    const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

    const [edgePath] = getStraightPath({
        sourceX: sx,
        sourceY: sy,
        //sourcePosition: sx, //TODO Can be removed without any errors
        //targetPosition: sy, //TODO can be removed without any errors
        targetX: tx,
        targetY: ty,
    });

    const edgeStyle = {
        stroke: isCircular ? isSelected ? "red" : "#ca7461" : isSelected ? "black" : "#b1b1b7",
        strokeWidth: `${Math.sqrt(weight) + 1}px`,
        opacity: isSelected ? 1 : (nonSelected ? 0.75 : 0.1)
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

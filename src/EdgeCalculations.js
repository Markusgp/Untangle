import {Position} from "reactflow";

//Returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
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
    }
}

// This function returns the border point of the node that is closest to the target node
// considering rounded edges with a given corner radius
function getNodeIntersection(intersectionNode, targetNode, cornerRadius = 40) {
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

    const dx = x1 - x2;
    const dy = y1 - y2;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Compute the normalized direction vector
    const directionX = dx / distance;
    const directionY = dy / distance;

    // Calculate the intersection point of the straight line with the rounded rectangle
    const straightLineIntersectionX = w * Math.abs(directionX) + cornerRadius * (1 - Math.abs(directionX));
    const straightLineIntersectionY = h * Math.abs(directionY) + cornerRadius * (1 - Math.abs(directionY));

    // Scale the intersection point along the direction vector to ensure it lies on the rounded rectangle
    const scaleX = straightLineIntersectionX / (w * Math.abs(directionX));
    const scaleY = straightLineIntersectionY / (h * Math.abs(directionY));
    const scale = Math.min(scaleX, scaleY);

    const x = x2 + directionX * w * scale;
    const y = y2 + directionY * h * scale;

    return { x, y };
}




//Returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node, intersectionPoint) {
    const n = { ...node.positionAbsolute, ...node };
    const nx = Math.round(n.x);
    const ny = Math.round(n.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1)
        return Position.Left;
    if (px >= nx + n.width - 1)
        return Position.Right;
    if (py <= ny + 1)
        return Position.Top;
    if (py >= n.y + n.height - 1)
        return Position.Bottom;
    return Position.Top;
}
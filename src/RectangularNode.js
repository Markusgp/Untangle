import { Handle, Position } from 'reactflow';
import { useCallback } from 'react';
import './index.css';

const nodeStyle = {
  background: '#f9f9f9',
  borderRadius: '8px',
  border: '2px solid #d3d3d3',
  width: 120,
  height: 80,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  fontSize: 16,
  fontWeight: 500,
  color: '#333'
};

function RectangularNode({data}) {
   const {id, label } = data;
   const nodeId = id

   const onClick = useCallback((evt) => {
    console.log(data)
    console.log("nodeit",nodeId)
    console.log(`Node ${id} clicked`); // log the node id
   },[]);

   return (
     <div className="rectangular-node" style={nodeStyle} id={nodeId} onClick={onClick}>
       <Handle type="target" position={Position.Top} />
       <Handle type="source" position={Position.Bottom} />
       <div>{label}</div>
     </div>
   );
}

export default RectangularNode;
import { Handle, Position } from 'reactflow';
import './NodeStyles.css'
import FileLogo from './Assets/File.svg'
import { useState } from "react";

const iconWrapperStyle  = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start"
}

function ClassNode({data}) {
  const {id, label} = data;
  const [focused, setIsFocused] = useState(false);

  const classNodeStyle = {
    border: focused ? '5px solid #292929' : '5px solid #FBA500',
    boxShadow: focused ? '0px 5px 15px rgba(0, 0, 0, 0.5)' : '0px 5px 5px rgba(0, 0, 0, 0.3)',
  };

   const onClick = () => {
     console.log(`Node ${id} clicked`); // log the node id
   };

  const onFocus = () => { setIsFocused(true); };
  const onBlur = () => { setIsFocused(false); };

   return (
     <div className="nodeDefault" style={classNodeStyle} tabIndex="1" onClick={onClick} onFocus={onFocus} onBlur={onBlur}>
       <Handle type="target" position={Position.Top} />
       <Handle type="source" position={Position.Bottom} />
       <div className="nodeContentWrapper">
         <div className="iconWrapper" style={iconWrapperStyle}>
           <img className="nodeIcon" src={FileLogo} alt="Package-icon"/>
         </div>
         <div className="nodeNameLabel">{label}</div>
         <p className="nodeTypeLabel">&lt;Class&gt;</p>
       </div>
     </div>
   );
}

export default ClassNode;
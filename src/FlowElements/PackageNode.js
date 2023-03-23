import { Handle, Position } from 'reactflow';
import './NodeStyles.css'
import ComponentLogo from './Assets/Component.svg'
import ExpandLogo from './Assets/Expand.svg'
import { useState} from "react";

const iconWrapperStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between"
}

function PackageNode({data}) {
  const {id, label} = data;
  const nodeId = id
  const [focused, setIsFocused] = useState(false);

  const packageNodeStyle = {
    border: focused ? '5px solid #292929' : '5px solid #6FA8FF',
    boxShadow: focused ? '0px 5px 15px rgba(0, 0, 0, 0.5)' : '0px 5px 5px rgba(0, 0, 0, 0.3)',
  };

    const onClick = () => {
        console.log(`${id}`); // log the node id
    };

    const onFocus = () => { /* setIsFocused(true);*/ };
    const onBlur = () => { /*setIsFocused(false);*/ };

  const expandModule = () => {
    console.log(id + " was expanded");
  };

   return (
     <div className="nodeDefault" style={packageNodeStyle} tabIndex="1" id={nodeId} onClick={onClick} onFocus={onFocus} onBlur={onBlur}>
       <Handle type="target" position={Position.Top} />
       <Handle type="source" position={Position.Bottom} />
       <div className="nodeContentWrapper" id={nodeId}>
         <div className="iconWrapper" style={iconWrapperStyle}>
           <img className="nodeIcon" src={ComponentLogo} alt="File-icon"/>
           <img className="expandIcon" src={ExpandLogo} alt="ComponentLogo" onClick={expandModule}/>
         </div>
         <div className="nodeNameLabel">{label}.*</div>
         <p className="nodeTypeLabel">&lt;Package&gt;</p>
       </div>
     </div>
   );
}

export default PackageNode;
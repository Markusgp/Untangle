import { Handle, Position } from 'reactflow';
import '../index.css';
import ComponentLogo from './Assets/Component.svg'
import ExpandLogo from './Assets/Expand.svg'
import {useState} from "react";

const contentWrapperStyle = {
  width: "85%",
  height: "80%",
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const packageNameStyle = {
  fontWeight: "700",
  maxWidth: "100%",
  overflowWrap: "break-word",
}

const packageLabelStyle =  {
  fontSize: '8px',
  fontWeight: '500',
}

const iconWrapperStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  opacity: "0"
}

const ComponentLogoStyle = {
  opacity: "0.5",
  width: "16px",
  height: "16px",
  visible: "false"
}

const ExpandLogoStyle = {
  opacity: "1",
  width: "14px",
  height: "14px",
  visible: "false"
}

function PackageNode({data}) {

  const {id, label} = data;
  const [focused, setIsFocused] = useState(false);

  const nodeStyle = {
    background: '#FFFFFF',
    border: focused ? '5px solid #292929' : '5px solid #FBA500',
    boxShadow: focused ? '0px 5px 15px rgba(0, 0, 0, 0.5)' : '0px 5px 5px rgba(0, 0, 0, 0.3)',
    borderRadius: '20px',
    width: 100,
    height: 90,
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '12px',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center"
  };



   const onClick = () => {
     console.log(`Node ${id} clicked`); // log the node id
   };

  const onFocus = () => { setIsFocused(true); };
  const onBlur = () => { setIsFocused(false); };

  const expandModule = () => {
    console.log("${id} was expanded");
  };

   return (
     <div className="classNode" style={nodeStyle} tabIndex="1" onClick={onClick} onFocus={onFocus} onBlur={onBlur}>
       <Handle type="target" position={Position.Top} />
       <Handle type="source" position={Position.Bottom} />
       <div className="contentWrapper" style={contentWrapperStyle}>
         <div className="iconWrapper" style={iconWrapperStyle}>
           <img src={ComponentLogo} style={ComponentLogoStyle} alt="ComponentLogo"/>
           <img src={ExpandLogo} style={ExpandLogoStyle} alt="ComponentLogo" onClick={expandModule}/>
         </div>
         <div style={packageNameStyle}>{label}</div>
         <p style={packageLabelStyle}>&lt;Class&gt;</p>
       </div>
     </div>
   );
}

export default PackageNode;
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

const packageLabelStyle =  {
  fontSize: '8px',
  fontWeight: '500'
}

const iconWrapperStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between"
}

const ComponentLogoStyle = {
  opacity: "0.5",
  width: "16px",
  height: "16px"
}

const ExpandLogoStyle = {
  opacity: "1",
  width: "14px",
  height: "14px"
}

function PackageNode({data}) {

  const {id, label} = data;
  const [focused, setIsFocused] = useState(false);

  const nodeStyle = {
    background: '#FFFFFF',
    border: focused ? '5px solid #292929' : '5px solid #6FA8FF',
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
     <div className="rectangular-node" style={nodeStyle} tabIndex="1" onClick={onClick} onFocus={onFocus} onBlur={onBlur}>
       <Handle type="target" position={Position.Top} />
       <Handle type="source" position={Position.Bottom} />
       <div className="contentWrapper" style={contentWrapperStyle}>
         <div className="iconWrapper" style={iconWrapperStyle}>
           <img src={ComponentLogo} style={ComponentLogoStyle} alt="ComponentLogo"/>
           <img src={ExpandLogo} style={ExpandLogoStyle} alt="ComponentLogo" onClick={expandModule}/>
         </div>
         <div>{label}.*</div>
         <p style={packageLabelStyle}>&lt;Package&gt;</p>
       </div>
     </div>
   );
}

export default PackageNode;
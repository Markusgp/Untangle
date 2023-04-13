import React, {useState} from 'react';
import "./PanelStyles.css"
import Drop from "../Assets/Drop.svg";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { BiFilterAlt } from "react-icons/bi";


const ExamplePanel = ({classesToggled, interfacesToggled, moduleToggled, implementationsToggled, abstractionsToggled, invocationsToggled}) => {
  const toggle = () => setOpen(!open);
  const nodeTypes = ["Classes", "Interfaces", "Modules"]
  const edgeTypes = ["Invokes", "Inherits", "Implements"]
  const eyeMap = new Map();

  const [classEye, setClassEye]=useState(true);
  const [interfaceEye, setInterfaceEye]=useState(true);
  const [moduleEye, setModuleEye]=useState(true);
  const [abstractionEye, setAbstractionEye]=useState(true);
  const [implementationEye, setImplementationEye]=useState(true);
  const [invocationEye, setInvocationEye]=useState(true);

  eyeMap.set("Classes", classEye);
  eyeMap.set("Interfaces", interfaceEye);
  eyeMap.set("Modules", moduleEye);
  eyeMap.set("Invokes", invocationEye);
  eyeMap.set("Inherits", abstractionEye);
  eyeMap.set("Implements", implementationEye)
  const eyeClick = (nodeType) => {
    switch (nodeType) {
      case "Classes": setClassEye(!classEye); classesToggled(!classEye); break;
      case "Interfaces": setInterfaceEye(!interfaceEye); interfacesToggled(!interfaceEye); break;
      case "Modules": setModuleEye(!moduleEye); moduleToggled(!moduleEye); break;
      case "Invokes": setInvocationEye(!invocationEye); invocationsToggled(!invocationEye); break;
      case "Inherits": setAbstractionEye(!abstractionEye); abstractionsToggled(!abstractionEye); break;
      case "Implements": setImplementationEye(!implementationEye); implementationsToggled(!implementationEye); break;
    }
  }
  const nodeTypeItems = nodeTypes.map((nodeType) => <li className="nodesList" key={nodeType}>{eyeMap.get(nodeType) ? <FaEye className="faEye" onClick={() => eyeClick(nodeType)}/> : <FaEyeSlash className="faEye" onClick={() => eyeClick(nodeType)}/>} {nodeType} </li>)
  const edgeTypeItems = edgeTypes.map((edgeType) => <li className="nodesList" key={edgeType}>{eyeMap.get(edgeType) ? <FaEye className="faEye" onClick={() => eyeClick(edgeType)}/> : <FaEyeSlash className="faEye" onClick={() => eyeClick(edgeType)}/>} {edgeType} </li>)
  const [open, setOpen] = useState(false);

  const dropStyle = {
    transform: open ? "rotate(180deg)" : "rotate(0)"
  }

  return (
    <>
    <div className="topBar">
      <div className="identifierSection">
        <BiFilterAlt className="filterIcon"></BiFilterAlt>
        <p className="panelName">Filter</p>
      </div>

      <img className="dropBtn" src={Drop} style={dropStyle} alt={"toggleOpen"} onClick={toggle}/>
    </div>
    {open && (
      <div className="content">
        <span className="contentDivider"/>
        <p className="toggleHeader" id="firstToggleHeader">Nodes:</p>
        <ul>{nodeTypeItems}</ul>
        <p className="toggleHeader">Edges:</p>
        <ul>{edgeTypeItems}</ul>
      </div>
    )}
    </>
  );
};
export default ExamplePanel;
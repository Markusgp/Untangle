import React, {useState} from 'react';
import "./PanelStyles.css"
import FileLogo from "../Assets/File.svg"
import Drop from "../Assets/Drop.svg";
import ToggleSwitch from './ToggleSwitch.js';


const ExamplePanel = () => {
  const toggle = () => setOpen(!open);

  const [open, setOpen] = useState(false);

  const dropStyle = {
    transform: open ? "rotate(180deg)" : "rotate(0)"
  }

  return (
    <>
    <div className="topBar">
      <div className="identifierSection">
        <img className="panelIcon" src={FileLogo}/>
        <p className="panelName">Design</p>
      </div>

      <img className="dropBtn" src={Drop} style={dropStyle} alt={"toggleOpen"} onClick={toggle}/>
    </div>
    {open && (
      <div className="content">
        <span className="contentDivider"/>
        <ToggleSwitch />
      </div>
    )}
    </>
  );
};
export default ExamplePanel;
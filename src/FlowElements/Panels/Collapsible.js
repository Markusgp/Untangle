import React, {useState} from 'react';
import "./PanelStyles.css"
import FileLogo from "../Assets/File.svg"


const Collapsible = () => {
  const toggle = () => setOpen(!open);

  const panelName = "Panel Name";

  const [open, setOpen] = useState(false);
  return (
    <>
    <div className="topBar">
      <div className="identifierSection">
        <img className="panelIcon" src={FileLogo}/>
        <p className="panelName">{panelName}</p>
      </div>

      <button onClick={toggle}>*</button>
    </div>
    {open && (
      <div className="content">
        <span className="contentDivider"/>
        <p>Content here</p>
      </div>
    )}
    </>
  );
};
export default Collapsible;
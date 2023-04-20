import React, {useState} from 'react';
import "./PanelStyles.css"
import Drop from "../Assets/Drop.svg";
import {FaEyeSlash} from "react-icons/fa";
import {CgClose} from "react-icons/cg"


const ExamplePanel = ({ hiddenElements, hideFunc }) => {
  const toggle = () => setOpen(!open);
  const [open, setOpen] = useState(true);

  const dropStyle = {
    transform: open ? "rotate(180deg)" : "rotate(0)"
  }


  const truncateString = (string, max) => {
    if (string.length >= max) return string.substring(0, max) + "...";
    else return string;
  }

  function createNodeList(nodelist) {
    const rows = [];
    for (let i = 0; i < nodelist.length; i++)
      rows.push(
          <div key={nodelist[i].id} className="listElementHolder">
            <div className="leftFloat">
              <span className="dot"></span>
              <div>
                <p className="hiddenNodeName">{truncateString(nodelist[i].data.label, 25)}</p>
              </div>
            </div>
            <CgClose className="hiddenCloseBtn" onClick={() => hideFunc(nodelist[i])}/>
          </div>
      );
    return rows;
  }

  return (
    <>
    <div className="topBar">
      <div className="identifierSection">
        <FaEyeSlash className="faEyeLarge"></FaEyeSlash>
        <p className="panelName">Hidden Elements</p>
      </div>

      <img className="dropBtn" src={Drop} style={dropStyle} alt={"toggleOpen"} onClick={toggle}/>
    </div>
    {open && (
      <div className="content">
        <span className="contentDivider"/>
        <div className="listHolder">
          {createNodeList(hiddenElements)}
        </div>
      </div>
    )}
    </>
  );
};
export default ExamplePanel;
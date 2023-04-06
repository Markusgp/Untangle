import React, {useState} from 'react';
import "./PanelStyles.css"
import ObjectLogo from "../Assets/Object.svg"
import Drop from "../Assets/Drop.svg"
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { CgExpand } from "react-icons/cg";

const InformationPanel = (props) => {
    const toggle = () => setOpen(!open);

    const isPackage = props.type === "package";

    const [open, setOpen] = useState(true);

    const dropStyle = {
        transform: open ? "rotate(180deg)" : "rotate(0)"
    }

    return (
        <>
            <div className="topBar">
                <div className="identifierSection">
                    <img className="objectIcon" src={ObjectLogo} alt="informationPanelLogo"/>
                    <p className="panelName">Information Panel</p>
                </div>
                <img className="dropBtn" src={Drop} style={dropStyle} alt={"toggleOpen"} onClick={toggle}/>
            </div>
            {open && (
                <div className="content">
                    <span className="contentDivider"/>
                    <div className="treeDiagram"></div>
                    <h5>Info</h5>
                    <div className="listHolder">
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Type:</strong></p>
                            </div>
                            <p><i>{props.type.charAt(0).toUpperCase() + props.type.slice(1)}</i></p>
                        </div>
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Name:</strong></p>
                            </div>
                            <p><i>{props.name}</i></p>
                        </div>
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Q-Name:</strong></p>
                            </div>
                            <p><i>{props.pack}</i></p>
                        </div>
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Hidden:</strong></p>
                            </div>
                            <p><i>{(!props.visible).toString()}</i></p>
                        </div>
                        {props.linesOfCode != null && (<div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Lines of Code:</strong></p>
                            </div>

                            <p><i>{props.linesOfCode.toString()}</i></p>
                        </div>)}
                    </div>
                    <div className="buttonWrapper">
                        {isPackage && (
                          <div className="iconButton" id="expand">
                              <p>Expand</p>
                              <CgExpand className="ExpandIcon"></CgExpand>
                          </div>
                        )}
                        <div className="iconButton" id="hide">
                            <p>Hide</p>
                            <FaEye className="EyeIcon"></FaEye>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default InformationPanel;
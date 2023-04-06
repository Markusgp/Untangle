import React, {useState} from 'react';
import "./PanelStyles.css"
import ObjectLogo from "../Assets/Object.svg"
import Drop from "../Assets/Drop.svg"
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { CgExpand, CgCompressRight } from "react-icons/cg";
import openedPackageNode from "../Nodes/OpenedPackageNode";

const InformationPanel = ({treeNode, node}) => {
    const toggle = () => setOpen(!open);

    const isPackage = treeNode.type === "package";
    const isOpenedPackage = node.type === "openedPackageNode";


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
                            <p><i>{treeNode.type.charAt(0).toUpperCase() + treeNode.type.slice(1)}</i></p>
                        </div>
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Name:</strong></p>
                            </div>
                            <p><i>{treeNode.name}</i></p>
                        </div>
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Q-Name:</strong></p>
                            </div>
                            <p><i>{treeNode.pack}</i></p>
                        </div>
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Hidden:</strong></p>
                            </div>
                            <p><i>{(!treeNode.visible).toString()}</i></p>
                        </div>
                        {treeNode.linesOfCode != null && (<div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Lines of Code:</strong></p>
                            </div>

                            <p><i>{treeNode.linesOfCode.toString()}</i></p>
                        </div>)}
                    </div>
                    <div className="buttonWrapper">
                        {isPackage && !isOpenedPackage && (
                          <div className="iconButton">
                              <p>Expand</p>
                              <CgExpand className="ExpandIcon"></CgExpand>
                          </div>
                        )}
                        {isPackage && isOpenedPackage && (
                          <div className="iconButton">
                              <p>Collapse</p>
                              <CgCompressRight className="CollapseIcon"></CgCompressRight>
                          </div>
                        )}
                        <div className="iconButton">
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
import React, {useState} from 'react';
import "./PanelStyles.css"
import ObjectLogo from "../Assets/Object.svg"
import Drop from "../Assets/Drop.svg"
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { CgExpand, CgCompressRight } from "react-icons/cg";
import TreeMap from "./TreeMap";

const InformationPanel = ({treeNode, node, expandFunc}) => {
    console.log("opened")
    const toggle = () => setOpen(!open);

    const isPackage = treeNode.type === "package";
    const isOpenedPackage = node.type === "openedPackageNode";
    const isHidden = treeNode.visible === false;
    const [open, setOpen] = useState(true);

    const dropStyle = {
        transform: open ? "rotate(180deg)" : "rotate(0)"
    }
    const jsonData = ({'children' : treeNode.jsonRep.children});

    return (
        <>
            <div className="topBar">
                <div className="identifierSection">
                    <img className="objectIcon" src={ObjectLogo} alt="informationPanelLogo"/>
                    <p className="panelName">{treeNode.name}</p>
                </div>
                <img className="dropBtn" src={Drop} style={dropStyle} alt={"toggleOpen"} onClick={toggle}/>
            </div>
            {open && (
                <div className="content">
                    <span className="contentDivider"/>
                    {isPackage && (
                        <TreeMap key={Math.random()} width={348} height={198} data={jsonData}></TreeMap>
                    )}
                    <p className="sectionHeader">Specifications</p>
                    <div className="listHolder">
                        {/*
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p>Type:</p>
                            </div>
                            <p><i>{treeNode.type.charAt(0).toUpperCase() + treeNode.type.slice(1)}</i></p>
                        </div>
                        */}
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p>Name:</p>
                            </div>
                            <p><i>{treeNode.name}</i></p>
                        </div>
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p>Q-Name:</p>
                            </div>
                            <p><i>{treeNode.pack}</i></p>
                        </div>
                        {/*
                            <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p>Hidden:</p>
                            </div>
                            <p><i>{(!treeNode.visible).toString()}</i></p>
                        </div>
                        */}
                        {treeNode.linesOfCode != null && (<div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p>Lines of Code:</p>
                            </div>

                            <p><i>{treeNode.linesOfCode.toString()}</i></p>
                        </div>)}
                    </div>
                    <p className="sectionHeader">Options</p>
                    <div className="buttonWrapper">
                        {isPackage && !isOpenedPackage && (
                          <div className="iconButton" onClick={() => expandFunc(null, node)}>
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
                        { !isHidden && (
                          <div className="iconButton">
                              <p>Hide</p>
                              <FaEyeSlash className="EyeIcon"></FaEyeSlash>
                          </div>
                        )}
                        { isHidden && (
                          <div className="iconButton">
                              <p>Unhide</p>
                              <FaEye className="EyeIcon"></FaEye>
                          </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
export default InformationPanel;
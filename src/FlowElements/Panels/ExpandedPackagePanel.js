import React, { useState, useEffect } from 'react';
import "./PanelStyles.css"
import Drop from "../Assets/Drop.svg";
import { FaExpandAlt, FaEyeSlash, FaCompressAlt, FaEye } from 'react-icons/fa';
import {CgClose, CgCompressRight} from "react-icons/cg";
import { TbArrowsMinimize } from "react-icons/tb";
import { FiPackage } from "react-icons/fi"
import { RxMagnifyingGlass } from "react-icons/rx";

const ExpandedPackagePanel = ({ nodes, expandFunc, selectFunc }) => {
  const [open, setOpen] = useState(false);
  const [expandedPackages, setExpandedPackages] = useState([]);

  useEffect(() => {
    const updateExpandedPackages = () => {
      const openedPackages = nodes.filter(node => node.type === 'openedPackageNode');
      setExpandedPackages(openedPackages);
    };
    updateExpandedPackages();
  }, [nodes]);

  const toggle = () => setOpen(!open);

  const dropStyle = {
    transform: open ? "rotate(180deg)" : "rotate(0)"
  }

  const isChildOf = (childNode, parentNode) => {
    return childNode.parentNode === parentNode.id;
  };

  const renderPackageList = (parentId) => {
    const children = expandedPackages.filter(packageNode => isChildOf(packageNode, { id: parentId }));
    if (children.length === 0) {
      return null;
    }

    return (
      <ul style={{margin: 0}}>
        {children.map(childNode => (
          <li key={childNode.id || childNode.name} className="child-item">
            <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
              {childNode.data.label}
              <div>
                <RxMagnifyingGlass onClick={() => selectFunc(null, childNode)} className="InspectIcon" />
                <CgCompressRight onClick={() => expandFunc(null, childNode)} className="CollapseIcon"></CgCompressRight>
              </div>
            </div>
              {renderPackageList(childNode.id)}
          </li>
        ))}
      </ul>
    );
  };

  const findRootPackages = () => {
    return expandedPackages.filter(packageNode => !expandedPackages.some(otherNode => isChildOf(packageNode, otherNode)));
  };

  return (
    <>
      <div className="topBar">
        <div className="identifierSection">
          <FiPackage className="ExpandedPackagesIcon"/>
          <p className="panelName">Expanded Packages</p>
        </div>
        <img className="dropBtn" src={Drop} style={dropStyle} alt={"toggleOpen"} onClick={toggle} />
      </div>
      {open && (
        <div className="content">
          <span className="contentDivider" />
          <ul className="treeRoot" style={{width: "91%"}}>
            {findRootPackages().map(packageNode => (
              <li key={packageNode.id} style={{marginBottom: "5px", borderBottom: "2px solid #FF6C69"}}>
                <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                  {packageNode.data.label}
                  <div>
                    <RxMagnifyingGlass className="InspectIcon" onClick={() => selectFunc(null, packageNode)}/>
                    <CgCompressRight className="CollapseIcon" onClick={() => expandFunc(null, packageNode)}></CgCompressRight>
                  </div>
                </div>
                {renderPackageList(packageNode.id)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
export default ExpandedPackagePanel;

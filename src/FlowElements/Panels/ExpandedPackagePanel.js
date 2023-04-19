import React, { useState, useEffect } from 'react';
import "./PanelStyles.css"
import Drop from "../Assets/Drop.svg";
import { CgCompressRight } from "react-icons/cg";
import { FiPackage } from "react-icons/fi"
import { RxMagnifyingGlass } from "react-icons/rx";

const ExpandedPackagePanel = ({ expandedNodes, expandFunc, selectFunc }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const dropStyle = { transform: open ? "rotate(180deg)" : "rotate(0)" }

  const isChildOf = (childNode, parentNode) => {
    return childNode.parentNode === parentNode.id || childNode.parent === parentNode.id;
  }

  const renderPackageList = (parentId) => {
    const children = expandedNodes.filter(packageNode => isChildOf(packageNode, { id: parentId }));
    if (children.length === 0) return null;

    return (
      <ul style={{margin: 0}}>
        {children.map(childNode => (
          <li key={childNode.id || childNode.name} className="child-item">
            <div className="rowContainer">
              {childNode.data.label}
              <div>
                <RxMagnifyingGlass onClick={() => selectFunc(null, childNode)} className="InspectIcon" />
                <CgCompressRight onClick={() => expandFunc(null, childNode)} className="CollapseIcon" />
              </div>
            </div>
              {renderPackageList(childNode.id)}
          </li>
        ))}
      </ul>
    );
  };

  const findRootPackages = () => {
    return expandedNodes.filter(packageNode => !expandedNodes.some(otherNode => isChildOf(packageNode, otherNode)));
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
          <ul className="treeRoot">
            {findRootPackages().map(packageNode => (
              <li className="parent-item" key={packageNode.id}>
                <div className="rowContainer">
                  {packageNode.data.label}
                  <div>
                    <RxMagnifyingGlass className="InspectIcon" onClick={() => selectFunc(null, packageNode)} />
                    <CgCompressRight className="CollapseIcon" onClick={() => expandFunc(null, packageNode)} />
                  </div>
                </div>
                { renderPackageList(packageNode.id) }
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
export default ExpandedPackagePanel;
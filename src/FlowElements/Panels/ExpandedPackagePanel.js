import React, { useState, useEffect } from 'react';
import "./PanelStyles.css"
import Drop from "../Assets/Drop.svg";
import { FaExpandAlt } from 'react-icons/fa';

const ExpandedPackagePanel = (props) => {
  const [open, setOpen] = useState(false);
  const [expandedPackages, setExpandedPackages] = useState([]);

  useEffect(() => {
    const updateExpandedPackages = () => {
      const openedPackages = props.nodes.filter(node => node.type === 'openedPackageNode');
      setExpandedPackages(openedPackages);
    };
    updateExpandedPackages();
  }, [props.nodes]);

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
      <ul>
        {children.map(childNode => (
          <li key={childNode.id || childNode.name}>
            {childNode.data.label}
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
          <FaExpandAlt className="filterIcon"></FaExpandAlt>
          <p className="panelName">Expanded Packages</p>
        </div>

        <img className="dropBtn" src={Drop} style={dropStyle} alt={"toggleOpen"} onClick={toggle} />
      </div>
      {open && (
        <div className="content">
          <span className="contentDivider" />
          <ul className="tree">
            {findRootPackages().map(packageNode => (
              <li key={packageNode.id}>
                {packageNode.data.label}
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

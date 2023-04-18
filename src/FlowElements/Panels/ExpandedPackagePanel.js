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
    console.log(props.nodes);
    updateExpandedPackages();
  }, [props.nodes]);

  const toggle = () => setOpen(!open);

  const dropStyle = {
    transform: open ? "rotate(180deg)" : "rotate(0)"
  }

  const renderPackageList = (node) => {
    if (node.children && node.children.length > 0) {
      return (
        <ul>
          {node.children.map(childNode => (
            <li key={childNode.id || childNode.name}>
              {childNode.name}
              {renderPackageList(childNode)}
            </li>
          ))}
        </ul>
      );
    }
    return null;
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
          <ul>
            {expandedPackages.map(packageNode => (
              <li key={packageNode.id}>
                {packageNode.label}
                {renderPackageList(packageNode)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
export default ExpandedPackagePanel;

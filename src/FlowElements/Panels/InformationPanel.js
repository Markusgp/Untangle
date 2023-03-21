import React, {useState} from 'react';
import "./PanelStyles.css"
import ObjectLogo from "../Assets/Object.svg"
import Drop from "../Assets/Drop.svg"


const InformationPanel = ({name, pack, visible}) => {
    const toggle = () => setOpen(!open);

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
                                <p><strong>Name:</strong></p>
                            </div>
                            <p>{name}</p>
                        </div>
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Q-Name:</strong></p>
                            </div>
                            <p>{pack}</p>
                        </div>
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Hidden:</strong></p>
                            </div>
                            <p>{(!visible).toString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default InformationPanel;
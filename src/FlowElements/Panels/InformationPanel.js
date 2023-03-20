import React, {useState} from 'react';
import "./PanelStyles.css"
import FileLogo from "../Assets/File.svg"


const InformationPanel = (props) => {
    const toggle = () => setOpen(!open);

    const panelName = "Information-Panel";

    const [open, setOpen] = useState(true);
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
                    <div className="treeDiagram"></div>
                    <h5>Info</h5>
                    <div className="listHolder">
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Name:</strong></p>
                            </div>
                            <p>{props.name?.data?.label}</p>
                        </div>
                        <div className="listElementHolder">
                            <div className="leftFloat">
                                <span className="dot"></span>
                                <p><strong>Q-Name:</strong></p>
                            </div>
                            <p>{props.name?.id}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default InformationPanel;
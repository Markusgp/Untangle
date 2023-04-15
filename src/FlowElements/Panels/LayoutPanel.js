import "./PanelStyles.css"
import {BiLayout} from "react-icons/bi"
import React, {useState} from "react";
import Drop from "../Assets/Drop.svg";


const LayoutPanel = ({children}) => {
    const toggle = () => setOpen(!open);
    const [open, setOpen] = useState(true);

    const dropStyle = {
        transform: open ? "rotate(180deg)" : "rotate(0)"
    }
    return (
        <>
            <div className="topBar">
                <div className="identifierSection">
                    <BiLayout style={{fontSize: "24px", marginRight: "8px", strokeWidth: "0.5px"}}></BiLayout>
                    <p className="panelName">Layout</p>
                </div>
                <img className="dropBtn" src={Drop} style={dropStyle} alt={"toggleOpen"} onClick={toggle}/>
            </div>
            {open && (
                <div className="content">
                    <span className="contentDivider"/>
                    {children}
                </div>
            )}
        </>
    );
};
export default LayoutPanel;
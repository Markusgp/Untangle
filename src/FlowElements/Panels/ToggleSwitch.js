import React from 'react';
import ReactSwitch from 'react-switch';
import {BiShapeCircle, BiNetworkChart} from "react-icons/bi"

function ToggleSwitch({layout, setLayout}) {

    const handleChange = val => {
        const newLayout = val ? "force" : "circle";
        setLayout(newLayout);
    };

    return (
        <div className="SwitchContainer"
             style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <p style={{
                width: "65px",
                fontWeight: "700",
                opacity: layout === "force" ? 0.3 : 1
            }}>{"Circular"}</p>
            <ReactSwitch
                checked={layout === "force"}
                onChange={handleChange}
                offColor="#FF6C69"
                onColor="#FF6C69"
                offHandleColor="#FFFFFF"
                onHandleColor="#FFFFFF"
                height={40}
                width={100}
                handleDiameter={30}
                uncheckedIcon={
                    <BiNetworkChart
                        style={{
                            height: "100%",
                            fontSize: 30,
                            color: "white",
                            marginLeft: "20px",
                            opacity: 0.5
                        }}
                    >
                    </BiNetworkChart>
                }
                checkedIcon={
                    <BiShapeCircle
                        style={{
                            height: "100%",
                            fontSize: 30,
                            color: "white",
                            marginLeft: "10px",
                            opacity: 0.5
                        }}
                    >
                    </BiShapeCircle>}
                uncheckedHandleIcon={
                    <BiShapeCircle
                        style={{
                            height: "100%",
                            fontSize: 25,
                            marginLeft: 3,
                            color: "#00"
                        }}
                    />
                }
                checkedHandleIcon={
                    <BiNetworkChart
                        style={{
                            height: "100%",
                            fontSize: 25,
                            marginLeft: 3,
                            color: "#00"
                        }}
                    >
                    </BiNetworkChart>
                }

            />
            <p style={{
                width: "65px",
                fontWeight: 700,
                opacity: layout === "force" ? 1 : 0.3
            }}>{"Force"}</p>
        </div>
    );
}

export default ToggleSwitch;

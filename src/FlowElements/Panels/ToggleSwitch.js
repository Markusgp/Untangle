import React from 'react';
import ReactSwitch from 'react-switch';

function ToggleSwitch({ layout, setLayout }) {
  const handleChange = val => {
    const newLayout = val ? "force" : "circle";
    setLayout(newLayout);
  };

  return (
    <div className="app" style={{ textAlign: "center" }}>
      <h4>Circular | Force Directed</h4>
      <ReactSwitch
        checked={layout === "force"}
        onChange={handleChange}
      />
    </div>
  );
}

export default ToggleSwitch;

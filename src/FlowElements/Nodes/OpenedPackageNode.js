import './NodeStyles.css'

function OpenedPackageNode({data}) {
  const {id, label} = data;
  const nodeId = id

   return (
     <div className="nodeExpanded" id={nodeId}>
       <div className="titleContainer">
          <h3>.{label}</h3>
       </div>
     </div>
   );
}

export default OpenedPackageNode;
import {Handle, Position} from 'reactflow';
import './NodeStyles.css'
import ComponentLogo from '../Assets/Component.svg'

function PackageNode({data}) {
    const {id, label, isSelected} = data;
    const nodeId = id
    const packageNodeStyle = {
        border: isSelected ? '5px solid #292929' : '5px solid #6FA8FF',
        boxShadow: isSelected ? '0px 5px 15px rgba(0, 0, 0, 0.5)' : '0px 5px 5px rgba(0, 0, 0, 0.3)',
    };

    return (
        <div className="nodeDefault" style={packageNodeStyle}>
            <Handle type="target" position={Position.Top}/>
            <Handle type="source" position={Position.Bottom}/>
            <div className="nodeContentWrapper" id={nodeId}>
                <div className="iconWrapper">
                    <img className="nodeIcon" src={ComponentLogo} alt="ComponentIcon"/>
                </div>
                <div className="nodeNameLabel">{label}.*</div>
                <p className="nodeTypeLabel">&lt;Package&gt;</p>
            </div>
        </div>
    );
}

export default PackageNode;
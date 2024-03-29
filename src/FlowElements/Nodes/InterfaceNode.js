import {Handle, Position} from 'reactflow';
import './NodeStyles.css'
import FileLogo from '../Assets/File.svg'

function InterfaceNode({data}) {
    const {label, isSelected} = data;
    const interfaceNodeStyle = {
        border: isSelected ? '5px solid #292929' : '5px solid #58BF62',
        boxShadow: isSelected ? '0px 5px 15px rgba(0, 0, 0, 0.5)' : '0px 5px 5px rgba(0, 0, 0, 0.3)',
    };

    return (
        <div className="nodeDefault" style={interfaceNodeStyle}>
            <Handle type="target" position={Position.Top}/>
            <Handle type="source" position={Position.Bottom}/>
            <div className="nodeContentWrapper">
                <div className="iconWrapper">
                    <img className="nodeIcon" src={FileLogo} alt="InterfaceIcon"/>
                </div>
                <div className="nodeNameLabel">{label}</div>
                <p className="nodeTypeLabel">&lt;Interface&gt;</p>
            </div>
        </div>
    );
}

export default InterfaceNode;
import {Handle, Position} from 'reactflow';
import './NodeStyles.css'
import FileLogo from '../Assets/File.svg'

function ClassNode({data}) {
    const {label, isSelected} = data;
    const classNodeStyle = {
        border: isSelected ? '5px solid #292929' : '5px solid #FBA500',
        boxShadow: isSelected ? '0px 5px 15px rgba(0, 0, 0, 0.5)' : '0px 5px 5px rgba(0, 0, 0, 0.3)',
    };

    return (
        <div className="nodeDefault" style={classNodeStyle}>
            <Handle type="target" position={Position.Top}/>
            <Handle type="source" position={Position.Bottom}/>
            <div className="nodeContentWrapper">
                <div className="iconWrapper">
                    <img className="nodeIcon" src={FileLogo} alt="ClassIcon"/>
                </div>
                <div className="nodeNameLabel">{label}</div>
                <p className="nodeTypeLabel">&lt;Class&gt;</p>
            </div>
        </div>
    );
}

export default ClassNode;
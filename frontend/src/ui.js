// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { UniversalNode } from './nodes/UniversalNode';
import { EnhancedTextNode } from './nodes/enhancedTextNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Define all node types using UniversalNode
const nodeTypes = {
  customInput: (props) => <UniversalNode {...props} type="customInput" />,
  llm: (props) => <UniversalNode {...props} type="llm" />,
  customOutput: (props) => <UniversalNode {...props} type="customOutput" />,
  text: EnhancedTextNode,
  apiCall: (props) => <UniversalNode {...props} type="apiCall" />,
  dataTransform: (props) => <UniversalNode {...props} type="dataTransform" />,
  conditional: (props) => <UniversalNode {...props} type="conditional" />,
  loop: (props) => <UniversalNode {...props} type="loop" />,
  database: (props) => <UniversalNode {...props} type="database" />
};

// Define nodeColor function outside component
const nodeColor = (node) => {
  const colors = {
    customInput: '#3b82f6',
    customOutput: '#10b981',
    llm: '#f59e0b',
    text: '#8b5cf6',
    apiCall: '#ef4444',
    dataTransform: '#6366f1',
    conditional: '#eab308',
    loop: '#a855f7',
    database: '#14b8a6'
  };
  return colors[node.type] || '#6b7280';
};

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    
    // Use individual selectors to avoid recreation
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const getNodeID = useStore((state) => state.getNodeID);
    const addNode = useStore((state) => state.addNode);
    const onNodesChange = useStore((state) => state.onNodesChange);
    const onEdgesChange = useStore((state) => state.onEdgesChange);
    const onConnect = useStore((state) => state.onConnect);

    const getInitNodeData = useCallback((nodeID, type) => {
      return { id: nodeID, nodeType: `${type}` };
    }, []);

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          const data = event.dataTransfer.getData('application/reactflow');
          
          if (data) {
            const appData = JSON.parse(data);
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode, getInitNodeData]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div ref={reactFlowWrapper} style={{width: '100vw', height: '70vh'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap 
                    nodeColor={nodeColor}
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem'
                    }}
                />
            </ReactFlow>
        </div>
    );
};
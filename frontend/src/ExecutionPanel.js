import { useState } from 'react';
import { useStore } from './store';

export const ExecutionPanel = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const [inputs, setInputs] = useState({});
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const inputNodes = nodes.filter(node => node.type === 'customInput');

    const handleInputChange = (inputName, value) => {
        setInputs(prev => ({ ...prev, [inputName]: value }));
    };

  const handleExecute = async () => {
    setLoading(true);
    
    const pipelineNodes = nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
    }));
    
    const pipelineEdges = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
    }));
    
    // Add debugging
    console.log('Pipeline Nodes:', pipelineNodes);
    console.log('Pipeline Edges:', pipelineEdges);
    console.log('User Inputs:', inputs);
    
    const requestData = {
        pipeline: {
            nodes: pipelineNodes,
            edges: pipelineEdges
        },
        inputs: inputs
    };

        try {
            const response = await fetch('http://localhost:8000/pipelines/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setResults(result);
        } catch (error) {
            console.error('Error executing pipeline:', error);
            alert('Error executing pipeline. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            right: '20px',
            top: '190px', // Positioned below header and toolbar
            width: '300px',
            maxHeight: 'calc(100vh - 320px)', // Leaves space for header, toolbar, and submit button
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            overflowY: 'auto',
            zIndex: 1000 // Ensure it's above other elements
        }}>
            <h2 style={{ marginBottom: '20px' }}>Pipeline Execution</h2>

            {inputNodes.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '10px' }}>Inputs</h3>
                    {inputNodes.map(node => {
                        const inputName = node.data.inputName || node.id;
                        return (
                            <div key={node.id} style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>
                                    {inputName}
                                </label>
                                <input
                                    type="text"
                                    value={inputs[inputName] || ''}
                                    onChange={(e) => handleInputChange(inputName, e.target.value)}
                                    placeholder={`Enter ${inputName}`}
                                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                />
                            </div>
                        );
                    })}
                </div>
            )}

            <button
                onClick={handleExecute}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: loading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '20px'
                }}
            >
                {loading ? 'Executing...' : 'Execute Pipeline'}
            </button>

            {results && (
                <div>
                    <h3 style={{ marginBottom: '10px' }}>Results</h3>
                    {results.outputs && Object.keys(results.outputs).length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h4>Outputs:</h4>
                            {Object.entries(results.outputs).map(([key, value]) => (
                                <div key={key} style={{ marginBottom: '10px' }}>
                                    <strong>{key}:</strong>
                                    <pre style={{
                                        background: '#f5f5f5',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        overflow: 'auto'
                                    }}>
                                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
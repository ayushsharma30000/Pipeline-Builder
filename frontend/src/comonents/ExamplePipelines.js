export const ExamplePipelines = ({ onLoad }) => {
    const examples = [
        {
            name: "Text Transformation",
            description: "Transform text from uppercase to lowercase",
            pipeline: {
                nodes: [
                    {
                        id: 'input-1',
                        type: 'customInput',
                        position: { x: 100, y: 100 },
                        data: { inputName: 'text_input', inputType: 'Text' }
                    },
                    {
                        id: 'transform-1',
                        type: 'dataTransform',
                        position: { x: 400, y: 100 },
                        data: { operation: 'lowercase' }
                    },
                    {
                        id: 'output-1',
                        type: 'customOutput',
                        position: { x: 700, y: 100 },
                        data: { outputName: 'transformed_text', outputType: 'Text' }
                    }
                ],
                edges: [
                    {
                        id: 'e1',
                        source: 'input-1',
                        target: 'transform-1',
                        sourceHandle: 'input-1-value',
                        targetHandle: 'transform-1-input'
                    },
                    {
                        id: 'e2',
                        source: 'transform-1',
                        target: 'output-1',
                        sourceHandle: 'transform-1-output',
                        targetHandle: 'output-1-value'
                    }
                ]
            }
        },
        {
            name: "Conditional Logic",
            description: "Route data based on condition",
            pipeline: {
                nodes: [
                    {
                        id: 'input-1',
                        type: 'customInput',
                        position: { x: 100, y: 100 },
                        data: { inputName: 'user_input', inputType: 'Text' }
                    },
                    {
                        id: 'condition-1',
                        type: 'conditional',
                        position: { x: 400, y: 100 },
                        data: { condition: 'equals', value: 'yes' }
                    },
                    {
                        id: 'output-true',
                        type: 'customOutput',
                        position: { x: 700, y: 50 },
                        data: { outputName: 'true_result', outputType: 'Text' }
                    },
                    {
                        id: 'output-false',
                        type: 'customOutput',
                        position: { x: 700, y: 150 },
                        data: { outputName: 'false_result', outputType: 'Text' }
                    }
                ],
                edges: [
                    {
                        id: 'e1',
                        source: 'input-1',
                        target: 'condition-1',
                        sourceHandle: 'input-1-value',
                        targetHandle: 'condition-1-input'
                    },
                    {
                        id: 'e2',
                        source: 'condition-1',
                        target: 'output-true',
                        sourceHandle: 'condition-1-true',
                        targetHandle: 'output-true-value'
                    },
                    {
                        id: 'e3',
                        source: 'condition-1',
                        target: 'output-false',
                        sourceHandle: 'condition-1-false',
                        targetHandle: 'output-false-value'
                    }
                ]
            }
        }
    ];

    return (
        <div style={{
            position: 'fixed',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '300px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            padding: '1.5rem',
            maxHeight: '80vh',
            overflowY: 'auto'
        }}>
            <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: 'var(--gray-800)'
            }}>
                Example Pipelines
            </h2>
            
            {examples.map((example, index) => (
                <div
                    key={index}
                    style={{
                        padding: '1rem',
                        background: 'var(--gray-50)',
                        borderRadius: 'var(--radius)',
                        marginBottom: '1rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--gray-100)';
                        e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--gray-50)';
                        e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    onClick={() => onLoad(example.pipeline)}
                >
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem',
                        color: 'var(--gray-700)'
                    }}>
                        {example.name}
                    </h3>
                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--gray-600)'
                    }}>
                        {example.description}
                    </p>
                </div>
            ))}
        </div>
    );
};
// toolbar.js
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div style={{ 
            padding: '1rem 2rem',
            background: 'var(--gray-50)',
            borderTop: '1px solid var(--gray-200)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.5rem'
            }}>
                <h2 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--gray-700)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    Nodes
                </h2>
                <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--gray-500)'
                }}>
                    Drag and drop to canvas
                </div>
            </div>
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.75rem'
            }}>
                {/* Original nodes */}
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                
                {/* New nodes */}
                <DraggableNode type='apiCall' label='API Call' />
                <DraggableNode type='dataTransform' label='Transform' />
                <DraggableNode type='conditional' label='Conditional' />
                <DraggableNode type='loop' label='Loop' />
                <DraggableNode type='database' label='Database' />
            </div>
        </div>
    );
};
// enhancedTextNode.js
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const EnhancedTextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [text, setText] = useState(data?.text || '{{input}}');
  const [handles, setHandles] = useState([]);
  const [nodeSize, setNodeSize] = useState({ width: 220, height: 90 });
  const textAreaRef = useRef(null);

  // Extract variables from text
  const extractVariables = (text) => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    
    return variables;
  };

  // Update handles when text changes
  useEffect(() => {
    const variables = extractVariables(text);
    setHandles(variables);
  }, [text]);

  // Auto-resize based on content
  useEffect(() => {
    if (textAreaRef.current) {
      const textarea = textAreaRef.current;
      textarea.style.height = 'auto';
      const newHeight = Math.max(90, textarea.scrollHeight + 60);
      
      const lines = text.split('\n');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = '14px sans-serif';
      
      let maxWidth = 220;
      lines.forEach(line => {
        const metrics = context.measureText(line);
        maxWidth = Math.max(maxWidth, metrics.width + 60);
      });
      
      setNodeSize({
        width: Math.min(maxWidth, 400),
        height: newHeight
      });
    }
  }, [text]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <div 
      className="node-container fade-in"
      style={{
        width: nodeSize.width,
        minHeight: nodeSize.height,
        border: 'none',
        borderRadius: '0.75rem',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        padding: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'visible'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      }}
    >
      {/* Dynamic input handles for variables */}
      {handles.map((variable, index) => (
        <div key={variable}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${variable}`}
            style={{
              top: `${((index + 1) * 100) / (handles.length + 1)}%`,
              background: '#8b5cf6',
              border: '3px solid white',
              width: '14px',
              height: '14px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              left: '-7px'  // Center the handle on the edge
            }}
          />
          {/* Variable label - positioned outside the node */}
          <div
            style={{
              position: 'absolute',
              left: '-60px',  // Position to the left of the handle
              top: `${((index + 1) * 100) / (handles.length + 1)}%`,
              transform: 'translateY(-50%)',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#8b5cf6',
              background: 'white',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.375rem',
              border: '1px solid #8b5cf6',
              whiteSpace: 'nowrap',
              zIndex: 10,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            {variable}
          </div>
        </div>
      ))}

      {/* Node Header */}
      <div style={{ 
        fontWeight: '700',
        fontSize: '1rem',
        marginBottom: '0.75rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        Text
      </div>

      {/* Text Area */}
      <div>
        <textarea
          ref={textAreaRef}
          value={text}
          onChange={handleTextChange}
          style={{
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '0.375rem',
            padding: '0.5rem',
            fontSize: '0.875rem',
            resize: 'none',
            minHeight: '40px',
            background: 'rgba(255, 255, 255, 0.95)',
            color: 'var(--gray-800)',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.4',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
          }}
          placeholder="Enter text or use {{variables}}"
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          background: '#8b5cf6',
          border: '3px solid white',
          width: '14px',
          height: '14px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          right: '-7px'  // Center the handle on the edge
        }}
      />
    </div>
  );
};
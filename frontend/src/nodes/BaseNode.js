import { Handle, Position } from 'reactflow';
import { useState, useEffect } from 'react';
import { useStore } from '../store';

export const BaseNode = ({ id, data, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const removeNode = useStore((state) => state.removeNode);
  const [fieldValues, setFieldValues] = useState({});
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  // Initialize field values
  useEffect(() => {
    const initialValues = {};
    config.fields?.forEach(field => {
      initialValues[field.name] = data[field.name] || field.defaultValue || '';
    });
    setFieldValues(initialValues);
  }, [config.fields, data]);

  const handleFieldChange = (fieldName, value) => {
    setFieldValues(prev => ({ ...prev, [fieldName]: value }));
    updateNodeField(id, fieldName, value);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    removeNode(id);
  };

  const renderField = (field) => {
    const inputStyles = {
      width: '100%',
      padding: '0.5rem',
      fontSize: '0.875rem',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '0.375rem',
      background: 'rgba(255, 255, 255, 0.95)',
      color: 'var(--gray-800)',
      outline: 'none',
      transition: 'all 0.2s ease',
      marginTop: '0.25rem'
    };

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={fieldValues[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={inputStyles}
            placeholder={field.placeholder}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
          />
        );
      case 'select':
        return (
          <select
            value={fieldValues[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={{
              ...inputStyles,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            value={fieldValues[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={{
              ...inputStyles,
              resize: 'vertical',
              minHeight: '60px',
              fontFamily: 'monospace'
            }}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="node-container fade-in"
      style={{
        width: config.width || 200,
        minHeight: config.height || 80,
        border: 'none',
        borderRadius: '0.75rem',
        background: config.background || 'white',
        padding: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'visible',
        ...config.style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        setShowDeleteButton(true);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        setShowDeleteButton(false);
      }}
    >
      {/* Delete button */}
      {showDeleteButton && (
        <button
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#ef4444',
            color: 'white',
            border: '2px solid white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ef4444';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Delete node"
        >
          ×
        </button>
      )}

      {/* Render input handles */}
      {config.handles?.inputs?.map((handle, index) => (
        <Handle
          key={handle.id}
          type="target"
          position={handle.position || Position.Left}
          id={handle.id}
          style={{
            top: handle.top || `${((index + 1) * 100) / (config.handles.inputs.length + 1)}%`,
            background: config.handleColor || 'var(--primary)',
            border: '3px solid white',
            width: '14px',
            height: '14px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            ...handle.style
          }}
        />
      ))}

      {/* Node Header */}
      <div style={{ 
        fontWeight: '700',
        fontSize: '1rem',
        marginBottom: '0.75rem',
        color: config.titleColor || 'var(--gray-800)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {config.icon && <span style={{ fontSize: '1.25rem' }}>{config.icon}</span>}
        {config.title}
      </div>

      {/* Node Fields */}
      <div style={{ marginTop: '0.5rem' }}>
        {config.fields?.map(field => (
          <div key={field.name} style={{ marginBottom: '0.75rem' }}>
            {field.label && (
              <label style={{ 
                fontSize: '0.75rem',
                color: config.titleColor || 'var(--gray-700)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                opacity: 0.9
              }}>
                {field.label}
              </label>
            )}
            {renderField(field)}
          </div>
        ))}
      </div>

      {/* Custom content */}
      {config.customContent && (
        <div style={{ marginTop: '0.75rem' }}>
          {config.customContent({ id, data, fieldValues })}
        </div>
      )}

      {/* Render output handles */}
      {config.handles?.outputs?.map((handle, index) => (
        <Handle
          key={handle.id}
          type="source"
          position={handle.position || Position.Right}
          id={handle.id}
          style={{
            top: handle.top || `${((index + 1) * 100) / (config.handles.outputs.length + 1)}%`,
            background: config.handleColor || 'var(--primary)',
            border: '3px solid white',
            width: '14px',
            height: '14px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            ...handle.style
          }}
        />
      ))}
    </div>
  );
};
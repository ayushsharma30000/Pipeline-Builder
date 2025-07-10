// nodeConfigs.js
import { Position } from 'reactflow';

export const nodeConfigs = {
  // Original nodes
  customInput: {
    title: 'Input',
    width: 220,
    height: 90,
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    borderColor: '#2563eb',
    titleColor: '#ffffff',
    handleColor: '#3b82f6',
    fields: [
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        defaultValue: (id) => id.replace('customInput-', 'input_'),
        placeholder: 'Enter input name'
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' }
        ]
      }
    ],
    handles: {
      outputs: [
        { id: (id) => `${id}-value`, position: Position.Right }
      ]
    }
  },
  
  llm: {
    title: 'LLM',
    width: 220,
    height: 110,
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    borderColor: '#d97706',
    titleColor: '#ffffff',
    handleColor: '#f59e0b',
    customContent: () => <div style={{ fontSize: '0.75rem', color: '#ffffff', opacity: 0.9 }}>Language Model Processing</div>,
    handles: {
      inputs: [
        { id: (id) => `${id}-system`, position: Position.Left, top: '33%' },
        { id: (id) => `${id}-prompt`, position: Position.Left, top: '67%' }
      ],
      outputs: [
        { id: (id) => `${id}-response`, position: Position.Right }
      ]
    }
  },
  
  customOutput: {
    title: 'Output',
    width: 220,
    height: 90,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderColor: '#059669',
    titleColor: '#ffffff',
    handleColor: '#10b981',
    fields: [
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        defaultValue: (id) => id.replace('customOutput-', 'output_'),
        placeholder: 'Enter output name'
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' }
        ]
      }
    ],
    handles: {
      inputs: [
        { id: (id) => `${id}-value`, position: Position.Left }
      ]
    }
  },
  
  text: {
    title: 'Text',
    width: 220,
    height: 90,
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    borderColor: '#7c3aed',
    titleColor: '#ffffff',
    handleColor: '#8b5cf6',
    isEnhanced: true,
    fields: [
      {
        name: 'text',
        label: 'Text',
        type: 'text',
        defaultValue: '{{input}}',
        placeholder: 'Enter text'
      }
    ],
    handles: {
      outputs: [
        { id: (id) => `${id}-output`, position: Position.Right }
      ]
    }
  },

  // New nodes with gradient backgrounds
  apiCall: {
    title: 'API Call',
    width: 240,
    height: 130,
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    borderColor: '#dc2626',
    titleColor: '#ffffff',
    handleColor: '#ef4444',
    fields: [
      {
        name: 'endpoint',
        label: 'Endpoint URL',
        type: 'text',
        defaultValue: 'https://api.example.com',
        placeholder: 'Enter API endpoint'
      },
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: 'GET',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' }
        ]
      }
    ],
    handles: {
      inputs: [
        { id: (id) => `${id}-body`, position: Position.Left }
      ],
      outputs: [
        { id: (id) => `${id}-response`, position: Position.Right }
      ]
    }
  },

  dataTransform: {
    title: 'Data Transform',
    width: 220,
    height: 110,
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    borderColor: '#4f46e5',
    titleColor: '#ffffff',
    handleColor: '#6366f1',
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        defaultValue: 'parse_json',
        options: [
          { value: 'parse_json', label: 'Parse JSON' },
          { value: 'stringify', label: 'Stringify' },
          { value: 'uppercase', label: 'Uppercase' },
          { value: 'lowercase', label: 'Lowercase' }
        ]
      }
    ],
    handles: {
      inputs: [
        { id: (id) => `${id}-input`, position: Position.Left }
      ],
      outputs: [
        { id: (id) => `${id}-output`, position: Position.Right }
      ]
    }
  },

  conditional: {
    title: 'Conditional',
    width: 220,
    height: 120,
    background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    borderColor: '#ca8a04',
    titleColor: '#ffffff',
    handleColor: '#eab308',
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'select',
        defaultValue: 'equals',
        options: [
          { value: 'equals', label: 'Equals' },
          { value: 'not_equals', label: 'Not Equals' },
          { value: 'greater_than', label: 'Greater Than' },
          { value: 'less_than', label: 'Less Than' }
        ]
      },
      {
        name: 'value',
        label: 'Compare Value',
        type: 'text',
        defaultValue: '',
        placeholder: 'Enter value'
      }
    ],
    handles: {
      inputs: [
        { id: (id) => `${id}-input`, position: Position.Left }
      ],
      outputs: [
        { id: (id) => `${id}-true`, position: Position.Right, top: '30%' },
        { id: (id) => `${id}-false`, position: Position.Right, top: '70%' }
      ]
    }
  },

  loop: {
    title: 'Loop',
    width: 220,
    height: 110,
    background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    borderColor: '#9333ea',
    titleColor: '#ffffff',
    handleColor: '#a855f7',
    fields: [
      {
        name: 'iterations',
        label: 'Iterations',
        type: 'text',
        defaultValue: '10',
        placeholder: 'Number of iterations'
      }
    ],
    handles: {
      inputs: [
        { id: (id) => `${id}-input`, position: Position.Left }
      ],
      outputs: [
        { id: (id) => `${id}-loop`, position: Position.Right, top: '30%' },
        { id: (id) => `${id}-complete`, position: Position.Right, top: '70%' }
      ]
    }
  },

  database: {
    title: 'Database Query',
    width: 240,
    height: 150,
    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    borderColor: '#0d9488',
    titleColor: '#ffffff',
    handleColor: '#14b8a6',
    fields: [
      {
        name: 'database',
        label: 'Database',
        type: 'select',
        defaultValue: 'postgresql',
        options: [
          { value: 'postgresql', label: 'PostgreSQL' },
          { value: 'mysql', label: 'MySQL' },
          { value: 'mongodb', label: 'MongoDB' },
          { value: 'sqlite', label: 'SQLite' }
        ]
      },
      {
        name: 'query',
        label: 'Query',
        type: 'textarea',
        defaultValue: 'SELECT * FROM users',
        placeholder: 'Enter SQL query',
        rows: 3
      }
    ],
    handles: {
      inputs: [
        { id: (id) => `${id}-params`, position: Position.Left }
      ],
      outputs: [
        { id: (id) => `${id}-results`, position: Position.Right }
      ]
    }
  }
};
// UniversalNode.js
import { BaseNode } from './BaseNode';
import { nodeConfigs } from './nodeConfigs';

export const UniversalNode = ({ id, data, type }) => {
  const config = nodeConfigs[type];
  
  if (!config) {
    return <div>Unknown node type: {type}</div>;
  }

  // Process dynamic values in config
  const processedConfig = {
    ...config,
    fields: config.fields?.map(field => ({
      ...field,
      defaultValue: typeof field.defaultValue === 'function' 
        ? field.defaultValue(id) 
        : field.defaultValue
    })),
    handles: {
      inputs: config.handles?.inputs?.map(handle => ({
        ...handle,
        id: typeof handle.id === 'function' ? handle.id(id) : handle.id
      })),
      outputs: config.handles?.outputs?.map(handle => ({
        ...handle,
        id: typeof handle.id === 'function' ? handle.id(id) : handle.id
      }))
    }
  };

  return <BaseNode id={id} data={data} config={processedConfig} />;
};
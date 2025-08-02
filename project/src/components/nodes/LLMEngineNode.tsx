import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Bot } from 'lucide-react';

export const LLMEngineNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`bg-white rounded-lg border-2 p-4 shadow-sm min-w-[200px] ${
      selected ? 'border-purple-500' : 'border-gray-200'
    } hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center space-x-2 mb-2">
        <div className="bg-purple-500 p-1.5 rounded text-white">
          <Bot size={16} />
        </div>
        <h3 className="font-medium text-gray-900">LLM Engine</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">AI language model processing</p>
      
      {data.config?.provider && (
        <div className="text-xs bg-purple-50 p-2 rounded border">
          <div>Provider: {data.config.provider}</div>
          {data.config.model && <div>Model: {data.config.model}</div>}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="bg-purple-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="bg-purple-500 border-2 border-white"
      />
    </div>
  );
};
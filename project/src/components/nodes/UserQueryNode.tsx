import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';

export const UserQueryNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`bg-white rounded-lg border-2 p-4 shadow-sm min-w-[200px] ${
      selected ? 'border-blue-500' : 'border-gray-200'
    } hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center space-x-2 mb-2">
        <div className="bg-blue-500 p-1.5 rounded text-white">
          <MessageSquare size={16} />
        </div>
        <h3 className="font-medium text-gray-900">User Query</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">Entry point for user input</p>
      
      {data.config?.query && (
        <div className="text-xs bg-blue-50 p-2 rounded border">
          Query: {data.config.query}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="bg-blue-500 border-2 border-white"
      />
    </div>
  );
};
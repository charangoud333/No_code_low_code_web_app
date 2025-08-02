import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database } from 'lucide-react';

export const KnowledgeBaseNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`bg-white rounded-lg border-2 p-4 shadow-sm min-w-[200px] ${
      selected ? 'border-green-500' : 'border-gray-200'
    } hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center space-x-2 mb-2">
        <div className="bg-green-500 p-1.5 rounded text-white">
          <Database size={16} />
        </div>
        <h3 className="font-medium text-gray-900">Knowledge Base</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">Upload and process PDFs</p>
      
      {data.config?.fileName && (
        <div className="text-xs bg-green-50 p-2 rounded border">
          File: {data.config.fileName}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="bg-green-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="bg-green-500 border-2 border-white"
      />
    </div>
  );
};
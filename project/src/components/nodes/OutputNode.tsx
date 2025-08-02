import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MonitorSpeaker } from 'lucide-react';

export const OutputNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`bg-white rounded-lg border-2 p-4 shadow-sm min-w-[200px] ${
      selected ? 'border-orange-500' : 'border-gray-200'
    } hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center space-x-2 mb-2">
        <div className="bg-orange-500 p-1.5 rounded text-white">
          <MonitorSpeaker size={16} />
        </div>
        <h3 className="font-medium text-gray-900">Output</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">Display final results</p>
      
      {data.config?.displayFormat && (
        <div className="text-xs bg-orange-50 p-2 rounded border">
          Format: {data.config.displayFormat}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="bg-orange-500 border-2 border-white"
      />
    </div>
  );
};
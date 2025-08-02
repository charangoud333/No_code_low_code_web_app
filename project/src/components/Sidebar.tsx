import React from 'react';
import { MessageSquare, Database, Bot, MonitorSpeaker } from 'lucide-react';

const nodeTypes = [
  {
    type: 'userQuery',
    label: 'User Query',
    icon: MessageSquare,
    description: 'Entry point for user input',
    color: 'bg-blue-500'
  },
  {
    type: 'knowledgeBase',
    label: 'Knowledge Base',
    icon: Database,
    description: 'Upload and process PDFs',
    color: 'bg-green-500'
  },
  {
    type: 'llmEngine',
    label: 'LLM Engine',
    icon: Bot,
    description: 'AI language model processing',
    color: 'bg-purple-500'
  },
  {
    type: 'output',
    label: 'Output',
    icon: MonitorSpeaker,
    description: 'Display final results',
    color: 'bg-orange-500'
  }
];

export const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Components</h2>
      
      <div className="space-y-3">
        {nodeTypes.map(({ type, label, icon: Icon, description, color }) => (
          <div
            key={type}
            className="p-3 rounded-lg border border-gray-200 cursor-grab hover:shadow-md transition-shadow duration-200 bg-gray-50 hover:bg-white"
            draggable
            onDragStart={(event) => onDragStart(event, type)}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-md ${color} text-white`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{label}</h3>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Instructions</h3>
        <div className="text-xs text-gray-600 space-y-2">
          <p>1. Drag components to the canvas</p>
          <p>2. Connect nodes with arrows</p>
          <p>3. Configure each node by selecting it</p>
          <p>4. Run your workflow with the chat interface</p>
        </div>
      </div>
    </div>
  );
};
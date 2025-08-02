import React, { useState } from 'react';
import { Play, Settings, MessageSquare, Save, Upload } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import { workflowService } from '../services/workflowService';

interface HeaderProps {
  onOpenChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenChat }) => {
  const { nodes, edges, isExecuting } = useWorkflowStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRunWorkflow = async () => {
    try {
      await workflowService.validateWorkflow(nodes, edges);
      onOpenChat();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Workflow validation failed');
    }
  };

  const handleSaveWorkflow = () => {
    const workflowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLoadWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflowData = JSON.parse(e.target?.result as string);
        // Here you would load the workflow data into the store
        console.log('Loading workflow:', workflowData);
        alert('Workflow loaded successfully!');
      } catch (error) {
        alert('Failed to load workflow file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Workflow Builder</h1>
          <span className="text-sm text-gray-500">
            {nodes.length} nodes, {edges.length} connections
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {showSuccess && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm">
              Workflow saved!
            </div>
          )}
          
          <input
            type="file"
            accept=".json"
            onChange={handleLoadWorkflow}
            className="hidden"
            id="load-workflow"
          />
          
          <button
            onClick={() => document.getElementById('load-workflow')?.click()}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <Upload size={16} />
            <span>Load</span>
          </button>

          <button
            onClick={handleSaveWorkflow}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <Save size={16} />
            <span>Save</span>
          </button>

          <button
            onClick={handleRunWorkflow}
            disabled={isExecuting || nodes.length === 0}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Play size={16} />
            <span>Run Workflow</span>
          </button>

          <button
            onClick={onOpenChat}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
          >
            <MessageSquare size={16} />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
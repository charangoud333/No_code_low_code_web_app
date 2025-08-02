import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Save } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import {
  UserQueryConfig,
  KnowledgeBaseConfig,
  LLMEngineConfig,
  OutputConfig
} from '../types/workflow';

export const ConfigPanel: React.FC = () => {
  const { selectedNode, updateNode, setSelectedNode } = useWorkflowStore();
  const { register, handleSubmit, setValue, watch } = useForm();

  React.useEffect(() => {
    if (selectedNode?.data.config) {
      Object.entries(selectedNode.data.config).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [selectedNode, setValue]);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
          </div>
          <p>Select a node to configure its settings</p>
        </div>
      </div>
    );
  }

  const onSubmit = (data: any) => {
    updateNode(selectedNode.id, { config: data });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('fileName', file.name);
      setValue('pdfFile', file);
    }
  };

  const renderUserQueryConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Placeholder Text
        </label>
        <input
          {...register('placeholder')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your question..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Query (Optional)
        </label>
        <textarea
          {...register('query')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
          placeholder="Default question to ask..."
        />
      </div>
    </div>
  );

  const renderKnowledgeBaseConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          PDF Document
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer flex flex-col items-center text-gray-600 hover:text-gray-800"
          >
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm">Click to upload PDF</span>
            {watch('fileName') && (
              <span className="text-xs text-green-600 mt-1">{watch('fileName')}</span>
            )}
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Embedding Provider
        </label>
        <select
          {...register('embeddingProvider')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="openai">OpenAI</option>
          <option value="cohere">Cohere</option>
          <option value="gemini">Gemini</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key
        </label>
        <input
          {...register('apiKey')}
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter API key..."
        />
      </div>
    </div>
  );

  const renderLLMEngineConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Provider
        </label>
        <select
          {...register('provider')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="openai">OpenAI</option>
          <option value="gemini">Gemini</option>
          <option value="groq">Groq</option>
          <option value="cohere">Cohere</option>
          <option value="anthropic">Anthropic</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          {...register('model')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {watch('provider') === 'openai' && (
            <>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4.1">GPT-4.1</option>
              <option value="o1-mini">o1-mini</option>
            </>
          )}
          {watch('provider') === 'gemini' && (
            <>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            </>
          )}
          {watch('provider') === 'groq' && (
            <option value="mixtral">Mixtral</option>
          )}
          {watch('provider') === 'cohere' && (
            <option value="command-r">Command-R</option>
          )}
          {watch('provider') === 'anthropic' && (
            <option value="claude-sonnet">Claude Sonnet</option>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key
        </label>
        <input
          {...register('apiKey')}
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter API key..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Temperature: {watch('temperature') || 0.7}
        </label>
        <input
          {...register('temperature', { valueAsNumber: true })}
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Tokens
        </label>
        <input
          {...register('maxTokens', { valueAsNumber: true })}
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="1000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt (Optional)
        </label>
        <textarea
          {...register('systemPrompt')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
          placeholder="You are a helpful assistant..."
        />
      </div>
    </div>
  );

  const renderOutputConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Display Format
        </label>
        <select
          {...register('displayFormat')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="chat">Chat Interface</option>
          <option value="text">Plain Text</option>
        </select>
      </div>
    </div>
  );

  const getNodeColor = () => {
    switch (selectedNode.type) {
      case 'userQuery': return 'blue';
      case 'knowledgeBase': return 'green';
      case 'llmEngine': return 'purple';
      case 'output': return 'orange';
      default: return 'gray';
    }
  };

  const color = getNodeColor();

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className={`bg-${color}-500 text-white p-4 flex items-center justify-between`}>
        <h3 className="font-medium">Configure Node</h3>
        <button
          onClick={() => setSelectedNode(null)}
          className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-1">{selectedNode.data.label}</h4>
          <p className="text-sm text-gray-600">Node ID: {selectedNode.id}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {selectedNode.type === 'userQuery' && renderUserQueryConfig()}
          {selectedNode.type === 'knowledgeBase' && renderKnowledgeBaseConfig()}
          {selectedNode.type === 'llmEngine' && renderLLMEngineConfig()}
          {selectedNode.type === 'output' && renderOutputConfig()}

          <button
            type="submit"
            className={`w-full bg-${color}-500 text-white py-2 px-4 rounded-md hover:bg-${color}-600 flex items-center justify-center space-x-2 transition-colors duration-200`}
          >
            <Save size={16} />
            <span>Save Configuration</span>
          </button>
        </form>
      </div>
    </div>
  );
};
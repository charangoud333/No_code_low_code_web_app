import React, { useCallback, useRef, DragEvent } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ReactFlowProvider,
  ReactFlowInstance,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '../store/workflowStore';
import { WorkflowNode } from '../types/workflow';
import { UserQueryNode } from './nodes/UserQueryNode';
import { KnowledgeBaseNode } from './nodes/KnowledgeBaseNode';
import { LLMEngineNode } from './nodes/LLMEngineNode';
import { OutputNode } from './nodes/OutputNode';

const nodeTypes = {
  userQuery: UserQueryNode,
  knowledgeBase: KnowledgeBaseNode,
  llmEngine: LLMEngineNode,
  output: OutputNode
};

export const WorkflowCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    addNode,
    addEdge: addStoreEdge,
    setSelectedNode
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const currentNodes = useWorkflowStore.getState().nodes;
      const updatedNodes = applyNodeChanges(changes, currentNodes);
      setNodes(updatedNodes);
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const currentEdges = useWorkflowStore.getState().edges;
      const updatedEdges = applyEdgeChanges(changes, currentEdges);
      setEdges(updatedEdges);
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const edge: Edge = {
        id: `edge-${params.source}-${params.target}`,
        source: params.source!,
        target: params.target!,
        type: 'smoothstep'
      };
      addStoreEdge(edge);
      setEdges((eds) => addEdge(params, eds));
    },
    [addStoreEdge, setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (!position) return;

      const newNode: WorkflowNode = {
        id: `${type}-${Date.now()}`,
        type: type as WorkflowNode['type'],
        position,
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          config: getDefaultConfig(type)
        }
      };

      addNode(newNode);
      setNodes((nds) => nds.concat(newNode as Node));
    },
    [reactFlowInstance, addNode, setNodes]
  );

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case 'userQuery':
        return { placeholder: 'Enter your question...' };
      case 'knowledgeBase':
        return { embeddingProvider: 'openai' };
      case 'llmEngine':
        return {
          provider: 'openai',
          model: 'gpt-4o',
          temperature: 0.7,
          maxTokens: 1000
        };
      case 'output':
        return { displayFormat: 'chat' };
      default:
        return {};
    }
  };

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node as WorkflowNode);
    },
    [setSelectedNode]
  );

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes as Node[]}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm" />
        <MiniMap className="bg-white border border-gray-200 rounded-lg shadow-sm" />
        <Background color="#e5e7eb" gap={20} />
      </ReactFlow>
    </div>
  );
};

export const WorkflowCanvasWrapper: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  );
};
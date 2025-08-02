import { create } from 'zustand';
import { WorkflowNode, WorkflowEdge, ChatMessage, WorkflowExecution } from '../types/workflow';

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  chatMessages: ChatMessage[];
  currentExecution: WorkflowExecution | null;
  isExecuting: boolean;
  
  // Actions
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, data: Partial<WorkflowNode['data']>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (id: string) => void;
  setSelectedNode: (node: WorkflowNode | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  setExecution: (execution: WorkflowExecution | null) => void;
  setIsExecuting: (executing: boolean) => void;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  chatMessages: [],
  currentExecution: null,
  isExecuting: false,

  addNode: (node) => {
    set(state => ({
      nodes: [...state.nodes, node]
    }));
  },

  updateNode: (id, data) => {
    set(state => ({
      nodes: state.nodes.map(node => 
        node.id === id 
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    }));
  },

  removeNode: (id) => {
    set(state => ({
      nodes: state.nodes.filter(node => node.id !== id),
      edges: state.edges.filter(edge => edge.source !== id && edge.target !== id),
      selectedNode: state.selectedNode?.id === id ? null : state.selectedNode
    }));
  },

  addEdge: (edge) => {
    set(state => ({
      edges: [...state.edges, edge]
    }));
  },

  removeEdge: (id) => {
    set(state => ({
      edges: state.edges.filter(edge => edge.id !== id)
    }));
  },

  setSelectedNode: (node) => {
    set({ selectedNode: node });
  },

  addChatMessage: (message) => {
    set(state => ({
      chatMessages: [...state.chatMessages, message]
    }));
  },

  clearChat: () => {
    set({ chatMessages: [] });
  },

  setExecution: (execution) => {
    set({ currentExecution: execution });
  },

  setIsExecuting: (executing) => {
    set({ isExecuting: executing });
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    set({ edges });
  }
}));
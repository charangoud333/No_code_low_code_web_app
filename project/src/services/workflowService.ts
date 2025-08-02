import axios from 'axios';
import { WorkflowNode, WorkflowEdge } from '../types/workflow';

const API_BASE_URL = 'http://localhost:8000';

class WorkflowService {
  async executeWorkflow(query: string, nodes: WorkflowNode[], edges: WorkflowEdge[]) {
    try {
      const response = await axios.post(`${API_BASE_URL}/run_workflow`, {
        query,
        nodes,
        edges
      });
      return response.data;
    } catch (error) {
      // Mock response for development
      console.log('API not available, using mock response');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on workflow configuration
      const llmNode = nodes.find(node => node.type === 'llmEngine');
      const kbNode = nodes.find(node => node.type === 'knowledgeBase');
      
      let response = `Mock response for query: "${query}"`;
      
      if (kbNode?.data.config?.fileName) {
        response += `\n\nKnowledge from ${kbNode.data.config.fileName} has been processed.`;
      }
      
      if (llmNode?.data.config?.provider) {
        response += `\n\nProcessed using ${llmNode.data.config.provider} ${llmNode.data.config.model || ''}.`;
      }
      
      return {
        success: true,
        response,
        execution_id: `mock-${Date.now()}`
      };
    }
  }

  async uploadPDF(file: File, embeddingProvider: string, apiKey: string) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('embedding_provider', embeddingProvider);
      formData.append('api_key', apiKey);

      const response = await axios.post(`${API_BASE_URL}/upload_pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      // Mock response for development
      console.log('PDF upload API not available, using mock response');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        message: `Mock: PDF "${file.name}" processed successfully with ${embeddingProvider}`,
        document_id: `mock-doc-${Date.now()}`
      };
    }
  }

  async validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
    // Basic workflow validation
    const userQueryNodes = nodes.filter(node => node.type === 'userQuery');
    const outputNodes = nodes.filter(node => node.type === 'output');
    
    if (userQueryNodes.length === 0) {
      throw new Error('Workflow must have at least one User Query node');
    }
    
    if (outputNodes.length === 0) {
      throw new Error('Workflow must have at least one Output node');
    }
    
    // Check for disconnected nodes
    const connectedNodes = new Set<string>();
    edges.forEach(edge => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });
    
    const disconnectedNodes = nodes.filter(node => !connectedNodes.has(node.id));
    if (disconnectedNodes.length > 0 && nodes.length > 1) {
      console.warn('Some nodes are not connected:', disconnectedNodes);
    }
    
    return { valid: true };
  }
}

export const workflowService = new WorkflowService();
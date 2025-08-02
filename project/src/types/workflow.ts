export interface WorkflowNode {
  id: string;
  type: 'userQuery' | 'knowledgeBase' | 'llmEngine' | 'output';
  position: { x: number; y: number };
  data: {
    label: string;
    config?: any;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface UserQueryConfig {
  placeholder: string;
  query?: string;
}

export interface KnowledgeBaseConfig {
  pdfFile?: File;
  fileName?: string;
  embeddingProvider: 'openai' | 'cohere' | 'gemini';
  apiKey?: string;
}

export interface LLMEngineConfig {
  provider: 'openai' | 'gemini' | 'groq' | 'cohere' | 'anthropic';
  model: string;
  apiKey?: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

export interface OutputConfig {
  displayFormat: 'chat' | 'text';
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface WorkflowExecution {
  id: string;
  status: 'running' | 'completed' | 'error';
  result?: any;
  error?: string;
}
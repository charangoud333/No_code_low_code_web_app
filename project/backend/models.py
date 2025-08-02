from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class NodePosition(BaseModel):
    x: float
    y: float

class NodeData(BaseModel):
    label: str
    config: Optional[Dict[str, Any]] = None

class WorkflowNode(BaseModel):
    id: str
    type: str  # userQuery, knowledgeBase, llmEngine, output
    position: NodePosition
    data: NodeData

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    type: Optional[str] = None

class WorkflowRequest(BaseModel):
    query: str
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]

class WorkflowResponse(BaseModel):
    success: bool
    response: str
    execution_id: str
    metadata: Optional[Dict[str, Any]] = None

class DocumentInfo(BaseModel):
    filename: str
    collection_name: str
    text_length: int
    chunk_count: int
    embedding_provider: str
    upload_time: str

class ExecutionResult(BaseModel):
    execution_id: str
    query: str
    response: str
    status: str
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None

# LLM Provider configurations
class OpenAIConfig(BaseModel):
    api_key: str
    model: str = "gpt-4o"
    temperature: float = 0.7
    max_tokens: int = 1000

class GeminiConfig(BaseModel):
    api_key: str
    model: str = "gemini-2.5-pro"
    temperature: float = 0.7
    max_tokens: int = 1000

class CohereConfig(BaseModel):
    api_key: str
    model: str = "command-r"
    temperature: float = 0.7
    max_tokens: int = 1000

class GroqConfig(BaseModel):
    api_key: str
    model: str = "mixtral"
    temperature: float = 0.7
    max_tokens: int = 1000

class AnthropicConfig(BaseModel):
    api_key: str
    model: str = "claude-sonnet"
    temperature: float = 0.7
    max_tokens: int = 1000
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import asyncio
import logging
from datetime import datetime

# Mock implementations - replace with actual integrations
import fitz  # PyMuPDF for PDF processing
import chromadb
from chromadb.config import Settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Workflow Builder API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB
chroma_client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="./chroma_db"
))

# Data models
class WorkflowNode(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

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

# In-memory storage for demonstration
uploaded_documents = {}
workflow_executions = {}

@app.get("/")
async def root():
    return {"message": "Workflow Builder API", "status": "running"}

@app.post("/upload_pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    embedding_provider: str = Form(...),
    api_key: str = Form(...)
):
    """Upload and process PDF document"""
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Read PDF content
        pdf_content = await file.read()
        
        # Extract text using PyMuPDF
        doc = fitz.open(stream=pdf_content, filetype="pdf")
        text_content = ""
        
        for page_num in range(doc.page_count):
            page = doc[page_num]
            text_content += page.get_text()
        
        doc.close()
        
        if not text_content.strip():
            raise HTTPException(status_code=400, detail="No text content found in PDF")
        
        # Create embeddings (mock implementation)
        embeddings = await create_embeddings(text_content, embedding_provider, api_key)
        
        # Store in ChromaDB
        collection_name = f"doc_{file.filename}_{datetime.now().timestamp()}"
        collection = chroma_client.create_collection(name=collection_name)
        
        # Split text into chunks (simplified)
        chunks = split_text_into_chunks(text_content)
        
        # Add to collection
        collection.add(
            documents=chunks,
            metadatas=[{"source": file.filename, "chunk_id": i} for i in range(len(chunks))],
            ids=[f"chunk_{i}" for i in range(len(chunks))]
        )
        
        # Store document metadata
        doc_id = f"doc_{datetime.now().timestamp()}"
        uploaded_documents[doc_id] = {
            "filename": file.filename,
            "collection_name": collection_name,
            "text_length": len(text_content),
            "chunk_count": len(chunks),
            "embedding_provider": embedding_provider,
            "upload_time": datetime.now().isoformat()
        }
        
        logger.info(f"Successfully processed PDF: {file.filename}")
        
        return {
            "success": True,
            "message": f"PDF processed successfully",
            "document_id": doc_id,
            "text_length": len(text_content),
            "chunk_count": len(chunks)
        }
        
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/run_workflow", response_model=WorkflowResponse)
async def run_workflow(request: WorkflowRequest):
    """Execute workflow with given nodes and edges"""
    try:
        execution_id = f"exec_{datetime.now().timestamp()}"
        
        logger.info(f"Starting workflow execution: {execution_id}")
        logger.info(f"Query: {request.query}")
        logger.info(f"Nodes: {len(request.nodes)}, Edges: {len(request.edges)}")
        
        # Validate workflow
        validation_result = validate_workflow(request.nodes, request.edges)
        if not validation_result["valid"]:
            raise HTTPException(status_code=400, detail=validation_result["error"])
        
        # Execute workflow
        result = await execute_workflow_logic(request.query, request.nodes, request.edges)
        
        # Store execution results
        workflow_executions[execution_id] = {
            "query": request.query,
            "result": result,
            "timestamp": datetime.now().isoformat(),
            "status": "completed"
        }
        
        logger.info(f"Workflow execution completed: {execution_id}")
        
        return WorkflowResponse(
            success=True,
            response=result["response"],
            execution_id=execution_id,
            metadata=result.get("metadata", {})
        )
        
    except Exception as e:
        logger.error(f"Error executing workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error executing workflow: {str(e)}")

@app.get("/workflow/{execution_id}")
async def get_workflow_result(execution_id: str):
    """Get workflow execution result"""
    if execution_id not in workflow_executions:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    return workflow_executions[execution_id]

@app.get("/documents")
async def list_documents():
    """List all uploaded documents"""
    return {"documents": uploaded_documents}

# Helper functions
def validate_workflow(nodes: List[WorkflowNode], edges: List[WorkflowEdge]) -> Dict[str, Any]:
    """Validate workflow structure"""
    try:
        # Check for required node types
        user_query_nodes = [n for n in nodes if n.type == "userQuery"]
        output_nodes = [n for n in nodes if n.type == "output"]
        
        if not user_query_nodes:
            return {"valid": False, "error": "Workflow must have at least one User Query node"}
        
        if not output_nodes:
            return {"valid": False, "error": "Workflow must have at least one Output node"}
        
        # Check for valid connections
        node_ids = {n.id for n in nodes}
        for edge in edges:
            if edge.source not in node_ids or edge.target not in node_ids:
                return {"valid": False, "error": f"Invalid edge connection: {edge.id}"}
        
        return {"valid": True}
        
    except Exception as e:
        return {"valid": False, "error": f"Validation error: {str(e)}"}

async def execute_workflow_logic(query: str, nodes: List[WorkflowNode], edges: List[WorkflowEdge]) -> Dict[str, Any]:
    """Execute the workflow logic"""
    try:
        # Find workflow components
        user_query_node = next((n for n in nodes if n.type == "userQuery"), None)
        knowledge_base_node = next((n for n in nodes if n.type == "knowledgeBase"), None)
        llm_engine_node = next((n for n in nodes if n.type == "llmEngine"), None)
        output_node = next((n for n in nodes if n.type == "output"), None)
        
        context = ""
        
        # Retrieve context from knowledge base if available
        if knowledge_base_node:
            context = await retrieve_context(query, knowledge_base_node)
        
        # Process with LLM
        if llm_engine_node:
            response = await call_llm(query, context, llm_engine_node)
        else:
            response = f"Processed query: {query}"
            if context:
                response += f"\n\nWith context from knowledge base."
        
        return {
            "response": response,
            "metadata": {
                "has_context": bool(context),
                "context_length": len(context),
                "llm_provider": llm_engine_node.data.get("config", {}).get("provider") if llm_engine_node else None
            }
        }
        
    except Exception as e:
        logger.error(f"Error in workflow execution: {str(e)}")
        raise

async def retrieve_context(query: str, kb_node: WorkflowNode) -> str:
    """Retrieve relevant context from knowledge base"""
    try:
        config = kb_node.data.get("config", {})
        filename = config.get("fileName")
        
        if not filename:
            return ""
        
        # Find the document collection
        doc_collection = None
        for doc_id, doc_info in uploaded_documents.items():
            if doc_info["filename"] == filename:
                doc_collection = doc_info["collection_name"]
                break
        
        if not doc_collection:
            logger.warning(f"No collection found for document: {filename}")
            return ""
        
        # Query the collection
        collection = chroma_client.get_collection(name=doc_collection)
        results = collection.query(
            query_texts=[query],
            n_results=3
        )
        
        # Combine retrieved documents
        context = "\n\n".join(results["documents"][0]) if results["documents"] else ""
        
        logger.info(f"Retrieved context length: {len(context)}")
        return context
        
    except Exception as e:
        logger.error(f"Error retrieving context: {str(e)}")
        return ""

async def call_llm(query: str, context: str, llm_node: WorkflowNode) -> str:
    """Call the specified LLM provider"""
    try:
        config = llm_node.data.get("config", {})
        provider = config.get("provider", "openai")
        model = config.get("model", "gpt-4")
        api_key = config.get("apiKey")
        
        if not api_key:
            return f"Mock response from {provider} {model}: {query}"
        
        # Construct prompt
        prompt = query
        if context:
            prompt = f"Context: {context}\n\nQuery: {query}"
        
        # Mock LLM call - replace with actual API calls
        await asyncio.sleep(1)  # Simulate API call delay
        
        response = f"Mock response from {provider} {model}:\n\n"
        response += f"Based on your query '{query}'"
        
        if context:
            response += " and the provided context"
        
        response += ", here's a comprehensive answer:\n\n"
        response += "This is a mock response that would normally come from the actual LLM API. "
        response += f"The system is configured to use {provider} with model {model}."
        
        if context:
            response += f"\n\nContext was provided from the knowledge base ({len(context)} characters)."
        
        return response
        
    except Exception as e:
        logger.error(f"Error calling LLM: {str(e)}")
        return f"Error generating response: {str(e)}"

async def create_embeddings(text: str, provider: str, api_key: str) -> List[float]:
    """Create embeddings for text using specified provider"""
    # Mock implementation - replace with actual embedding APIs
    await asyncio.sleep(0.5)  # Simulate API call
    
    # Return mock embeddings (in reality, this would be a vector from the embedding API)
    return [0.1] * 384  # Mock 384-dimensional embedding

def split_text_into_chunks(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """Split text into overlapping chunks"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        
        # Try to end at a sentence boundary
        if end < len(text):
            last_period = chunk.rfind('.')
            last_newline = chunk.rfind('\n')
            boundary = max(last_period, last_newline)
            
            if boundary > start + chunk_size // 2:  # Only use boundary if it's not too early
                chunk = text[start:start + boundary + 1]
                end = start + boundary + 1
        
        chunks.append(chunk.strip())
        start = end - overlap
        
        if start >= len(text):
            break
    
    return [chunk for chunk in chunks if chunk.strip()]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
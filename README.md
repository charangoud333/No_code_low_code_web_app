# Full-Stack No-Code Workflow Builder

A powerful visual workflow builder that allows users to create AI-powered document processing pipelines without writing code. Upload PDFs, connect AI models, and extract insights through an intuitive drag-and-drop interface.

## 🌟 Features

- **Visual Workflow Designer**: Drag-and-drop interface for building complex AI workflows
- **PDF Document Processing**: Upload and extract text from PDF documents
- **Multiple AI Providers**: Support for OpenAI, Gemini, Groq, Cohere, and Anthropic
- **Smart Question Extraction**: Automatically identify and list questions from documents
- **Real-time Chat Interface**: Test workflows with an interactive chat system
- **Embedding Support**: Multiple embedding providers for semantic search
- **Workflow Persistence**: Save and load workflow configurations

## 🚀 Live Demo

[click here](https://neon-alfajores-f02f90.netlify.app)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Flow** for the visual workflow canvas
- **Zustand** for state management
- **PDF.js** for client-side PDF processing
- **Lucide React** for icons

### Backend 
- **FastAPI** (Python) for API endpoints
- **ChromaDB** for vector storage
- **PyMuPDF** for server-side PDF processing
- **Multiple LLM integrations**

## 📦 Installation

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🎯 How to Use

### 1. Build Your Workflow
- Drag components from the sidebar to the canvas
- Connect nodes with arrows to define the flow
- Available components:
  - **User Query**: Entry point for user input
  - **Knowledge Base**: Upload and process PDF documents
  - **LLM Engine**: AI language model processing
  - **Output**: Display final results

### 2. Configure Components
- Click on any node to open the configuration panel
- Set up API keys, models, and parameters
- Upload PDF documents to knowledge base nodes

### 3. Test Your Workflow
- Click "Run Workflow" or "Chat" to test
- Ask questions about your uploaded documents
- Try queries like:
  - "List all questions in the PDF"
  - "What are the main topics covered?"
  - "Extract key information about [topic]"

[🚀 Live Demo](https://neon-alfajores-f02f90.netlify.app)


**[⬆ Back to Top](#full-stack-no-code-workflow-builder)**

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { WorkflowCanvasWrapper } from './components/WorkflowCanvas';
import { ConfigPanel } from './components/ConfigPanel';
import { Header } from './components/Header';
import { ChatModal } from './components/ChatModal';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <WorkflowCanvasWrapper />
        <ConfigPanel />
      </div>

      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}

export default App;
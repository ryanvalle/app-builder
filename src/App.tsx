import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import { getTemplates } from './templates';
import Header from './components/Header';
import TemplateGallery from './components/TemplateGallery';
import WorkflowEditor from './components/WorkflowEditor';
import ChatInterface from './components/ChatInterface';
import ConsolePanel from './components/ConsolePanel';
import InputDialog from './components/InputDialog';

function App() {
  const { currentWorkflow, editorMode } = useAppStore();

  useEffect(() => {
    // Initialize templates on app load
    useAppStore.setState({ templates: getTemplates() });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {!currentWorkflow ? (
          <TemplateGallery />
        ) : (
          <>
            <div className="flex-1 flex flex-col">
              {editorMode === 'visual' ? (
                <WorkflowEditor />
              ) : (
                <ChatInterface />
              )}
            </div>
            <ConsolePanel />
          </>
        )}
      </div>
      
      <InputDialog />
    </div>
  );
}

export default App;

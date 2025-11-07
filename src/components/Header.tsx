import React from 'react';
import { useAppStore } from '../store/appStore';
import { MessageSquare, Layout, Share2, Save, Home } from 'lucide-react';

const Header: React.FC = () => {
  const { currentWorkflow, editorMode, setEditorMode, setCurrentWorkflow } = useAppStore();

  const handleShare = () => {
    if (!currentWorkflow) return;
    
    const shareUrl = `${window.location.origin}/app/${currentWorkflow.id}`;
    navigator.clipboard.writeText(shareUrl);
    
    useAppStore.getState().addConsoleLog('info', `Share link copied to clipboard: ${shareUrl}`);
    alert('Share link copied to clipboard!');
  };

  const handleSave = () => {
    if (!currentWorkflow) return;
    
    // In a real app, this would save to a backend
    localStorage.setItem(`workflow-${currentWorkflow.id}`, JSON.stringify(currentWorkflow));
    useAppStore.getState().addConsoleLog('info', 'Workflow saved successfully');
    alert('Workflow saved!');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">AI App Builder</h1>
          {currentWorkflow && (
            <span className="text-sm text-gray-600">
              / {currentWorkflow.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentWorkflow && (
            <>
              <button
                onClick={() => setCurrentWorkflow(null)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to templates"
              >
                <Home size={20} />
                Home
              </button>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setEditorMode('visual')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    editorMode === 'visual'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layout size={20} />
                  Visual
                </button>
                <button
                  onClick={() => setEditorMode('chat')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    editorMode === 'chat'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageSquare size={20} />
                  Chat
                </button>
              </div>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={20} />
                Save
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 size={20} />
                Share
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

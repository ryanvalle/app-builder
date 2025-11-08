import React from 'react';
import { useAppStore } from '../store/appStore';
import { FileText, MessageCircle, Megaphone, ListTodo, Search, Plus } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'Document Summarizer': <FileText size={32} />,
  'Customer Support Reply Generator': <MessageCircle size={32} />,
  'Marketing Copy Enhancer': <Megaphone size={32} />,
  'Personal Task Planner': <ListTodo size={32} />,
  'Research Assistant with Web Scraping': <Search size={32} />,
};

const TemplateGallery: React.FC = () => {
  const { templates, addWorkflow } = useAppStore();

  const createFromTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const newWorkflow = {
      ...template.workflow,
      id: `workflow-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addWorkflow(newWorkflow);
  };

  const createBlankWorkflow = () => {
    const newWorkflow = {
      id: `workflow-${crypto.randomUUID()}`,
      name: 'New Workflow',
      description: 'A new workflow',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addWorkflow(newWorkflow);
  };

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AI App Builder
          </h2>
          <p className="text-lg text-gray-600">
            Choose a template to get started, or create a blank workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blank Workflow Card */}
          <div
            onClick={createBlankWorkflow}
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Plus size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Blank Workflow
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Start from scratch and build your own
              </p>
            </div>
          </div>

          {/* Template Cards */}
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => createFromTemplate(template.id)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                  {iconMap[template.name] || <FileText size={32} />}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex-1">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {template.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {template.workflow.nodes.length} steps
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Getting Started
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Select a template or create a blank workflow</li>
            <li>• Use the visual editor to add and connect workflow steps</li>
            <li>• Switch to chat mode to describe changes in natural language</li>
            <li>• Configure API calls with custom authentication</li>
            <li>• Test your workflow step-by-step in the console</li>
            <li>• Share your app with a single click</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;

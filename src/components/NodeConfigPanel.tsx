import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WorkflowNode, ApiConfig, HttpMethod, AuthType } from '../types/workflow';

interface NodeConfigPanelProps {
  node: WorkflowNode;
  onClose: () => void;
  onUpdate: (node: WorkflowNode) => void;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ node, onClose, onUpdate }) => {
  const [label, setLabel] = useState(node.data.label);
  const [prompt, setPrompt] = useState(node.data.prompt || '');
  const [model, setModel] = useState(node.data.model || 'gpt-4');
  const [code, setCode] = useState(node.data.code || '');
  
  // API config state
  const [apiUrl, setApiUrl] = useState(node.data.config?.url || '');
  const [apiMethod, setApiMethod] = useState<HttpMethod>(node.data.config?.method || 'GET');
  const [authType, setAuthType] = useState<AuthType>(node.data.config?.authType || 'none');
  const [apiKey, setApiKey] = useState(node.data.config?.authConfig?.apiKey || '');
  const [apiKeyHeader, setApiKeyHeader] = useState(node.data.config?.authConfig?.apiKeyHeader || 'X-API-Key');

  const handleSave = () => {
    const updatedNode: WorkflowNode = {
      ...node,
      data: {
        ...node.data,
        label,
        ...(node.type === 'ai-model' && { prompt, model }),
        ...(node.type === 'data-processing' && { code }),
        ...(node.type === 'api-call' && {
          config: {
            id: node.data.config?.id || `api-${Date.now()}`,
            name: label,
            url: apiUrl,
            method: apiMethod,
            headers: {},
            authType,
            ...(authType === 'api-key' && {
              authConfig: {
                apiKey,
                apiKeyHeader,
              },
            }),
            queryParams: {},
          } as ApiConfig,
        }),
      },
    };

    onUpdate(updatedNode);
  };

  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-xl border-l border-gray-200 z-20 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Configure Node</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Common fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* AI Model specific fields */}
        {node.type === 'ai-model' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
                <option value="gemini-pro">Gemini Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Enter your prompt here. Use {{input}} to reference the previous step's output."
              />
            </div>
          </>
        )}

        {/* Data Processing specific fields */}
        {node.type === 'data-processing' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="// Process the input data
function process(input) {
  return input;
}"
            />
          </div>
        )}

        {/* API Call specific fields */}
        {node.type === 'api-call' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/endpoint"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTTP Method
              </label>
              <select
                value={apiMethod}
                onChange={(e) => setApiMethod(e.target.value as HttpMethod)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authentication
              </label>
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value as AuthType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="api-key">API Key</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="oauth2">OAuth 2.0</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {authType === 'api-key' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key Header Name
                  </label>
                  <input
                    type="text"
                    value={apiKeyHeader}
                    onChange={(e) => setApiKeyHeader(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="X-API-Key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your API key"
                  />
                </div>
              </>
            )}
          </>
        )}

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigPanel;

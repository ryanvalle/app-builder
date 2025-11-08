import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Terminal, 
  Sparkles, 
  Globe, 
  Code, 
  Webhook as WebhookIcon, 
  FileOutput 
} from 'lucide-react';
import { NodeType } from '../../types/workflow';

interface CustomNodeProps {
  data: {
    label: string;
  };
  type?: NodeType;
}

const getNodeIcon = (type?: NodeType) => {
  switch (type) {
    case 'input':
      return <Terminal size={16} />;
    case 'ai-model':
      return <Sparkles size={16} />;
    case 'api-call':
      return <Globe size={16} />;
    case 'data-processing':
      return <Code size={16} />;
    case 'webhook':
      return <WebhookIcon size={16} />;
    case 'output':
      return <FileOutput size={16} />;
    default:
      return <Terminal size={16} />;
  }
};

const getNodeColor = (type?: NodeType) => {
  switch (type) {
    case 'input':
      return 'border-green-400 bg-green-50';
    case 'ai-model':
      return 'border-purple-400 bg-purple-50';
    case 'api-call':
      return 'border-blue-400 bg-blue-50';
    case 'data-processing':
      return 'border-yellow-400 bg-yellow-50';
    case 'webhook':
      return 'border-orange-400 bg-orange-50';
    case 'output':
      return 'border-red-400 bg-red-50';
    default:
      return 'border-gray-400 bg-gray-50';
  }
};

const CustomNode: React.FC<CustomNodeProps> = ({ data, type }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-lg border-2 ${getNodeColor(type)} min-w-[150px]`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <div className="text-gray-700">
          {getNodeIcon(type)}
        </div>
        <div className="font-medium text-sm text-gray-800">
          {data.label}
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

export default CustomNode;

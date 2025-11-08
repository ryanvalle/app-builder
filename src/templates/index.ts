import { Template } from '../types/workflow';

// Helper function to create template with fresh timestamps
const createTemplate = (template: Omit<Template, 'workflow'> & { 
  workflow: Omit<Template['workflow'], 'createdAt' | 'updatedAt'> 
}): Template => ({
  ...template,
  workflow: {
    ...template.workflow,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
});

export const getTemplates = (): Template[] => [
  createTemplate({
    id: 'template-1',
    name: 'Document Summarizer',
    description: 'Upload a document and get an AI-powered summary',
    category: 'Productivity',
    workflow: {
      id: 'workflow-doc-summarizer',
      name: 'Document Summarizer',
      description: 'Summarizes documents using AI',
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          position: { x: 100, y: 100 },
          data: {
            label: 'Document Input',
            inputSchema: {
              type: 'file',
              accept: '.txt,.pdf,.docx',
            },
          },
        },
        {
          id: 'ai-1',
          type: 'ai-model',
          position: { x: 400, y: 100 },
          data: {
            label: 'Summarize',
            prompt: 'Summarize the following document concisely:\n\n{{input}}',
            model: 'gpt-4',
          },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 700, y: 100 },
          data: {
            label: 'Summary Output',
          },
        },
      ],
      edges: [
        { id: 'e1-2', source: 'input-1', target: 'ai-1' },
        { id: 'e2-3', source: 'ai-1', target: 'output-1' },
      ],
    },
  }),
  createTemplate({
    id: 'template-2',
    name: 'Customer Support Reply Generator',
    description: 'Generate professional customer support responses',
    category: 'Communication',
    workflow: {
      id: 'workflow-support-reply',
      name: 'Customer Support Reply Generator',
      description: 'Generates customer support responses',
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          position: { x: 100, y: 100 },
          data: {
            label: 'Customer Message',
            inputSchema: {
              type: 'text',
              multiline: true,
            },
          },
        },
        {
          id: 'ai-1',
          type: 'ai-model',
          position: { x: 400, y: 100 },
          data: {
            label: 'Generate Response',
            prompt: 'Generate a professional and empathetic customer support response to:\n\n{{input}}',
            model: 'gpt-4',
          },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 700, y: 100 },
          data: {
            label: 'Support Response',
          },
        },
      ],
      edges: [
        { id: 'e1-2', source: 'input-1', target: 'ai-1' },
        { id: 'e2-3', source: 'ai-1', target: 'output-1' },
      ],
    },
  }),
  createTemplate({
    id: 'template-3',
    name: 'Marketing Copy Enhancer',
    description: 'Improve marketing copy with AI suggestions',
    category: 'Marketing',
    workflow: {
      id: 'workflow-marketing-copy',
      name: 'Marketing Copy Enhancer',
      description: 'Enhances marketing copy',
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          position: { x: 100, y: 100 },
          data: {
            label: 'Original Copy',
            inputSchema: {
              type: 'text',
              multiline: true,
            },
          },
        },
        {
          id: 'ai-1',
          type: 'ai-model',
          position: { x: 400, y: 100 },
          data: {
            label: 'Enhance Copy',
            prompt: 'Improve this marketing copy to be more engaging and persuasive:\n\n{{input}}',
            model: 'gpt-4',
          },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 700, y: 100 },
          data: {
            label: 'Enhanced Copy',
          },
        },
      ],
      edges: [
        { id: 'e1-2', source: 'input-1', target: 'ai-1' },
        { id: 'e2-3', source: 'ai-1', target: 'output-1' },
      ],
    },
  }),
  createTemplate({
    id: 'template-4',
    name: 'Personal Task Planner',
    description: 'Break down goals into actionable tasks',
    category: 'Productivity',
    workflow: {
      id: 'workflow-task-planner',
      name: 'Personal Task Planner',
      description: 'Plans tasks from goals',
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          position: { x: 100, y: 100 },
          data: {
            label: 'Goal Description',
            inputSchema: {
              type: 'text',
              multiline: true,
            },
          },
        },
        {
          id: 'ai-1',
          type: 'ai-model',
          position: { x: 400, y: 100 },
          data: {
            label: 'Create Task Plan',
            prompt: 'Break down this goal into specific, actionable tasks:\n\n{{input}}',
            model: 'gpt-4',
          },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 700, y: 100 },
          data: {
            label: 'Task List',
          },
        },
      ],
      edges: [
        { id: 'e1-2', source: 'input-1', target: 'ai-1' },
        { id: 'e2-3', source: 'ai-1', target: 'output-1' },
      ],
    },
  }),
  createTemplate({
    id: 'template-5',
    name: 'Research Assistant with Web Scraping',
    description: 'Fetch data from the web and analyze it with AI',
    category: 'Research',
    workflow: {
      id: 'workflow-research-assistant',
      name: 'Research Assistant',
      description: 'Web scraping and AI analysis',
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          position: { x: 100, y: 100 },
          data: {
            label: 'Research Query',
            inputSchema: {
              type: 'text',
            },
          },
        },
        {
          id: 'api-1',
          type: 'api-call',
          position: { x: 400, y: 100 },
          data: {
            label: 'Fetch Web Data',
            config: {
              id: 'api-web-search',
              name: 'Web Search API',
              url: 'https://api.example.com/search',
              method: 'GET',
              headers: {},
              authType: 'api-key',
              queryParams: { q: '{{input}}' },
              authConfig: {
                apiKey: '',
                apiKeyHeader: 'X-API-Key',
              },
              errorHandling: {
                retries: 3,
                timeout: 30000,
              },
            },
          },
        },
        {
          id: 'ai-1',
          type: 'ai-model',
          position: { x: 700, y: 100 },
          data: {
            label: 'Analyze Results',
            prompt: 'Analyze and summarize this research data:\n\n{{input}}',
            model: 'gpt-4',
          },
        },
        {
          id: 'output-1',
          type: 'output',
          position: { x: 1000, y: 100 },
          data: {
            label: 'Research Summary',
          },
        },
      ],
      edges: [
        { id: 'e1-2', source: 'input-1', target: 'api-1' },
        { id: 'e2-3', source: 'api-1', target: 'ai-1' },
        { id: 'e3-4', source: 'ai-1', target: 'output-1' },
      ],
    },
  }),
];

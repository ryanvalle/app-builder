export type NodeType = 'input' | 'output' | 'ai-model' | 'api-call' | 'data-processing' | 'webhook';

export type AuthType = 'none' | 'api-key' | 'bearer' | 'oauth2' | 'basic' | 'custom';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RequestBodyType = 'json' | 'form-data' | 'raw';

export interface ApiConfig {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  authType: AuthType;
  authConfig?: {
    apiKey?: string;
    apiKeyHeader?: string;
    bearerToken?: string;
    username?: string;
    password?: string;
    oauthConfig?: {
      clientId: string;
      clientSecret: string;
      authUrl: string;
      tokenUrl: string;
    };
  };
  queryParams: Record<string, string>;
  body?: {
    type: RequestBodyType;
    content: string | Record<string, unknown>;
  };
  responseMapping?: Record<string, string>;
  errorHandling?: {
    retries: number;
    timeout: number;
    fallbackValue?: unknown;
  };
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    config?: ApiConfig;
    inputSchema?: Record<string, unknown>;
    outputSchema?: Record<string, unknown>;
    code?: string;
    prompt?: string;
    model?: string;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionResult {
  nodeId: string;
  success: boolean;
  output?: unknown;
  error?: string;
  duration: number;
  timestamp: string;
}

export interface WorkflowExecution {
  workflowId: string;
  status: 'running' | 'completed' | 'failed';
  results: ExecutionResult[];
  startedAt: string;
  completedAt?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow: Workflow;
  thumbnail?: string;
}

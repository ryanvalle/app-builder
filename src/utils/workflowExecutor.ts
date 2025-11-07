import { WorkflowNode, WorkflowEdge, ApiConfig } from '../types/workflow';

export interface ExecutionContext {
  variables: Record<string, unknown>;
  results: Record<string, unknown>;
}

/**
 * Execute an input node - prompts for user input
 */
async function executeInputNode(
  node: WorkflowNode,
  _context: ExecutionContext
): Promise<{ success: boolean; output: unknown; error?: string }> {
  try {
    // For now, return a simulated input based on the input schema
    const schema = node.data.inputSchema as Record<string, unknown>;
    
    if (schema?.type === 'file') {
      return {
        success: true,
        output: '[File Input: document.txt - Sample document content for processing]',
      };
    } else if (schema?.type === 'text' && schema?.multiline) {
      return {
        success: true,
        output: 'Sample text input from user',
      };
    } else {
      return {
        success: true,
        output: 'User input received',
      };
    }
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : 'Unknown error in input node',
    };
  }
}

/**
 * Execute an AI model node - makes API call to AI service
 */
async function executeAIModelNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<{ success: boolean; output: unknown; error?: string }> {
  try {
    const { prompt, model } = node.data;
    
    if (!prompt) {
      return {
        success: false,
        output: null,
        error: 'No prompt configured for AI model',
      };
    }

    // Replace template variables in prompt
    let processedPrompt = prompt;
    const matches = prompt.match(/\{\{(\w+)\}\}/g);
    if (matches) {
      matches.forEach((match) => {
        const varName = match.replace(/\{\{|\}\}/g, '');
        const value = context.variables[varName] || context.results[varName] || '';
        processedPrompt = processedPrompt.replace(match, String(value));
      });
    }

    // Simulate AI response (in production, this would call OpenAI, Anthropic, etc.)
    const simulatedResponse = `[AI Response from ${model || 'GPT-4'}]\n\nProcessed your request: "${processedPrompt.substring(0, 100)}..."\n\nThis is a simulated AI response. In production, this would connect to:\n- OpenAI API (GPT-4, GPT-3.5)\n- Anthropic API (Claude)\n- Google AI API (Gemini)\n\nThe AI would analyze the input and provide intelligent responses based on the prompt.`;

    return {
      success: true,
      output: simulatedResponse,
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : 'Unknown error in AI model',
    };
  }
}

/**
 * Execute an API call node - makes HTTP request
 */
async function executeApiCallNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<{ success: boolean; output: unknown; error?: string }> {
  try {
    const config = node.data.config as ApiConfig;
    
    if (!config || !config.url) {
      return {
        success: false,
        output: null,
        error: 'API URL not configured',
      };
    }

    // Build URL with query parameters
    let url = config.url;
    const queryParams = new URLSearchParams();
    Object.entries(config.queryParams || {}).forEach(([key, value]) => {
      // Replace template variables
      let processedValue = value;
      const matches = value.match(/\{\{(\w+)\}\}/g);
      if (matches) {
        matches.forEach((match) => {
          const varName = match.replace(/\{\{|\}\}/g, '');
          const varValue = context.variables[varName] || context.results[varName] || '';
          processedValue = processedValue.replace(match, String(varValue));
        });
      }
      queryParams.append(key, processedValue);
    });

    if (queryParams.toString()) {
      url += (url.includes('?') ? '&' : '?') + queryParams.toString();
    }

    // Build headers
    const headers: HeadersInit = { ...config.headers };
    
    // Add authentication
    if (config.authType === 'api-key' && config.authConfig?.apiKey) {
      const headerName = config.authConfig.apiKeyHeader || 'X-API-Key';
      headers[headerName] = config.authConfig.apiKey;
    } else if (config.authType === 'bearer' && config.authConfig?.bearerToken) {
      headers['Authorization'] = `Bearer ${config.authConfig.bearerToken}`;
    } else if (config.authType === 'basic' && config.authConfig?.username) {
      const credentials = btoa(`${config.authConfig.username}:${config.authConfig.password || ''}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }

    // Make the actual HTTP request with timeout and retry logic
    const timeout = config.errorHandling?.timeout || 30000;
    const retries = config.errorHandling?.retries || 0;
    
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method: config.method,
          headers,
          body: config.body ? JSON.stringify(config.body.content) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Apply response mapping if configured
        let output = data;
        if (config.responseMapping) {
          output = {};
          Object.entries(config.responseMapping).forEach(([key, path]) => {
            // Simple path extraction (e.g., "data.result")
            const parts = path.split('.');
            let value: any = data;
            for (const part of parts) {
              value = value?.[part];
            }
            output[key] = value;
          });
        }

        return {
          success: true,
          output,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (attempt < retries) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // All retries failed, use fallback if available
    if (config.errorHandling?.fallbackValue !== undefined) {
      return {
        success: true,
        output: config.errorHandling.fallbackValue,
      };
    }

    return {
      success: false,
      output: null,
      error: lastError?.message || 'API call failed',
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : 'Unknown error in API call',
    };
  }
}

/**
 * Execute a data processing node - runs JavaScript code
 */
async function executeDataProcessingNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<{ success: boolean; output: unknown; error?: string }> {
  try {
    const { code } = node.data;
    
    if (!code) {
      return {
        success: false,
        output: null,
        error: 'No code configured for data processing',
      };
    }

    // Create a safe execution context
    // In production, this should use a sandboxed environment
    // For now, we'll use a Function constructor with limited scope
    
    try {
      // Create function that has access to context variables
      const fn = new Function('context', 'input', code);
      
      // Get the most recent output as input
      const inputValue = Object.values(context.results).pop();
      
      // Execute the code
      const result = fn(context, inputValue);
      
      return {
        success: true,
        output: result,
      };
    } catch (codeError) {
      return {
        success: false,
        output: null,
        error: `Code execution error: ${codeError instanceof Error ? codeError.message : 'Unknown error'}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : 'Unknown error in data processing',
    };
  }
}

/**
 * Execute a webhook node - receives webhook data
 */
async function executeWebhookNode(
  _node: WorkflowNode,
  _context: ExecutionContext
): Promise<{ success: boolean; output: unknown; error?: string }> {
  try {
    // In a real implementation, this would set up a webhook endpoint
    // For now, return simulated webhook data
    return {
      success: true,
      output: {
        webhook: 'received',
        data: 'Simulated webhook payload',
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : 'Unknown error in webhook',
    };
  }
}

/**
 * Execute an output node - displays results
 */
async function executeOutputNode(
  _node: WorkflowNode,
  context: ExecutionContext
): Promise<{ success: boolean; output: unknown; error?: string }> {
  try {
    // Get the most recent result as the output
    const outputValue = Object.values(context.results).pop();
    
    return {
      success: true,
      output: outputValue || 'No output available',
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : 'Unknown error in output',
    };
  }
}

/**
 * Execute a single node based on its type
 */
export async function executeNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<{ success: boolean; output: unknown; error?: string; duration: number }> {
  const startTime = Date.now();
  
  let result;
  switch (node.type) {
    case 'input':
      result = await executeInputNode(node, context);
      break;
    case 'ai-model':
      result = await executeAIModelNode(node, context);
      break;
    case 'api-call':
      result = await executeApiCallNode(node, context);
      break;
    case 'data-processing':
      result = await executeDataProcessingNode(node, context);
      break;
    case 'webhook':
      result = await executeWebhookNode(node, context);
      break;
    case 'output':
      result = await executeOutputNode(node, context);
      break;
    default:
      result = {
        success: false,
        output: null,
        error: `Unknown node type: ${node.type}`,
      };
  }
  
  const duration = Date.now() - startTime;
  
  // Store result in context
  if (result.success) {
    context.results[node.id] = result.output;
    // Also store by node label for easy reference
    context.variables[node.data.label.toLowerCase().replace(/\s+/g, '_')] = result.output;
  }
  
  return {
    ...result,
    duration,
  };
}

/**
 * Build execution order based on node connections
 */
export function buildExecutionOrder(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const inDegree = new Map(nodes.map(n => [n.id, 0]));
  const adjacencyList = new Map<string, string[]>();

  // Build graph
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    adjacencyList.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });

  // Topological sort (Kahn's algorithm)
  const queue: string[] = [];
  const result: WorkflowNode[] = [];

  // Find all nodes with no incoming edges
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodeMap.get(nodeId);
    if (node) {
      result.push(node);
    }

    // Process neighbors
    adjacencyList.get(nodeId)?.forEach(neighborId => {
      const newDegree = (inDegree.get(neighborId) || 0) - 1;
      inDegree.set(neighborId, newDegree);
      if (newDegree === 0) {
        queue.push(neighborId);
      }
    });
  }

  // If result doesn't include all nodes, there's a cycle or disconnected nodes
  // Add remaining nodes at the end
  nodes.forEach(node => {
    if (!result.find(n => n.id === node.id)) {
      result.push(node);
    }
  });

  return result;
}

import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Play, ChevronDown, ChevronUp, AlertCircle, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { executeNode, buildExecutionOrder, ExecutionContext } from '../utils/workflowExecutor';

const ConsolePanel: React.FC = () => {
  const { currentWorkflow, consoleLogs, clearConsoleLogs, addConsoleLog } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeWorkflow = async () => {
    if (!currentWorkflow || isExecuting) return;

    setIsExecuting(true);
    clearConsoleLogs();
    addConsoleLog('info', '=== Workflow Execution Started ===');
    addConsoleLog('info', `Workflow: ${currentWorkflow.name}`);
    addConsoleLog('info', `Total nodes: ${currentWorkflow.nodes.length}`);

    // Build execution order based on node connections
    const orderedNodes = buildExecutionOrder(currentWorkflow.nodes, currentWorkflow.edges);
    
    // Initialize execution context
    const context: ExecutionContext = {
      variables: {},
      results: {},
    };

    // Execute nodes in order
    for (const node of orderedNodes) {
      addConsoleLog('info', `Executing node: ${node.data.label} (${node.type})`);
      
      try {
        const result = await executeNode(node, context);
        
        if (result.success) {
          addConsoleLog('info', `✓ ${node.data.label} completed successfully (${result.duration}ms)`);
          
          // Log output preview for debugging
          const output = typeof result.output === 'string' 
            ? result.output.substring(0, 200) 
            : JSON.stringify(result.output).substring(0, 200);
          addConsoleLog('info', `  Output: ${output}${output.length === 200 ? '...' : ''}`);
        } else {
          addConsoleLog('error', `✗ Error in ${node.data.label}: ${result.error}`);
        }
      } catch (error) {
        addConsoleLog('error', `✗ Unexpected error in ${node.data.label}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    addConsoleLog('info', '=== Workflow Execution Completed ===');
    
    // Log final output
    const finalOutput = Object.values(context.results).pop();
    if (finalOutput) {
      addConsoleLog('info', 'Final Output:');
      const outputStr = typeof finalOutput === 'string' 
        ? finalOutput 
        : JSON.stringify(finalOutput, null, 2);
      addConsoleLog('info', outputStr);
    }
    
    setIsExecuting(false);
  };

  const getLogIcon = (level: 'info' | 'error' | 'warning') => {
    switch (level) {
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  const getLogColor = (level: 'info' | 'error' | 'warning') => {
    switch (level) {
      case 'error':
        return 'text-red-700 bg-red-50';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50';
      default:
        return 'text-gray-700';
    }
  };

  if (!currentWorkflow) {
    return null;
  }

  return (
    <div className={`flex flex-col bg-gray-900 text-gray-100 border-l border-gray-700 transition-all duration-300 ${
      isExpanded ? 'w-96' : 'w-12'
    }`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        {isExpanded && (
          <>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Console</h3>
              <span className="text-xs text-gray-400">
                ({consoleLogs.length} logs)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearConsoleLogs}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
                title="Clear logs"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </>
        )}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="p-1 hover:bg-gray-800 rounded transition-colors mx-auto"
          >
            <ChevronUp size={20} />
          </button>
        )}
      </div>

      {isExpanded && (
        <>
          <div className="p-3 border-b border-gray-700">
            <button
              onClick={executeWorkflow}
              disabled={isExecuting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={16} />
              {isExecuting ? 'Executing...' : 'Run Workflow'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs">
            {consoleLogs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No logs yet. Click "Run Workflow" to execute.
              </div>
            ) : (
              consoleLogs.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-2 rounded ${
                    log.level !== 'info' ? getLogColor(log.level) : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getLogIcon(log.level)}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                    <div className={log.level === 'info' ? 'text-gray-300' : ''}>
                      {log.message}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ConsolePanel;

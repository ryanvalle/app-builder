import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeTypes,
  NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAppStore } from '../store/appStore';
import CustomNode from './nodes/CustomNode';
import NodeConfigPanel from './NodeConfigPanel';
import { WorkflowNode } from '../types/workflow';

const nodeTypes: NodeTypes = {
  'input': CustomNode,
  'output': CustomNode,
  'ai-model': CustomNode,
  'api-call': CustomNode,
  'data-processing': CustomNode,
  'webhook': CustomNode,
};

const WorkflowEditor: React.FC = () => {
  const { currentWorkflow, updateNodes, updateEdges } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    currentWorkflow?.nodes.map(n => ({
      ...n,
      type: n.type,
    })) || []
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    currentWorkflow?.edges || []
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      updateEdges(newEdges);
    },
    [edges, setEdges, updateEdges]
  );

  const onNodesChangeWrapper = useCallback(
    (changes: NodeChange[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onNodesChange(changes as any);
      // Update store after a short delay to batch changes
      setTimeout(() => {
        updateNodes(nodes);
      }, 100);
    },
    [onNodesChange, nodes, updateNodes]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const workflowNode = currentWorkflow?.nodes.find(n => n.id === node.id);
    setSelectedNode(workflowNode || null);
  }, [currentWorkflow]);

  const addNode = (type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: `node-${crypto.randomUUID()}`,
      type,
      position: { x: 250, y: 250 },
      data: {
        label: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      },
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    updateNodes(updatedNodes);
  };

  if (!currentWorkflow) {
    return null;
  }

  return (
    <div className="flex-1 relative">
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Node</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => addNode('input')}
            className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            + Input
          </button>
          <button
            onClick={() => addNode('ai-model')}
            className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
          >
            + AI Model
          </button>
          <button
            onClick={() => addNode('api-call')}
            className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            + API Call
          </button>
          <button
            onClick={() => addNode('data-processing')}
            className="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
          >
            + Data Processing
          </button>
          <button
            onClick={() => addNode('webhook')}
            className="px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
          >
            + Webhook
          </button>
          <button
            onClick={() => addNode('output')}
            className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            + Output
          </button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeWrapper}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={(updatedNode) => {
            const updatedNodes = nodes.map(n => 
              n.id === updatedNode.id ? updatedNode : n
            );
            setNodes(updatedNodes);
            updateNodes(updatedNodes);
            setSelectedNode(null);
          }}
        />
      )}
    </div>
  );
};

export default WorkflowEditor;

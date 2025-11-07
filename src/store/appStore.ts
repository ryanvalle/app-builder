import { create } from 'zustand';
import { Workflow, WorkflowNode, WorkflowEdge, Template, ApiConfig, WorkflowExecution, ExecutionResult } from '../types/workflow';

interface AppState {
  // Current workflow
  currentWorkflow: Workflow | null;
  workflows: Workflow[];
  
  // Editor mode
  editorMode: 'chat' | 'visual';
  
  // API configurations library
  apiLibrary: ApiConfig[];
  
  // Templates
  templates: Template[];
  
  // Execution
  currentExecution: WorkflowExecution | null;
  executionHistory: WorkflowExecution[];
  
  // Console logs
  consoleLogs: Array<{ timestamp: string; level: 'info' | 'error' | 'warning'; message: string }>;
  
  // Actions
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  updateWorkflow: (workflow: Workflow) => void;
  addWorkflow: (workflow: Workflow) => void;
  deleteWorkflow: (id: string) => void;
  
  setEditorMode: (mode: 'chat' | 'visual') => void;
  
  updateNodes: (nodes: WorkflowNode[]) => void;
  updateEdges: (edges: WorkflowEdge[]) => void;
  
  addApiConfig: (config: ApiConfig) => void;
  updateApiConfig: (config: ApiConfig) => void;
  deleteApiConfig: (id: string) => void;
  
  setCurrentExecution: (execution: WorkflowExecution | null) => void;
  addExecutionResult: (result: ExecutionResult) => void;
  
  addConsoleLog: (level: 'info' | 'error' | 'warning', message: string) => void;
  clearConsoleLogs: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentWorkflow: null,
  workflows: [],
  editorMode: 'visual',
  apiLibrary: [],
  templates: [],
  currentExecution: null,
  executionHistory: [],
  consoleLogs: [],
  
  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  
  updateWorkflow: (workflow) => {
    set((state) => ({
      currentWorkflow: workflow,
      workflows: state.workflows.map((w) => (w.id === workflow.id ? workflow : w)),
    }));
  },
  
  addWorkflow: (workflow) => {
    set((state) => ({
      workflows: [...state.workflows, workflow],
      currentWorkflow: workflow,
    }));
  },
  
  deleteWorkflow: (id) => {
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
      currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
    }));
  },
  
  setEditorMode: (mode) => set({ editorMode: mode }),
  
  updateNodes: (nodes) => {
    const current = get().currentWorkflow;
    if (current) {
      const updated = { ...current, nodes, updatedAt: new Date().toISOString() };
      get().updateWorkflow(updated);
    }
  },
  
  updateEdges: (edges) => {
    const current = get().currentWorkflow;
    if (current) {
      const updated = { ...current, edges, updatedAt: new Date().toISOString() };
      get().updateWorkflow(updated);
    }
  },
  
  addApiConfig: (config) => {
    set((state) => ({
      apiLibrary: [...state.apiLibrary, config],
    }));
  },
  
  updateApiConfig: (config) => {
    set((state) => ({
      apiLibrary: state.apiLibrary.map((c) => (c.id === config.id ? config : c)),
    }));
  },
  
  deleteApiConfig: (id) => {
    set((state) => ({
      apiLibrary: state.apiLibrary.filter((c) => c.id !== id),
    }));
  },
  
  setCurrentExecution: (execution) => set({ currentExecution: execution }),
  
  addExecutionResult: (result) => {
    set((state) => {
      if (!state.currentExecution) return state;
      
      const updated = {
        ...state.currentExecution,
        results: [...state.currentExecution.results, result],
      };
      
      return { currentExecution: updated };
    });
  },
  
  addConsoleLog: (level, message) => {
    set((state) => ({
      consoleLogs: [
        ...state.consoleLogs,
        { timestamp: new Date().toISOString(), level, message },
      ],
    }));
  },
  
  clearConsoleLogs: () => set({ consoleLogs: [] }),
}));

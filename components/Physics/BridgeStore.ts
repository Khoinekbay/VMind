import { create } from 'zustand';
import { MaterialType, MATERIALS } from './Materials';

// --- Types defined in TDD Section 3.1 ---

export interface PNode {
  id: string;
  x: number;
  y: number;
  isAnchor: boolean;
}

export interface PEdge {
  id: string;
  startNodeId: string;
  endNodeId: string;
  material: MaterialType;
}

export interface CameraState {
  x: number;
  y: number;
  scale: number;
}

interface BridgeState {
  // Blueprint Data
  nodes: PNode[];
  edges: PEdge[];
  budget: number;
  
  // Editor State
  selectedMaterial: MaterialType;
  activeTool: 'beam' | 'node' | 'eraser' | 'pan'; // Added 'node' tool
  simulationState: 'design' | 'running' | 'paused' | 'collapsed' | 'success';
  
  // Camera (Viewport)
  camera: CameraState;

  // Actions
  setNodes: (nodes: PNode[]) => void;
  setEdges: (edges: PEdge[]) => void;
  addNode: (node: PNode) => void;
  addEdge: (edge: PEdge) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  setMaterial: (mat: MaterialType) => void;
  setTool: (tool: 'beam' | 'node' | 'eraser' | 'pan') => void;
  setSimulationState: (state: 'design' | 'running' | 'paused' | 'collapsed' | 'success') => void;
  updateBudget: (amount: number) => void;
  setBudget: (amount: number) => void;
  setCamera: (camera: Partial<CameraState>) => void;
  resetLevel: () => void;
}

// Initial Level Config (Constants from TDD)
export const LEVEL_CONSTANTS = {
  WORLD_WIDTH: 2400,
  WORLD_HEIGHT: 2000,
  CLIFF_Y: 800,
  CLIFF_WIDTH: 400,
  GAP_WIDTH: 1600,
  INITIAL_BUDGET: 3000, // Increased budget for realism
  NODE_COST: 10
};

const initialNodes: PNode[] = [
  { id: 'anchor_l1', x: LEVEL_CONSTANTS.CLIFF_WIDTH, y: LEVEL_CONSTANTS.CLIFF_Y, isAnchor: true },
  { id: 'anchor_l2', x: LEVEL_CONSTANTS.CLIFF_WIDTH, y: LEVEL_CONSTANTS.CLIFF_Y + 120, isAnchor: true },
  { id: 'anchor_r1', x: LEVEL_CONSTANTS.WORLD_WIDTH - LEVEL_CONSTANTS.CLIFF_WIDTH, y: LEVEL_CONSTANTS.CLIFF_Y, isAnchor: true },
  { id: 'anchor_r2', x: LEVEL_CONSTANTS.WORLD_WIDTH - LEVEL_CONSTANTS.CLIFF_WIDTH, y: LEVEL_CONSTANTS.CLIFF_Y + 120, isAnchor: true },
];

export const useBridgeStore = create<BridgeState>((set) => ({
  nodes: initialNodes,
  edges: [],
  budget: LEVEL_CONSTANTS.INITIAL_BUDGET,
  
  selectedMaterial: MATERIALS.ROAD, // Default to Road
  activeTool: 'beam',
  simulationState: 'design',
  
  camera: { x: 0, y: 0, scale: 1 },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addNode: (node) => set((state) => ({ 
    nodes: [...state.nodes, node],
    budget: state.budget - LEVEL_CONSTANTS.NODE_COST
  })),
  
  addEdge: (edge) => set((state) => {
    // Check duplicates
    const exists = state.edges.some(e => 
      (e.startNodeId === edge.startNodeId && e.endNodeId === edge.endNodeId) ||
      (e.startNodeId === edge.endNodeId && e.endNodeId === edge.startNodeId)
    );
    if (exists) return state;
    
    return { 
      edges: [...state.edges, edge],
      budget: state.budget - edge.material.cost
    };
  }),

  removeNode: (id) => set((state) => {
    // Cannot remove anchors
    if (state.nodes.find(n => n.id === id)?.isAnchor) return state;

    const newNodes = state.nodes.filter(n => n.id !== id);
    // Remove connected edges and refund
    const removedEdges = state.edges.filter(e => e.startNodeId === id || e.endNodeId === id);
    const refund = removedEdges.reduce((acc, e) => acc + e.material.cost, 0);
    const newEdges = state.edges.filter(e => e.startNodeId !== id && e.endNodeId !== id);

    return { 
      nodes: newNodes, 
      edges: newEdges, 
      budget: state.budget + refund + LEVEL_CONSTANTS.NODE_COST // Refund node cost
    };
  }),

  removeEdge: (id) => set((state) => {
    const edge = state.edges.find(e => e.id === id);
    if (!edge) return state;
    
    return {
      edges: state.edges.filter(e => e.id !== id),
      budget: state.budget + edge.material.cost
    };
  }),

  setMaterial: (mat) => set({ selectedMaterial: mat }),
  setTool: (tool) => set({ activeTool: tool }),
  setSimulationState: (s) => set({ simulationState: s }),
  updateBudget: (amount) => set((state) => ({ budget: state.budget + amount })),
  setBudget: (amount) => set({ budget: amount }),
  
  setCamera: (cam) => set((state) => ({ camera: { ...state.camera, ...cam } })),
  
  resetLevel: () => set({
    nodes: initialNodes,
    edges: [],
    budget: LEVEL_CONSTANTS.INITIAL_BUDGET,
    simulationState: 'design'
  })
}));
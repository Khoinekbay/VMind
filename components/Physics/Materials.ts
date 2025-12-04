
export interface MaterialType {
  id: string;
  name: string;
  color: string;
  renderColor: string; // Hex for canvas rendering (legacy/fallback)
  strength: number; // Max strain (pixels) before breaking
  stiffness: number; // 0-1 (1 is rigid)
  density: number; // For weight calculation
  cost: number;
  type: 'road' | 'support' | 'cable';
  // 3D Properties
  metalness: number;
  roughness: number;
}

export const MATERIALS: Record<string, MaterialType> = {
  ROAD: { 
    id: 'road', 
    name: 'Đường Nhựa', 
    color: 'bg-slate-700', 
    renderColor: '#334155',
    strength: 100, // Very strong
    stiffness: 1, 
    density: 0.005, // Heavy
    cost: 50,
    type: 'road',
    metalness: 0.1,
    roughness: 0.9
  },
  WOOD: { 
    id: 'wood', 
    name: 'Gỗ (Thanh giằng)', 
    color: 'bg-amber-600', 
    renderColor: '#D97706',
    strength: 25, // Breaks easier
    stiffness: 0.9, 
    density: 0.001, // Light
    cost: 15,
    type: 'support',
    metalness: 0.0,
    roughness: 0.8
  },
  STEEL: { 
    id: 'steel', 
    name: 'Thanh Thép', 
    color: 'bg-slate-400', 
    renderColor: '#94A3B8',
    strength: 60, // Strong
    stiffness: 0.99, 
    density: 0.002, 
    cost: 40,
    type: 'support',
    metalness: 0.8,
    roughness: 0.2
  },
  CABLE: { 
    id: 'cable', 
    name: 'Dây Cáp', 
    color: 'bg-gray-600', 
    renderColor: '#475569',
    strength: 40, 
    stiffness: 0.5, // Flexible
    density: 0.001,
    cost: 30,
    type: 'cable',
    metalness: 0.5,
    roughness: 0.5
  },
};

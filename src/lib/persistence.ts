import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const LOCAL_STORAGE_PREFIX = 'v-mind_sim_';

export interface SaveData {
  nodes: any[];
  edges: any[];
  budget: number;
  timestamp: number;
}

export const saveToLocal = (key: string, data: Omit<SaveData, 'timestamp'>) => {
  try {
    const payload: SaveData = { ...data, timestamp: Date.now() };
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.error('Save failed', e);
    return false;
  }
};

export const loadFromLocal = (key: string): SaveData | null => {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch (e) {
    console.error('Load failed', e);
    return null;
  }
};

export const saveToCloud = async (userId: string, simulationId: string, data: any) => {
  if (!supabase || !isSupabaseConfigured) {
    console.warn('Supabase chưa được cấu hình - bỏ qua lưu đám mây');
    return;
  }
  // Uses the user_progress table defined in migration 001
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      simulation_id: simulationId, // Ensure this UUID exists in 'simulations' table
      progress: data,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, simulation_id' });

  if (error) throw error;
};

export const loadFromCloud = async (userId: string, simulationId: string) => {
  if (!supabase || !isSupabaseConfigured) {
    console.warn('Supabase chưa được cấu hình - bỏ qua tải đám mây');
    return null;
  }
  const { data, error } = await supabase
    .from('user_progress')
    .select('progress')
    .eq('user_id', userId)
    .eq('simulation_id', simulationId)
    .single();
  
  if (error) return null;
  return data?.progress;
};
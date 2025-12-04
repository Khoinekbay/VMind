import React, { useState } from 'react';
import { Save, FolderOpen, CloudUpload, Check, Loader2 } from 'lucide-react';
import { useBridgeStore } from '../Physics/BridgeStore';
import { saveToLocal, loadFromLocal, saveToCloud } from '../../lib/persistence';

interface SaveLoadControlsProps {
  userId?: string;
  simId?: string; // Should be a valid UUID from database
}

const SaveLoadControls: React.FC<SaveLoadControlsProps> = ({ userId, simId }) => {
  const [status, setStatus] = useState<'idle' | 'saving' | 'loading' | 'success'>('idle');
  
  const handleSaveLocal = () => {
    const { nodes, edges, budget } = useBridgeStore.getState();
    saveToLocal('autosave', { nodes, edges, budget });
    showSuccess();
  };

  const handleLoadLocal = () => {
    const data = loadFromLocal('autosave');
    if (data) {
      useBridgeStore.getState().resetLevel();
      // Small timeout to allow reset to clear physics
      setTimeout(() => {
        useBridgeStore.setState({ 
          nodes: data.nodes, 
          edges: data.edges, 
          budget: data.budget 
        });
        showSuccess();
      }, 50);
    }
  };

  const handleSaveCloud = async () => {
    if (!userId || !simId) return;
    setStatus('saving');
    try {
      const { nodes, edges, budget } = useBridgeStore.getState();
      // Use a fixed UUID for the bridge simulation for now if simId not provided
      // In production, this comes from the URL/Page prop
      const targetSimId = simId || '00000000-0000-0000-0000-000000000000'; 
      
      await saveToCloud(userId, targetSimId, { nodes, edges, budget });
      showSuccess();
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  const showSuccess = () => {
    setStatus('success');
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="flex bg-black/40 rounded-lg p-1 gap-1">
      <button 
        onClick={handleSaveLocal} 
        title="Lưu vào máy (Local)" 
        className="p-2 rounded text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
      >
        {status === 'success' ? <Check size={16} className="text-green-500" /> : <Save size={16} />}
      </button>
      
      <button 
        onClick={handleLoadLocal} 
        title="Mở bản lưu máy" 
        className="p-2 rounded text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
      >
        <FolderOpen size={16} />
      </button>

      {userId && (
        <button 
          onClick={handleSaveCloud} 
          disabled={status === 'saving'}
          title="Lưu lên đám mây" 
          className="p-2 rounded text-gray-400 hover:bg-white/10 hover:text-cyber-neon transition-colors"
        >
          {status === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <CloudUpload size={16} />}
        </button>
      )}
    </div>
  );
};

export default SaveLoadControls;
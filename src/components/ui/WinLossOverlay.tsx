import React from 'react';
import { RefreshCw, Save, Trophy, AlertTriangle } from 'lucide-react';

interface WinLossOverlayProps {
  outcome: 'win' | 'lose' | null;
  onRetry: () => void;
  onSave?: () => Promise<void>;
}

const WinLossOverlay: React.FC<WinLossOverlayProps> = ({ outcome, onRetry, onSave }) => {
  if (!outcome) return null;

  const isWin = outcome === 'win';

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      role="alertdialog"
      aria-live="assertive"
    >
      <div className={`relative p-8 rounded-2xl border-2 shadow-2xl max-w-md w-full text-center transform transition-all scale-100 ${
        isWin 
          ? 'bg-slate-900/90 border-cyber-neon shadow-cyber-neon/20' 
          : 'bg-slate-900/90 border-red-500 shadow-red-500/20'
      }`}>
        
        {/* Icon */}
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4 ${
          isWin ? 'bg-cyber-neon/20 border-cyber-neon text-cyber-neon' : 'bg-red-500/20 border-red-500 text-red-500'
        }`}>
          {isWin ? <Trophy size={40} /> : <AlertTriangle size={40} />}
        </div>

        {/* Text */}
        <h2 className={`text-4xl font-display uppercase tracking-wider mb-2 ${
          isWin ? 'text-white' : 'text-red-100'
        }`}>
          {isWin ? 'Mission Accomplished!' : 'Bridge Collapsed'}
        </h2>
        
        <p className="text-slate-400 mb-8 font-mono">
          {isWin 
            ? 'Cây cầu đã chịu được tải trọng. Xe đã qua sông an toàn!' 
            : 'Kết cấu không chịu được lực. Hãy gia cố và thử lại.'}
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-200 transition-colors"
          >
            <RefreshCw size={20} />
            Thử lại
          </button>
          
          {isWin && onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 bg-cyber-neon hover:bg-emerald-400 transition-colors"
            >
              <Save size={20} />
              Lưu kết quả
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinLossOverlay;
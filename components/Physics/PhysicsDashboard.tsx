import React from 'react';
import { Hammer, Zap, ArrowRight, Construction } from 'lucide-react';

interface PhysicsDashboardProps {
  onSelectSim: (simId: string) => void;
  onBack: () => void;
}

const PhysicsDashboard: React.FC<PhysicsDashboardProps> = ({ onSelectSim, onBack }) => {
  return (
    <div className="min-h-screen bg-[#080911] text-gray-100 p-8 font-mono relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyber-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
          <div>
            <button onClick={onBack} className="text-gray-500 hover:text-white mb-4 text-sm flex items-center gap-1 transition-colors">
               ← Quay lại Dashboard
            </button>
            <h1 className="text-4xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-blue-500">
              The Engineering Sandbox
            </h1>
            <p className="mt-2 text-gray-400 max-w-2xl">
              Phòng thí nghiệm mô phỏng vật lý kiến tạo. Nơi bạn xây dựng, phá hủy và học hỏi từ những sai lầm.
            </p>
          </div>
          <div className="hidden md:block text-right">
             <div className="text-cyber-neon text-xs tracking-widest border border-cyber-neon px-2 py-1 inline-block rounded">
                PHYSICS MODULE v2.1
             </div>
          </div>
        </header>

        {/* Sim Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Bridge */}
          <div 
            onClick={() => onSelectSim('bridge')}
            className="group relative bg-[#0F172A]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-cyber-neon hover:shadow-[0_0_30px_rgba(0,255,159,0.15)] transition-all duration-300"
          >
             <div className="h-48 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-80 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=800" 
                  alt="Bridge" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 grayscale group-hover:grayscale-0"
                />
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                   <div className="p-2 bg-cyber-neon/20 rounded-lg text-cyber-neon border border-cyber-neon/50">
                      <Hammer size={24} />
                   </div>
                   <span className="font-bold text-white text-lg">Xây Cầu Chịu Lực</span>
                </div>
             </div>
             <div className="p-6">
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                   Áp dụng định luật cân bằng lực và ứng suất vật liệu để thiết kế cây cầu vững chắc nhất với chi phí thấp nhất.
                </p>
                <div className="flex items-center justify-between">
                   <div className="flex gap-2">
                      <span className="text-[10px] uppercase bg-white/5 px-2 py-1 rounded text-gray-500 border border-white/5">Cơ học</span>
                      <span className="text-[10px] uppercase bg-white/5 px-2 py-1 rounded text-gray-500 border border-white/5">Kết cấu</span>
                   </div>
                   <span className="text-cyber-neon flex items-center gap-1 text-sm font-bold group-hover:translate-x-1 transition-transform">
                      Bắt đầu <ArrowRight size={14} />
                   </span>
                </div>
             </div>
          </div>

          {/* Card 2: Circuit (Locked) */}
          <div className="group relative bg-[#0F172A]/50 border border-white/5 rounded-2xl overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
             <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs text-gray-400 border border-white/10 flex items-center gap-1">
                <Construction size={12} /> Coming Soon
             </div>
             <div className="h-48 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-80 z-10"></div>
                <img 
                   src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800"
                   alt="Circuit"
                   className="w-full h-full object-cover opacity-30 grayscale"
                />
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                   <div className="p-2 bg-cyber-acid/20 rounded-lg text-cyber-acid border border-cyber-acid/50">
                      <Zap size={24} />
                   </div>
                   <span className="font-bold text-white text-lg">Mạch Điện Tử Thần</span>
                </div>
             </div>
             <div className="p-6">
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                   Thiết kế mạch điện và chứng kiến hậu quả của việc đấu sai dây. Cảnh báo: Có thể gây cháy nổ ảo.
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PhysicsDashboard;
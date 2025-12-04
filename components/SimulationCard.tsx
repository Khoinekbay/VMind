import React from 'react';
import { Simulation, SubjectType } from '../types';
import { SUBJECT_CONFIGS } from '../constants';
import { Play, CheckCircle2, Star } from 'lucide-react';

interface SimulationCardProps {
  simulation: Simulation;
}

const SimulationCard: React.FC<SimulationCardProps> = ({ simulation }) => {
  const subjectConfig = SUBJECT_CONFIGS[simulation.subject] || SUBJECT_CONFIGS[SubjectType.ALL];
  const Icon = subjectConfig.icon;
  const mastery = simulation.masteryLevel || 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img 
          src={simulation.thumbnailUrl} 
          alt={simulation.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 transition-colors group-hover:bg-slate-900/30">
          <div className="h-14 w-14 rounded-full bg-white/95 backdrop-blur-sm shadow-xl shadow-brand-900/10 flex items-center justify-center text-brand-600 opacity-80 scale-90 sm:opacity-0 sm:scale-75 transition-all duration-300 sm:group-hover:opacity-100 sm:group-hover:scale-100">
            <Play size={24} fill="currentColor" className="ml-1" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-md ${subjectConfig.color}`}>
            <Icon size={12} strokeWidth={3} />
            {subjectConfig.label}
          </span>
          {simulation.isNew && (
            <span className="rounded-lg bg-red-500/90 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white shadow-sm animate-pulse-slow">
              MỚI
            </span>
          )}
        </div>

         {/* Mastery Badge if completed */}
         {mastery === 100 && (
            <div className="absolute top-3 right-3 rounded-full bg-green-500 p-1.5 text-white shadow-lg border-2 border-white" title="Đã hoàn thành">
               <CheckCircle2 size={16} />
            </div>
         )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {simulation.title}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500 shrink-0 bg-yellow-50 px-1.5 py-0.5 rounded-md">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold">{simulation.popularity}</span>
          </div>
        </div>
        
        <p className="mb-4 flex-1 text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {simulation.description}
        </p>

        {/* Footer: Progress & Stats */}
        <div className="mt-auto pt-3 border-t border-gray-50">
          {mastery > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Tiến độ</span>
                <span className={mastery === 100 ? "text-green-600" : "text-brand-600"}>{mastery}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden ring-1 ring-gray-100">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${mastery === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-brand-400 to-brand-600'}`} 
                  style={{ width: `${mastery}%` }}
                />
              </div>
            </div>
          ) : (
             <div className="flex items-center justify-between text-xs font-medium text-slate-400 pt-1">
                <span className="hover:text-brand-600 transition-colors">Bắt đầu học ngay</span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-brand-400 transition-colors"></span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationCard;
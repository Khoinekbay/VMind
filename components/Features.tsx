import React from 'react';
import { BrainCircuit, Atom, Trophy, Zap, Smartphone, Database, Lock, Code2 } from 'lucide-react';

const Features: React.FC = () => {
  const featureList = [
    {
      icon: BrainCircuit,
      color: "text-purple-600 bg-purple-100 dark:text-cyber-purple dark:bg-cyber-purple/10",
      title: "Vercel AI SDK Integration",
      desc: "Sử dụng công nghệ StreamText để phản hồi thời gian thực, giảm độ trễ nhận thức (perceived latency) xuống mức tối thiểu. AI đóng vai trò Socratic Tutor."
    },
    {
      icon: Atom,
      color: "text-blue-600 bg-blue-100 dark:text-cyber-neon dark:bg-cyber-neon/10",
      title: "Matter.js Physics Engine",
      desc: "Engine vật lý 2D (rigid-body) xác định (deterministic) và nhẹ, được tối ưu hóa cho giáo dục, giúp chạy mượt mà trên trình duyệt di động mà không cần WebGL nặng nề."
    },
    {
      icon: Database,
      color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-400/10",
      title: "Supabase & JSONB",
      desc: "Mô hình dữ liệu đa hình (Polymorphic Data Modeling) sử dụng JSONB của PostgreSQL để lưu trữ cấu trúc bài học đa dạng từ Vật lý đến Sinh học."
    },
    {
      icon: Trophy,
      color: "text-orange-600 bg-orange-100 dark:text-cyber-solar dark:bg-cyber-solar/10",
      title: "Behavioral Gamification",
      desc: "Hệ thống 'Streak' và 'Streak Freeze' dựa trên tâm lý học hành vi (Loss Aversion) để tăng tỷ lệ giữ chân người học lên đến 60%."
    },
    {
      icon: Smartphone,
      color: "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-400/10",
      title: "Mobile-First Design",
      desc: "Giao diện tối ưu cho màn hình cảm ứng với Touch Targets đạt chuẩn 48x48dp, đảm bảo trải nghiệm tốt trên máy tính bảng và Chromebook."
    },
    {
      icon: Lock,
      color: "text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-400/10",
      title: "Row Level Security (RLS)",
      desc: "Bảo mật dữ liệu học sinh ở cấp hàng (Row Level) trong cơ sở dữ liệu, đảm bảo quyền riêng tư và tuân thủ các quy định giáo dục."
    },
     {
      icon: Code2,
      color: "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-400/10",
      title: "Graph-Based Chemistry",
      desc: "Mô hình hóa học dựa trên đồ thị (Graph-Based) cho phép mô phỏng các phản ứng phức tạp mà không cần tính toán từng phân tử tốn kém."
    },
    {
      icon: Zap,
      color: "text-yellow-600 bg-yellow-100 dark:text-cyber-acid dark:bg-cyber-acid/10",
      title: "Dual-State Synchronization",
      desc: "Đồng bộ hóa trạng thái kép giữa React (Declarative) và Physics Engine (Imperative) để đạt hiệu suất render tối đa 60fps."
    }
  ];

  return (
    <div className="bg-white dark:bg-cyber-black min-h-screen py-16 lg:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-display tracking-wide text-slate-900 dark:text-white sm:text-5xl mb-6">Tính năng Nền tảng</h1>
          <p className="text-lg text-slate-600 dark:text-gray-400 font-sans">
            V-Mind được xây dựng dựa trên ngăn xếp công nghệ hiện đại (Next.js, Supabase, Vercel AI) để mang lại hiệu suất và khả năng mở rộng tối đa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, index) => {
             const Icon = feature.icon;
             return (
              <div key={index} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-brand-200 dark:hover:border-cyber-neon/50 hover:bg-white dark:hover:bg-cyber-slate hover:shadow-lg transition-all duration-300">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-2 font-sans">{feature.title}</h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed font-sans">{feature.desc}</p>
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default Features;
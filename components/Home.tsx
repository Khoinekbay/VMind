import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit, Smartphone, Atom, Trophy, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface HomeProps {
  onNavigate: (page: 'home' | 'features' | 'about' | 'login' | 'dashboard') => void;
  user?: UserProfile;
}

const Home: React.FC<HomeProps> = ({ onNavigate, user }) => {
  
  const handleExperienceClick = () => {
    if (user) {
      onNavigate('dashboard');
    } else {
      onNavigate('login');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-cyber-black pt-10 pb-16 lg:pt-20 lg:pb-24 transition-colors duration-300">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none transition-opacity duration-300">
           <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-50 to-transparent dark:from-brand-900/40 blur-3xl opacity-70"></div>
           <div className="absolute top-1/2 right-0 h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-bl from-purple-50 to-transparent dark:from-cyber-purple/20 blur-3xl opacity-70"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Hero Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-900/30 px-3 py-1 text-base text-brand-700 dark:text-brand-300 mb-6 border border-brand-100 dark:border-brand-800 shadow-sm backdrop-blur-sm">
                <Sparkles size={14} className="text-yellow-500 dark:text-cyber-acid animate-pulse" />
                <span className="font-script text-lg">powered by khoiisthebad</span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl mb-6 leading-[1.1] font-sans">
                Học Khoa học với <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-cyber-neon dark:to-cyber-purple animate-glow">
                  Gia sư AI Riêng
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
                Không chỉ là mô phỏng. <strong className="text-slate-900 dark:text-gray-200">V-Mind</strong> sẽ đặt câu hỏi gợi mở, giúp bạn tự khám phá kiến thức thay vì đưa ra đáp án có sẵn.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button 
                  onClick={handleExperienceClick}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 dark:bg-brand-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/30 dark:shadow-brand-900/50 transition-all hover:scale-105 hover:bg-brand-700 dark:hover:bg-brand-600 active:scale-95 font-sans"
                >
                  <BrainCircuit size={20} />
                  Trải nghiệm Ngay
                </button>
                <button onClick={() => onNavigate('about')} className="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-white/5 px-8 py-4 text-base font-bold text-slate-700 dark:text-gray-200 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-white/10 hover:ring-gray-300 dark:hover:ring-gray-600 font-sans">
                  Xem Báo cáo
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:block relative perspective-1000 group">
               <div className="relative rounded-2xl bg-slate-900 dark:bg-cyber-slate p-2 shadow-2xl rotate-y-6 group-hover:rotate-y-2 transition-transform duration-700 ease-out border border-slate-800 dark:border-gray-700">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-gray-800 dark:bg-gray-600 rounded-b-lg z-20"></div>
                  {/* Simulation Preview */}
                  <div className="relative overflow-hidden rounded-xl bg-gray-800 dark:bg-black aspect-video">
                    <img 
                      src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800" 
                      alt="Pendulum Simulation" 
                      className="w-full h-full object-cover opacity-60 dark:opacity-40"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                        <Smartphone size={36} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Floating AI Chat Bubbles */}
                  <div className="absolute -bottom-12 -left-12 w-80 space-y-4">
                     <div className="bg-white dark:bg-cyber-gunmetal p-4 rounded-2xl rounded-tl-sm shadow-xl border border-purple-100 dark:border-gray-700 animate-in slide-in-from-bottom-5 fade-in duration-700">
                        <div className="flex items-start gap-3">
                           <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-cyber-purple/20 flex items-center justify-center text-purple-600 dark:text-cyber-purple flex-shrink-0 mt-1">
                              <BrainCircuit size={16} />
                           </div>
                           <div>
                              <p className="text-lg font-script font-bold text-purple-600 dark:text-cyber-purple mb-1">AI Socratic Tutor</p>
                              <p className="text-sm font-medium text-slate-700 dark:text-gray-300 font-sans">Nếu em tăng chiều dài dây con lắc lên gấp đôi, em dự đoán chu kỳ dao động sẽ thay đổi thế nào?</p>
                           </div>
                        </div>
                     </div>
                     <div className="bg-brand-600 dark:bg-brand-700 p-3 rounded-2xl rounded-tr-sm shadow-lg ml-12 animate-in slide-in-from-bottom-5 fade-in duration-1000 delay-300">
                        <p className="text-sm text-white font-medium font-sans">Em nghĩ nó sẽ chạy chậm hơn ạ.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section className="py-24 bg-slate-50 dark:bg-cyber-slate border-t border-slate-200 dark:border-gray-800 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-display tracking-wide text-slate-900 dark:text-white sm:text-5xl">Công nghệ Giáo dục Thế hệ mới</h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto font-sans">
                V-Mind kết hợp sư phạm kiến tạo với công nghệ mô phỏng tiên tiến nhất để giải quyết các hạn chế của giáo dục truyền thống.
              </p>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-md hover:border-brand-200 dark:hover:border-cyber-purple/50 transition-all group">
                <div className="h-12 w-12 bg-purple-100 dark:bg-cyber-purple/20 text-purple-600 dark:text-cyber-purple rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <BrainCircuit size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-3 font-sans">Gia sư AI Socratic</h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-sans">
                  AI không đưa ra đáp án. Nó đóng vai trò người dẫn dắt, đặt câu hỏi để học sinh tự xây dựng kiến thức.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-md hover:border-brand-200 dark:hover:border-cyber-neon/50 transition-all group">
                <div className="h-12 w-12 bg-blue-100 dark:bg-cyber-neon/20 text-blue-600 dark:text-cyber-neon rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Atom size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-3 font-sans">Mô phỏng Đa hình</h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-sans">
                  Sử dụng engine vật lý <strong>Matter.js</strong> cho chuyển động thực tế và Hóa học dựa trên đồ thị.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-md hover:border-brand-200 dark:hover:border-cyber-solar/50 transition-all group">
                <div className="h-12 w-12 bg-orange-100 dark:bg-cyber-solar/20 text-orange-600 dark:text-cyber-solar rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Trophy size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-3 font-sans">Gamification</h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-sans">
                  Biến việc học thành thói quen với cơ chế "Chuỗi" (Streak), điểm XP và bảng xếp hạng.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-md hover:border-brand-200 dark:hover:border-cyber-acid/50 transition-all group">
                <div className="h-12 w-12 bg-green-100 dark:bg-cyber-acid/20 text-green-600 dark:text-cyber-acid rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Zap size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-3 font-sans">Hiệu suất Tối đa</h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-sans">
                  Thiết kế Mobile-first. Chạy mượt mà trên Chromebook nhờ tối ưu hóa React & WebGL.
                </p>
              </div>
           </div>
           
           <div className="mt-12 text-center">
             <button onClick={() => onNavigate('features')} className="inline-flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-sans">
               Xem chi tiết tất cả tính năng <ArrowRight size={16} />
             </button>
           </div>
        </div>
      </section>
    </>
  );
};

export default Home;
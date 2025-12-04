import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  FlaskConical,
  Dna,
  CheckCircle2,
  Circle,
  BrainCircuit,
  Target,
  ArrowRight,
  Microscope,
  Globe
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  user?: UserProfile;
  onNavigate: (page: 'home' | 'features' | 'about' | 'login' | 'register' | 'dashboard' | 'physics') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'subjects' | 'community' | 'settings'>('overview');
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
  };

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'subjects', icon: BookOpen, label: 'Môn học' },
    { id: 'community', icon: Users, label: 'Cộng đồng' },
    { id: 'settings', icon: Settings, label: 'Cài đặt' },
  ];

  const tasks = [
    { id: 1, text: "Hoàn thành bài Con lắc đơn", subject: 'PHYSICS', completed: false },
    { id: 2, text: "Pha chế dung dịch X", subject: 'CHEMISTRY', completed: true },
    { id: 3, text: "Đọc lý thuyết Gen", subject: 'BIOLOGY', completed: false },
  ];

  // Helper for Corner Brackets (HUD Effect)
  const CornerBrackets = ({ color = "border-white/20" }) => (
    <>
      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${color}`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${color}`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${color}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${color}`} />
    </>
  );

  // --- SUB-COMPONENTS ---

  const OverviewView = () => (
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-min animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Widget 1: Welcome & Quote (Large) */}
      <div className="col-span-1 md:col-span-6 lg:col-span-8 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-30"></div>
        <div className="relative h-full bg-[#0F172A]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col justify-center overflow-hidden shadow-2xl">
          <CornerBrackets color="border-cyber-purple/30 group-hover:border-cyber-purple/60 transition-colors" />
          <div className="absolute right-0 top-0 p-32 bg-cyber-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-2xl md:text-4xl font-display text-white mb-4">
            Xin chào, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-cyber-purple">{user?.name || 'Nhà khoa học'}</span>!
          </h2>
          <blockquote className="text-lg md:text-xl text-gray-300 font-light italic border-l-4 border-cyber-solar pl-4 py-1 max-w-2xl">
            "Khoa học không phải là sự thật tuyệt đối, mà là hành trình không ngừng sửa sai để tiến gần hơn đến sự thật."
          </blockquote>
          <p className="mt-4 text-sm text-gray-500 font-mono uppercase tracking-wider">— Socratic Archive</p>
        </div>
      </div>

      {/* Widget 2: Radar Chart / Stats (Medium) */}
      <div className="col-span-1 md:col-span-3 lg:col-span-4 relative group">
        <div className="h-full bg-[#0F172A]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-2xl">
            <CornerBrackets color="border-cyber-neon/30" />
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target size={16} className="text-cyber-neon" />
              Chỉ số Năng lực
            </h3>
            
            {/* Mock Radar Chart with SVG */}
            <div className="flex-1 flex items-center justify-center relative">
              <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-[0_0_15px_rgba(0,255,159,0.1)]">
                  {/* Background Grid */}
                  <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="#334155" strokeWidth="1" />
                  <polygon points="100,50 145,75 145,125 100,150 55,125 55,75" fill="none" stroke="#334155" strokeWidth="1" />
                  {/* Labels */}
                  <text x="100" y="15" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">Lý thuyết</text>
                  <text x="180" y="55" textAnchor="start" fill="#94A3B8" fontSize="10" fontFamily="monospace">Thực hành</text>
                  <text x="180" y="150" textAnchor="start" fill="#94A3B8" fontSize="10" fontFamily="monospace">Tư duy</text>
                  <text x="100" y="195" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">Sáng tạo</text>
                  <text x="20" y="150" textAnchor="end" fill="#94A3B8" fontSize="10" fontFamily="monospace">Logic</text>
                  <text x="20" y="55" textAnchor="end" fill="#94A3B8" fontSize="10" fontFamily="monospace">Ghi nhớ</text>
                  
                  {/* Data Shape (Randomized for visual) */}
                  <polygon points="100,30 160,70 150,130 100,160 40,130 50,70" fill="rgba(0, 255, 159, 0.2)" stroke="#00FF9F" strokeWidth="2" className="animate-pulse-slow" />
              </svg>
            </div>
        </div>
      </div>

      {/* Widget 3: Subjects (Wide) */}
      <div className="col-span-1 md:col-span-6 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Physics Card */}
        <button 
          onClick={() => setCurrentView('subjects')}
          className="relative group h-32 bg-[#0F172A]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left transition-all hover:bg-[#0F172A] hover:border-cyber-neon hover:shadow-[0_0_20px_rgba(0,255,159,0.15)]"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-110">
              <Zap size={64} className="text-cyber-neon" />
            </div>
            <div className="h-10 w-10 bg-cyber-neon/10 rounded-lg flex items-center justify-center text-cyber-neon mb-3">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyber-neon transition-colors">Vật lý</h3>
            <p className="text-xs text-gray-400 mt-1">Cơ học, Điện từ, Quang học</p>
        </button>

        {/* Chemistry Card */}
        <button 
          onClick={() => setCurrentView('subjects')}
          className="relative group h-32 bg-[#0F172A]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left transition-all hover:bg-[#0F172A] hover:border-cyber-acid hover:shadow-[0_0_20px_rgba(252,238,12,0.15)]"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-110">
              <FlaskConical size={64} className="text-cyber-acid" />
            </div>
            <div className="h-10 w-10 bg-cyber-acid/10 rounded-lg flex items-center justify-center text-cyber-acid mb-3">
              <FlaskConical size={20} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyber-acid transition-colors">Hóa học</h3>
            <p className="text-xs text-gray-400 mt-1">Phản ứng, Hữu cơ, Vô cơ</p>
        </button>

        {/* Biology Card */}
        <button 
          onClick={() => setCurrentView('subjects')}
          className="relative group h-32 bg-[#0F172A]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left transition-all hover:bg-[#0F172A] hover:border-cyber-purple hover:shadow-[0_0_20px_rgba(189,0,255,0.15)]"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-110">
              <Dna size={64} className="text-cyber-purple" />
            </div>
            <div className="h-10 w-10 bg-cyber-purple/10 rounded-lg flex items-center justify-center text-cyber-purple mb-3">
              <Dna size={20} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyber-purple transition-colors">Sinh học</h3>
            <p className="text-xs text-gray-400 mt-1">Di truyền, Tế bào, Sinh thái</p>
        </button>
      </div>

      {/* Widget 4: Daily Tasks (Vertical) */}
      <div className="col-span-1 md:col-span-3 lg:col-span-4 row-span-2 relative group">
        <div className="h-full bg-[#0F172A]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col shadow-2xl">
          <CornerBrackets color="border-cyber-solar/30" />
          <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BrainCircuit size={16} className="text-cyber-solar" />
              Nhiệm vụ hàng ngày
          </h3>
          
          <div className="flex-1 space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="group/item flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyber-solar/50 hover:bg-white/10 transition-all cursor-pointer">
                    <button className={`mt-0.5 flex-shrink-0 ${task.completed ? 'text-cyber-solar' : 'text-gray-500 group-hover/item:text-cyber-solar'}`}>
                      {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                    <div>
                      <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                          {task.text}
                      </p>
                      <span className="text-[10px] font-mono text-gray-500 bg-black/30 px-1.5 py-0.5 rounded mt-1 inline-block">
                          {task.subject}
                      </span>
                    </div>
                </div>
              ))}
          </div>
          
          <button className="mt-4 w-full py-2 rounded-lg border border-dashed border-gray-600 text-xs text-gray-400 hover:text-white hover:border-gray-400 transition-colors">
              + Thêm nhiệm vụ cá nhân
          </button>
        </div>
      </div>

    </div>
  );

  const SubjectsView = () => {
    const subjects = [
      {
        id: 'physics',
        title: 'Vật lý',
        icon: Zap,
        color: 'cyber-neon', // CSS variable or tailwind color name part
        hex: '#00FF9F',
        desc: 'Khám phá các định luật của vũ trụ từ cơ học Newton đến điện từ trường.',
        topics: ['Cơ học', 'Điện học', 'Quang học', 'Nhiệt học'],
        progress: 65,
        action: () => onNavigate('physics')
      },
      {
        id: 'chemistry',
        title: 'Hóa học',
        icon: FlaskConical,
        color: 'cyber-acid',
        hex: '#FCEE0C',
        desc: 'Thực hành các phản ứng, cân bằng phương trình và cấu trúc phân tử.',
        topics: ['Vô cơ', 'Hữu cơ', 'Phân tích', 'Lý hóa'],
        progress: 30,
        action: null
      },
      {
        id: 'biology',
        title: 'Sinh học',
        icon: Dna,
        color: 'cyber-purple',
        hex: '#BD00FF',
        desc: 'Tìm hiểu về sự sống, từ DNA, tế bào đến các hệ sinh thái phức tạp.',
        topics: ['Di truyền', 'Tế bào', 'Sinh thái', 'Tiến hóa'],
        progress: 10,
        action: null
      },
      {
        id: 'earth',
        title: 'Khoa học Trái đất',
        icon: Globe,
        color: 'blue-400',
        hex: '#60A5FA',
        desc: 'Nghiên cứu cấu trúc địa chất, khí hậu và các hiện tượng tự nhiên.',
        topics: ['Địa chất', 'Khí tượng', 'Thiên văn', 'Môi trường'],
        progress: 0,
        action: null
      }
    ];

    return (
      <div className="animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => setCurrentView('overview')} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={24} />
           </button>
           <h2 className="text-3xl font-display text-white">Lựa chọn Môn học</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {subjects.map((subject, idx) => {
            const Icon = subject.icon;
            // Dynamic classes based on color logic
            const borderColor = `hover:border-${subject.color}`;
            const textColor = `text-${subject.color}`;
            const shadowColor = `hover:shadow-[0_0_30px_${subject.hex}40]`;
            const iconBg = `bg-${subject.color}/10`;
            const barColor = `bg-${subject.color}`;

            return (
              <div 
                key={subject.id}
                className={`group relative h-96 bg-[#0F172A]/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 ${shadowColor} hover:border-${subject.color} cursor-pointer`}
              >
                <CornerBrackets color={`border-white/10 group-hover:border-${subject.color}/50`} />
                
                {/* Background Glow */}
                <div 
                  className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ backgroundColor: subject.hex }}
                ></div>

                <div>
                   <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6`}>
                      <Icon size={28} className={textColor} style={{ color: subject.hex }} />
                   </div>
                   
                   <h3 className="text-2xl font-bold text-white mb-2">{subject.title}</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {subject.desc}
                   </p>

                   <div className="space-y-2">
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Chủ đề nổi bật</p>
                      <div className="flex flex-wrap gap-2">
                         {subject.topics.map(topic => (
                           <span key={topic} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-xs text-gray-300">
                             {topic}
                           </span>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="mt-8">
                   <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                      <span>Tiến độ</span>
                      <span style={{ color: subject.hex }}>{subject.progress}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${subject.progress}%`, backgroundColor: subject.hex }}
                      />
                   </div>
                   
                   <button onClick={() => subject.action && subject.action()} className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-sm font-bold text-white transition-colors group-hover:bg-white/10">
                      Vào phòng Lab <ArrowRight size={16} />
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#080911] text-gray-100 font-sans overflow-hidden selection:bg-cyber-neon selection:text-[#080911]">
      {/* Sidebar (VS Code Style) */}
      <aside 
        className={`${isCollapsed ? 'w-16' : 'w-64'} bg-[#0F172A] border-r border-white/5 flex flex-col transition-all duration-300 relative z-20`}
      >
        <div className="h-16 flex items-center justify-center border-b border-white/5">
           <div className="flex items-center gap-2 overflow-hidden px-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyber-neon to-cyber-purple flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyber-neon/20">
                 <FlaskConical size={18} className="text-[#080911]" strokeWidth={2.5} />
              </div>
              {!isCollapsed && (
                <span className="font-display text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-cyber-purple whitespace-nowrap">
                  V-Mind
                </span>
              )}
           </div>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentView(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                currentView === item.id 
                  ? 'bg-cyber-neon/10 text-cyber-neon border-l-2 border-cyber-neon' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'stroke-[2.5px]' : ''} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-14 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm font-medium">Đăng xuất</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-[#0F172A] border border-white/10 rounded-full p-1 text-gray-400 hover:text-cyber-neon transition-colors z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-950">
        {/* Background Ambient Glows - Cleaner, no noise */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/40 via-[#0F172A]/20 to-transparent pointer-events-none" />
        <div className="absolute -top-[200px] right-[10%] w-[600px] h-[600px] bg-cyber-purple/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 relative z-10">
          
          {/* Header */}
          <header className="flex justify-between items-end mb-8">
             <div>
                <p className="text-cyber-neon font-mono text-xs mb-1 tracking-widest uppercase opacity-80">Dashboard /// V-Mind OS v2.0</p>
                <h1 className="text-3xl font-display text-white">
                  {currentView === 'overview' && 'Trung tâm Điều khiển'}
                  {currentView === 'subjects' && 'Danh mục Môn học'}
                  {currentView === 'community' && 'Cộng đồng'}
                  {currentView === 'settings' && 'Cài đặt Hệ thống'}
                </h1>
             </div>
             <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                   <p className="text-sm text-gray-400 font-mono">{new Date().toLocaleDateString('vi-VN')}</p>
                   <p className="text-xs text-cyber-solar">SYSTEM ONLINE</p>
                </div>
                <div className="h-10 w-10 rounded-full border border-cyber-neon/30 p-0.5">
                   <img src={user?.avatarUrl} alt="Avatar" className="h-full w-full rounded-full" />
                </div>
             </div>
          </header>

          {/* Dynamic Content */}
          {currentView === 'overview' && <OverviewView />}
          {currentView === 'subjects' && <SubjectsView />}
          
          {(currentView === 'community' || currentView === 'settings') && (
             <div className="flex flex-col items-center justify-center h-96 bg-[#0F172A]/50 border border-white/10 rounded-3xl animate-in fade-in zoom-in">
                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                   <Settings size={40} className="text-gray-500 animate-spin-slow" />
                </div>
                <h3 className="text-xl text-gray-300">Module đang được bảo trì</h3>
                <p className="text-gray-500 mt-2">Vui lòng quay lại sau.</p>
             </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
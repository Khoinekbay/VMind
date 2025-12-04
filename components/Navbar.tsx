import React from 'react';
import { FlaskConical, Menu, X, Flame, Zap, LogOut, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  user?: UserProfile;
  onNavigate: (page: 'home' | 'features' | 'about' | 'login' | 'register') => void;
  currentPage: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, currentPage, theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleNavClick = (page: 'home' | 'features' | 'about' | 'login' | 'register') => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    onNavigate('home');
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-cyber-black/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <button onClick={() => handleNavClick('home')} className="flex items-center gap-2 cursor-pointer flex-shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-600 dark:to-brand-800 text-white shadow-brand-500/30 dark:shadow-cyber-neon/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FlaskConical size={22} className="stroke-[2.5px]" />
            </div>
            <span className="text-2xl font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-violet-600 dark:from-cyber-neon dark:to-cyber-purple hidden sm:block pt-1 drop-shadow-sm">V-Mind</span>
          </button>
        </div>

        {/* Right: Gamification & Profile */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            title={theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          >
            {theme === 'light' ? (
               <Moon size={20} className="fill-slate-600" />
            ) : (
               <Sun size={20} className="text-cyber-acid fill-cyber-acid" />
            )}
          </button>

          {user ? (
             /* Authenticated State with Gamification Elements */
            <div className="flex items-center gap-4">
              {/* Streak Counter */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 border border-orange-100 dark:border-orange-900/50" title="Chuỗi ngày học tập">
                <Flame size={18} className="text-orange-500 fill-orange-500 dark:text-cyber-solar dark:fill-cyber-solar" />
                <span className="text-lg font-display text-orange-600 dark:text-cyber-solar pt-1">{user.streakDays}</span>
              </div>

              {/* XP Counter */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 border border-yellow-100 dark:border-yellow-900/50" title="Điểm kinh nghiệm">
                <Zap size={18} className="text-yellow-500 fill-yellow-500 dark:text-cyber-acid dark:fill-cyber-acid" />
                <span className="text-sm font-bold text-yellow-700 dark:text-cyber-acid font-sans">{user.xp} XP</span>
              </div>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative group focus:outline-none"
                >
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="h-9 w-9 rounded-full border-2 border-white dark:border-gray-700 shadow-sm ring-2 ring-gray-100 dark:ring-gray-700 transition-all hover:ring-brand-500 dark:hover:ring-cyber-neon"
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 dark:bg-cyber-neon ring-2 ring-white dark:ring-cyber-black"></div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-cyber-slate py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none animate-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 truncate">Học viên Cấp {user.level}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Guest State */
             <div className="hidden md:flex items-center gap-3">
               <button 
                onClick={() => handleNavClick('login')}
                className="text-sm font-semibold text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-neon px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
               >
                 Đăng nhập
               </button>
               <button 
                onClick={() => handleNavClick('register')}
                className="rounded-full bg-brand-600 dark:bg-brand-700 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 dark:shadow-brand-900/40 hover:bg-brand-700 dark:hover:bg-brand-600 hover:-translate-y-0.5 transition-all"
               >
                Đăng ký
              </button>
             </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-cyber-black px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-5">
           
           {user && (
             <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                   <Flame size={18} className="text-orange-500 dark:text-cyber-solar fill-orange-500 dark:fill-cyber-solar" />
                   <span className="font-display text-slate-700 dark:text-gray-200 text-lg pt-1">{user.streakDays} ngày</span>
                </div>
                <div className="flex items-center gap-2">
                   <Zap size={18} className="text-yellow-500 dark:text-cyber-acid fill-yellow-500 dark:fill-cyber-acid" />
                   <span className="font-bold text-slate-700 dark:text-gray-200">{user.xp} XP</span>
                </div>
             </div>
           )}

          <div className="flex flex-col gap-2">
            <button onClick={() => handleNavClick('features')} className={`block text-left rounded-lg px-3 py-2 text-base font-medium ${currentPage === 'features' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-cyber-neon' : 'text-slate-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-brand-600 dark:hover:text-cyber-neon'}`}>Tính năng</button>
            <button onClick={() => handleNavClick('about')} className={`block text-left rounded-lg px-3 py-2 text-base font-medium ${currentPage === 'about' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-cyber-neon' : 'text-slate-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-brand-600 dark:hover:text-cyber-neon'}`}>Về dự án</button>
             {!user ? (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => handleNavClick('login')} className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 py-3 text-sm font-semibold text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5">
                    Đăng nhập
                  </button>
                  <button onClick={() => handleNavClick('register')} className="flex items-center justify-center rounded-lg bg-brand-600 dark:bg-brand-700 py-3 text-sm font-semibold text-white shadow-md">
                    Đăng ký
                  </button>
                </div>
             ) : (
                <button onClick={handleLogout} className="flex items-center justify-center w-full rounded-lg border border-red-200 dark:border-red-900/50 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-4">
                   Đăng xuất
                </button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
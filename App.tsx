import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Features from './components/Features';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PhysicsDashboard from './components/Physics/PhysicsDashboard';
import BridgeSim from './components/Physics/BridgeSim';
import { LayoutTemplate, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { UserProfile } from './types';

type Page = 'home' | 'features' | 'about' | 'login' | 'register' | 'dashboard' | 'physics' | 'physics-bridge';
type Theme = 'light' | 'dark';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<UserProfile | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');
  const showSupabaseWarning = !isSupabaseConfigured;

  // Initialize Theme
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(undefined);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setUser({
          id: data.id,
          username: data.username || data.email?.split('@')[0] || 'user', // Fallback
          name: data.full_name || 'Người dùng',
          email: data.contact_email || '', 
          avatarUrl: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
          streakDays: data.streak_days || 0,
          xp: data.xp || 0,
          level: data.level || 1,
          isStreakFrozen: data.is_streak_frozen || false
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigateTo} user={user} />;
      case 'features':
        return <Features />;
      case 'about':
        return <About />;
      case 'login':
        return <Login onNavigate={navigateTo} />;
      case 'register':
        return <Register onNavigate={navigateTo} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={navigateTo} />;
      case 'physics':
        return <PhysicsDashboard onSelectSim={(id) => {
          if (id === 'bridge') navigateTo('physics-bridge');
        }} onBack={() => navigateTo('dashboard')} />;
      case 'physics-bridge':
        return <BridgeSim user={user} onBack={() => navigateTo('physics')} />;
      default:
        return <Home onNavigate={navigateTo} user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-cyber-black transition-colors duration-300">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600 dark:text-cyber-neon" />
      </div>
    );
  }

  // Fullscreen modes
  const isImmersive = currentPage === 'physics' || currentPage === 'physics-bridge';
  const isDashboard = currentPage === 'dashboard';

  return (
    <div className="min-h-screen bg-white dark:bg-cyber-black text-slate-900 dark:text-gray-100 flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900 dark:selection:bg-cyber-neon dark:selection:text-cyber-black transition-colors duration-300">
      {/* Supabase config warning */}
      {showSupabaseWarning && (
        <div className="bg-amber-50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 px-4 py-3 text-sm text-center border-b border-amber-200 dark:border-amber-800">
          Supabase chưa được cấu hình. Các tính năng đăng nhập/lưu đám mây sẽ bị tắt cho tới khi thêm VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY hoặc NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </div>
      )}

      {/* Navbar - Only show if not in dashboard or immersive mode */}
      {!isDashboard && !isImmersive && (
        <Navbar 
          onNavigate={navigateTo} 
          currentPage={currentPage} 
          user={user} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer - Only show if not in dashboard or immersive */}
      {!isDashboard && !isImmersive && (
        <footer className="bg-white dark:bg-cyber-slate border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-gray-800 text-white shadow-lg border border-transparent dark:border-gray-700">
                    <LayoutTemplate size={20} className="dark:text-cyber-neon" />
                  </div>
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-violet-600 dark:from-cyber-neon dark:to-cyber-purple">V-Mind</span>
              </div>
              <div className="flex gap-8 text-sm font-medium text-slate-600 dark:text-gray-400">
                <button onClick={() => navigateTo('about')} className="hover:text-brand-600 dark:hover:text-cyber-neon transition-colors">Về dự án</button>
                <button onClick={() => navigateTo('features')} className="hover:text-brand-600 dark:hover:text-cyber-neon transition-colors">Tính năng</button>
                <a href="https://discord.gg/eDkqhfFumV" target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 dark:hover:text-cyber-neon transition-colors">Liên hệ</a>
              </div>
              <p className="text-sm text-slate-400 dark:text-gray-500">&copy; 2025 V-Mind Platform</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
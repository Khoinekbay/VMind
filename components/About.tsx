import React from 'react';
import { Construction } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white dark:bg-cyber-black px-4 transition-colors duration-300">
      <div className="h-24 w-24 bg-brand-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
        <Construction size={48} className="text-brand-600 dark:text-cyber-neon" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">Dự án V-Mind</h1>
      <p className="text-slate-600 dark:text-gray-400 text-center max-w-md mb-8">
        Trang này đang trong quá trình xây dựng. Chúng tôi sẽ sớm cập nhật thông tin chi tiết về tầm nhìn, sứ mệnh và đội ngũ phát triển.
      </p>
      <div className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brand-700 dark:text-cyber-black bg-brand-100 dark:bg-cyber-neon">
        Trạng thái: Đang phát triển (Phase 4)
      </div>
    </div>
  );
};

export default About;
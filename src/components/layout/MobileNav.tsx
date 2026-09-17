import React from 'react';
import { BookOpen, FileUp, Youtube, Sparkles, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { id: 'dashboard', label: 'Materi', icon: BookOpen },
    { id: 'upload_dokumen', label: 'Upload PDF', icon: FileUp },
    { id: 'input_youtube', label: 'YouTube', icon: Youtube },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0E1715]/95 border-t border-[#E2E8E5] dark:border-[#253B34] backdrop-blur-lg px-2 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition ${
                isActive
                  ? 'text-[#0D7A5F] dark:text-[#34D399] font-bold'
                  : 'text-[#596A65] dark:text-[#94A7A0] font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition ${
                  isActive ? 'bg-[#0D7A5F]/15 dark:bg-[#0D7A5F]/25 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

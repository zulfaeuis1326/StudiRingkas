import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ApiConfigModal } from '../common/ApiConfigModal';
import { getApiBaseUrl, isMockModeEnabled } from '../../lib/api';
import {
  BookOpen,
  Sun,
  Moon,
  Sliders,
  LogOut,
  User,
  Plus,
  Compass,
  FileText,
  Youtube,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const mockActive = isMockModeEnabled();
  const baseUrl = getApiBaseUrl();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E2E8E5] dark:border-[#253B34] bg-white/90 dark:bg-[#0E1715]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 text-left group transition focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0D7A5F] to-[#10B981] flex items-center justify-center text-white shadow-sm shadow-[#0D7A5F]/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#111C19] dark:text-white flex items-center gap-1.5">
                  StudiRingkas
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-[#0D7A5F]/10 text-[#0D7A5F] dark:bg-[#0D7A5F]/20 dark:text-[#34D399]">
                    SaaS
                  </span>
                </span>
                <span className="hidden sm:block text-[11px] text-[#596A65] dark:text-[#94A7A0] leading-none">
                  Ringkas Kuliah & Podcast Belajar
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-[#E2E8E5] dark:border-[#253B34]">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                    activeTab === 'dashboard'
                      ? 'bg-[#0D7A5F]/10 dark:bg-[#0D7A5F]/20 text-[#0D7A5F] dark:text-[#34D399]'
                      : 'text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white'
                  }`}
                >
                  Dashboard Materi
                </button>
                <button
                  onClick={() => setActiveTab('upload_dokumen')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    activeTab === 'upload_dokumen'
                      ? 'bg-[#0D7A5F]/10 dark:bg-[#0D7A5F]/20 text-[#0D7A5F] dark:text-[#34D399]'
                      : 'text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Upload Dokumen
                </button>
                <button
                  onClick={() => setActiveTab('input_youtube')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    activeTab === 'input_youtube'
                      ? 'bg-[#0D7A5F]/10 dark:bg-[#0D7A5F]/20 text-[#0D7A5F] dark:text-[#34D399]'
                      : 'text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white'
                  }`}
                >
                  <Youtube className="w-4 h-4 text-red-500" />
                  Ringkas YouTube
                </button>
              </nav>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend Connection Indicator Badge */}
            <button
              onClick={() => setIsConfigOpen(true)}
              title="Atur Base URL API & Supabase"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8E5] dark:border-[#253B34] text-xs font-medium text-[#596A65] dark:text-[#94A7A0] hover:bg-neutral-100 dark:hover:bg-[#182723] transition"
            >
              <span className={`w-2 h-2 rounded-full ${mockActive ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
              <span className="hidden sm:inline">
                {mockActive ? 'API: Demo Mock' : baseUrl ? 'API: Custom' : 'API: Real'}
              </span>
              <Sliders className="w-3.5 h-3.5 ml-0.5 text-[#0D7A5F]" />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#182723] transition"
              aria-label="Toggle Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile or Login CTA */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] hover:bg-neutral-100 dark:hover:bg-[#182723] transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0D7A5F]/20 text-[#0D7A5F] dark:text-[#34D399] font-bold text-xs flex items-center justify-center">
                    {user.nama_lengkap.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-[#111C19] dark:text-white truncate max-w-[120px]">
                      {user.nama_lengkap}
                    </p>
                    <p className="text-[10px] text-[#596A65] dark:text-[#94A7A0] truncate max-w-[120px]">
                      {user.universitas || 'Mahasiswa'}
                    </p>
                  </div>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#14221F] border border-[#E2E8E5] dark:border-[#253B34] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-[#E2E8E5] dark:border-[#253B34]">
                      <p className="text-xs font-bold text-[#111C19] dark:text-white">{user.nama_lengkap}</p>
                      <p className="text-[11px] text-[#596A65] dark:text-[#94A7A0] truncate">{user.email}</p>
                      {user.universitas && (
                        <p className="text-[10px] text-[#0D7A5F] dark:text-[#34D399] font-medium mt-0.5">
                          {user.universitas}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setIsConfigOpen(true);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-[#596A65] dark:text-[#94A7A0] hover:bg-neutral-100 dark:hover:bg-[#1B2B27] flex items-center gap-2"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Setelan API & Supabase
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        logout();
                        setActiveTab('landing');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Keluar (Sign Out)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('auth')}
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#0D7A5F] dark:text-[#34D399] hover:bg-[#0D7A5F]/10 transition"
                >
                  Masuk
                </button>
                <button
                  onClick={() => setActiveTab('auth')}
                  className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#0D7A5F] hover:bg-[#0B654E] text-white shadow-sm transition active:scale-95"
                >
                  Daftar Gratis
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* API Configuration Modal */}
      <ApiConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </>
  );
};

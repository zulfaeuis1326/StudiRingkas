import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadDokumenPage } from './pages/UploadDokumenPage';
import { InputYoutubePage } from './pages/InputYoutubePage';
import { MateriDetailPage } from './pages/MateriDetailPage';

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(() => (user ? 'dashboard' : 'landing'));
  const [selectedMateriId, setSelectedMateriId] = useState<string | null>('mat-001');

  // Handle routing helpers
  const handleSelectMateri = (id: string) => {
    setSelectedMateriId(id);
    setActiveTab('materi_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadSuccess = (newMateriId: string) => {
    setSelectedMateriId(newMateriId);
    setActiveTab('materi_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] dark:bg-[#0C1210] text-[#1E292B] dark:text-[#E2E8F0] selection:bg-[#0D7A5F]/20 selection:text-[#0D7A5F]">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <main className="flex-1 pb-20 md:pb-10">
        {activeTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setActiveTab(user ? 'dashboard' : 'auth')}
            onExploreDemo={() => {
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'auth' && (
          <AuthPage
            onSuccess={() => setActiveTab('dashboard')}
            onBackToLanding={() => setActiveTab('landing')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            onSelectMateri={handleSelectMateri}
            onNavigateUploadDokumen={() => setActiveTab('upload_dokumen')}
            onNavigateInputYoutube={() => setActiveTab('input_youtube')}
          />
        )}

        {activeTab === 'upload_dokumen' && (
          <UploadDokumenPage
            onSuccessNavigate={handleUploadSuccess}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'input_youtube' && (
          <InputYoutubePage
            onSuccessNavigate={handleUploadSuccess}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'materi_detail' && selectedMateriId && (
          <MateriDetailPage
            materiId={selectedMateriId}
            onBack={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile Handsets */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

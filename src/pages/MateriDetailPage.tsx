import React, { useState, useEffect } from 'react';
import {
  MateriItem,
  RingkasanResponse,
  ProcessingStatusResponse,
  AsyncProcessingStatus,
} from '../types';
import { getMateriStatus, getRingkasan, fetchMateriList } from '../lib/api';
import { AsyncStateIndicator } from '../components/common/AsyncStateIndicator';
import { StructuredSummary } from '../components/materi/StructuredSummary';
import { PodcastPlayer } from '../components/materi/PodcastPlayer';
import { QuizViewer } from '../components/materi/QuizViewer';
import {
  ArrowLeft,
  FileText,
  Youtube,
  BookOpen,
  Headphones,
  HelpCircle,
  Share2,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface MateriDetailPageProps {
  materiId: string;
  onBack: () => void;
}

export const MateriDetailPage: React.FC<MateriDetailPageProps> = ({ materiId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'podcast' | 'quiz'>('ringkasan');
  const [status, setStatus] = useState<AsyncProcessingStatus>('processing');
  const [progressPercent, setProgressPercent] = useState<number>(35);
  const [statusMessage, setStatusMessage] = useState<string>('Memeriksa status pemrosesan...');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [materiMeta, setMateriMeta] = useState<MateriItem | null>(null);
  const [ringkasan, setRingkasan] = useState<RingkasanResponse | null>(null);

  const loadStatusAndData = async () => {
    try {
      setErrorMessage('');
      // 1. Fetch metadata if list has it
      const list = await fetchMateriList();
      const item = list.find((m) => m.id === materiId);
      if (item) setMateriMeta(item);

      // 2. Call GET /api/materi/:id/status
      const statusRes = await getMateriStatus(materiId);
      setStatus(statusRes.status);
      setProgressPercent(statusRes.progress);
      setStatusMessage(statusRes.pesan);

      if (statusRes.status === 'ready') {
        // 3. Fetch structured summary: GET /api/materi/:id/ringkasan
        const ringkasanData = await getRingkasan(materiId);
        setRingkasan(ringkasanData);
      }
    } catch (err: any) {
      setStatus('failed');
      setErrorMessage(err.message || 'Gagal memuat status materi kuliah.');
    }
  };

  useEffect(() => {
    loadStatusAndData();

    // Polling while status is processing: GET /api/materi/:id/status
    let interval: NodeJS.Timeout | null = null;
    if (status === 'processing') {
      interval = setInterval(async () => {
        try {
          const statusRes = await getMateriStatus(materiId);
          setStatus(statusRes.status);
          setProgressPercent(statusRes.progress);
          setStatusMessage(statusRes.pesan);

          if (statusRes.status === 'ready') {
            if (interval) clearInterval(interval);
            const ringkasanData = await getRingkasan(materiId);
            setRingkasan(ringkasanData);
          } else if (statusRes.status === 'failed') {
            if (interval) clearInterval(interval);
            setErrorMessage(statusRes.error_message || 'Pemrosesan backend gagal.');
          }
        } catch (err: any) {
          if (interval) clearInterval(interval);
          setStatus('failed');
          setErrorMessage(err.message || 'Gagal mempolling status.');
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [materiId, status]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#596A65] dark:text-[#94A7A0] hover:text-[#0D7A5F] dark:hover:text-[#34D399] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {materiMeta?.sumber_url && (
            <a
              href={materiMeta.sumber_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-red-600 hover:underline"
            >
              <span>Buka YouTube Asli</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Main Material Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              materiMeta?.tipe === 'youtube'
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#0D7A5F] dark:text-[#34D399]'
            }`}
          >
            {materiMeta?.tipe === 'youtube' ? <Youtube className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{materiMeta?.tipe === 'youtube' ? 'Video YouTube' : 'Dokumen PDF'}</span>
          </span>

          {materiMeta?.kategori && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-[#1E2D29] text-[#596A65] dark:text-[#94A7A0]">
              {materiMeta.kategori}
            </span>
          )}

          {materiMeta?.nama_file && (
            <span className="text-xs text-[#596A65] dark:text-[#94A7A0] truncate max-w-xs">
              File: {materiMeta.nama_file}
            </span>
          )}
        </div>

        <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111C19] dark:text-white tracking-tight">
          {materiMeta?.judul || ringkasan?.judul || 'Memuat Materi...'}
        </h1>
      </div>

      {/* State Indicator if still processing initial extraction or failed */}
      {status !== 'ready' ? (
        <AsyncStateIndicator
          status={status}
          progressPercent={progressPercent}
          pesan={statusMessage}
          errorMessage={errorMessage}
          onRetry={loadStatusAndData}
          actionName="GET /api/materi/:id/status"
        />
      ) : (
        <>
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#EFF3F1] dark:bg-[#14221F] border border-[#E2E8E5] dark:border-[#253B34]">
            <button
              onClick={() => setActiveTab('ringkasan')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'ringkasan'
                  ? 'bg-white dark:bg-[#0D7A5F] text-[#0D7A5F] dark:text-white shadow-sm'
                  : 'text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Ringkasan Terstruktur</span>
            </button>

            <button
              onClick={() => setActiveTab('podcast')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'podcast'
                  ? 'bg-white dark:bg-amber-500 text-amber-600 dark:text-white shadow-sm'
                  : 'text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Podcast Audio</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'quiz'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quiz Interaktif</span>
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'ringkasan' && ringkasan && (
            <div className="space-y-6">
              <StructuredSummary ringkasan={ringkasan} />
              
              {/* Quick Prompt Cards to trigger Podcast or Quiz */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E2E8E5] dark:border-[#253B34]">
                <button
                  onClick={() => setActiveTab('podcast')}
                  className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-left hover:border-amber-500 transition group flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500 text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#111C19] dark:text-white">
                      Dengarkan Podcast Audio
                    </h4>
                    <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-0.5">
                      Dengarkan rekap audio 3 menit santai saat mobile.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-left hover:border-indigo-500 transition group flex items-start gap-3.5"
                >
                  <div className="p-2.5 rounded-xl bg-indigo-600 text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#111C19] dark:text-white">
                      Uji Pemahaman Lewat Kuis
                    </h4>
                    <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-0.5">
                      Kerjakan 4 soal pilihan ganda lengkap dengan pembahasan.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'podcast' && (
            <PodcastPlayer materiId={materiId} />
          )}

          {activeTab === 'quiz' && (
            <QuizViewer materiId={materiId} />
          )}
        </>
      )}
    </div>
  );
};

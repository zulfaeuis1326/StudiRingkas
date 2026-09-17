import React, { useEffect, useState } from 'react';
import { MateriItem, AsyncProcessingStatus } from '../types';
import { fetchMateriList } from '../lib/api';
import { AsyncStateIndicator } from '../components/common/AsyncStateIndicator';
import {
  BookOpen,
  FileText,
  Youtube,
  Headphones,
  HelpCircle,
  Clock,
  Search,
  Plus,
  ArrowRight,
  Filter,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface DashboardPageProps {
  onSelectMateri: (id: string) => void;
  onNavigateUploadDokumen: () => void;
  onNavigateInputYoutube: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectMateri,
  onNavigateUploadDokumen,
  onNavigateInputYoutube,
}) => {
  const [materiList, setMateriList] = useState<MateriItem[]>([]);
  const [pageStatus, setPageStatus] = useState<AsyncProcessingStatus>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'semua' | 'dokumen' | 'youtube' | 'processing'>('semua');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setErrorMessage('');
      const data = await fetchMateriList();
      setMateriList(data);
      setPageStatus('ready');
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memuat daftar materi kuliah.');
      setPageStatus('failed');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh interval if any item is processing
    const interval = setInterval(() => {
      setMateriList((current) => {
        const hasProcessing = current.some((m) => m.status === 'processing');
        if (hasProcessing) {
          fetchMateriList().then(setMateriList).catch(() => {});
        }
        return current;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const filteredMateri = materiList.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.kategori && item.kategori.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedFilter === 'dokumen') return item.tipe === 'dokumen';
    if (selectedFilter === 'youtube') return item.tipe === 'youtube';
    if (selectedFilter === 'processing') return item.status === 'processing';
    return true;
  });

  const totalMateri = materiList.length;
  const readyMateri = materiList.filter((m) => m.status === 'ready').length;
  const podcastCount = materiList.filter((m) => m.podcast_status === 'ready').length;
  const quizCount = materiList.filter((m) => m.quiz_status === 'ready').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111C19] dark:text-white tracking-tight">
            Dashboard Materi Belajar
          </h1>
          <p className="text-xs sm:text-sm text-[#596A65] dark:text-[#94A7A0] mt-1">
            Kelola ringkasan materi, dengarkan podcast audio, dan asah pemahaman lewat kuis
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white hover:bg-white dark:hover:bg-[#15221F] transition disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onNavigateUploadDokumen}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0D7A5F] hover:bg-[#0B654E] text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Upload Dokumen</span>
          </button>

          <button
            onClick={onNavigateInputYoutube}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#121D1A] hover:bg-neutral-50 dark:hover:bg-[#182723] text-[#111C19] dark:text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95"
          >
            <Youtube className="w-4 h-4 text-red-500" />
            <span>Ringkas YouTube</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#596A65] dark:text-[#94A7A0]">Total Materi</span>
            <div className="p-1.5 rounded-lg bg-[#0D7A5F]/10 text-[#0D7A5F] dark:text-[#34D399]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading text-2xl font-bold text-[#111C19] dark:text-white mt-2">
            {totalMateri}
          </p>
          <span className="text-[11px] text-[#596A65] dark:text-[#94A7A0]">
            {readyMateri} materi siap dipelajari
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#596A65] dark:text-[#94A7A0]">Podcast Audio</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Headphones className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading text-2xl font-bold text-[#111C19] dark:text-white mt-2">
            {podcastCount}
          </p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Tersedia untuk didengar
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#596A65] dark:text-[#94A7A0]">Quiz Interaktif</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading text-2xl font-bold text-[#111C19] dark:text-white mt-2">
            {quizCount}
          </p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Paket latihan soal siap
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#596A65] dark:text-[#94A7A0]">Efisiensi Waktu</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#0D7A5F] dark:text-[#34D399]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading text-2xl font-bold text-[#0D7A5F] dark:text-[#34D399] mt-2">
            ~85%
          </p>
          <span className="text-[11px] text-[#596A65] dark:text-[#94A7A0]">
            Waktu belajar dihemat
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi kuliah, topik, atau kata kunci..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#121D1A] text-xs sm:text-sm text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'semua', label: 'Semua Materi' },
            { id: 'dokumen', label: 'Dokumen PDF' },
            { id: 'youtube', label: 'YouTube' },
            { id: 'processing', label: 'Sedang Diproses' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedFilter === tab.id
                  ? 'bg-[#0D7A5F] text-white shadow-sm'
                  : 'bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Async State Wrapper for Materi List */}
      <AsyncStateIndicator
        status={pageStatus}
        actionName="Daftar Materi (GET /api/materi)"
        errorMessage={errorMessage}
        onRetry={loadData}
      >
        {filteredMateri.length === 0 ? (
          <div className="p-10 text-center rounded-3xl border border-dashed border-[#E2E8E5] dark:border-[#253B34] bg-white/50 dark:bg-[#121D1A]/50">
            <BookOpen className="w-10 h-10 mx-auto text-[#596A65] dark:text-[#94A7A0] opacity-40 mb-3" />
            <h3 className="font-heading font-bold text-base text-[#111C19] dark:text-white">
              Tidak Ada Materi Ditemukan
            </h3>
            <p className="text-xs text-[#596A65] dark:text-[#94A7A0] max-w-sm mx-auto mt-1 mb-5">
              {searchQuery
                ? 'Tidak ada materi yang cocok dengan kata pencarian Anda.'
                : 'Mulai dengan mengunggah modul kuliah atau memasukkan URL video YouTube.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onNavigateUploadDokumen}
                className="px-4 py-2 rounded-xl bg-[#0D7A5F] text-white text-xs font-semibold hover:bg-[#0B654E] transition"
              >
                Upload Dokumen Baru
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMateri.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectMateri(item.id)}
                className="group p-5 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] hover:border-[#0D7A5F]/50 dark:hover:border-[#0D7A5F]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.tipe === 'dokumen'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#0D7A5F] dark:text-[#34D399]'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {item.tipe === 'dokumen' ? (
                        <>
                          <FileText className="w-3 h-3" />
                          <span>Dokumen</span>
                        </>
                      ) : (
                        <>
                          <Youtube className="w-3 h-3" />
                          <span>YouTube</span>
                        </>
                      )}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'ready'
                          ? 'bg-[#0D7A5F]/10 text-[#0D7A5F] dark:text-[#34D399]'
                          : item.status === 'processing'
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 animate-pulse'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status === 'ready' && <CheckCircle2 className="w-3 h-3" />}
                      {item.status === 'processing' && <Sparkles className="w-3 h-3" />}
                      {item.status === 'ready'
                        ? 'Ringkasan Siap'
                        : item.status === 'processing'
                        ? 'Sedang Memproses'
                        : 'Gagal'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#111C19] dark:text-white group-hover:text-[#0D7A5F] dark:group-hover:text-[#34D399] transition line-clamp-2 leading-snug">
                    {item.judul}
                  </h3>

                  {/* Meta info */}
                  <div className="mt-2 space-y-1">
                    {item.kategori && (
                      <p className="text-[11px] font-medium text-[#596A65] dark:text-[#94A7A0]">
                        Topik: <span className="text-[#111C19] dark:text-neutral-300">{item.kategori}</span>
                      </p>
                    )}
                    {item.nama_file && (
                      <p className="text-[11px] text-[#596A65] dark:text-[#94A7A0] truncate">
                        File: {item.nama_file} ({item.ukuran_file || 'PDF'})
                      </p>
                    )}
                    {item.sumber_url && (
                      <p className="text-[11px] text-red-500/80 truncate">
                        {item.sumber_url}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bar if processing */}
                {item.status === 'processing' && (
                  <div className="my-3 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
                    <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-300 mb-1">
                      <span>Proses Latar Belakang</span>
                      <span className="font-mono font-bold">{item.progress_percent || 45}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-amber-200/60 dark:bg-amber-900/40 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress_percent || 45}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Badges and CTA */}
                <div className="mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#253B34] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.podcast_status === 'ready' && (
                      <span className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" title="Podcast Tersedia">
                        <Headphones className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {item.quiz_status === 'ready' && (
                      <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400" title="Quiz Tersedia">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="text-[10px] text-[#596A65] dark:text-[#94A7A0]">
                      {new Date(item.tanggal_dibuat).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-[#0D7A5F] dark:text-[#34D399] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Buka Detail
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </AsyncStateIndicator>
    </div>
  );
};

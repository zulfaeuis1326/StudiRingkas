import React from 'react';
import { AsyncProcessingStatus } from '../../types';
import { AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface AsyncStateIndicatorProps {
  status: AsyncProcessingStatus;
  progressPercent?: number;
  pesan?: string;
  errorMessage?: string;
  onRetry?: () => void;
  actionName?: string; // e.g. "Ringkasan Dokumen", "Audio Podcast", "Quiz Interaktif"
  children?: React.ReactNode;
}

export const AsyncStateIndicator: React.FC<AsyncStateIndicatorProps> = ({
  status,
  progressPercent = 45,
  pesan = 'Sedang memproses di latar belakang...',
  errorMessage = 'Terjadi kendala saat memproses materi. Silakan coba kembali.',
  onRetry,
  actionName = 'Proses',
  children,
}) => {
  if (status === 'ready') {
    return <>{children}</>;
  }

  if (status === 'processing') {
    return (
      <div className="w-full rounded-2xl border border-[#0D7A5F]/20 bg-[#0D7A5F]/5 dark:bg-[#0D7A5F]/10 p-6 md:p-8 relative overflow-hidden transition-all duration-300">
        {/* Subtle Animated Ambient Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0D7A5F]/30 via-[#0D7A5F] to-[#E09F3E] animate-shimmer" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0 mt-0.5">
              <div className="w-12 h-12 rounded-xl bg-[#0D7A5F]/15 dark:bg-[#0D7A5F]/25 text-[#0D7A5F] dark:text-[#34D399] flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D7A5F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0D7A5F]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#0D7A5F]/15 text-[#0D7A5F] dark:text-[#34D399]">
                  Sedang Diproses
                </span>
                <span className="text-xs text-[#596A65] dark:text-[#94A7A0]">
                  {actionName}
                </span>
              </div>
              <h4 className="text-base font-semibold text-[#111C19] dark:text-white mt-1">
                {pesan}
              </h4>
              <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-0.5">
                Backend sedang menganalisis materi di latar belakang. Halaman ini akan otomatis diperbarui.
              </p>
            </div>
          </div>

          <div className="w-full md:w-56 flex flex-col items-end gap-1.5">
            <div className="flex justify-between w-full text-xs font-medium text-[#111C19] dark:text-white">
              <span>Progress Estimasi</span>
              <span className="font-mono text-[#0D7A5F] dark:text-[#34D399]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#E2E8E5] dark:bg-[#1E2D29] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0D7A5F] to-[#10B981] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(12, Math.min(100, progressPercent))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Polished Skeleton Blocks Previewing Content Shape */}
        <div className="mt-6 pt-6 border-t border-[#0D7A5F]/15 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-white/60 dark:bg-black/20 border border-[#0D7A5F]/10 space-y-2">
            <div className="h-4 w-24 bg-[#0D7A5F]/15 dark:bg-[#0D7A5F]/20 rounded animate-pulse" />
            <div className="h-3 w-full bg-black/5 dark:bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-4/5 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
          </div>
          <div className="p-3.5 rounded-xl bg-white/60 dark:bg-black/20 border border-[#0D7A5F]/10 space-y-2">
            <div className="h-4 w-32 bg-[#0D7A5F]/15 dark:bg-[#0D7A5F]/20 rounded animate-pulse" />
            <div className="h-3 w-full bg-black/5 dark:bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
          </div>
          <div className="p-3.5 rounded-xl bg-white/60 dark:bg-black/20 border border-[#0D7A5F]/10 space-y-2">
            <div className="h-4 w-28 bg-[#0D7A5F]/15 dark:bg-[#0D7A5F]/20 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Failed State
  return (
    <div className="w-full rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/70 dark:bg-red-950/20 p-6 md:p-7 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                Gagal Memproses
              </span>
              <span className="text-xs text-red-600/80 dark:text-red-400/80">{actionName}</span>
            </div>
            <p className="text-sm text-[#111C19] dark:text-red-200 font-medium mt-1">
              {errorMessage}
            </p>
            <p className="text-xs text-[#596A65] dark:text-red-300/70 mt-0.5">
              Periksa format dokumen atau koneksi URL video yang diinputkan.
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition active:scale-95 flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  );
};

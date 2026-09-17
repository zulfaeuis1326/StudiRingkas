import React, { useState } from 'react';
import { submitYoutube } from '../lib/api';
import { AsyncStateIndicator } from '../components/common/AsyncStateIndicator';
import { AsyncProcessingStatus } from '../types';
import {
  Youtube,
  Link as LinkIcon,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface InputYoutubePageProps {
  onSuccessNavigate: (materiId: string) => void;
  onCancel: () => void;
}

export const InputYoutubePage: React.FC<InputYoutubePageProps> = ({
  onSuccessNavigate,
  onCancel,
}) => {
  const [url, setUrl] = useState('');
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Teknologi Informasi');
  const [status, setStatus] = useState<AsyncProcessingStatus>('ready');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [progressPercent, setProgressPercent] = useState(25);
  const [statusMessage, setStatusMessage] = useState('Memvalidasi URL YouTube...');

  // Helper to extract YouTube ID
  const extractYoutubeId = (inputUrl: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = inputUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractYoutubeId(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSubmitting(true);
    setStatus('processing');
    setProgressPercent(35);
    setStatusMessage('Mengirim URL ke POST /api/materi/youtube...');
    setErrorMessage('');

    try {
      const res = await submitYoutube(url, {
        judul: judul || 'Kuliah Ringkas Video YouTube',
        kategori,
      });

      setProgressPercent(85);
      setStatusMessage('Video diterima! AI sedang mengunduh transkrip audio...');

      setTimeout(() => {
        setStatus('ready');
        setIsSubmitting(false);
        onSuccessNavigate(res.materi_id);
      }, 900);
    } catch (err: any) {
      setIsSubmitting(false);
      setStatus('failed');
      setErrorMessage(err.message || 'Gagal memproses link YouTube.');
    }
  };

  const loadSampleVideo = () => {
    setUrl('https://www.youtube.com/watch?v=IPvY4p91q0s');
    setJudul('Jaringan Komputer: Pemetaan 7 Lapisan OSI Model & TCP/IP');
    setKategori('Teknologi Informasi');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onCancel}
          className="text-xs text-[#596A65] dark:text-[#94A7A0] hover:text-[#0D7A5F] transition mb-2"
        >
          ← Kembali ke Dashboard
        </button>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111C19] dark:text-white tracking-tight flex items-center gap-2">
          <span>Ringkas Video YouTube</span>
          <span className="p-1 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600">
            <Youtube className="w-6 h-6" />
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#596A65] dark:text-[#94A7A0] mt-1">
          Kirimkan tautan video rekaman kuliah atau webinar. Endpoint: POST /api/materi/youtube
        </p>
      </div>

      {isSubmitting || status === 'failed' ? (
        <div className="space-y-4">
          <AsyncStateIndicator
            status={status}
            progressPercent={progressPercent}
            pesan={statusMessage}
            errorMessage={errorMessage}
            onRetry={() => {
              setStatus('ready');
              setIsSubmitting(false);
            }}
            actionName="POST /api/materi/youtube"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* URL Input Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#596A65] dark:text-[#94A7A0]">
                Tautan Video YouTube (Link URL)
              </label>
              <button
                type="button"
                onClick={loadSampleVideo}
                className="text-xs text-[#0D7A5F] dark:text-[#34D399] hover:underline font-semibold"
              >
                Gunakan Contoh Link Kuliah
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <Youtube className="w-5 h-5 text-red-500" />
              </div>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#15221F] text-sm text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]"
              />
            </div>

            {/* Video Thumbnail Preview */}
            {videoId ? (
              <div className="mt-4 p-3 rounded-2xl bg-[#F0F4F2] dark:bg-[#182723] border border-[#E2E8E5] dark:border-[#253B34] flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-black flex-shrink-0 group">
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt="YouTube Thumbnail"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="text-left w-full">
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                    Video Terdeteksi
                  </span>
                  <p className="text-xs font-semibold text-[#111C19] dark:text-white mt-0.5">
                    ID Video: {videoId}
                  </p>
                  <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1">
                    AI akan mengekstrak transkrip tertutup (CC/subtitle) serta audio untuk dianalisis menjadi poin belajar.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#596A65] dark:text-[#94A7A0]">
                Mendukung link reguler youtube.com/watch?v=... maupun youtu.be/...
              </p>
            )}
          </div>

          {/* Title & Category Input Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#596A65] dark:text-[#94A7A0]">
                Judul Materi Kuliah (Opsional)
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Jaringan Komputer - Penjelasan OSI Layer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#15221F] text-sm text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#596A65] dark:text-[#94A7A0]">
                Kategori Mata Kuliah
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Teknologi Informasi',
                  'Metodologi Riset',
                  'Ilmu Ekonomi',
                  'Sains & Teknik',
                  'Kesehatan & Farmasi',
                ].map((kat) => (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => setKategori(kat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      kategori === kat
                        ? 'bg-[#0D7A5F] text-white'
                        : 'bg-[#F0F4F2] dark:bg-[#182723] text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white'
                    }`}
                  >
                    {kat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#596A65] dark:text-[#94A7A0] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!url.trim() || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0D7A5F] hover:bg-[#0B654E] text-white text-sm font-semibold shadow-md transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kirim & Ringkas Video</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

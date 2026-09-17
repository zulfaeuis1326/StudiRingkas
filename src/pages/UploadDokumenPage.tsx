import React, { useState, useRef } from 'react';
import { uploadDokumen } from '../lib/api';
import { AsyncStateIndicator } from '../components/common/AsyncStateIndicator';
import { AsyncProcessingStatus } from '../types';
import {
  FileText,
  UploadCloud,
  X,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  AlertCircle,
  Tag,
  Sparkles,
} from 'lucide-react';

interface UploadDokumenPageProps {
  onSuccessNavigate: (materiId: string) => void;
  onCancel: () => void;
}

export const UploadDokumenPage: React.FC<UploadDokumenPageProps> = ({
  onSuccessNavigate,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Metodologi Riset');
  const [status, setStatus] = useState<AsyncProcessingStatus>('ready'); // 'ready' here means idle ready to upload
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMateriId, setCreatedMateriId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [progressPercent, setProgressPercent] = useState(20);
  const [statusMessage, setStatusMessage] = useState('Mengunggah dokumen...');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!judul) {
        setJudul(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!judul) {
        setJudul(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);
    setStatus('processing');
    setProgressPercent(30);
    setStatusMessage('Mengirim file ke POST /api/materi/dokumen...');
    setErrorMessage('');

    try {
      const result = await uploadDokumen(selectedFile, { judul, kategori });
      setCreatedMateriId(result.materi_id);
      setProgressPercent(80);
      setStatusMessage('Dokumen berhasil diterima! Sedang menginisiasi ekstraksi...');

      setTimeout(() => {
        setStatus('ready');
        setIsSubmitting(false);
        onSuccessNavigate(result.materi_id);
      }, 900);
    } catch (err: any) {
      setIsSubmitting(false);
      setStatus('failed');
      setErrorMessage(err.message || 'Gagal mengunggah dokumen.');
    }
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
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#111C19] dark:text-white tracking-tight">
          Upload Dokumen Kuliah
        </h1>
        <p className="text-xs sm:text-sm text-[#596A65] dark:text-[#94A7A0] mt-1">
          Kirimkan diktat kuliah, jurnal PDF, atau modul praktikum. Endpoint: POST /api/materi/dokumen
        </p>
      </div>

      {/* Async State: Processing / Failed */}
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
            actionName="POST /api/materi/dokumen"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dropzone Container */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#0D7A5F] bg-[#0D7A5F]/10 scale-[1.01]'
                : selectedFile
                ? 'border-[#0D7A5F]/60 bg-[#0D7A5F]/5 dark:bg-[#0D7A5F]/10'
                : 'border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#121D1A] hover:border-[#0D7A5F]/40 hover:bg-neutral-50 dark:hover:bg-[#15221F]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt,.pptx"
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#0D7A5F] text-white flex items-center justify-center shadow-lg shadow-[#0D7A5F]/20 mb-3">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-base text-[#111C19] dark:text-white">
                  {selectedFile.name}
                </h3>
                <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1">
                  Ukuran: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Format Didukung
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="mt-4 px-3 py-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Ganti File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#0D7A5F]/10 dark:bg-[#0D7A5F]/20 text-[#0D7A5F] dark:text-[#34D399] flex items-center justify-center mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-base text-[#111C19] dark:text-white">
                  Tarik & Lepas File di Sini, atau <span className="text-[#0D7A5F] dark:text-[#34D399] underline">Pilih File</span>
                </h3>
                <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1.5 max-w-sm">
                  Mendukung PDF, Word (DOCX), atau Slide Presentasi hingga 50 MB
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-[#596A65] dark:text-[#94A7A0]">
                  <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#1E2D29]">PDF</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#1E2D29]">DOCX</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#1E2D29]">PPTX</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#1E2D29]">TXT</span>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#596A65] dark:text-[#94A7A0]">
                Judul Materi Kuliah
              </label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Metodologi Penelitian Bab 4 - Desain Kuasi-Eksperimen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#15221F] text-sm text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#596A65] dark:text-[#94A7A0]">
                Kategori / Mata Kuliah
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Metodologi Riset',
                  'Teknologi Informasi',
                  'Ilmu Ekonomi',
                  'Hukum & Sosial',
                  'Kedokteran & Kesehatan',
                  'Teknik & MIPA',
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
              disabled={!selectedFile || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0D7A5F] hover:bg-[#0B654E] text-white text-sm font-semibold shadow-md transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kirim & Ringkas Dokumen</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

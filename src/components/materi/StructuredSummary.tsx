import React, { useState } from 'react';
import { RingkasanResponse } from '../../types';
import {
  BookOpen,
  Sparkles,
  Key,
  CheckCircle,
  Copy,
  Check,
  Tag,
  Zap,
  Clock,
  Layers,
  FileText,
  Compass,
} from 'lucide-react';

interface StructuredSummaryProps {
  ringkasan: RingkasanResponse;
}

export const StructuredSummary: React.FC<StructuredSummaryProps> = ({ ringkasan }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    let text = `# ${ringkasan.judul}\n\n`;
    text += `## Ringkasan Eksekutif\n${ringkasan.ringkasan_eksekutif}\n\n`;
    text += `## Poin-Poin Utama\n`;
    ringkasan.poin_utama.forEach((p, idx) => {
      text += `\n### ${idx + 1}. ${p.judul_poin}\n${p.ringkasan_singkat}\n`;
      p.penjelasan_mendalam.forEach((sub) => {
        text += `- ${sub}\n`;
      });
      if (p.contoh_kontekstual) {
        text += `Contoh: ${p.contoh_kontekstual}\n`;
      }
    });
    text += `\n## Istilah Penting\n`;
    ringkasan.istilah_penting.forEach((item) => {
      text += `- **${item.istilah}**: ${item.definisi}\n`;
    });
    text += `\n## Kesimpulan & Aksi\n`;
    ringkasan.kesimpulan_dan_aksi.forEach((aksi) => {
      text += `- ${aksi}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Executive Summary */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8E5] dark:border-[#253B34]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#0D7A5F]/10 text-[#0D7A5F] dark:text-[#34D399]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-heading font-bold text-base text-[#111C19] dark:text-white">
              Ringkasan Eksekutif Terstruktur
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {ringkasan.efisiensi_baca && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0D7A5F]/10 dark:bg-[#0D7A5F]/20 text-[#0D7A5F] dark:text-[#34D399]">
                <Clock className="w-3.5 h-3.5" />
                {ringkasan.efisiensi_baca}
              </span>
            )}

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold border border-[#E2E8E5] dark:border-[#253B34] text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-[#182723] transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Semua'}</span>
            </button>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[#111C19] dark:text-neutral-200">
          {ringkasan.ringkasan_eksekutif}
        </p>

        {ringkasan.total_kata_asli && (
          <div className="pt-2 flex items-center gap-4 text-[11px] text-[#596A65] dark:text-[#94A7A0]">
            <span>Dari <strong>{ringkasan.total_kata_asli} kata</strong> materi asli</span>
            <span>•</span>
            <span>Diringkas menjadi <strong>{ringkasan.total_kata_ringkas} kata</strong> terarah</span>
          </div>
        )}
      </div>

      {/* Structured Core Points */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#0D7A5F]" />
          <h3 className="font-heading font-bold text-lg text-[#111C19] dark:text-white">
            Poin-Poin Utama & Pembahasan Mendalam
          </h3>
        </div>

        <div className="space-y-4">
          {ringkasan.poin_utama.map((poin, idx) => (
            <div
              key={poin.id || idx}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm space-y-4 hover:border-[#0D7A5F]/40 transition"
            >
              {/* Point Header */}
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-[#0D7A5F]/10 dark:bg-[#0D7A5F]/20 text-[#0D7A5F] dark:text-[#34D399] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-base sm:text-lg text-[#111C19] dark:text-white">
                    {poin.judul_poin}
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-[#0D7A5F] dark:text-[#34D399] mt-0.5">
                    {poin.ringkasan_singkat}
                  </p>
                </div>
              </div>

              {/* In-depth Bullets */}
              <div className="pl-10 space-y-2 border-l-2 border-[#0D7A5F]/20 ml-3">
                {poin.penjelasan_mendalam.map((penjelasan, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-[#596A65] dark:text-[#CBD5E1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A5F] flex-shrink-0 mt-2" />
                    <span>{penjelasan}</span>
                  </div>
                ))}
              </div>

              {/* Contextual Case / Example */}
              {poin.contoh_kontekstual && (
                <div className="ml-3 sm:ml-10 p-3.5 rounded-xl bg-[#F0F4F2] dark:bg-[#162521] border border-[#E2E8E5] dark:border-[#253B34] text-xs">
                  <span className="font-bold text-[#0D7A5F] dark:text-[#34D399] uppercase tracking-wider text-[10px] block mb-1">
                    Contoh Penerapan / Skenario Kuliah:
                  </span>
                  <p className="text-[#111C19] dark:text-white italic">
                    &ldquo;{poin.contoh_kontekstual}&rdquo;
                  </p>
                </div>
              )}

              {/* Keywords Tag Row */}
              {poin.kata_kunci && poin.kata_kunci.length > 0 && (
                <div className="ml-3 sm:ml-10 flex flex-wrap items-center gap-1.5 pt-1">
                  <Tag className="w-3 h-3 text-[#596A65] dark:text-[#94A7A0]" />
                  {poin.kata_kunci.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#1C2C28] text-[11px] font-medium text-[#596A65] dark:text-[#94A7A0]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Istilah Penting & Rekomendasi Aksi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Istilah Penting / Glossary */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8E5] dark:border-[#253B34]">
            <Key className="w-4 h-4 text-amber-500" />
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#111C19] dark:text-white">
              Glosarium Istilah Penting
            </h4>
          </div>

          <div className="space-y-3">
            {ringkasan.istilah_penting.map((item, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
                <span className="font-bold text-[#111C19] dark:text-white block">
                  {item.istilah}
                </span>
                <span className="text-[#596A65] dark:text-[#94A7A0] leading-relaxed">
                  {item.definisi}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Kesimpulan & Action Items */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8E5] dark:border-[#253B34]">
            <CheckCircle className="w-4 h-4 text-[#0D7A5F]" />
            <h4 className="font-heading font-bold text-sm sm:text-base text-[#111C19] dark:text-white">
              Rekomendasi Aksi Belajar
            </h4>
          </div>

          <div className="space-y-2.5">
            {ringkasan.kesimpulan_dan_aksi.map((aksi, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-[#111C19] dark:text-neutral-200">
                <span className="w-4 h-4 rounded-full bg-[#0D7A5F]/15 text-[#0D7A5F] dark:text-[#34D399] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{aksi}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

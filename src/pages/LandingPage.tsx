import React from 'react';
import {
  FileText,
  Youtube,
  Headphones,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onExploreDemo }) => {
  const { loginAsDemoStudent } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0C1210] text-[#1E292B] dark:text-[#E2E8F0] pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle Decorative Pattern */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#0D7A5F]/10 via-[#10B981]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D7A5F]/10 dark:bg-[#0D7A5F]/20 text-[#0D7A5F] dark:text-[#34D399] text-xs font-semibold mb-6 border border-[#0D7A5F]/20 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Asisten Belajar Cerdas Mahasiswa Indonesia</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111C19] dark:text-white leading-[1.15]">
            Ubah Diktat Tebal & Video Kuliah Jadi{' '}
            <span className="text-[#0D7A5F] dark:text-[#34D399] underline decoration-[#E09F3E]/40 decoration-wavy decoration-2">
              Materi Belajar Ringkas
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#596A65] dark:text-[#94A7A0] leading-relaxed max-w-2xl mx-auto">
            StudiRingkas merangkum modul PDF, paper jurnal, dan video kuliah YouTube menjadi poin-poin terstruktur, podcast audio santai, serta quiz latihan soal lengkap dengan pembahasan.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#0D7A5F] hover:bg-[#0B654E] text-white font-semibold shadow-md shadow-[#0D7A5F]/25 hover:shadow-lg transition active:scale-95"
            >
              <span>Mulai Ringkas Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                loginAsDemoStudent();
                onExploreDemo();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#14221F] hover:bg-neutral-50 dark:hover:bg-[#1B2D29] text-[#111C19] dark:text-white font-medium shadow-sm transition active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Coba Demo Instan (1-Klik)</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 pt-6 border-t border-[#E2E8E5]/70 dark:border-[#253B34]/70 flex flex-wrap items-center justify-center gap-6 text-xs text-[#596A65] dark:text-[#94A7A0]">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#0D7A5F]" />
              <span>Mobile-First untuk Belajar di HP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#0D7A5F]" />
              <span>Audio Podcast Bahasa Indonesia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#0D7A5F]" />
              <span>Quiz + Pembahasan Per Soal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111C19] dark:text-white">
            4 Langkah Mudah Taklukkan Bahan Ujian
          </h2>
          <p className="text-sm text-[#596A65] dark:text-[#94A7A0] mt-2">
            Dari input mentah hingga pemahaman mendalam tanpa begadang
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm hover:border-[#0D7A5F]/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#0D7A5F] dark:text-[#34D399] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#111C19] dark:text-white">
              1. Upload Dokumen
            </h3>
            <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-2 leading-relaxed">
              Tarik file PDF, slide materi dosen, buku acuan, atau paper jurnal. AI mengekstrak konsep inti secara otomatis.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm hover:border-[#0D7A5F]/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Youtube className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#111C19] dark:text-white">
              2. Tempel Link YouTube
            </h3>
            <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-2 leading-relaxed">
              Cukup masukkan URL video rekaman webinar atau penjelasan kuliah 1 jam, langsung jadi ringkasan 3 halaman.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm hover:border-[#0D7A5F]/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#111C19] dark:text-white">
              3. Podcast Audio Belajar
            </h3>
            <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-2 leading-relaxed">
              Dengarkan obrolan santai 3 menit antar dua AI podcaster. Belajar sambil naik motor, komuter KRL, atau sebelum tidur.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm hover:border-[#0D7A5F]/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#111C19] dark:text-white">
              4. Quiz Interaktif & Evaluasi
            </h3>
            <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-2 leading-relaxed">
              Uji pemahamanmu dengan kuis pilihan ganda otomatis dan pembahasan detail per jawaban untuk persiapan UTS & UAS.
            </p>
          </div>
        </div>
      </section>

      {/* Realistic Interactive Preview Teaser */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 my-12">
        <div className="rounded-3xl border border-[#0D7A5F]/30 bg-gradient-to-b from-[#0D7A5F]/10 to-transparent p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#0D7A5F]/20">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D7A5F] dark:text-[#34D399]">
                Format Hasil Terstruktur
              </span>
              <h3 className="font-heading text-xl font-bold text-[#111C19] dark:text-white mt-1">
                Bukan Teks Bebas Berantakan, Tapi Poin & Logika Terpandu
              </h3>
            </div>
            <button
              onClick={() => {
                loginAsDemoStudent();
                onExploreDemo();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D7A5F] text-white hover:bg-[#0B654E] transition"
            >
              Buka Sample Materi
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34]">
              <div className="text-[11px] font-bold text-[#0D7A5F] uppercase">Poin Utama #1</div>
              <h4 className="text-sm font-semibold text-[#111C19] dark:text-white mt-1">
                Fondasi Teori Kuasi-Eksperimen
              </h4>
              <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1.5 line-clamp-3">
                Desain eksperimen tanpa random assignment penuh, sering dipakai di kelas nyata dengan pretest sebagai pengontrol awal...
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34]">
              <div className="text-[11px] font-bold text-amber-600 uppercase">Podcast Preview</div>
              <h4 className="text-sm font-semibold text-[#111C19] dark:text-white mt-1">
                Audio 3:15 Menit Santai
              </h4>
              <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1.5 line-clamp-3">
                &quot;Halo teman-teman! Di episode ini kita bahas trik menghadapi dosen pembimbing saat menggunakan kelompok kontrol alami...&quot;
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34]">
              <div className="text-[11px] font-bold text-indigo-600 uppercase">Quiz Otomatis</div>
              <h4 className="text-sm font-semibold text-[#111C19] dark:text-white mt-1">
                4 Soal Analisis Pilihan Ganda
              </h4>
              <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1.5 line-clamp-3">
                Skor langsung keluar dengan ulasan lengkap mengapa opsi A salah dan opsi B benar untuk persiapan ujian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center max-w-xl mx-auto px-4 pt-8">
        <h3 className="font-heading text-2xl font-bold text-[#111C19] dark:text-white">
          Siap Nilai A Semester Ini?
        </h3>
        <p className="text-xs sm:text-sm text-[#596A65] dark:text-[#94A7A0] mt-2 mb-6">
          Gabung bersama ribuan mahasiswa dari berbagai kampus di Indonesia.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-3.5 rounded-2xl bg-[#0D7A5F] hover:bg-[#0B654E] text-white font-semibold shadow-lg shadow-[#0D7A5F]/30 hover:scale-105 transition-all"
        >
          Daftar Akun StudiRingkas Sekarang
        </button>
      </section>
    </div>
  );
};

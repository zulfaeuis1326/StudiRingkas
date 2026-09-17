import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Mail,
  Lock,
  User,
  GraduationCap,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface AuthPageProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToLanding }) => {
  const { login, register, loginAsDemoStudent, isSupabaseConfigured, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [universitas, setUniversitas] = useState('Universitas Indonesia');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          onSuccess();
        } else {
          setErrorMsg(res.error || 'Email atau password salah');
        }
      } else {
        if (!nama.trim()) {
          setErrorMsg('Silakan masukkan nama lengkap Anda.');
          setSubmitting(false);
          return;
        }
        const res = await register(email, password, nama, universitas);
        if (res.success) {
          onSuccess();
        } else {
          setErrorMsg(res.error || 'Gagal mendaftar');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoStudent();
    onSuccess();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-[#F8FAF9] dark:bg-[#0C1210]">
      <div className="w-full max-w-md">
        {/* Logo and Greeting */}
        <div className="text-center mb-6">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 mb-3 text-left group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#0D7A5F] text-white flex items-center justify-center shadow-md shadow-[#0D7A5F]/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-xl text-[#111C19] dark:text-white">
              StudiRingkas
            </span>
          </button>
          <h2 className="font-heading text-2xl font-bold text-[#111C19] dark:text-white">
            {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Mahasiswa'}
          </h2>
          <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1">
            {mode === 'login'
              ? 'Masuk untuk mengakses ringkasan dan riwayat kuis belajarmu'
              : 'Daftar gratis untuk mulai merangkum materi dan mendengarkan podcast'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-xl p-6 sm:p-8">
          {/* Supabase Notice Banner */}
          <div className="mb-5 p-3 rounded-xl bg-[#0D7A5F]/10 dark:bg-[#0D7A5F]/15 border border-[#0D7A5F]/20 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#0D7A5F] dark:text-[#34D399] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#111C19] dark:text-[#E2E8F0]">
              <span className="font-semibold text-[#0D7A5F] dark:text-[#34D399]">
                {isSupabaseConfigured ? 'Supabase Client Terhubung' : 'Supabase Auth Ready:'}
              </span>{' '}
              {isSupabaseConfigured
                ? 'Autentikasi langsung ke project Supabase Anda.'
                : 'Mendukung login email & password riil, atau gunakan tombol Uji Cepat di bawah.'}
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F0F4F2] dark:bg-[#182723] mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                mode === 'login'
                  ? 'bg-white dark:bg-[#121D1A] text-[#111C19] dark:text-white shadow-sm'
                  : 'text-[#596A65] dark:text-[#94A7A0]'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
                mode === 'register'
                  ? 'bg-white dark:bg-[#121D1A] text-[#111C19] dark:text-white shadow-sm'
                  : 'text-[#596A65] dark:text-[#94A7A0]'
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#111C19] dark:text-white">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#15221F] text-sm text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#111C19] dark:text-white">
                    Asal Kampus / Universitas
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={universitas}
                      onChange={(e) => setUniversitas(e.target.value)}
                      placeholder="Contoh: Universitas Indonesia"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#15221F] text-sm text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#111C19] dark:text-white">
                Email Mahasiswa / Pribadi
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@mahasiswa.ac.id"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#15221F] text-sm text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#111C19] dark:text-white">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#15221F] text-sm text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 rounded-2xl bg-[#0D7A5F] hover:bg-[#0B654E] text-white font-semibold text-sm shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Memproses...' : mode === 'login' ? 'Masuk ke StudiRingkas' : 'Buat Akun Sekarang'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="my-5 relative flex items-center justify-center">
            <div className="border-t border-[#E2E8E5] dark:border-[#253B34] w-full" />
            <span className="bg-white dark:bg-[#121D1A] px-3 text-[11px] text-[#596A65] dark:text-[#94A7A0] absolute uppercase tracking-wider font-semibold">
              Atau Akses Cepat
            </span>
          </div>

          {/* Demo Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-2xl border border-dashed border-[#0D7A5F]/40 hover:border-[#0D7A5F] bg-[#0D7A5F]/5 dark:bg-[#0D7A5F]/10 hover:bg-[#0D7A5F]/15 text-[#0D7A5F] dark:text-[#34D399] text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Masuk Cepat Demo (Budi Santoso - UI)</span>
          </button>
        </div>

        {/* Back button */}
        <div className="text-center mt-5">
          <button
            onClick={onBackToLanding}
            className="text-xs text-[#596A65] dark:text-[#94A7A0] hover:text-[#0D7A5F] transition"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

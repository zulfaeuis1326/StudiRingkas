import React, { useState } from 'react';
import { getApiBaseUrl, setApiBaseUrl, isMockModeEnabled, setMockMode } from '../../lib/api';
import { getSupabaseConfig, updateSupabaseCredentials } from '../../lib/supabase';
import { X, Server, Database, Check, Sliders, AlertCircle, RefreshCw } from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose }) => {
  const [baseUrl, setBaseUrlState] = useState(getApiBaseUrl());
  const [mockEnabled, setMockEnabled] = useState(isMockModeEnabled());
  const supabaseConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig.url.includes('demo-studiringkas') ? '' : supabaseConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(supabaseConfig.anonKey.includes('demo-anon-key') ? '' : supabaseConfig.anonKey);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiBaseUrl(baseUrl);
    setMockMode(mockEnabled);

    if (supabaseUrl && supabaseKey) {
      updateSupabaseCredentials(supabaseUrl, supabaseKey);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleTestBackend = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      if (mockEnabled) {
        await new Promise((r) => setTimeout(r, 400));
        setTestResult({ ok: true, message: 'Mode Mock Aktif: 100% responsif simulasi siap pakai.' });
      } else {
        const url = `${baseUrl.replace(/\/$/, '')}/api/materi`;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (res.ok) {
          setTestResult({ ok: true, message: `Koneksi Berhasil! Backend merespons status ${res.status}.` });
        } else {
          setTestResult({ ok: false, message: `Backend merespons error HTTP ${res.status}: ${res.statusText}` });
        }
      }
    } catch (err: any) {
      setTestResult({ ok: false, message: `Gagal terhubung: ${err.message || 'CORS / Server belum berjalan'}` });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8E5] dark:border-[#253B34]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D7A5F]/10 dark:bg-[#0D7A5F]/20 text-[#0D7A5F] dark:text-[#34D399] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-[#111C19] dark:text-white">
                Konfigurasi Backend API
              </h3>
              <p className="text-xs text-[#596A65] dark:text-[#94A7A0]">
                Sambungkan ke endpoint backend StudiRingkas atau gunakan mode mock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Mode Toggle Banner */}
          <div className="p-4 rounded-xl bg-[#F6F8F7] dark:bg-[#182723] border border-[#E2E8E5] dark:border-[#253B34] flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-[#111C19] dark:text-white">Mode Simulasi / Mock Backend</p>
              <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-0.5">
                Gunakan data dummy realistis bahasa Indonesia jika backend lokal Anda sedang offline
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mockEnabled}
                onChange={(e) => setMockEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D7A5F]"></div>
            </label>
          </div>

          {/* Backend URL Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#596A65] dark:text-[#94A7A0]">
              <div className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#0D7A5F]" />
                <span>Backend Base URL (Opsi API Eksternal)</span>
              </div>
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrlState(e.target.value)}
              placeholder="Contoh: http://localhost:8000 atau https://api.studiringkas.id"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#15221F] text-sm text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D7A5F]"
            />
            <p className="text-[11px] text-[#596A65] dark:text-[#94A7A0]">
              Kosongkan untuk menggunakan origin relatif (misal: /api/materi).
            </p>
          </div>

          {/* Test Connection Button */}
          <div>
            <button
              onClick={handleTestBackend}
              disabled={testingConnection}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-neutral-100 dark:bg-[#1E2D29] hover:bg-neutral-200 dark:hover:bg-[#253B34] text-[#111C19] dark:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
              Uji Koneksi Backend
            </button>

            {testResult && (
              <div
                className={`mt-2 p-3 rounded-lg text-xs flex items-start gap-2 ${
                  testResult.ok
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}
              >
                {testResult.ok ? <Check className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Supabase Config Section */}
          <div className="pt-3 border-t border-[#E2E8E5] dark:border-[#253B34] space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#596A65] dark:text-[#94A7A0]">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#0D7A5F]" />
                <span>Kredensial Supabase Client Auth</span>
              </div>
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#15221F] text-xs text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#0D7A5F]"
              />
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="Supabase Anon Public Key (eyJhbGciOi...)"
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#15221F] text-xs text-[#111C19] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#0D7A5F]"
              />
            </div>
            <p className="text-[11px] text-[#596A65] dark:text-[#94A7A0]">
              Jika belum memiliki project Supabase, Anda dapat langsung login via tombol &quot;Masuk Cepat Demo&quot; di halaman Login.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8E5] dark:border-[#253B34]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[#596A65] dark:text-[#94A7A0] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Tutup
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D7A5F] hover:bg-[#0B654E] text-white text-sm font-semibold shadow-sm transition active:scale-95"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Tersimpan!
              </>
            ) : (
              'Simpan Pengaturan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

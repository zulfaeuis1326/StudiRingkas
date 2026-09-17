import React, { useState, useEffect } from 'react';
import { QuizResponse, QuizSubmitResult, AsyncProcessingStatus } from '../../types';
import { generateQuiz, getQuiz, submitQuizAnswers } from '../../lib/api';
import { AsyncStateIndicator } from '../common/AsyncStateIndicator';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
  AlertCircle,
} from 'lucide-react';

interface QuizViewerProps {
  materiId: string;
  initialQuiz?: QuizResponse;
}

export const QuizViewer: React.FC<QuizViewerProps> = ({ materiId, initialQuiz }) => {
  const [quiz, setQuiz] = useState<QuizResponse | null>(initialQuiz || null);
  const [status, setStatus] = useState<AsyncProcessingStatus>(
    initialQuiz?.status || 'ready'
  );
  const [hasStartedQuiz, setHasStartedQuiz] = useState(Boolean(initialQuiz));
  const [errorMessage, setErrorMessage] = useState('');

  // User Answers: Record<soal_id, 'A' | 'B' | 'C' | 'D'>
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<QuizSubmitResult | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    getQuiz(materiId)
      .then((data) => {
        if (isSubscribed && data) {
          setQuiz(data);
          setStatus(data.status);
          if (data.status === 'processing') {
            setHasStartedQuiz(true);
            pollQuizStatus();
          }
        }
      })
      .catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, [materiId]);

  const pollQuizStatus = () => {
    const interval = setInterval(async () => {
      try {
        const updated = await getQuiz(materiId);
        setQuiz(updated);
        setStatus(updated.status);
        if (updated.status === 'ready' || updated.status === 'failed') {
          clearInterval(interval);
        }
      } catch (err: any) {
        clearInterval(interval);
        setStatus('failed');
        setErrorMessage(err.message || 'Gagal memeriksa status kuis.');
      }
    }, 2500);
  };

  const handleGenerate = async () => {
    setHasStartedQuiz(true);
    setStatus('processing');
    setErrorMessage('');
    try {
      const res = await generateQuiz(materiId);
      setQuiz(res);
      setStatus(res.status);
      if (res.status === 'processing') {
        pollQuizStatus();
      }
    } catch (err: any) {
      setStatus('failed');
      setErrorMessage(err.message || 'Gagal membuat kuis.');
    }
  };

  const handleSelectOption = (soalId: string, kunci: 'A' | 'B' | 'C' | 'D') => {
    if (submitResult) return; // Locked once submitted
    setUserAnswers((prev) => ({
      ...prev,
      [soalId]: kunci,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < quiz.soal_list.length) {
      if (!confirm(`Kamu baru menjawab ${answeredCount} dari ${quiz.soal_list.length} soal. Yakin ingin mengumpulkan sekarang?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        materi_id: materiId,
        jawaban: quiz.soal_list.map((soal) => ({
          soal_id: soal.id,
          jawaban_dipilih: userAnswers[soal.id] || ('A' as const),
        })),
      };

      const result = await submitQuizAnswers(quiz.id, payload);
      setSubmitResult(result);
    } catch (err: any) {
      alert(`Gagal mengirim jawaban: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmitResult(null);
  };

  if (!hasStartedQuiz) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20 dark:border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 flex-shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Evaluasi Pemahaman
            </span>
            <h3 className="font-heading font-bold text-lg text-[#111C19] dark:text-white mt-0.5">
              Buat Quiz Latihan Soal dari Materi Ini
            </h3>
            <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1 max-w-lg">
              AI akan menyusun paket soal pilihan ganda berbobot konseptual beserta pembahasan lengkap per jawaban untuk evaluasi mandiri.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition active:scale-95 flex-shrink-0 w-full sm:w-auto justify-center"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buat Quiz Sekarang</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E5] dark:border-[#253B34]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#111C19] dark:text-white">
              Quiz Evaluasi Mandiri
            </h3>
            <p className="text-xs text-[#596A65] dark:text-[#94A7A0]">
              Endpoint: POST /api/materi/:id/quiz & POST /api/quiz/:id/submit
            </p>
          </div>
        </div>

        {submitResult && (
          <button
            onClick={handleResetQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8E5] dark:border-[#253B34] text-xs font-semibold text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Quiz</span>
          </button>
        )}
      </div>

      <AsyncStateIndicator
        status={status}
        progressPercent={70}
        pesan="AI sedang merumuskan pertanyaan analitis dan kunci pembahasan (POST /api/materi/:id/quiz)..."
        errorMessage={errorMessage}
        onRetry={handleGenerate}
        actionName="Penyusunan Kuis Interaktif"
      >
        {quiz && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h4 className="font-heading font-bold text-lg text-[#111C19] dark:text-white">
                {quiz.judul_quiz}
              </h4>
              <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1">
                Total {quiz.total_soal} soal • Pilih jawaban terbaik lalu klik &quot;Kumpulkan Jawaban&quot;
              </p>
            </div>

            {/* If Submitted: Celebration & Score Banner */}
            {submitResult && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0D7A5F]/15 via-emerald-500/10 to-transparent border border-[#0D7A5F]/30 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#0D7A5F] text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-lg shadow-[#0D7A5F]/25">
                      {submitResult.skor}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0D7A5F] dark:text-[#34D399]">
                          Hasil Evaluasi Belajar
                        </span>
                        <Award className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="text-sm font-semibold text-[#111C19] dark:text-white mt-0.5">
                        {submitResult.feedback}
                      </p>
                      <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-0.5">
                        Benar: {submitResult.jawaban_benar} dari {submitResult.total_soal} soal ({submitResult.persentase}%)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-[#182723] border border-[#E2E8E5] dark:border-[#253B34] text-xs font-semibold text-[#111C19] dark:text-white shadow-sm hover:bg-neutral-50 transition"
                  >
                    Coba Ulang Kuis
                  </button>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
              {quiz.soal_list.map((soal, sIdx) => {
                const pembahasan = submitResult?.pembahasan_detail.find(
                  (p) => p.soal_id === soal.id || p.nomor === soal.nomor
                );
                const userChoice = userAnswers[soal.id];

                return (
                  <div
                    key={soal.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      pembahasan
                        ? pembahasan.is_benar
                          ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10'
                          : 'border-red-300 dark:border-red-900 bg-red-50/20 dark:bg-red-950/10'
                        : 'border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#14221F]'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-[#1E2D29] text-[#111C19] dark:text-white font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {soal.nomor || sIdx + 1}
                      </span>
                      <p className="text-sm font-semibold text-[#111C19] dark:text-white leading-relaxed">
                        {soal.pertanyaan}
                      </p>
                    </div>

                    {/* Options Grid */}
                    <div className="mt-4 space-y-2 pl-9">
                      {soal.pilihan.map((pil) => {
                        const isSelected = userChoice === pil.kunci;
                        const isCorrectAnswer = pembahasan?.jawaban_benar === pil.kunci;
                        const isWrongSelection = submitResult && isSelected && !pembahasan?.is_benar;

                        let optionStyle =
                          'border-[#E2E8E5] dark:border-[#253B34] bg-white dark:bg-[#121D1A] text-[#111C19] dark:text-white hover:border-[#0D7A5F]/50';

                        if (isSelected && !submitResult) {
                          optionStyle =
                            'border-[#0D7A5F] bg-[#0D7A5F]/10 dark:bg-[#0D7A5F]/20 text-[#0D7A5F] dark:text-[#34D399] font-medium';
                        } else if (submitResult) {
                          if (isCorrectAnswer) {
                            optionStyle =
                              'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-semibold';
                          } else if (isWrongSelection) {
                            optionStyle =
                              'border-red-500 bg-red-100/70 dark:bg-red-950/50 text-red-800 dark:text-red-200';
                          } else {
                            optionStyle = 'opacity-50 border-[#E2E8E5] dark:border-[#253B34]';
                          }
                        }

                        return (
                          <button
                            key={pil.kunci}
                            type="button"
                            disabled={Boolean(submitResult)}
                            onClick={() => handleSelectOption(soal.id, pil.kunci)}
                            className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 transition active:scale-[0.99] ${optionStyle}`}
                          >
                            <span className="font-mono font-bold w-4">{pil.kunci}.</span>
                            <span className="flex-1">{pil.teks}</span>
                            {submitResult && isCorrectAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            )}
                            {isWrongSelection && (
                              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Pembahasan Box if submitted */}
                    {pembahasan && (
                      <div className="mt-4 ml-9 p-3.5 rounded-xl bg-neutral-100 dark:bg-[#182723] border border-[#E2E8E5] dark:border-[#253B34] text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#111C19] dark:text-white">
                          <BookOpen className="w-3.5 h-3.5 text-[#0D7A5F]" />
                          <span>Pembahasan Soal #{soal.nomor}:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 ml-1">
                            Kunci Jawaban: {pembahasan.jawaban_benar}
                          </span>
                        </div>
                        <p className="text-[#596A65] dark:text-[#94A7A0] leading-relaxed pt-0.5">
                          {pembahasan.pembahasan}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Submit Action */}
            {!submitResult && (
              <div className="pt-4 flex items-center justify-between border-t border-[#E2E8E5] dark:border-[#253B34]">
                <p className="text-xs text-[#596A65] dark:text-[#94A7A0]">
                  Dijawab: {Object.keys(userAnswers).length} dari {quiz.soal_list.length} soal
                </p>

                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md transition active:scale-95 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Mengoreksi...' : 'Kumpulkan & Lihat Pembahasan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </AsyncStateIndicator>
    </div>
  );
};

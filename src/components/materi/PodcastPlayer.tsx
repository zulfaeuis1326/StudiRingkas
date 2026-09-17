import React, { useState, useRef, useEffect } from 'react';
import { PodcastResponse, AsyncProcessingStatus } from '../../types';
import { generatePodcast, getPodcast } from '../../lib/api';
import { AsyncStateIndicator } from '../common/AsyncStateIndicator';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Headphones,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface PodcastPlayerProps {
  materiId: string;
  initialPodcast?: PodcastResponse;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ materiId, initialPodcast }) => {
  const [podcast, setPodcast] = useState<PodcastResponse | null>(initialPodcast || null);
  const [status, setStatus] = useState<AsyncProcessingStatus>(
    initialPodcast?.status || 'ready'
  );
  const [hasStartedGenerating, setHasStartedGenerating] = useState(
    Boolean(initialPodcast)
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(195); // fallback seconds
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load existing podcast if available
  useEffect(() => {
    let isSubscribed = true;
    getPodcast(materiId)
      .then((data) => {
        if (isSubscribed && data) {
          setPodcast(data);
          setStatus(data.status);
          if (data.status === 'processing') {
            setHasStartedGenerating(true);
            pollPodcastStatus();
          }
        }
      })
      .catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, [materiId]);

  // Polling logic when processing
  const pollPodcastStatus = () => {
    const interval = setInterval(async () => {
      try {
        const updated = await getPodcast(materiId);
        setPodcast(updated);
        setStatus(updated.status);
        if (updated.status === 'ready' || updated.status === 'failed') {
          clearInterval(interval);
        }
      } catch (err: any) {
        clearInterval(interval);
        setStatus('failed');
        setErrorMessage(err.message || 'Gagal memeriksa status audio podcast.');
      }
    }, 2500);
  };

  const handleGenerate = async () => {
    setHasStartedGenerating(true);
    setStatus('processing');
    setErrorMessage('');
    try {
      const res = await generatePodcast(materiId);
      setPodcast(res);
      setStatus(res.status);
      if (res.status === 'processing') {
        pollPodcastStatus();
      }
    } catch (err: any) {
      setStatus('failed');
      setErrorMessage(err.message || 'Gagal membuat podcast.');
    }
  };

  // Audio player controls
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const skipSeconds = (sec: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + sec));
    }
  };

  const changeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!hasStartedGenerating) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 dark:border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Audio Recap Pintar
            </span>
            <h3 className="font-heading font-bold text-lg text-[#111C19] dark:text-white mt-0.5">
              Ubah Ringkasan Ini Jadi Podcast 3 Menit
            </h3>
            <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1 max-w-lg">
              AI akan menyusun skenario dialog santai berbahasa Indonesia. Belajar fleksibel di komuter, kendaraan, atau saat istirahat.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-amber-500/20 transition active:scale-95 flex-shrink-0 w-full sm:w-auto justify-center"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buat Podcast Sekarang</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121D1A] border border-[#E2E8E5] dark:border-[#253B34] shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E5] dark:border-[#253B34]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[#111C19] dark:text-white">
              Podcast Audio Belajar
            </h3>
            <p className="text-xs text-[#596A65] dark:text-[#94A7A0]">
              Disintesis dari poin ringkasan materi (Endpoint: POST /api/materi/:id/podcast)
            </p>
          </div>
        </div>

        {status === 'ready' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Audio Siap
          </span>
        )}
      </div>

      {/* Async State: Processing / Failed / Ready */}
      <AsyncStateIndicator
        status={status}
        progressPercent={65}
        pesan="AI sedang merekam obrolan podcast materi belajar (polling GET /api/materi/:id/podcast)..."
        errorMessage={errorMessage}
        onRetry={handleGenerate}
        actionName="Sintesis Audio Podcast"
      >
        {podcast && (
          <div className="space-y-5">
            {/* Hidden native audio tag */}
            <audio
              ref={audioRef}
              src={podcast.audio_url || 'https://cdn.freesound.org/previews/612/612613_5674468-lq.mp3'}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Episode Title & Description */}
            <div>
              <h4 className="font-heading font-bold text-base text-[#111C19] dark:text-white">
                {podcast.judul_episode}
              </h4>
              <p className="text-xs text-[#596A65] dark:text-[#94A7A0] mt-1">
                {podcast.deskripsi}
              </p>
            </div>

            {/* Animated Waveform Simulation */}
            <div className="h-14 px-4 py-2 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center gap-1 overflow-hidden">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-amber-500 transition-all duration-300 ${
                    isPlaying ? 'animate-audio-bar' : 'opacity-40'
                  }`}
                  style={{
                    height: isPlaying ? undefined : `${20 + ((i * 7) % 65)}%`,
                    animationDelay: `${(i % 8) * 0.15}s`,
                  }}
                />
              ))}
            </div>

            {/* Scrubber Progress Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={duration || 180}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#596A65] dark:text-[#94A7A0]">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {/* Speed Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-[#1E2D29]">
                {[1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => changeRate(rate)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                      playbackRate === rate
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19]'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Main Center Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => skipSeconds(-10)}
                  className="p-2 rounded-xl text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#182723] transition"
                  title="Mundur 10 Detik"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 transition active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                </button>

                <button
                  onClick={() => skipSeconds(10)}
                  className="p-2 rounded-xl text-[#596A65] dark:text-[#94A7A0] hover:text-[#111C19] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#182723] transition"
                  title="Maju 10 Detik"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle Transcript */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showTranscript
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                    : 'border-[#E2E8E5] dark:border-[#253B34] text-[#596A65] dark:text-[#94A7A0]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Transkrip Teks</span>
              </button>
            </div>

            {/* Transcript Drawer */}
            {showTranscript && podcast.transkrip && (
              <div className="mt-4 p-4 rounded-2xl bg-[#F8FAF9] dark:bg-[#162521] border border-[#E2E8E5] dark:border-[#253B34] space-y-3 animate-in fade-in">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Transkrip Audio Skenario
                </span>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {podcast.transkrip.map((t, idx) => (
                    <div key={idx} className="text-xs leading-relaxed">
                      <span className="font-mono text-amber-600 dark:text-amber-400 mr-2 font-semibold">
                        [{t.menit}]
                      </span>
                      <span className="font-bold text-[#111C19] dark:text-white mr-1.5">
                        {t.pembicara}:
                      </span>
                      <span className="text-[#596A65] dark:text-[#94A7A0]">{t.teks}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AsyncStateIndicator>
    </div>
  );
};

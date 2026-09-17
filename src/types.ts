export type MaterialSourceType = 'dokumen' | 'youtube';

export type AsyncProcessingStatus = 'processing' | 'ready' | 'failed';

export interface MateriItem {
  id: string;
  judul: string;
  tipe: MaterialSourceType;
  sumber_url?: string;
  nama_file?: string;
  ukuran_file?: string;
  tanggal_dibuat: string;
  status: AsyncProcessingStatus;
  progress_percent?: number;
  pesan_status?: string;
  kategori?: string;
  estimasi_menit?: number;
  podcast_status?: AsyncProcessingStatus;
  quiz_status?: AsyncProcessingStatus;
}

export interface ProcessingStatusResponse {
  id: string;
  status: AsyncProcessingStatus;
  progress: number; // 0 - 100
  pesan: string; // e.g. "Sedang mengekstrak poin penting..."
  tahap: 'ekstraksi' | 'analisis' | 'pembuatan_ringkasan' | 'selesai' | 'gagal';
  error_message?: string;
}

export interface PoinRingkasan {
  id: string;
  judul_poin: string;
  ringkasan_singkat: string;
  penjelasan_mendalam: string[];
  kata_kunci: string[];
  contoh_kontekstual?: string;
}

export interface RingkasanResponse {
  id: string;
  materi_id: string;
  judul: string;
  tipe: MaterialSourceType;
  ringkasan_eksekutif: string;
  poin_utama: PoinRingkasan[];
  istilah_penting: { istilah: string; definisi: string }[];
  kesimpulan_dan_aksi: string[];
  total_kata_asli?: number;
  total_kata_ringkas?: number;
  efisiensi_baca?: string; // e.g. "Hemat 78% waktu baca"
}

export interface PodcastResponse {
  id: string;
  materi_id: string;
  status: AsyncProcessingStatus;
  audio_url?: string;
  durasi_detik?: number;
  judul_episode: string;
  deskripsi: string;
  transkrip?: { menit: string; pembicara: string; teks: string }[];
  error_message?: string;
}

export interface SoalQuiz {
  id: string;
  nomor: number;
  pertanyaan: string;
  pilihan: {
    kunci: 'A' | 'B' | 'C' | 'D';
    teks: string;
  }[];
}

export interface QuizResponse {
  id: string;
  materi_id: string;
  status: AsyncProcessingStatus;
  judul_quiz: string;
  total_soal: number;
  soal_list: SoalQuiz[];
  error_message?: string;
}

export interface QuizSubmitPayload {
  materi_id: string;
  jawaban: {
    soal_id: string;
    jawaban_dipilih: 'A' | 'B' | 'C' | 'D';
  }[];
}

export interface PembahasanItem {
  soal_id: string;
  nomor: number;
  pertanyaan: string;
  jawaban_benar: 'A' | 'B' | 'C' | 'D';
  jawaban_user: 'A' | 'B' | 'C' | 'D';
  is_benar: boolean;
  pembahasan: string;
}

export interface QuizSubmitResult {
  quiz_id: string;
  materi_id: string;
  skor: number; // 0 - 100
  total_soal: number;
  jawaban_benar: number;
  jawaban_salah: number;
  persentase: number;
  feedback: string;
  pembahasan_detail: PembahasanItem[];
}

export interface UserSession {
  id: string;
  email: string;
  nama_lengkap: string;
  universitas?: string;
  jurusan?: string;
  avatar_url?: string;
}

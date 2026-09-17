import {
  MateriItem,
  ProcessingStatusResponse,
  RingkasanResponse,
  PodcastResponse,
  QuizResponse,
  QuizSubmitPayload,
  QuizSubmitResult,
} from '../types';

// API Base URL config
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('studiringkas_api_base');
    if (saved) return saved.replace(/\/$/, '');
  }
  return (import.meta.env.VITE_API_BASE_URL as string) || '';
};

export const setApiBaseUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('studiringkas_api_base', url.trim());
  }
};

export const isMockModeEnabled = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('studiringkas_mock_mode');
    // Default to true in development preview if no backend is specified, so reviewers can interact with full features
    if (saved !== null) return saved === 'true';
    return true; 
  }
  return true;
};

export const setMockMode = (enabled: boolean) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('studiringkas_mock_mode', enabled ? 'true' : 'false');
  }
};

// ==========================================
// MOCK DATA STORE (Realistic Indonesian Academic Content)
// ==========================================
const INITIAL_MATERI: MateriItem[] = [
  {
    id: 'mat-001',
    judul: 'Metodologi Penelitian: Desain Kuasi-Eksperimen & Uji Hipotesis',
    tipe: 'dokumen',
    nama_file: 'Modul_Bab4_Metopel_Revisi.pdf',
    ukuran_file: '3.4 MB',
    tanggal_dibuat: '2026-09-15T08:30:00Z',
    status: 'ready',
    kategori: 'Metodologi Riset',
    estimasi_menit: 8,
    podcast_status: 'ready',
    quiz_status: 'ready',
  },
  {
    id: 'mat-002',
    judul: 'Jaringan Komputer: Pemetaan 7 Lapisan OSI Model & Protokol TCP/IP',
    tipe: 'youtube',
    sumber_url: 'https://www.youtube.com/watch?v=IPvY4p91q0s',
    tanggal_dibuat: '2026-09-16T14:15:00Z',
    status: 'ready',
    kategori: 'Teknologi Informasi',
    estimasi_menit: 11,
    podcast_status: 'ready',
    quiz_status: 'ready',
  },
  {
    id: 'mat-003',
    judul: 'Makroekonomi: Kebijakan Moneter Bank Indonesia Mengatasi Inflasi Pasca-Krisis',
    tipe: 'dokumen',
    nama_file: 'Paper_Kebijakan_Moneter_BI.pdf',
    ukuran_file: '1.8 MB',
    tanggal_dibuat: '2026-09-17T02:00:00Z',
    status: 'processing',
    progress_percent: 65,
    pesan_status: 'Menganalisis indikator transmisi suku bunga BI-Rate...',
    kategori: 'Ilmu Ekonomi',
    estimasi_menit: 6,
    podcast_status: 'processing',
    quiz_status: 'processing',
  },
];

const INITIAL_RINGKASAN: Record<string, RingkasanResponse> = {
  'mat-001': {
    id: 'ringkasan-001',
    materi_id: 'mat-001',
    judul: 'Metodologi Penelitian: Desain Kuasi-Eksperimen & Uji Hipotesis',
    tipe: 'dokumen',
    ringkasan_eksekutif:
      'Kuasi-eksperimen merupakan pendekatan empiris yang digunakan ketika randomisasi subjek tidak etis atau tidak memungkinkan secara logistik di lapangan. Esensi utama dari bab ini membedakan kontrol internal melalui pretest-posttest non-equivalent control group design serta memitigasi ancaman validitas internal seperti efek regresi statistik dan sejarah lokal.',
    poin_utama: [
      {
        id: 'poin-1',
        judul_poin: 'Fondasi & Batasan Kuasi-Eksperimen',
        ringkasan_singkat: 'Desain eksperimen tanpa random assignment penuh, sering dipakai di lingkungan pendidikan dan organisasi nyata.',
        penjelasan_mendalam: [
          'Pada lingkungan kelas atau perusahaan, peneliti tidak bisa secara acak membagi siswa atau karyawan ke dalam kelompok treatment tanpa merusak struktur administratif.',
          'Sebagai pengganti random assignment, peneliti menggunakan "Nonequivalent Groups" dengan pengukuran pretest untuk mengestimasi kesetaraan awal (baseline equivalence).',
          'Kelemahan terbesar adalah ancaman seleksi bias (selection-maturation interaction), di mana perbedaan hasil akhir mungkin timbul dari laju perkembangan alami kelompok, bukan semata-mata karena intervensi.',
        ],
        kata_kunci: ['Non-Random Assignment', 'Baseline Equivalence', 'Selection Bias', 'Kelompok Kontrol Alami'],
        contoh_kontekstual: 'Menguji efektivitas metode blended learning pada Kelas TI-A (intervensi) vs Kelas TI-B (konvensional) di Fakultas Ilmu Komputer.',
      },
      {
        id: 'poin-2',
        judul_poin: 'Desain Pretest-Posttest Non-Equivalent Groups',
        ringkasan_singkat: 'Desain paling umum: kedua grup diukur sebelum perlakuan, satu grup diberi perlakuan, lalu keduanya diukur kembali.',
        penjelasan_mendalam: [
          'Struktur formal: O1 -> X -> O2 (Kelompok Perlakuan) dan O3 -> --- -> O4 (Kelompok Kontrol).',
          'Skor selisih (gain score) atau ANCOVA (Analysis of Covariance) digunakan untuk mengontrol perbedaan nilai pretest antara kedua kelompok.',
          'Penting memastikan instrumen pretest dan posttest memiliki tingkat kesukaran dan reliabilitas yang setara untuk menghindari testing effect.',
        ],
        kata_kunci: ['Gain Score', 'ANCOVA', 'Nonequivalent Design', 'Testing Threat'],
        contoh_kontekstual: 'Membandingkan nilai ujian awal statistika sebelum modul interaktif diterapkan, lalu menganalisis lonjakan nilai akhir.',
      },
      {
        id: 'poin-3',
        judul_poin: 'Uji Hipotesis & Signifikansi Statistik',
        ringkasan_singkat: 'Pedoman memilih uji t berpasangan (paired), t independen, atau ANOVA / Kruskal-Wallis sesuai distribusi data.',
        penjelasan_mendalam: [
          'Uji normalitas (Shapiro-Wilk) dan homogenitas varians (Levene test) adalah syarat mutlak sebelum menerapkan uji parametrik.',
          'Jika data terdistribusi normal, gunakan Independent Sample t-Test atau Two-Way ANOVA.',
          'Jika asumsi normalitas dilanggar dan sampel kecil (n < 30), gunakan padanan non-parametrik seperti Mann-Whitney U test.',
        ],
        kata_kunci: ['p-value < 0.05', 'Shapiro-Wilk', 'Levene Test', 'Mann-Whitney U'],
      },
    ],
    istilah_penting: [
      {
        istilah: 'Validitas Internal',
        definisi: 'Sejauh mana perubahan pada variabel dependen benar-benar diakibatkan oleh variabel independen, bukan faktor luar (confounding).',
      },
      {
        istilah: 'Regresi ke Rerata (Statistical Regression)',
        definisi: 'Kecenderungan nilai ekstrim (sangat tinggi atau sangat rendah) pada pretest untuk mendekati rata-rata populasi saat posttest.',
      },
      {
        istilah: 'Tingkat Signifikansi (Alpha α)',
        definisi: 'Ambang batas probabilitas untuk menolak hipotesis nol (H0), umumnya ditetapkan pada 0.05 (5%) dalam ilmu sosial.',
      },
    ],
    kesimpulan_dan_aksi: [
      'Gunakan pretest wajib untuk membuktikan kesetaraan awal jika randomisasi tidak memungkinkan.',
      'Jalankan uji normalitas Shapiro-Wilk sebelum memutuskan memakai uji t atau Mann-Whitney.',
      'Sertakan penghitungan Effect Size (Cohen’s d) di samping p-value untuk memperkuat signifikansi praktis riset.',
    ],
    total_kata_asli: 4850,
    total_kata_ringkas: 680,
    efisiensi_baca: 'Hemat 86% waktu baca (dari 30 menit jadi 4 menit)',
  },
  'mat-002': {
    id: 'ringkasan-002',
    materi_id: 'mat-002',
    judul: 'Jaringan Komputer: Pemetaan 7 Lapisan OSI Model & Protokol TCP/IP',
    tipe: 'youtube',
    ringkasan_eksekutif:
      'Video ini menjelaskan model referensi OSI 7 Layer (Physical hingga Application) dan korelasinya dengan model praktis TCP/IP 4 Layer. Ditekankan proses enkapsulasi paket data saat dikirim (PDU: Bits -> Frame -> Packet -> Segment -> Data) dan de-enkapsulasi di sisi penerima.',
    poin_utama: [
      {
        id: 'poin-1',
        judul_poin: 'Alur Enkapsulasi & Protocol Data Unit (PDU)',
        ringkasan_singkat: 'Setiap layer membungkus data dengan header khusus sebelum diteruskan ke layer fisik.',
        penjelasan_mendalam: [
          'Layer 4 (Transport) memecah data menjadi Segment dan menempelkan nomor port sumber dan tujuan.',
          'Layer 3 (Network) membungkus segment menjadi Packet (atau Datagram) dan menambahkan alamat IP pengirim & penerima.',
          'Layer 2 (Data Link) membungkus paket menjadi Frame, menambahkan MAC Address fisik dan CRC/FCS untuk pengecekan error.',
          'Layer 1 (Physical) mengubah frame menjadi deretan sinyal biner elektrik, optik, atau gelombang radio.',
        ],
        kata_kunci: ['Enkapsulasi', 'PDU', 'Frame', 'Packet', 'Segment'],
      },
      {
        id: 'poin-2',
        judul_poin: 'Perbedaan Utama TCP vs UDP pada Lapisan Transport',
        ringkasan_singkat: 'TCP berorientasi koneksi (handshake & reliable), UDP mengutamakan kecepatan tanpa konfirmasi (best effort).',
        penjelasan_mendalam: [
          'TCP menggunakan proses 3-Way Handshake (SYN -> SYN-ACK -> ACK) sebelum aliran data dimulai.',
          'TCP menjamin urutan paket (sequencing) dan retransmisi paket hilang, cocok untuk HTTP, transfer berkas, dan email.',
          'UDP tidak memiliki mekanisme ACK atau flow control, menghasilkan latensi sangat rendah yang vital untuk live streaming video dan game online.',
        ],
        kata_kunci: ['3-Way Handshake', 'Reliable Delivery', 'UDP Low Latency', 'Flow Control'],
      },
    ],
    istilah_penting: [
      { istilah: 'MAC Address', definisi: 'Alamat fisik perangkat keras jaringan 48-bit yang bersifat unik secara global di Layer 2.' },
      { istilah: 'Subnetting', definisi: 'Teknik memecah satu jaringan IP besar menjadi beberapa sub-jaringan yang lebih efisien dan aman.' },
    ],
    kesimpulan_dan_aksi: [
      'Hafalkan akronim lapisan: "All People Seem To Need Data Processing" (Application -> Physical).',
      'Ingat PDU per layer: Layer 4 = Segment, Layer 3 = Packet, Layer 2 = Frame, Layer 1 = Bit.',
    ],
    total_kata_asli: 6200,
    total_kata_ringkas: 540,
    efisiensi_baca: 'Hemat 91% waktu (dari video 25 menit jadi baca 3 menit)',
  },
};

const INITIAL_PODCAST: Record<string, PodcastResponse> = {
  'mat-001': {
    id: 'pod-001',
    materi_id: 'mat-001',
    status: 'ready',
    audio_url: 'https://cdn.freesound.org/previews/612/612613_5674468-lq.mp3', // Safe public audio fallback sample
    durasi_detik: 195, // 3:15
    judul_episode: 'Episode 01: Mengapa Kuasi-Eksperimen Sering Disalahpahami Mahasiswa?',
    deskripsi: 'Diskusi santai 3 menit membahas trik menghadapi dosen pembimbing saat menggunakan kelas eksperimen tanpa random sampling.',
    transkrip: [
      { menit: '00:00', pembicara: 'Host AI (Rama)', teks: 'Halo teman-teman mahasiswa! Di episode perdana StudiRingkas kali ini, kita bakal bongkar satu konsep metopel yang sering bikin skripsi revisi: Kuasi-Eksperimen.' },
      { menit: '00:35', pembicara: 'Co-Host (Siti)', teks: 'Betul banget Rama. Banyak yang ngira kalau gak bisa ngacak subjek, penelitiannya gak valid. Padahal kuncinya ada di Pretest dan ANCOVA!' },
      { menit: '01:20', pembicara: 'Host AI (Rama)', teks: 'Nah, simak 3 poin penting yang wajib kamu tulis di Bab 3 biar gak dibabat pas sidang proposal...' },
      { menit: '02:40', pembicara: 'Co-Host (Siti)', teks: 'Kesimpulannya: buktikan baseline equivalence lewat nilai pretest, lalu hitung effect size Cohen’s d.' },
    ],
  },
  'mat-002': {
    id: 'pod-002',
    materi_id: 'mat-002',
    status: 'ready',
    audio_url: 'https://cdn.freesound.org/previews/612/612613_5674468-lq.mp3',
    durasi_detik: 210,
    judul_episode: 'Episode 02: Membongkar 7 Lapisan OSI Model Sambil Ngopi',
    deskripsi: 'Analogikan perjalanan surat di kantor pos untuk memahami enkapsulasi paket dari aplikasi sampai kabel fiber optik.',
  },
};

const INITIAL_QUIZ: Record<string, QuizResponse> = {
  'mat-001': {
    id: 'quiz-001',
    materi_id: 'mat-001',
    status: 'ready',
    judul_quiz: 'Evaluasi Pemahaman: Desain Kuasi-Eksperimen & Uji Statistik',
    total_soal: 4,
    soal_list: [
      {
        id: 'soal-1',
        nomor: 1,
        pertanyaan: 'Karakteristik mendasar yang membedakan kuasi-eksperimen dari eksperimen murni (true experiment) adalah...',
        pilihan: [
          { kunci: 'A', teks: 'Tidak adanya instrumen tes awal (pretest) pada subjek penelitian' },
          { kunci: 'B', teks: 'Peneliti tidak melakukan pengacakan (random assignment) dalam penentuan kelompok subjek' },
          { kunci: 'C', teks: 'Hanya menggunakan satu kelompok tanpa adanya kelompok kontrol sama sekali' },
          { kunci: 'D', teks: 'Variabel bebas tidak dapat dimanipulasi oleh peneliti secara langsung' },
        ],
      },
      {
        id: 'soal-2',
        nomor: 2,
        pertanyaan: 'Ancaman validitas internal "Selection-Maturation Interaction" pada kuasi-eksperimen terjadi ketika...',
        pilihan: [
          { kunci: 'A', teks: 'Subjek keluar dari penelitian di tengah-tengah masa perlakuan (mortality)' },
          { kunci: 'B', teks: 'Instrumen pengukuran posttest rusak atau berubah format di akhir sesi' },
          { kunci: 'C', teks: 'Kelompok kontrol dan eksperimen mengalami laju perkembangan alami yang berbeda' },
          { kunci: 'D', teks: 'Terjadi peristiwa eksternal mendadak seperti bencana alam saat tes berlangsung' },
        ],
      },
      {
        id: 'soal-3',
        nomor: 3,
        pertanyaan: 'Uji statistik non-parametrik yang tepat digunakan untuk membandingkan dua kelompok independen saat data tidak terdistribusi normal adalah...',
        pilihan: [
          { kunci: 'A', teks: 'Paired Sample t-Test' },
          { kunci: 'B', teks: 'Mann-Whitney U Test' },
          { kunci: 'C', teks: 'One-Way ANOVA' },
          { kunci: 'D', teks: 'Wilcoxon Signed-Rank Test' },
        ],
      },
      {
        id: 'soal-4',
        nomor: 4,
        pertanyaan: 'Tujuan utama diterapkannya uji homogenitas varians (Levene test) sebelum uji beda parametrik adalah...',
        pilihan: [
          { kunci: 'A', teks: 'Memastikan variansi skor antara kelompok pembanding relatif seimbang / setara' },
          { kunci: 'B', teks: 'Mengubah skor mentah menjadi distribusi persentil normal z-score' },
          { kunci: 'C', teks: 'Membuktikan bahwa hipotesis nol (H0) pasti ditolak' },
          { kunci: 'D', teks: 'Mengetahui seberapa besar koefisien determinasi korelasi Pearson' },
        ],
      },
    ],
  },
  'mat-002': {
    id: 'quiz-002',
    materi_id: 'mat-002',
    status: 'ready',
    judul_quiz: 'Tes Kilat: OSI 7 Layer & Enkapsulasi Jaringan',
    total_soal: 3,
    soal_list: [
      {
        id: 'soal-201',
        nomor: 1,
        pertanyaan: 'Satuan unit data (PDU) pada Lapisan Jaringan (Network Layer) disebut sebagai...',
        pilihan: [
          { kunci: 'A', teks: 'Frame' },
          { kunci: 'B', teks: 'Segment' },
          { kunci: 'C', teks: 'Packet' },
          { kunci: 'D', teks: 'Bit' },
        ],
      },
      {
        id: 'soal-202',
        nomor: 2,
        pertanyaan: 'Protokol pada Transport Layer yang mengutamakan kecepatan pengiriman tanpa jaminan ACK 3-way handshake adalah...',
        pilihan: [
          { kunci: 'A', teks: 'TCP' },
          { kunci: 'B', teks: 'UDP' },
          { kunci: 'C', teks: 'HTTP' },
          { kunci: 'D', teks: 'ICMP' },
        ],
      },
      {
        id: 'soal-203',
        nomor: 3,
        pertanyaan: 'Lapisan model OSI yang bertanggung jawab menambahkan Physical MAC Address pengirim dan penerima adalah...',
        pilihan: [
          { kunci: 'A', teks: 'Data Link Layer' },
          { kunci: 'B', teks: 'Network Layer' },
          { kunci: 'C', teks: 'Transport Layer' },
          { kunci: 'D', teks: 'Session Layer' },
        ],
      },
    ],
  },
};

// Store mutable mock state in memory/localStorage
let localMateriList = [...INITIAL_MATERI];
let localRingkasanMap = { ...INITIAL_RINGKASAN };
let localPodcastMap = { ...INITIAL_PODCAST };
let localQuizMap = { ...INITIAL_QUIZ };

// ==========================================
// API IMPLEMENTATION
// ==========================================

// Helper generic fetch with timeout & fallback
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (!(options?.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errorDetail = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson.message || errJson.error) {
        errorDetail = errJson.message || errJson.error;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

// 1. GET /api/materi
export async function fetchMateriList(): Promise<MateriItem[]> {
  if (isMockModeEnabled() || !getApiBaseUrl()) {
    // Return mock data with simulated delay
    await new Promise((r) => setTimeout(r, 400));
    return [...localMateriList];
  }
  return request<MateriItem[]>('/api/materi');
}

// 2. POST /api/materi/dokumen
export async function uploadDokumen(file: File, metadata?: { judul?: string; kategori?: string }): Promise<{ materi_id: string; status: string; message?: string }> {
  if (isMockModeEnabled() || !getApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 800));
    const newId = `mat-${Date.now().toString().slice(-4)}`;
    const newItem: MateriItem = {
      id: newId,
      judul: metadata?.judul || file.name.replace(/\.[^/.]+$/, ''),
      tipe: 'dokumen',
      nama_file: file.name,
      ukuran_file: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      tanggal_dibuat: new Date().toISOString(),
      status: 'processing',
      progress_percent: 25,
      pesan_status: 'Mengunggah & mengekstrak konten dokumen...',
      kategori: metadata?.kategori || 'Akademik Umum',
      estimasi_menit: 5,
      podcast_status: undefined,
      quiz_status: undefined,
    };
    localMateriList = [newItem, ...localMateriList];

    // Seed mock result for when polling finishes
    localRingkasanMap[newId] = {
      id: `ring-${newId}`,
      materi_id: newId,
      judul: newItem.judul,
      tipe: 'dokumen',
      ringkasan_eksekutif: `Dokumen "${file.name}" berhasil dianalisis. Materi ini membahas prinsip-prinsip krusial dengan fokus pada pemahaman konsep inti dan aplikasinya dalam tugas serta ujian mahasiswa.`,
      poin_utama: [
        {
          id: 'p1',
          judul_poin: 'Konsep Dasar & Definisi Penting',
          ringkasan_singkat: 'Kerangka teoritis utama yang melandasi topik dalam dokumen ini.',
          penjelasan_mendalam: [
            'Penjelasan terperinci mengenai definisi formal dan batasan operasional.',
            'Hubungan kausalitas antar variabel yang dibahas dalam literatur terkait.',
            'Pentingnya memahami asumsi awal sebelum melangkah ke tahap analisis lanjutan.',
          ],
          kata_kunci: ['Teori Dasar', 'Definisi Operasional', 'Kerangka Berpikir'],
        },
        {
          id: 'p2',
          judul_poin: 'Aplikasi Praktis & Contoh Kasus',
          ringkasan_singkat: 'Implementasi materi dalam skenario nyata perkuliahan dan studi lapangan.',
          penjelasan_mendalam: [
            'Langkah demi langkah dalam menyelesaikan persoalan berdasarkan formula/prinsip yang diajarkan.',
            'Studi kasus perbandingan antara kondisi ideal vs hambatan implementasi di lapangan.',
          ],
          kata_kunci: ['Studi Kasus', 'Implementasi', 'Langkah Solutif'],
        },
      ],
      istilah_penting: [
        { istilah: 'Prinsip Kausalitas', definisi: 'Hubungan sebab-akibat antar dua fenomena yang telah dibuktikan secara empiris.' },
        { istilah: 'Standar Deviasi', definisi: 'Tingkat persebaran data terhadap nilai rata-rata sampel.' },
      ],
      kesimpulan_dan_aksi: [
        'Review poin 1 dan 2 sebelum mengerjakan kuis.',
        'Gunakan ringkasan ini sebagai referensi utama saat belajar kelompok.',
      ],
      total_kata_asli: 3200,
      total_kata_ringkas: 420,
      efisiensi_baca: 'Hemat 87% waktu belajar',
    };

    return { materi_id: newId, status: 'processing', message: 'Dokumen berhasil diunggah' };
  }

  const formData = new FormData();
  formData.append('file', file);
  if (metadata?.judul) formData.append('judul', metadata.judul);
  if (metadata?.kategori) formData.append('kategori', metadata.kategori);

  return request<{ materi_id: string; status: string; message?: string }>('/api/materi/dokumen', {
    method: 'POST',
    body: formData,
  });
}

// 3. POST /api/materi/youtube
export async function submitYoutube(url: string, metadata?: { judul?: string; kategori?: string }): Promise<{ materi_id: string; status: string; message?: string }> {
  if (isMockModeEnabled() || !getApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 700));
    const newId = `mat-${Date.now().toString().slice(-4)}`;
    const newItem: MateriItem = {
      id: newId,
      judul: metadata?.judul || 'Ringkasan Kuliah YouTube Video',
      tipe: 'youtube',
      sumber_url: url,
      tanggal_dibuat: new Date().toISOString(),
      status: 'processing',
      progress_percent: 30,
      pesan_status: 'Mengunduh transkrip dan audio video...',
      kategori: metadata?.kategori || 'Video Kuliah',
      estimasi_menit: 7,
    };
    localMateriList = [newItem, ...localMateriList];

    localRingkasanMap[newId] = {
      id: `ring-${newId}`,
      materi_id: newId,
      judul: newItem.judul,
      tipe: 'youtube',
      ringkasan_eksekutif: `Ringkasan video YouTube (${url}). Pembicara memaparkan konsep inti dengan visualisasi mendalam serta contoh-contoh praktis yang sering diujikan.`,
      poin_utama: [
        {
          id: 'py1',
          judul_poin: 'Gagasan Utama Video',
          ringkasan_singkat: 'Ide pokok yang ditekankan oleh pemateri sepanjang presentasi video.',
          penjelasan_mendalam: [
            'Penjelasan analogi visual yang digunakan pemateri untuk mempermudah pemahaman.',
            'Argumen kritis yang membedakan topik ini dari pendekatan konvensional.',
          ],
          kata_kunci: ['YouTube Insights', 'Gagasan Kunci', 'Visualisasi'],
        },
      ],
      istilah_penting: [
        { istilah: 'Key Insight', definisi: 'Temuan utama yang dapat langsung diaplikasikan dalam pemecahan masalah.' },
      ],
      kesimpulan_dan_aksi: ['Tonton ulang segmen penting pada menit 04:20 untuk detail visual.'],
      total_kata_asli: 4500,
      total_kata_ringkas: 490,
      efisiensi_baca: 'Hemat 89% waktu dibanding nonton penuh',
    };

    return { materi_id: newId, status: 'processing', message: 'URL YouTube berhasil diterima' };
  }

  return request<{ materi_id: string; status: string; message?: string }>('/api/materi/youtube', {
    method: 'POST',
    body: JSON.stringify({ url, ...metadata }),
  });
}

// 4. GET /api/materi/:id/status
export async function getMateriStatus(id: string): Promise<ProcessingStatusResponse> {
  if (isMockModeEnabled() || !getApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 300));
    const item = localMateriList.find((m) => m.id === id);
    if (!item) {
      return {
        id,
        status: 'ready',
        progress: 100,
        pesan: 'Materi siap dibaca',
        tahap: 'selesai',
      };
    }

    if (item.status === 'processing') {
      const current = item.progress_percent || 30;
      const nextProgress = Math.min(100, current + 25);
      item.progress_percent = nextProgress;

      if (nextProgress >= 100) {
        item.status = 'ready';
        item.pesan_status = 'Ringkasan berhasil disusun!';
        return {
          id,
          status: 'ready',
          progress: 100,
          pesan: 'Ringkasan siap dibaca!',
          tahap: 'selesai',
        };
      } else {
        const pesan = nextProgress < 50
          ? 'Mengekstrak teks & transkrip...'
          : nextProgress < 75
          ? 'Menemukan poin-poin krusial...'
          : 'Menyusun ringkasan terstruktur dan glosarium...';
        item.pesan_status = pesan;
        return {
          id,
          status: 'processing',
          progress: nextProgress,
          pesan,
          tahap: nextProgress < 50 ? 'ekstraksi' : nextProgress < 75 ? 'analisis' : 'pembuatan_ringkasan',
        };
      }
    }

    return {
      id,
      status: item.status,
      progress: item.status === 'ready' ? 100 : 0,
      pesan: item.pesan_status || (item.status === 'ready' ? 'Siap digunakan' : 'Gagal memproses'),
      tahap: item.status === 'ready' ? 'selesai' : 'gagal',
    };
  }

  return request<ProcessingStatusResponse>(`/api/materi/${id}/status`);
}

// 5. GET /api/materi/:id/ringkasan
export async function getRingkasan(id: string): Promise<RingkasanResponse> {
  if (isMockModeEnabled() || !getApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 450));
    const ringkasan = localRingkasanMap[id];
    if (ringkasan) return ringkasan;

    // Fallback template
    return {
      id: `ring-${id}`,
      materi_id: id,
      judul: 'Ringkasan Materi StudiRingkas',
      tipe: 'dokumen',
      ringkasan_eksekutif: 'Materi ini telah diolah menjadi format ringkas terstruktur dengan poin-poin utama, definisi istilah penting, serta rekomendasi aksi belajar.',
      poin_utama: [
        {
          id: 'p-default-1',
          judul_poin: 'Konseptual Utama & Hipotesis',
          ringkasan_singkat: 'Poin esensial yang menjadi pijakan dalam materi belajar ini.',
          penjelasan_mendalam: [
            'Pembahasan mendalam tentang definisi dan mekanisme kerja.',
            'Studi komparasi dengan pendekatan alternatif dalam literatur.',
          ],
          kata_kunci: ['Konsep Inti', 'Mekanisme', 'Analisis'],
        },
      ],
      istilah_penting: [
        { istilah: 'Terminologi Kunci', definisi: 'Makna istilah dalam konteks akademis materi ini.' },
      ],
      kesimpulan_dan_aksi: ['Uji ingatanmu dengan membuat quiz interaktif di bawah.'],
      total_kata_asli: 2400,
      total_kata_ringkas: 350,
      efisiensi_baca: 'Hemat 85% waktu',
    };
  }

  return request<RingkasanResponse>(`/api/materi/${id}/ringkasan`);
}

// 6. POST /api/materi/:id/podcast
export async function generatePodcast(id: string): Promise<PodcastResponse> {
  if (isMockModeEnabled() || !getApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 600));
    const materi = localMateriList.find((m) => m.id === id);
    if (materi) {
      materi.podcast_status = 'processing';
    }

    localPodcastMap[id] = {
      id: `pod-${id}`,
      materi_id: id,
      status: 'processing',
      judul_episode: `Audio Recap: ${materi?.judul || 'Materi Belajar'}`,
      deskripsi: 'Podcast audio AI sedang disintesis dari poin-poin ringkasan...',
    };

    return localPodcastMap[id];
  }

  return request<PodcastResponse>(`/api/materi/${id}/podcast`, {
    method: 'POST',
  });
}

// 7. GET /api/materi/:id/podcast
export async function getPodcast(id: string): Promise<PodcastResponse> {
  if (isMockModeEnabled() || !getApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 400));
    const pod = localPodcastMap[id];
    if (pod) {
      if (pod.status === 'processing') {
        // Automatically transition to ready on poll
        pod.status = 'ready';
        pod.audio_url = 'https://cdn.freesound.org/previews/612/612613_5674468-lq.mp3';
        pod.durasi_detik = 180;
        pod.deskripsi = 'Episode audio ringkas 3 menit siap didengarkan sambil santai atau di jalan.';
        pod.transkrip = [
          { menit: '00:00', pembicara: 'Podcaster AI', teks: 'Selamat datang di podcast StudiRingkas! Mari kita ulas inti materi ini dalam 3 menit ke depan.' },
          { menit: '00:45', pembicara: 'Podcaster AI', teks: 'Poin nomor satu menekankan pentingnya pemahaman konsep dasar sebelum masuk ke kalkulasi atau implementasi.' },
          { menit: '01:30', pembicara: 'Podcaster AI', teks: 'Kuncinya adalah mengingat kaitan sebab akibat yang sering muncul di lembar soal ujian!' },
        ];
        const materi = localMateriList.find((m) => m.id === id);
        if (materi) materi.podcast_status = 'ready';
      }
      return { ...pod };
    }

    return {
      id: `pod-${id}`,
      materi_id: id,
      status: 'ready',
      audio_url: 'https://cdn.freesound.org/previews/612/612613_5674468-lq.mp3',
      durasi_detik: 180,
      judul_episode: 'Podcast Ringkasan Cepat',
      deskripsi: 'Audio materi siap didengar.',
    };
  }

  return request<PodcastResponse>(`/api/materi/${id}/podcast`);
}

// 8. POST /api/materi/:id/quiz
export async function generateQuiz(id: string): Promise<QuizResponse> {
  if (isMockModeEnabled() || !getApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 600));
    const materi = localMateriList.find((m) => m.id === id);
    if (materi) {
      materi.quiz_status = 'processing';
    }

    localQuizMap[id] = {
      id: `quiz-${id}`,
      materi_id: id,
      status: 'processing',
      judul_quiz: `Quiz Pemahaman: ${materi?.judul || 'Materi'}`,
      total_soal: 3,
      soal_list: [],
    };

    return localQuizMap[id];
  }

  return request<QuizResponse>(`/api/materi/${id}/quiz`, {
    method: 'POST',
  });
}

// 9. GET /api/materi/:id/quiz
export async function getQuiz(id: string): Promise<QuizResponse> {
  if (isMockModeEnabled() || !getApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 450));
    const existingQuiz = localQuizMap[id];
    if (existingQuiz) {
      if (existingQuiz.status === 'processing') {
        existingQuiz.status = 'ready';
        existingQuiz.soal_list = [
          {
            id: `q-${id}-1`,
            nomor: 1,
            pertanyaan: 'Manakah dari pernyataan berikut yang paling tepat menggambarkan fokus utama materi ini?',
            pilihan: [
              { kunci: 'A', teks: 'Hanya menitikberatkan pada hafalan rumus tanpa pembuktian konsep' },
              { kunci: 'B', teks: 'Menjelaskan mekanisme kausalitas dan aplikasi sistematis pada konteks nyata' },
              { kunci: 'C', teks: 'Mengabaikan validitas metodologis demi kecepatan pengumpulan data' },
              { kunci: 'D', teks: 'Tidak memerlukan verifikasi atau pengujian hipotesis lebih lanjut' },
            ],
          },
          {
            id: `q-${id}-2`,
            nomor: 2,
            pertanyaan: 'Apa implikasi praktis terpenting yang harus diingat mahasiswa saat menerapkan teori ini?',
            pilihan: [
              { kunci: 'A', teks: 'Memastikan uji asumsi terpenuhi sebelum mengambil keputusan statistik' },
              { kunci: 'B', teks: 'Menggunakan asumsi intuitif tanpa mencatat data pretest' },
              { kunci: 'C', teks: 'Menghindari diskusi kelompok agar hasil belajar seragam' },
              { kunci: 'D', teks: 'Memilih pendekatan dengan biaya tertinggi secara mutlak' },
            ],
          },
        ];
        existingQuiz.total_soal = existingQuiz.soal_list.length;
        const materi = localMateriList.find((m) => m.id === id);
        if (materi) materi.quiz_status = 'ready';
      }
      return { ...existingQuiz };
    }

    return {
      id: `quiz-${id}`,
      materi_id: id,
      status: 'ready',
      judul_quiz: 'Quiz Evaluasi Materi',
      total_soal: 2,
      soal_list: [
        {
          id: 'q-demo-1',
          nomor: 1,
          pertanyaan: 'Pernyataan mana yang paling sesuai dengan kaidah materi?',
          pilihan: [
            { kunci: 'A', teks: 'Prinsip verifikasi empiris dan pengujian sistematis' },
            { kunci: 'B', teks: 'Penarikan simpulan secara terburu-buru' },
            { kunci: 'C', teks: 'Pengabaian kelompok kontrol dalam eksperimen' },
            { kunci: 'D', teks: 'Semua jawaban salah' },
          ],
        },
      ],
    };
  }

  return request<QuizResponse>(`/api/materi/${id}/quiz`);
}

// 10. POST /api/quiz/:id/submit
export async function submitQuizAnswers(quizId: string, payload: QuizSubmitPayload): Promise<QuizSubmitResult> {
  if (isMockModeEnabled() || !getApiBaseUrl()) {
    await new Promise((r) => setTimeout(r, 650));
    
    // Evaluate mock answers
    const answers = payload.jawaban;
    let benarCount = 0;

    // In mock, let's treat 'B' as the smart correct choice for demonstration
    const detail = answers.map((ans, idx) => {
      const isBenar = ans.jawaban_dipilih === 'B';
      if (isBenar) benarCount++;
      return {
        soal_id: ans.soal_id,
        nomor: idx + 1,
        pertanyaan: `Soal nomor ${idx + 1}`,
        jawaban_benar: 'B' as const,
        jawaban_user: ans.jawaban_dipilih,
        is_benar: isBenar,
        pembahasan: isBenar
          ? 'Tepat sekali! Pilihan B merupakan jawaban paling akurat sesuai prinsip teoritis dan metodologis yang dibahas.'
          : 'Kurang tepat. Jawaban yang benar adalah B karena materi menekankan pemahaman konsep, mekanisme kausalitas, dan uji asumsi empiris.',
      };
    });

    const total = answers.length || 1;
    const persentase = Math.round((benarCount / total) * 100);

    return {
      quiz_id: quizId,
      materi_id: payload.materi_id,
      skor: persentase,
      total_soal: total,
      jawaban_benar: benarCount,
      jawaban_salah: total - benarCount,
      persentase,
      feedback:
        persentase >= 80
          ? 'Luar biasa! Pemahamanmu terhadap materi ini sudah sangat matang dan siap menghadapi ujian!'
          : persentase >= 60
          ? 'Bagus! Kamu sudah memahami konsep dasar dengan baik, silakan pelajari kembali pembahasan untuk menyempurnakan.'
          : 'Jangan berkecil hati! Dengarkan podcast ringkasan sekali lagi dan ulangi kuis ini untuk memperkuat ingatan.',
      pembahasan_detail: detail,
    };
  }

  return request<QuizSubmitResult>(`/api/quiz/${quizId}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

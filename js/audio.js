/**
 * PEPAK DIGITAL - AUDIO SYNTHESIZER & SPEECH ENGINE
 * Menggunakan Web Audio API untuk efek suara gamelan tradisional (Pelog/Slendro)
 * dan Web Speech API untuk pelafalan Bahasa Jawa yang interaktif.
 */

class PepakAudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.synth = window.speechSynthesis || null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleSound(enabled) {
    this.soundEnabled = enabled;
    return this.soundEnabled;
  }

  // --- 1. GAMELAN CHIME (BENAR / SUCCESS) ---
  playSuccess() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Frekuensi Slendro: Slendro barang/nem/lima (Emas gamelan nada laras)
    const notes = [554.37, 659.25, 830.61, 1108.73]; // C#5, E5, G#5, C#6

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Campuran Sine & Triangle untuk kesan metalik perunggu gamelan (Bonang / Gender)
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.85);
    });
  }

  // --- 2. KENTRUNG / THUD (SALAH / INCORRECT) ---
  playError() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // --- 3. GONG AGUNG (LEVEL SELESAI / CELEBRATION) ---
  playGongFanfare() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Gong nada rendah bergaung dalam
    const baseFreq = 110; // A2 Gong Ageng
    const overtones = [baseFreq, baseFreq * 1.5, baseFreq * 2.02, baseFreq * 2.76];

    overtones.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);

      const amp = idx === 0 ? 0.4 : 0.15;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    });

    // Bonang melodi pembuka setelah gong
    setTimeout(() => {
      this.playSuccess();
    }, 200);
  }

  // --- 4. KLIK KAYU WAYANG (BUTTON CLICK) ---
  playClick() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  // --- 5. TEXT TO SPEECH (PELAFALAN BAHASA JAWA) ---
  speakText(text, rate = 0.88, pitch = 1.0) {
    if (!this.speechEnabled || !this.synth) return;

    // Batalkan ucapan sebelumnya jika masih berjalan
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID"; // Standard Indonesian/Javanese accent
    utterance.rate = rate;     // Sedikit lebih santai agar artikulasi Krama Alus jelas
    utterance.pitch = pitch;

    // Cari voice Indonesia jika tersedia di browser pengguna
    const voices = this.synth.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith("id") || v.lang.startsWith("jv"));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    this.synth.speak(utterance);
  }
}

// Inisialisasi global audio instance
window.audioEngine = new PepakAudioEngine();

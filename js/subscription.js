/**
 * PEPAK DIGITAL — SUBSCRIPTION ENGINE v1
 * ════════════════════════════════════════════════════════════════════════
 * Mengatur sistem 4 tier langganan, token/nyawa harian, masa aktif, dan
 * pembatasan fitur berdasarkan tier.
 *
 * ⚠️  Token & masa aktif disimpan di Supabase (pepak_subscriptions) agar
 *     konsisten lintas device. Fallback ke localStorage jika offline.
 *
 * Tabel Supabase yang dibutuhkan → lihat supabase-setup.sql (bagian baru).
 *
 * Tier & kuota:
 *   free    → 7  token/hari, unit 1-5
 *   monthly → 15 token/hari, unit 1-10
 *   semi    → 25 token/hari, unit 1-20
 *   yearly  → 35 token/hari, unit 1-20 + early access + refill
 *   school  → 35 token/hari, unit 1-20 (setara yearly)
 * ════════════════════════════════════════════════════════════════════════
 */

/* ── Konfigurasi tier ─────────────────────────────────────────────────── */
const TIER_CONFIG = {
  free:    { tokens: 7,  maxUnits: 5,  videoPro: 0,  cert: false, refill: false, badge: null },
  monthly: { tokens: 15, maxUnits: 10, videoPro: 10, cert: false, refill: false, badge: null },
  semi:    { tokens: 25, maxUnits: 20, videoPro: 30, cert: true,  refill: false, badge: 'madya' },
  yearly:  { tokens: 35, maxUnits: 20, videoPro: 30, cert: true,  refill: true,  badge: 'emas' },
  school:  { tokens: 35, maxUnits: 20, videoPro: 30, cert: true,  refill: true,  badge: 'emas' }
};

/* ── Supabase helpers (dari auth.js) ──────────────────────────────────── */
const SB_SUB_TABLE = (typeof SUPABASE_URL !== 'undefined')
  ? SUPABASE_URL + '/rest/v1/pepak_subscriptions'
  : null;

async function _subGet(url) {
  if (!SB_SUB_TABLE || typeof SB_HEADERS === 'undefined') return null;
  try {
    const r = await fetch(url, { headers: SB_HEADERS });
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}
async function _subPatch(url, body) {
  if (!SB_SUB_TABLE || typeof SB_HEADERS === 'undefined') return null;
  try {
    const r = await fetch(url, {
      method: 'PATCH',
      headers: { ...SB_HEADERS, 'Prefer': 'return=representation' },
      body: JSON.stringify(body)
    });
    const t = await r.text();
    return t ? JSON.parse(t) : null;
  } catch { return null; }
}
async function _subUpsert(body) {
  if (!SB_SUB_TABLE || typeof SB_HEADERS === 'undefined') return null;
  try {
    const r = await fetch(SB_SUB_TABLE, {
      method: 'POST',
      headers: { ...SB_HEADERS, 'Prefer': 'return=representation,resolution=merge-duplicates' },
      body: JSON.stringify(body)
    });
    const t = await r.text();
    return t ? JSON.parse(t) : null;
  } catch { return null; }
}

/* ════════════════════════════════════════════════════════════════════════
   KELAS UTAMA
════════════════════════════════════════════════════════════════════════ */
class PepakSubscription {

  constructor() {
    this.LOCAL_KEY = 'pepak_sub_local_v1';
    this._cache    = null;
  }

  /* ── Ambil data subscription dari Supabase atau localStorage ─────────── */
  async _loadSub() {
    const userId = window.pepakAuth?.getSession()?.id;

    if (userId && SB_SUB_TABLE) {
      const rows = await _subGet(
        `${SB_SUB_TABLE}?user_id=eq.${userId}&select=*&limit=1`
      );
      if (rows && rows.length > 0) {
        this._cache = rows[0];
        return this._cache;
      }
    }

    /* Fallback localStorage */
    try {
      const local = JSON.parse(localStorage.getItem(this.LOCAL_KEY) || 'null');
      if (local) { this._cache = local; return local; }
    } catch {}

    /* Default: tier gratis */
    const def = this._defaultSub(userId);
    this._cache = def;
    return def;
  }

  _defaultSub(userId) {
    return {
      user_id:          userId || 'guest',
      tier:             'free',
      tokens_remaining: 7,
      tokens_reset_at:  this._nextResetTime(),
      expires_at:       null,
      refill_used_today: false,
      refill_reset_at:  this._nextResetTime()
    };
  }

  _nextResetTime() {
    /* Reset pukul 00:00 hari berikutnya WIB (UTC+7) */
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 0);
    return next.toISOString();
  }

  /* ── Simpan ke Supabase + localStorage ───────────────────────────────── */
  async _saveSub(data) {
    this._cache = data;
    try { localStorage.setItem(this.LOCAL_KEY, JSON.stringify(data)); } catch {}

    if (data.user_id && data.user_id !== 'guest' && SB_SUB_TABLE) {
      await _subUpsert(data);
    }
  }

  /* ── Cek & reset token jika sudah lewat waktu reset ──────────────────── */
  async _checkReset(sub) {
    const now = new Date();
    const resetAt = sub.tokens_reset_at ? new Date(sub.tokens_reset_at) : new Date(0);

    if (now >= resetAt) {
      const cfg = TIER_CONFIG[sub.tier] || TIER_CONFIG.free;
      sub.tokens_remaining  = cfg.tokens;
      sub.tokens_reset_at   = this._nextResetTime();
      sub.refill_used_today = false;
      sub.refill_reset_at   = this._nextResetTime();
      await this._saveSub(sub);
    }
    return sub;
  }

  /* ── Cek apakah langganan sudah kadaluarsa ───────────────────────────── */
  async _checkExpiry(sub) {
    if (!sub.expires_at || sub.tier === 'free') return sub;

    const now = new Date();
    const exp = new Date(sub.expires_at);
    if (now > exp) {
      /* Turunkan ke free */
      sub.tier             = 'free';
      sub.expires_at       = null;
      sub.tokens_remaining = TIER_CONFIG.free.tokens;
      sub.tokens_reset_at  = this._nextResetTime();
      await this._saveSub(sub);

      /* Update pepakState juga */
      if (window.pepakState) {
        window.pepakState.state.subscription = {
          planId:        'free',
          planName:      'Ksatria Pemula (Gratis)',
          status:        'expired',
          expiresAt:     null
        };
        window.pepakState.saveState();
      }

      this._showExpiryToast();
    }
    return sub;
  }

  _showExpiryToast() {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);
      background:#1A0F08;border:1.5px solid #FF9E00;color:#F0E6D2;
      font-size:0.88rem;font-weight:600;padding:0.9rem 1.5rem;
      border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,0.7);
      z-index:9998;max-width:90vw;text-align:center;`;
    el.innerHTML = `⏰ Masa aktif langganan Anda telah berakhir.<br>
      <button onclick="window.app?.navigateTo('pricing');this.parentElement.remove();"
        style="margin-top:0.5rem;background:rgba(212,166,76,0.2);border:1px solid #D4A64C;
        color:#D4A64C;padding:0.35rem 1rem;border-radius:8px;cursor:pointer;font-weight:700;">
        Perpanjang Sekarang
      </button>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }

  /* ════════════════════════════════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════════════════════════════════ */

  /** Inisialisasi — panggil setelah login berhasil */
  async init() {
    let sub = await this._loadSub();
    sub = await this._checkExpiry(sub);
    sub = await this._checkReset(sub);
    this._patchPepakState(sub);
    this._updateTokenHUD(sub);
    return sub;
  }

  /** Kurangi 1 token saat jawab soal salah (menggantikan loseHeart) */
  async useToken() {
    let sub = this._cache || await this._loadSub();
    sub = await this._checkReset(sub);

    if (sub.tokens_remaining <= 0) {
      this._showTokenEmptyPopup(sub);
      return false;
    }

    sub.tokens_remaining = Math.max(0, sub.tokens_remaining - 1);
    await this._saveSub(sub);
    this._updateTokenHUD(sub);

    if (sub.tokens_remaining === 0) {
      this._showTokenEmptyPopup(sub);
    }

    return true;
  }

  /** Refill darurat (1× per hari, hanya tier yearly/school) */
  async emergencyRefill() {
    let sub = this._cache || await this._loadSub();
    const cfg = TIER_CONFIG[sub.tier] || TIER_CONFIG.free;

    if (!cfg.refill) {
      window.paymentEngine?.showPaywall('Refill Darurat (Eksklusif Ksatria Maharesi Emas)');
      return false;
    }

    const now = new Date();
    const refillReset = sub.refill_reset_at ? new Date(sub.refill_reset_at) : new Date(0);
    if (now < refillReset && sub.refill_used_today) {
      alert('Refill darurat sudah digunakan hari ini. Tersedia lagi besok.');
      return false;
    }

    sub.tokens_remaining  = Math.min(cfg.tokens, sub.tokens_remaining + 10);
    sub.refill_used_today = true;
    sub.refill_reset_at   = this._nextResetTime();
    await this._saveSub(sub);
    this._updateTokenHUD(sub);
    return true;
  }

  /** Apakah bisa akses unit tertentu? */
  canAccessUnit(unitNumber) {
    const sub = this._cache;
    if (!sub) return unitNumber <= 5;
    const cfg = TIER_CONFIG[sub.tier] || TIER_CONFIG.free;
    return unitNumber <= cfg.maxUnits;
  }

  /** Apakah bisa akses video PRO ke-n? */
  canAccessProVideo(videoIndex) {
    const sub = this._cache;
    if (!sub) return false;
    const cfg = TIER_CONFIG[sub.tier] || TIER_CONFIG.free;
    return videoIndex < cfg.videoPro;
  }

  /** Apakah bisa download sertifikat? */
  canGetCertificate() {
    const sub = this._cache;
    if (!sub) return false;
    return (TIER_CONFIG[sub.tier] || TIER_CONFIG.free).cert;
  }

  /** Ambil tier saat ini */
  getTier() { return this._cache?.tier || 'free'; }

  /** Ambil sisa token hari ini */
  getTokensRemaining() { return this._cache?.tokens_remaining ?? 7; }

  /** Aktivasi langganan berbayar setelah pembayaran berhasil */
  async activatePlan(planId, userName, userEmail) {
    const userId = window.pepakAuth?.getSession()?.id;
    const cfg    = TIER_CONFIG[planId] || TIER_CONFIG.free;

    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 hari

    const newSub = {
      user_id:           userId || 'guest',
      tier:              planId,
      tokens_remaining:  cfg.tokens,
      tokens_reset_at:   this._nextResetTime(),
      expires_at:        planId === 'free' ? null : expires.toISOString(),
      refill_used_today: false,
      refill_reset_at:   this._nextResetTime()
    };

    await this._saveSub(newSub);
    this._patchPepakState(newSub);
    this._updateTokenHUD(newSub);
    return newSub;
  }

  /* ── Sinkronisasi ke pepakState ───────────────────────────────────────── */
  _patchPepakState(sub) {
    if (!window.pepakState) return;
    const cfg = TIER_CONFIG[sub.tier] || TIER_CONFIG.free;
    const plan = window.PEPAK_DATA?.subscriptionPlans.find(p => p.id === sub.tier);

    /* Override isPremiumUser berdasarkan tier */
    window.pepakState.isPremiumUser = () => sub.tier !== 'free';

    /* Override loseHeart dengan useToken */
    window.pepakState.loseHeart = async () => {
      const ok = await window.pepakSubscription.useToken();
      return ok ? sub.tokens_remaining : 0;
    };

    /* Sync max hearts di HUD */
    window.pepakState.state.user.hearts    = sub.tokens_remaining;
    window.pepakState.state.user.maxHearts = cfg.tokens;

    if (plan) {
      window.pepakState.state.subscription = {
        planId:        sub.tier,
        planName:      plan.name,
        status:        'active',
        startDate:     new Date().toISOString().split('T')[0],
        expiresAt:     sub.expires_at ? sub.expires_at.split('T')[0] : null,
        autoRenew:     false,
        priceFormatted: plan.priceFormatted
      };
    }
  }

  /* ── Update HUD token di navbar ──────────────────────────────────────── */
  _updateTokenHUD(sub) {
    const cfg = TIER_CONFIG[sub.tier] || TIER_CONFIG.free;
    document.querySelectorAll('.hud-hearts-val').forEach(el => {
      el.textContent = `${sub.tokens_remaining}/${cfg.tokens}`;
    });

    /* Warna merah jika token <= 2 */
    document.querySelectorAll('.hud-pill.hearts').forEach(el => {
      el.style.color = sub.tokens_remaining <= 2 ? '#E63946' : '#FF4D6D';
    });

    /* Hitung waktu reset */
    if (sub.tokens_reset_at) {
      const resetAt  = new Date(sub.tokens_reset_at);
      const now      = new Date();
      const diffMs   = resetAt - now;
      const diffHrs  = Math.max(0, Math.floor(diffMs / 3600000));
      const diffMins = Math.max(0, Math.floor((diffMs % 3600000) / 60000));

      if (diffMs > 0) {
        document.querySelectorAll('.hud-token-reset').forEach(el => {
          el.textContent = `Reset: ${diffHrs}j ${diffMins}m`;
        });
      }
    }
  }

  /* ── Popup token habis ───────────────────────────────────────────────── */
  _showTokenEmptyPopup(sub) {
    /* Tutup quiz terlebih dahulu */
    const resetAt = sub.tokens_reset_at ? new Date(sub.tokens_reset_at) : new Date();
    const now     = new Date();
    const hours   = Math.max(1, Math.ceil((resetAt - now) / 3600000));

    document.getElementById('token-empty-popup')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'token-empty-popup';
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.82);
      backdrop-filter:blur(8px);z-index:9001;
      display:flex;align-items:center;justify-content:center;padding:1rem;`;

    const cfg = TIER_CONFIG[sub.tier] || TIER_CONFIG.free;
    const canRefill = cfg.refill && !sub.refill_used_today;

    overlay.innerHTML = `
      <div style="background:linear-gradient(160deg,#2A1B10,#1A0F08);
        border:1.5px solid rgba(230,57,70,0.45);border-radius:20px;
        max-width:420px;width:100%;padding:2rem;text-align:center;
        box-shadow:0 30px 70px rgba(0,0,0,0.88);">

        <div style="font-size:2.8rem;margin-bottom:0.8rem;">🗡️</div>
        <h3 style="font-family:'Cinzel',serif;font-size:1.3rem;color:#E63946;margin-bottom:0.5rem;">
          Token Harian Habis!
        </h3>
        <p style="color:#C8B89E;font-size:0.9rem;margin-bottom:1.4rem;line-height:1.55;">
          Token ${cfg.tokens}/hari Anda sudah habis.<br>
          Reset otomatis dalam <strong style="color:#FF9E00;">±${hours} jam</strong>,<br>
          atau upgrade paket untuk token lebih banyak.
        </p>

        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${canRefill ? `
          <button onclick="window.pepakSubscription.emergencyRefill().then(()=>document.getElementById('token-empty-popup')?.remove())"
            style="background:rgba(46,196,182,0.15);border:1px solid rgba(46,196,182,0.4);
            color:#2EC4B6;font-weight:700;padding:0.75rem;border-radius:10px;cursor:pointer;">
            🔄 Gunakan Refill Darurat (1× Hari Ini)
          </button>` : ''}
          <button onclick="window.app?.navigateTo('pricing');document.getElementById('token-empty-popup')?.remove();"
            style="background:linear-gradient(135deg,#F3E7C4,#D4A64C);color:#1A0F08;
            font-weight:800;padding:0.75rem;border:none;border-radius:10px;cursor:pointer;">
            👑 Upgrade Paket — Token Lebih Banyak
          </button>
          <button onclick="document.getElementById('token-empty-popup')?.remove();window.app?.navigateTo('home');"
            style="background:transparent;border:1px solid rgba(212,166,76,0.25);
            color:#8E7A68;padding:0.6rem;border-radius:10px;cursor:pointer;font-size:0.85rem;">
            Tunggu Reset Besok (${hours} jam lagi)
          </button>
        </div>
      </div>`;

    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  }

  /* ── Tampilkan sisa hari langganan di profil ─────────────────────────── */
  getRemainingDaysText() {
    const sub = this._cache;
    if (!sub || !sub.expires_at || sub.tier === 'free') return null;

    const now  = new Date();
    const exp  = new Date(sub.expires_at);
    const days = Math.max(0, Math.ceil((exp - now) / 86400000));

    if (days <= 3) return `⚠️ Sisa ${days} hari — Segera perpanjang!`;
    return `Masa aktif: ${days} hari lagi (hingga ${exp.toLocaleDateString('id-ID')})`;
  }
}

/* ── Inisialisasi global ─────────────────────────────────────────────── */
window.pepakSubscription = new PepakSubscription();

/* Auto-init setelah login berhasil — hook ke auth-ui */
document.addEventListener('DOMContentLoaded', () => {
  /* Subscribe ke perubahan sesi */
  window.pepakAuth?.subscribe(async (sess) => {
    if (sess) {
      await window.pepakSubscription.init();
      window.app?.updateStatsHUD?.();
    }
  });

  /* Jika sudah ada sesi saat halaman dibuka */
  if (window.pepakAuth?.getSession()) {
    window.pepakSubscription.init().then(() => {
      window.app?.updateStatsHUD?.();
    });
  }
});

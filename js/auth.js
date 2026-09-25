/**
 * PEPAK DIGITAL — AUTH ENGINE v3 (SUPABASE)
 * ═══════════════════════════════════════════════════════════════════════
 * Data akun tersimpan di Supabase (PostgreSQL) — terpusat, lintas device.
 * Sesi login tetap di sessionStorage browser (bukan localStorage) agar
 * otomatis berakhir saat browser ditutup.
 *
 * Konfigurasi:
 *   SUPABASE_URL  → Project URL dari Settings → API
 *   SUPABASE_KEY  → anon/public key dari Settings → API
 * ═══════════════════════════════════════════════════════════════════════
 */

/* ── KONFIGURASI SUPABASE ─────────────────────────────────────────────── */
const SUPABASE_URL = 'https://qchypfwhrqtlvnhyceqq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zZsg6B61LxmmgcRkIpBJqg_D3omSvU5';
const SB_HEADERS   = {
  'Content-Type':  'application/json',
  'apikey':        SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY
};
const SB_TABLE     = SUPABASE_URL + '/rest/v1/pepak_users';
const SB_RPC       = SUPABASE_URL + '/rest/v1/rpc/pepak_needs_bootstrap';

/* ── HELPERS HTTP ─────────────────────────────────────────────────────── */
async function sbGet(url) {
  const r = await fetch(url, { headers: SB_HEADERS });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function sbPost(url, body) {
  const r = await fetch(url, {
    method: 'POST', headers: { ...SB_HEADERS, 'Prefer': 'return=representation' },
    body: JSON.stringify(body)
  });
  const text = await r.text();
  if (!r.ok) throw new Error(text);
  return text ? JSON.parse(text) : null;
}
async function sbPatch(url, body) {
  const r = await fetch(url, {
    method: 'PATCH', headers: { ...SB_HEADERS, 'Prefer': 'return=representation' },
    body: JSON.stringify(body)
  });
  const text = await r.text();
  if (!r.ok) throw new Error(text);
  return text ? JSON.parse(text) : null;
}
async function sbDelete(url) {
  const r = await fetch(url, { method: 'DELETE', headers: SB_HEADERS });
  if (!r.ok) throw new Error(await r.text());
  return true;
}

/* ════════════════════════════════════════════════════════════════════════
   KELAS AUTH UTAMA
════════════════════════════════════════════════════════════════════════ */
class PepakAuth {
  constructor() {
    this.SESSION_KEY = 'pepak_session_v3';
    this.listeners   = [];
    this._ready      = false;
    this._bootstrap  = false; // cache hasil needsBootstrap
  }

  /* ── SESSION (sessionStorage — hilang saat browser ditutup) ─────────── */
  getSession() {
    try { return JSON.parse(sessionStorage.getItem(this.SESSION_KEY) || 'null'); }
    catch { return null; }
  }
  _saveSession(session) {
    if (session) sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    else         sessionStorage.removeItem(this.SESSION_KEY);
    this.listeners.forEach(fn => fn(session));
  }

  isLoggedIn() { return !!this.getSession(); }
  getRole()    { return this.getSession()?.role || 'tamu'; }
  isAdmin()    { return this.getRole() === 'admin'; }
  isGuru()     { return this.getRole() === 'guru' || this.isAdmin(); }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  /* ── BOOTSTRAP CHECK ────────────────────────────────────────────────── */
  /**
   * Cek apakah sistem belum punya admin approved.
   * Menggunakan fungsi RPC Supabase pepak_needs_bootstrap().
   * @returns {Promise<boolean>}
   */
  async needsBootstrap() {
    try {
      const r = await fetch(SB_RPC, {
        method: 'POST',
        headers: { ...SB_HEADERS, 'Content-Type': 'application/json' },
        body: '{}'
      });
      if (!r.ok) {
        /* Jika fungsi RPC belum dibuat, fallback: cek manual */
        const users = await sbGet(`${SB_TABLE}?role=eq.admin&status=eq.approved&select=id&limit=1`);
        return users.length === 0;
      }
      return await r.json();
    } catch(e) {
      console.warn('[Auth] needsBootstrap error:', e.message);
      /* Fallback: anggap tidak perlu bootstrap jika gagal cek */
      return false;
    }
  }

  /* ── BOOTSTRAP SUPER ADMIN ──────────────────────────────────────────── */
  /**
   * Buat admin pertama — langsung approved tanpa persetujuan.
   * @returns {Promise<{ok, error?}>}
   */
  async bootstrapSuperAdmin(name, email, password) {
    if (!name || !email || !password) return { ok: false, error: 'Semua kolom wajib diisi.' };
    if (password.length < 8)          return { ok: false, error: 'Kata sandi minimal 8 karakter.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Format email tidak valid.' };

    /* Pastikan masih perlu bootstrap */
    const needs = await this.needsBootstrap();
    if (!needs) return { ok: false, error: 'Super Admin sudah ada.' };

    try {
      /* Cek duplikat email */
      const existing = await sbGet(`${SB_TABLE}?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&select=id&limit=1`);
      if (existing.length > 0) return { ok: false, error: 'Email sudah terdaftar.' };

      await sbPost(SB_TABLE, {
        name:        name.trim(),
        email:       email.trim().toLowerCase(),
        password,
        role:        'admin',
        status:      'approved',
        avatar:      '🛡️',
        approved_at: new Date().toISOString(),
        approved_by: null
      });
      return { ok: true };
    } catch(e) {
      console.error('[Auth] bootstrapSuperAdmin:', e);
      return { ok: false, error: 'Gagal membuat akun: ' + e.message };
    }
  }

  /* ── REGISTRASI ─────────────────────────────────────────────────────── */
  /**
   * Daftar akun baru.
   * Siswa → status approved (langsung aktif)
   * Guru  → status pending (tunggu admin)
   * @returns {Promise<{ok, error?, pendingApproval?, session?}>}
   */
  async register(name, email, password, role) {
    if (!name || !email || !password) return { ok: false, error: 'Semua kolom wajib diisi.' };
    if (!['siswa','guru'].includes(role)) return { ok: false, error: 'Role tidak valid.' };
    if (role === 'admin') return { ok: false, error: 'Pendaftaran akun Admin ditutup. Hubungi Super Admin.' };
    if (password.length < 6)          return { ok: false, error: 'Kata sandi minimal 6 karakter.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Format email tidak valid.' };

    try {
      /* Cek duplikat */
      const existing = await sbGet(`${SB_TABLE}?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&select=id&limit=1`);
      if (existing.length > 0) return { ok: false, error: 'Email sudah terdaftar. Silakan login.' };

      const avatarMap = { siswa:'🎒', guru:'👨‍🏫' };
      const newAcc = {
        name:     name.trim(),
        email:    email.trim().toLowerCase(),
        password,
        role,
        status:   role === 'siswa' ? 'approved' : 'pending',
        avatar:   avatarMap[role]
      };

      await sbPost(SB_TABLE, newAcc);

      if (role !== 'siswa') {
        return { ok: true, pendingApproval: true, role, name: name.trim() };
      }

      /* Siswa langsung login */
      return this.login(email.trim(), password);

    } catch(e) {
      console.error('[Auth] register:', e);
      return { ok: false, error: 'Pendaftaran gagal: ' + e.message };
    }
  }

  /* ── LOGIN ──────────────────────────────────────────────────────────── */
  /**
   * @returns {Promise<{ok, error?, pendingApproval?, rejected?, session?}>}
   */
  async login(email, password) {
    try {
      const rows = await sbGet(
        `${SB_TABLE}?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&select=*&limit=1`
      );

      if (!rows || rows.length === 0) {
        return { ok: false, error: 'Email atau kata sandi salah.' };
      }

      const acc = rows[0];

      if (acc.password !== password) {
        return { ok: false, error: 'Email atau kata sandi salah.' };
      }

      /* Cek status */
      if (acc.status === 'pending') {
        return {
          ok: false, pendingApproval: true,
          error: `Akun ${acc.role === 'guru' ? 'Guru' : 'Admin'} Anda masih menunggu ` +
                 `persetujuan Admin. Silakan coba login kembali setelah mendapat konfirmasi.`
        };
      }
      if (acc.status === 'rejected') {
        return {
          ok: false, rejected: true,
          error: 'Pendaftaran Anda telah ditolak. Silakan hubungi Admin untuk informasi lebih lanjut.'
        };
      }
      if (acc.status !== 'approved') {
        return { ok: false, error: 'Status akun tidak valid. Hubungi Admin.' };
      }

      const session = {
        id: acc.id, name: acc.name, email: acc.email,
        role: acc.role, avatar: acc.avatar,
        loginAt: new Date().toISOString()
      };

      this._saveSession(session);

      if (window.pepakState) {
        window.pepakState.state.user.name   = acc.name;
        window.pepakState.state.user.email  = acc.email;
        window.pepakState.state.user.role   = acc.role;
        window.pepakState.state.user.avatar = acc.avatar;
        window.pepakState.saveState();
      }

      return { ok: true, session };

    } catch(e) {
      console.error('[Auth] login:', e);
      return { ok: false, error: 'Gagal menghubungi server: ' + e.message };
    }
  }

  /* ── LOGOUT ─────────────────────────────────────────────────────────── */
  logout() {
    this._saveSession(null);
    if (window.pepakState) {
      const def = window.pepakState.getDefaultState();
      window.pepakState.state.user.name  = def.user.name;
      window.pepakState.state.user.email = def.user.email;
      window.pepakState.state.user.role  = 'tamu';
      window.pepakState.saveState();
    }
  }

  /* ── GANTI PASSWORD ─────────────────────────────────────────────────── */
  async changePassword(oldPassword, newPassword) {
    const session = this.getSession();
    if (!session) return { ok: false, error: 'Sesi tidak ditemukan.' };

    try {
      const rows = await sbGet(`${SB_TABLE}?id=eq.${session.id}&select=password&limit=1`);
      if (!rows?.length) return { ok: false, error: 'Akun tidak ditemukan.' };
      if (rows[0].password !== oldPassword) return { ok: false, error: 'Kata sandi lama tidak sesuai.' };
      if (newPassword.length < 6) return { ok: false, error: 'Kata sandi baru minimal 6 karakter.' };

      await sbPatch(`${SB_TABLE}?id=eq.${session.id}`, { password: newPassword });
      return { ok: true };
    } catch(e) {
      return { ok: false, error: 'Gagal: ' + e.message };
    }
  }

  /* ════════════════════════════════════════════════════════════════════
     ADMIN API
  ════════════════════════════════════════════════════════════════════ */

  async getAllAccounts() {
    if (!this.isAdmin()) return [];
    try {
      return await sbGet(`${SB_TABLE}?status=eq.approved&select=id,name,email,role,avatar,created_at&order=created_at.asc`);
    } catch(e) { console.error(e); return []; }
  }

  async getPendingAccounts() {
    if (!this.isAdmin()) return [];
    try {
      return await sbGet(`${SB_TABLE}?status=eq.pending&select=id,name,email,role,created_at&order=created_at.asc`);
    } catch(e) { console.error(e); return []; }
  }

  async getRejectedAccounts() {
    if (!this.isAdmin()) return [];
    try {
      return await sbGet(`${SB_TABLE}?status=eq.rejected&select=id,name,email,role,created_at&order=created_at.desc&limit=20`);
    } catch(e) { console.error(e); return []; }
  }

  async getPendingCount() {
    if (!this.isAdmin()) return 0;
    try {
      const r = await fetch(`${SB_TABLE}?status=eq.pending&select=id`, {
        headers: { ...SB_HEADERS, 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' }
      });
      const count = r.headers.get('Content-Range')?.split('/')[1];
      return parseInt(count || '0');
    } catch(e) { return 0; }
  }

  async approveAccount(accountId) {
    if (!this.isAdmin()) return { ok: false, error: 'Tidak diizinkan.' };
    try {
      await sbPatch(`${SB_TABLE}?id=eq.${accountId}`, {
        status:      'approved',
        approved_at: new Date().toISOString(),
        approved_by: this.getSession()?.id
      });
      return { ok: true };
    } catch(e) { return { ok: false, error: e.message }; }
  }

  async rejectAccount(accountId) {
    if (!this.isAdmin()) return { ok: false, error: 'Tidak diizinkan.' };
    try {
      await sbPatch(`${SB_TABLE}?id=eq.${accountId}`, {
        status:      'rejected',
        rejected_at: new Date().toISOString()
      });
      return { ok: true };
    } catch(e) { return { ok: false, error: e.message }; }
  }

  async deleteAccount(accountId) {
    if (!this.isAdmin()) return false;
    if (accountId === this.getSession()?.id) return false;
    try {
      await sbDelete(`${SB_TABLE}?id=eq.${accountId}`);
      return true;
    } catch(e) { return false; }
  }

  async updateRole(accountId, newRole) {
    if (!this.isAdmin()) return false;
    try {
      await sbPatch(`${SB_TABLE}?id=eq.${accountId}`, { role: newRole });
      return true;
    } catch(e) { return false; }
  }
}

window.pepakAuth = new PepakAuth();

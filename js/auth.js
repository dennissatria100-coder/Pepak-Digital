/**
 * PEPAK DIGITAL — AUTH ENGINE v2 (DENGAN APPROVAL SYSTEM)
 * ═══════════════════════════════════════════════════════════════════════
 * Sistem autentikasi frontend-only menggunakan localStorage.
 *
 * ⚠️  CATATAN PENTING UNTUK PRODUKSI:
 *     localStorage TIDAK aman untuk menyimpan password & status approval
 *     di lingkungan produksi multi-perangkat. Upgrade ke backend nyata
 *     (Node.js/Express + database, Firebase Auth, Supabase, dll) sebelum
 *     deploy ke pengguna sungguhan.
 *
 * Alur per role:
 *   Siswa  → daftar → langsung aktif → bisa login
 *   Guru   → daftar → status "pending" → TUNGGU persetujuan admin → aktif
 *   Admin  → daftar → status "pending" → TUNGGU persetujuan super admin
 *
 * Super Admin pertama:
 *   Jika BELUM ada akun admin approved di sistem, halaman login menampilkan
 *   form bootstrap khusus (hanya muncul sekali) untuk membuat admin pertama.
 *   Admin pertama langsung approved tanpa perlu persetujuan karena tidak ada
 *   admin lain yang bisa menyetujui.
 * ═══════════════════════════════════════════════════════════════════════
 */

class PepakAuth {
  constructor() {
    this.ACCOUNTS_KEY = 'pepak_accounts_v2';
    this.SESSION_KEY  = 'pepak_session_v2';
    this.listeners    = [];

    /* Migrasi otomatis dari v1 ke v2 jika v2 masih kosong */
    this._migrateFromV1();
  }

  /* ── MIGRASI V1 → V2 ────────────────────────────────────────────────── */
  _migrateFromV1() {
    try {
      /* Jika v2 sudah ada isi, tidak perlu migrasi */
      const v2 = JSON.parse(localStorage.getItem(this.ACCOUNTS_KEY) || '[]');
      if (v2.length > 0) return;

      /* Coba ambil dari v1 */
      const v1 = JSON.parse(localStorage.getItem('pepak_accounts_v1') || '[]');
      if (v1.length === 0) return;

      /* Tambahkan field status jika belum ada */
      const migrated = v1.map(acc => ({
        ...acc,
        status:     acc.status || 'approved', /* akun v1 dianggap sudah approved */
        approvedAt: acc.approvedAt || acc.createdAt || new Date().toISOString().split('T')[0],
        approvedBy: acc.approvedBy || 'migration-v1'
      }));

      localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(migrated));
      console.log(`[Auth] Migrasi ${migrated.length} akun dari v1 → v2 berhasil.`);

      /* Migrasi sesi v1 juga jika ada */
      const sessV1 = localStorage.getItem('pepak_session_v1');
      if (sessV1 && !localStorage.getItem(this.SESSION_KEY)) {
        localStorage.setItem(this.SESSION_KEY, sessV1);
      }
    } catch(e) {
      console.warn('[Auth] Migrasi v1→v2 gagal:', e);
    }
  }

  /* ── STORAGE HELPERS ────────────────────────────────────────────────── */
  _loadAccounts() {
    try { return JSON.parse(localStorage.getItem(this.ACCOUNTS_KEY) || '[]'); }
    catch { return []; }
  }

  _saveAccounts(list) {
    localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(list));
  }

  _loadSession() {
    try { return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null'); }
    catch { return null; }
  }

  _saveSession(session) {
    if (session) localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    else         localStorage.removeItem(this.SESSION_KEY);
    this.listeners.forEach(fn => fn(session));
  }

  /* ── PUBLIC SESSION API ─────────────────────────────────────────────── */
  getSession()  { return this._loadSession(); }
  isLoggedIn()  { return !!this._loadSession(); }
  getRole()     { return this._loadSession()?.role || 'tamu'; }
  isAdmin()     { return this.getRole() === 'admin'; }
  isGuru()      { return this.getRole() === 'guru' || this.isAdmin(); }

  /* ── BOOTSTRAP CHECK ────────────────────────────────────────────────── */
  /**
   * Kembalikan true jika sistem belum memiliki satupun admin yang approved.
   * Dipakai untuk memunculkan form bootstrap Super Admin pertama.
   */
  needsBootstrap() {
    const accounts = this._loadAccounts();
    return !accounts.some(a => a.role === 'admin' && a.status === 'approved');
  }

  /**
   * Buat Super Admin pertama — hanya bisa dipanggil saat needsBootstrap() = true.
   * Admin pertama langsung approved (tidak perlu persetujuan karena tidak ada admin lain).
   */
  bootstrapSuperAdmin(name, email, password) {
    if (!this.needsBootstrap()) {
      return { ok: false, error: 'Super Admin sudah ada. Gunakan form daftar biasa.' };
    }
    if (!name || !email || !password) {
      return { ok: false, error: 'Semua kolom wajib diisi.' };
    }
    if (password.length < 8) {
      return { ok: false, error: 'Kata sandi minimal 8 karakter.' };
    }

    const accounts = this._loadAccounts();
    if (accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: 'Email sudah terdaftar.' };
    }

    const admin = {
      id:        'acc-' + Date.now(),
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      password,                         // ⚠️ plain text — ganti hash di produksi
      role:      'admin',
      status:    'approved',            // langsung aktif
      avatar:    '🛡️',
      createdAt: new Date().toISOString().split('T')[0],
      approvedAt: new Date().toISOString().split('T')[0],
      approvedBy: 'system-bootstrap'
    };

    accounts.push(admin);
    this._saveAccounts(accounts);
    return { ok: true };
  }

  /* ── REGISTRASI ─────────────────────────────────────────────────────── */
  /**
   * Daftar akun baru.
   * Siswa → status 'approved' (langsung aktif)
   * Guru  → status 'pending'  (tunggu persetujuan admin)
   * Admin (via form publik) → status 'pending' (tunggu super admin)
   *
   * @returns { ok, error?, pendingApproval? }
   */
  register(name, email, password, role) {
    if (!name || !email || !password) {
      return { ok: false, error: 'Semua kolom wajib diisi.' };
    }
    if (!['siswa', 'guru'].includes(role)) {
      return { ok: false, error: 'Role tidak valid.' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'Kata sandi minimal 6 karakter.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: 'Format email tidak valid.' };
    }

    const accounts = this._loadAccounts();
    if (accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: 'Email sudah terdaftar. Silakan login.' };
    }

    const avatarMap = { siswa: '🎒', guru: '👨‍🏫' };
    const newAcc = {
      id:        'acc-' + Date.now(),
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      password,                         // ⚠️ plain text — ganti hash di produksi
      role,
      status:    role === 'siswa' ? 'approved' : 'pending',
      avatar:    avatarMap[role],
      createdAt: new Date().toISOString().split('T')[0],
      approvedAt: null,
      approvedBy: null
    };

    accounts.push(newAcc);
    this._saveAccounts(accounts);

    if (role === 'siswa') {
      /* Siswa langsung login */
      return this.login(email.trim(), password);
    } else {
      /* Guru → pending, kembalikan flag khusus */
      return { ok: true, pendingApproval: true, role, name: newAcc.name };
    }
  }

  /* ── LOGIN ──────────────────────────────────────────────────────────── */
  /**
   * Login dengan email + password.
   * Memvalidasi status akun sebelum mengizinkan masuk.
   *
   * @returns { ok, error?, session?, pendingApproval?, rejected? }
   */
  login(email, password) {
    const accounts = this._loadAccounts();
    const acc = accounts.find(
      a => a.email.toLowerCase() === email.trim().toLowerCase()
        && a.password === password
    );

    if (!acc) {
      return { ok: false, error: 'Email atau kata sandi salah.' };
    }

    /* Cek status akun */
    if (acc.status === 'pending') {
      const roleLabel = acc.role === 'guru' ? 'Guru' : 'Admin';
      return {
        ok: false,
        pendingApproval: true,
        error: `Akun ${roleLabel} Anda masih menunggu persetujuan Admin. ` +
               `Anda akan dapat login setelah akun disetujui.`
      };
    }

    if (acc.status === 'rejected') {
      return {
        ok: false,
        rejected: true,
        error: 'Pendaftaran Anda telah ditolak oleh Admin. ' +
               'Silakan hubungi Admin untuk informasi lebih lanjut.'
      };
    }

    if (acc.status !== 'approved') {
      return { ok: false, error: 'Status akun tidak valid. Hubungi Admin.' };
    }

    const session = {
      id:      acc.id,
      name:    acc.name,
      email:   acc.email,
      role:    acc.role,
      avatar:  acc.avatar,
      loginAt: new Date().toISOString()
    };

    this._saveSession(session);

    /* Sinkron ke pepakState */
    if (window.pepakState) {
      window.pepakState.state.user.name   = acc.name;
      window.pepakState.state.user.email  = acc.email;
      window.pepakState.state.user.role   = acc.role;
      window.pepakState.state.user.avatar = acc.avatar;
      window.pepakState.saveState();
    }

    return { ok: true, session };
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

  /* ── SUBSCRIBE ──────────────────────────────────────────────────────── */
  subscribe(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  /* ══════════════════════════════════════════════════════════════════════
     ADMIN API
  ══════════════════════════════════════════════════════════════════════ */

  /** Semua akun approved (untuk tabel pengguna) */
  getAllAccounts() {
    if (!this.isAdmin()) return [];
    return this._loadAccounts()
      .filter(a => a.status === 'approved')
      .map(a => ({
        id: a.id, name: a.name, email: a.email,
        role: a.role, avatar: a.avatar, createdAt: a.createdAt
      }));
  }

  /** Semua akun pending (untuk panel persetujuan) */
  getPendingAccounts() {
    if (!this.isAdmin()) return [];
    return this._loadAccounts()
      .filter(a => a.status === 'pending')
      .map(a => ({
        id: a.id, name: a.name, email: a.email,
        role: a.role, createdAt: a.createdAt
      }));
  }

  /** Semua akun rejected */
  getRejectedAccounts() {
    if (!this.isAdmin()) return [];
    return this._loadAccounts()
      .filter(a => a.status === 'rejected')
      .map(a => ({
        id: a.id, name: a.name, email: a.email,
        role: a.role, createdAt: a.createdAt
      }));
  }

  /** Setujui akun pending → status 'approved' */
  approveAccount(accountId) {
    if (!this.isAdmin()) return { ok: false, error: 'Tidak diizinkan.' };

    const accounts = this._loadAccounts();
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return { ok: false, error: 'Akun tidak ditemukan.' };
    if (acc.status !== 'pending') return { ok: false, error: 'Akun tidak dalam status pending.' };

    acc.status     = 'approved';
    acc.approvedAt = new Date().toISOString().split('T')[0];
    acc.approvedBy = this.getSession()?.id || 'admin';
    this._saveAccounts(accounts);
    return { ok: true };
  }

  /** Tolak akun pending → status 'rejected' */
  rejectAccount(accountId) {
    if (!this.isAdmin()) return { ok: false, error: 'Tidak diizinkan.' };

    const accounts = this._loadAccounts();
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return { ok: false, error: 'Akun tidak ditemukan.' };

    acc.status    = 'rejected';
    acc.rejectedAt = new Date().toISOString().split('T')[0];
    this._saveAccounts(accounts);
    return { ok: true };
  }

  /** Ganti kata sandi akun yang sedang login */
  changePassword(oldPassword, newPassword) {
    const session = this._loadSession();
    if (!session) return { ok: false, error: 'Sesi tidak ditemukan. Silakan login ulang.' };

    const accounts = this._loadAccounts();
    const acc = accounts.find(a => a.id === session.id);
    if (!acc) return { ok: false, error: 'Akun tidak ditemukan.' };

    if (acc.password !== oldPassword) {
      return { ok: false, error: 'Kata sandi lama tidak sesuai.' };
    }
    if (newPassword.length < 6) {
      return { ok: false, error: 'Kata sandi baru minimal 6 karakter.' };
    }

    acc.password = newPassword;
    this._saveAccounts(accounts);
    return { ok: true };
  }

  /** Hapus akun (admin, tidak bisa hapus diri sendiri) */
  deleteAccount(accountId) {
    if (!this.isAdmin()) return false;
    if (accountId === this.getSession()?.id) return false;
    this._saveAccounts(this._loadAccounts().filter(a => a.id !== accountId));
    return true;
  }

  /** Update role akun */
  updateRole(accountId, newRole) {
    if (!this.isAdmin()) return false;
    const accounts = this._loadAccounts();
    const acc = accounts.find(a => a.id === accountId);
    if (acc) { acc.role = newRole; this._saveAccounts(accounts); return true; }
    return false;
  }

  /** Jumlah akun pending (untuk badge notifikasi) */
  getPendingCount() {
    if (!this.isAdmin()) return 0;
    return this._loadAccounts().filter(a => a.status === 'pending').length;
  }
}

window.pepakAuth = new PepakAuth();

/**
 * PEPAK DIGITAL — AUTH ENGINE (3 ROLE: SISWA, GURU, ADMIN)
 * Frontend-only authentication menggunakan localStorage.
 * Akun demo bawaan + registrasi akun baru.
 *
 * Role & Hak Akses:
 *   siswa  → akses penuh fitur belajar standar
 *   guru   → siswa + dashboard guru / kelas
 *   admin  → semua + panel manajemen pengguna
 */

class PepakAuth {
  constructor() {
    this.ACCOUNTS_KEY  = "pepak_accounts_v1";
    this.SESSION_KEY   = "pepak_session_v1";
    this.listeners     = [];

    /* Akun demo bawaan — langsung bisa dicoba */
    this._seedDefaultAccounts();
  }

  /* ── SEED AKUN DEMO ─────────────────────────────────────────────────── */
  _seedDefaultAccounts() {
    const existing = this._loadAccounts();
    const demos = [
      {
        id: "acc-siswa-demo",
        name: "Arjuna Ksatria",
        email: "siswa@pepak.edu",
        password: "siswa123",
        role: "siswa",
        avatar: "🎒",
        createdAt: "2026-01-01"
      },
      {
        id: "acc-guru-demo",
        name: "Ki Pamong Jawi",
        email: "guru@pepak.edu",
        password: "guru123",
        role: "guru",
        avatar: "👨‍🏫",
        createdAt: "2026-01-01"
      },
      {
        id: "acc-admin-demo",
        name: "Admin Pepak Digital",
        email: "admin@pepak.edu",
        password: "admin123",
        role: "admin",
        avatar: "🛡️",
        createdAt: "2026-01-01"
      }
    ];

    /* Tambahkan hanya yang belum ada */
    demos.forEach(demo => {
      if (!existing.find(a => a.id === demo.id)) {
        existing.push(demo);
      }
    });
    this._saveAccounts(existing);
  }

  /* ── STORAGE HELPERS ────────────────────────────────────────────────── */
  _loadAccounts() {
    try {
      return JSON.parse(localStorage.getItem(this.ACCOUNTS_KEY) || "[]");
    } catch { return []; }
  }

  _saveAccounts(list) {
    localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(list));
  }

  _loadSession() {
    try {
      return JSON.parse(localStorage.getItem(this.SESSION_KEY) || "null");
    } catch { return null; }
  }

  _saveSession(session) {
    if (session) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(this.SESSION_KEY);
    }
    this.listeners.forEach(fn => fn(session));
  }

  /* ── PUBLIC API ─────────────────────────────────────────────────────── */

  /** Sesi aktif saat ini (null = belum login / tamu) */
  getSession() {
    return this._loadSession();
  }

  isLoggedIn() {
    return !!this._loadSession();
  }

  getRole() {
    return this._loadSession()?.role || "tamu";
  }

  isAdmin() { return this.getRole() === "admin"; }
  isGuru()  { return this.getRole() === "guru" || this.isAdmin(); }

  /**
   * Login dengan email + password.
   * @returns { ok: boolean, error?: string, session?: object }
   */
  login(email, password) {
    const accounts = this._loadAccounts();
    const acc = accounts.find(
      a => a.email.trim().toLowerCase() === email.trim().toLowerCase() &&
           a.password === password
    );

    if (!acc) {
      return { ok: false, error: "Email atau kata sandi salah." };
    }

    const session = {
      id:        acc.id,
      name:      acc.name,
      email:     acc.email,
      role:      acc.role,
      avatar:    acc.avatar,
      loginAt:   new Date().toISOString()
    };

    this._saveSession(session);

    /* Sinkron ke pepakState.user agar HUD & profil ikut update */
    if (window.pepakState) {
      window.pepakState.state.user.name   = acc.name;
      window.pepakState.state.user.email  = acc.email;
      window.pepakState.state.user.role   = acc.role;
      window.pepakState.state.user.avatar = acc.avatar;
      window.pepakState.saveState();
    }

    return { ok: true, session };
  }

  /**
   * Registrasi akun baru.
   * @param {string} role — "siswa" | "guru"  (admin tidak boleh self-register)
   */
  register(name, email, password, role) {
    if (!name || !email || !password) {
      return { ok: false, error: "Semua kolom wajib diisi." };
    }
    if (!["siswa", "guru"].includes(role)) {
      return { ok: false, error: "Role tidak valid." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Kata sandi minimal 6 karakter." };
    }

    const accounts = this._loadAccounts();
    if (accounts.find(a => a.email.trim().toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: "Email sudah terdaftar. Silakan login." };
    }

    const avatarMap = { siswa: "🎒", guru: "👨‍🏫" };
    const newAcc = {
      id:        "acc-" + Date.now(),
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      password,
      role,
      avatar:    avatarMap[role],
      createdAt: new Date().toISOString().split("T")[0]
    };

    accounts.push(newAcc);
    this._saveAccounts(accounts);
    return this.login(newAcc.email, newAcc.password);
  }

  /** Logout — hapus sesi, kembalikan ke guest */
  logout() {
    this._saveSession(null);
    if (window.pepakState) {
      const def = window.pepakState.getDefaultState();
      window.pepakState.state.user.name  = def.user.name;
      window.pepakState.state.user.email = def.user.email;
      window.pepakState.state.user.role  = "tamu";
      window.pepakState.saveState();
    }
  }

  /** Subscribe ke perubahan sesi */
  subscribe(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  /* ── ADMIN HELPERS ──────────────────────────────────────────────────── */

  /** Ambil semua akun (hanya untuk admin) */
  getAllAccounts() {
    if (!this.isAdmin()) return [];
    return this._loadAccounts().map(a => ({
      id: a.id, name: a.name, email: a.email,
      role: a.role, avatar: a.avatar, createdAt: a.createdAt
    }));
  }

  /** Update role akun (hanya admin) */
  updateRole(accountId, newRole) {
    if (!this.isAdmin()) return false;
    const accounts = this._loadAccounts();
    const acc = accounts.find(a => a.id === accountId);
    if (acc) {
      acc.role = newRole;
      this._saveAccounts(accounts);
      return true;
    }
    return false;
  }

  /** Hapus akun (hanya admin, tidak bisa hapus diri sendiri) */
  deleteAccount(accountId) {
    if (!this.isAdmin()) return false;
    if (accountId === this.getSession()?.id) return false;
    const accounts = this._loadAccounts().filter(a => a.id !== accountId);
    this._saveAccounts(accounts);
    return true;
  }
}

window.pepakAuth = new PepakAuth();

/**
 * PEPAK DIGITAL — AUTH UI (LOGIN GATE)
 * Menampilkan halaman gerbang login fullscreen sebelum konten utama bisa diakses.
 * Tidak mengubah apapun di luar file ini dan auth.js.
 *
 * Alur:
 *   1. Saat halaman dibuka → cek sesi
 *   2. Belum login → tampilkan gate, sembunyikan konten
 *   3. Login berhasil → sembunyikan gate, tampilkan konten + set role
 *   4. Logout → sembunyikan konten, tampilkan gate kembali
 */

class PepakAuthUI {

  constructor() {
    this._activeRole = 'siswa'; // role yang sedang dipilih di UI
  }

  /* ══════════════════════════════════════════════════════════════════════
     INIT — dipanggil paling awal (DOMContentLoaded)
  ══════════════════════════════════════════════════════════════════════ */
  init() {
    const session = window.pepakAuth?.getSession();

    if (session) {
      // Sudah ada sesi tersimpan → langsung masuk
      this._enterApp(session, false);
    } else {
      // Belum login → kunci konten + tampilkan gate
      this._lockApp();
      this._showGate();
    }

    // Subscribe logout dari luar (misal tombol di profil)
    window.pepakAuth?.subscribe((sess) => {
      if (!sess) {
        this._lockApp();
        this._showGate();
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════════════
     GATE VISIBILITY
  ══════════════════════════════════════════════════════════════════════ */
  _showGate() {
    const gate = document.getElementById('pepak-login-gate');
    if (gate) {
      gate.style.display = 'flex';
      requestAnimationFrame(() => gate.classList.add('gate-visible'));
    }
  }

  _hideGate() {
    const gate = document.getElementById('pepak-login-gate');
    if (!gate) return;
    gate.classList.remove('gate-visible');
    gate.classList.add('gate-hiding');
    setTimeout(() => {
      gate.style.display = 'none';
      gate.classList.remove('gate-hiding');
    }, 380);
  }

  _lockApp() {
    const wrap = document.getElementById('pepak-app-wrapper');
    if (wrap) wrap.setAttribute('inert', '');
    if (wrap) wrap.style.display = 'none';
  }

  _unlockApp() {
    const wrap = document.getElementById('pepak-app-wrapper');
    if (wrap) wrap.removeAttribute('inert');
    if (wrap) wrap.style.display = '';
  }

  /* ══════════════════════════════════════════════════════════════════════
     SETELAH LOGIN BERHASIL
  ══════════════════════════════════════════════════════════════════════ */
  _enterApp(session, animate = true) {
    this._unlockApp();
    if (animate) this._hideGate();
    else {
      const gate = document.getElementById('pepak-login-gate');
      if (gate) gate.style.display = 'none';
    }

    // Tunggu app siap lalu update HUD & navigasi berdasarkan role
    const ready = () => {
      if (window.app) {
        window.app.updateStatsHUD?.();

        if (session.role === 'guru') {
          // Aktifkan mode guru otomatis (tanpa ubah kode asli)
          window.pepakState?.setRole('guru');
        } else if (session.role === 'admin') {
          window.pepakState?.setRole('admin');
          // Tampilkan tombol admin di nav
          const adminBtn = document.getElementById('nav-admin-btn');
          if (adminBtn) adminBtn.style.display = '';
        }

        // Update nav slot (info user + tombol logout)
        this._renderNavUserSlot(session);
      } else {
        setTimeout(ready, 100);
      }
    };
    setTimeout(ready, 50);
  }

  /* ══════════════════════════════════════════════════════════════════════
     NAVBAR — USER SLOT (nama, role badge, tombol logout)
  ══════════════════════════════════════════════════════════════════════ */
  _renderNavUserSlot(session) {
    const slot = document.getElementById('auth-nav-slot');
    if (!slot) return;

    const roleBadgeClass = session.role === 'admin' ? 'admin'
                         : session.role === 'guru'  ? 'guru' : '';
    const roleLabel = session.role === 'admin' ? 'ADMIN'
                    : session.role === 'guru'  ? 'GURU' : 'SISWA';

    slot.innerHTML = `
      <div class="auth-nav-user" title="Klik untuk keluar"
           onclick="window.pepakAuthUI.logout()" aria-label="Logout ${session.name}">
        <span class="auth-nav-avatar">${session.avatar || '🎭'}</span>
        <span class="auth-nav-name">${session.name.split(' ')[0]}</span>
        <span class="auth-nav-role-badge ${roleBadgeClass}">${roleLabel}</span>
      </div>`;
  }

  _clearNavUserSlot() {
    const slot = document.getElementById('auth-nav-slot');
    if (slot) slot.innerHTML = '';
  }

  /* ══════════════════════════════════════════════════════════════════════
     ROLE SELECTOR (3 kartu di gate)
  ══════════════════════════════════════════════════════════════════════ */
  selectRole(role) {
    this._activeRole = role;

    // Update kartu aktif
    ['siswa','guru','admin'].forEach(r => {
      const card = document.getElementById(`gate-role-${r}`);
      if (card) card.classList.toggle('active', r === role);
    });

    // Update placeholder form
    const emailInput = document.getElementById('gate-email');
    const passInput  = document.getElementById('gate-password');
    const hints = {
      siswa: { em: 'siswa@pepak.edu',  pw: 'siswa123' },
      guru:  { em: 'guru@pepak.edu',   pw: 'guru123'  },
      admin: { em: 'admin@pepak.edu',  pw: 'admin123' }
    };
    if (emailInput) emailInput.placeholder = hints[role].em;
    if (passInput)  passInput.placeholder  = hints[role].pw;

    // Update label tombol submit
    const submitBtn = document.getElementById('gate-submit-btn');
    const labels = { siswa:'🚀 Masuk sebagai Siswa', guru:'👨‍🏫 Masuk sebagai Guru', admin:'🛡️ Masuk sebagai Admin' };
    if (submitBtn) submitBtn.textContent = labels[role];

    // Sembunyikan pesan error saat ganti role
    this._setMsg('', '');
  }

  /* ══════════════════════════════════════════════════════════════════════
     SUBMIT LOGIN
  ══════════════════════════════════════════════════════════════════════ */
  submitLogin(e) {
    e.preventDefault();

    const email    = document.getElementById('gate-email')?.value?.trim();
    const password = document.getElementById('gate-password')?.value;
    const btn      = document.getElementById('gate-submit-btn');

    if (!email || !password) {
      this._setMsg('error', 'Email dan kata sandi wajib diisi.');
      return;
    }

    // Animasi loading
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Memverifikasi...'; }

    setTimeout(() => {
      const result = window.pepakAuth?.login(email, password);

      if (!result || !result.ok) {
        this._setMsg('error', result?.error || 'Login gagal. Periksa kembali email & kata sandi.');
        if (btn) {
          btn.disabled = false;
          const labels = { siswa:'🚀 Masuk sebagai Siswa', guru:'👨‍🏫 Masuk sebagai Guru', admin:'🛡️ Masuk sebagai Admin' };
          btn.textContent = labels[this._activeRole];
        }
        return;
      }

      // Pastikan role yang dipilih cocok dengan akun
      if (result.session.role !== this._activeRole) {
        const roleNames = { siswa:'Siswa', guru:'Guru', admin:'Admin' };
        this._setMsg('error',
          `Akun ini terdaftar sebagai ${roleNames[result.session.role]}, bukan ${roleNames[this._activeRole]}. Pilih peran yang sesuai.`
        );
        window.pepakAuth?.logout(); // batalkan sesi
        if (btn) {
          btn.disabled = false;
          const labels = { siswa:'🚀 Masuk sebagai Siswa', guru:'👨‍🏫 Masuk sebagai Guru', admin:'🛡️ Masuk sebagai Admin' };
          btn.textContent = labels[this._activeRole];
        }
        return;
      }

      this._setMsg('success', `Sugeng rawuh, ${result.session.name}! 🎉`);
      setTimeout(() => this._enterApp(result.session, true), 700);

    }, 400); // simulasi network delay kecil
  }

  /* ══════════════════════════════════════════════════════════════════════
     DAFTAR AKUN BARU (TAB REGISTER)
  ══════════════════════════════════════════════════════════════════════ */
  submitRegister(e) {
    e.preventDefault();

    const name     = document.getElementById('gate-reg-name')?.value?.trim();
    const email    = document.getElementById('gate-reg-email')?.value?.trim();
    const password = document.getElementById('gate-reg-password')?.value;
    const role     = document.querySelector('input[name="gate-reg-role"]:checked')?.value || 'siswa';
    const btn      = document.getElementById('gate-reg-btn');

    if (btn) { btn.disabled = true; btn.textContent = '⏳ Mendaftarkan...'; }

    setTimeout(() => {
      const result = window.pepakAuth?.register(name, email, password, role);

      if (!result || !result.ok) {
        this._setMsg('error', result?.error || 'Pendaftaran gagal.');
        if (btn) { btn.disabled = false; btn.textContent = '✨ Buat Akun Gratis'; }
        return;
      }

      this._setMsg('success', `Akun berhasil dibuat! Selamat datang, ${result.session.name}! 🎉`);
      setTimeout(() => this._enterApp(result.session, true), 700);
    }, 400);
  }

  /* ══════════════════════════════════════════════════════════════════════
     LOGOUT
  ══════════════════════════════════════════════════════════════════════ */
  logout() {
    window.pepakAuth?.logout();
    // Reset role guru/admin di state
    window.pepakState?.setRole('siswa');
    // Sembunyikan tombol admin
    const adminBtn = document.getElementById('nav-admin-btn');
    if (adminBtn) adminBtn.style.display = 'none';
    // Bersihkan nav slot
    this._clearNavUserSlot();
    // Kunci app & tampilkan gate
    this._lockApp();
    this._showGate();
    // Reset form
    const emailInput = document.getElementById('gate-email');
    const passInput  = document.getElementById('gate-password');
    if (emailInput) emailInput.value = '';
    if (passInput)  passInput.value  = '';
    this._setMsg('', '');
    this.switchTab('login');
    this.selectRole('siswa');
  }

  /* ══════════════════════════════════════════════════════════════════════
     TAB SWITCH (Login / Daftar)
  ══════════════════════════════════════════════════════════════════════ */
  switchTab(tab) {
    const loginForm  = document.getElementById('gate-form-login');
    const regForm    = document.getElementById('gate-form-register');
    const tabLogin   = document.getElementById('gate-tab-login');
    const tabReg     = document.getElementById('gate-tab-register');

    if (tab === 'login') {
      if (loginForm) loginForm.style.display = '';
      if (regForm)   regForm.style.display   = 'none';
      tabLogin?.classList.add('active');
      tabReg?.classList.remove('active');
    } else {
      if (loginForm) loginForm.style.display = 'none';
      if (regForm)   regForm.style.display   = '';
      tabLogin?.classList.remove('active');
      tabReg?.classList.add('active');
    }
    this._setMsg('', '');
  }

  /* ══════════════════════════════════════════════════════════════════════
     HELPER: TOGGLE PASSWORD VISIBILITY
  ══════════════════════════════════════════════════════════════════════ */
  togglePw(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    if (btn) btn.textContent = isHidden ? '🙈' : '👁';
  }

  /* ══════════════════════════════════════════════════════════════════════
     HELPER: AUTOFILL DEMO
  ══════════════════════════════════════════════════════════════════════ */
  fillDemo(email, password) {
    const emailInput = document.getElementById('gate-email');
    const passInput  = document.getElementById('gate-password');
    if (emailInput) emailInput.value = email;
    if (passInput)  passInput.value  = password;
    // Tentukan role dari email
    const roleMap = { 'siswa@pepak.edu':'siswa', 'guru@pepak.edu':'guru', 'admin@pepak.edu':'admin' };
    const role = roleMap[email] || 'siswa';
    this.selectRole(role);
    // Fokus ke tombol submit
    document.getElementById('gate-submit-btn')?.focus();
  }

  /* ══════════════════════════════════════════════════════════════════════
     HELPER: PESAN ERROR / SUKSES
  ══════════════════════════════════════════════════════════════════════ */
  _setMsg(type, text) {
    const el = document.getElementById('gate-message');
    if (!el) return;
    el.className = 'auth-msg' + (type ? ' ' + type : '');
    el.textContent = text;
    if (!type) el.style.display = 'none';
    else el.style.display = 'block';
  }

  /* ══════════════════════════════════════════════════════════════════════
     ADMIN PANEL RENDERER
  ══════════════════════════════════════════════════════════════════════ */
  renderAdminPanel() {
    if (!window.pepakAuth?.isAdmin()) return;

    const accounts = window.pepakAuth.getAllAccounts();

    // Stats
    const statsEl = document.getElementById('admin-stats-row');
    if (statsEl) {
      const total  = accounts.length;
      const siswa  = accounts.filter(a => a.role === 'siswa').length;
      const guru   = accounts.filter(a => a.role === 'guru').length;
      const admin  = accounts.filter(a => a.role === 'admin').length;
      statsEl.innerHTML = `
        <div class="admin-stat-card"><span class="admin-stat-num">${total}</span><span class="admin-stat-lbl">Total Pengguna</span></div>
        <div class="admin-stat-card"><span class="admin-stat-num">${siswa}</span><span class="admin-stat-lbl">🎒 Siswa</span></div>
        <div class="admin-stat-card"><span class="admin-stat-num">${guru}</span><span class="admin-stat-lbl">👨‍🏫 Guru</span></div>`;
    }

    // Tabel
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody) return;

    const currentId = window.pepakAuth.getSession()?.id;
    tbody.innerHTML = accounts.map(acc => `
      <tr>
        <td style="font-size:1.3rem">${acc.avatar}</td>
        <td style="font-weight:700; color:#F0E6D2;">${acc.name}${acc.id === currentId ? ' <span style="color:#D4A64C;font-size:0.72rem;">(Anda)</span>' : ''}</td>
        <td>${acc.email}</td>
        <td>
          <span class="auth-nav-role-badge ${acc.role === 'admin' ? 'admin' : acc.role === 'guru' ? 'guru' : ''}">
            ${acc.role.toUpperCase()}
          </span>
        </td>
        <td>
          <select class="admin-role-select" onchange="window.pepakAuthUI.changeRole('${acc.id}', this.value)"
            ${acc.id === currentId ? 'disabled title="Tidak bisa ubah role sendiri"' : ''}>
            <option value="siswa" ${acc.role==='siswa'?'selected':''}>Siswa</option>
            <option value="guru"  ${acc.role==='guru' ?'selected':''}>Guru</option>
            <option value="admin" ${acc.role==='admin'?'selected':''}>Admin</option>
          </select>
        </td>
        <td>
          <button class="admin-del-btn"
            onclick="window.pepakAuthUI.deleteUser('${acc.id}')"
            ${acc.id === currentId ? 'disabled title="Tidak bisa hapus akun sendiri"' : ''}>
            🗑 Hapus
          </button>
        </td>
      </tr>`).join('');
  }

  changeRole(accountId, newRole) {
    const ok = window.pepakAuth?.updateRole(accountId, newRole);
    if (ok) this.renderAdminPanel();
  }

  deleteUser(accountId) {
    if (!confirm('Hapus akun ini secara permanen?')) return;
    const ok = window.pepakAuth?.deleteAccount(accountId);
    if (ok) this.renderAdminPanel();
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   INISIALISASI — jalankan setelah DOM siap
────────────────────────────────────────────────────────────────────────── */
window.pepakAuthUI = new PepakAuthUI();

document.addEventListener('DOMContentLoaded', () => {
  window.pepakAuthUI.init();
});

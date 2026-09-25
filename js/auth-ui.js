/**
 * PEPAK DIGITAL — AUTH UI v2
 * Mengelola tampilan login gate, bootstrap Super Admin, dan panel persetujuan.
 * Tidak mengubah apapun di luar file ini dan auth.js.
 */

class PepakAuthUI {

  constructor() {
    this._activeRole = 'siswa';
  }

  /* ══════════════════════════════════════════════════════════════════════
     INIT — async karena needsBootstrap() sekarang async (Supabase)
  ══════════════════════════════════════════════════════════════════════ */
  async init() {
    const session = window.pepakAuth?.getSession();

    if (session) {
      this._enterApp(session, false);
    } else {
      this._lockApp();
      /* Tampilkan loading singkat saat cek ke Supabase */
      this._showLoadingGate();
      try {
        const needs = await window.pepakAuth?.needsBootstrap();
        this._hideLoadingGate();
        if (needs) {
          this._showBootstrapForm();
        } else {
          this._showGate();
        }
      } catch(e) {
        this._hideLoadingGate();
        this._showGate();
      }
    }

    window.pepakAuth?.subscribe(async (sess) => {
      if (!sess) {
        this._lockApp();
        this._showLoadingGate();
        try {
          const needs = await window.pepakAuth?.needsBootstrap();
          this._hideLoadingGate();
          if (needs) this._showBootstrapForm();
          else        this._showGate();
        } catch(e) {
          this._hideLoadingGate();
          this._showGate();
        }
      }
    });
  }

  /* Loading gate singkat saat cek Supabase */
  _showLoadingGate() {
    let el = document.getElementById('pepak-loading-gate');
    if (!el) {
      el = document.createElement('div');
      el.id = 'pepak-loading-gate';
      el.style.cssText = `
        position:fixed;inset:0;z-index:10000;
        background:linear-gradient(160deg,#1A0F08,#0D0704);
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;`;
      el.innerHTML = `
        <div style="font-size:2.8rem;">🎭</div>
        <div style="font-family:'Cinzel',serif;font-size:1.1rem;color:#D4A64C;letter-spacing:1px;">PEPAK DIGITAL</div>
        <div style="width:48px;height:3px;background:rgba(212,166,76,0.2);border-radius:9999px;overflow:hidden;">
          <div style="height:100%;background:#D4A64C;border-radius:9999px;
            animation:pepakLoadBar 1.2s ease-in-out infinite;width:40%;"></div>
        </div>
        <style>
          @keyframes pepakLoadBar {
            0%   { transform:translateX(-100%); }
            50%  { transform:translateX(200%); }
            100% { transform:translateX(-100%); }
          }
        </style>`;
      document.body.appendChild(el);
    } else {
      el.style.display = 'flex';
    }
  }

  _hideLoadingGate() {
    const el = document.getElementById('pepak-loading-gate');
    if (el) el.style.display = 'none';
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
    /* Sembunyikan bootstrap jika ada */
    const bs = document.getElementById('pepak-bootstrap-gate');
    if (bs) bs.style.display = 'none';
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
    if (wrap) { wrap.setAttribute('inert', ''); wrap.style.display = 'none'; }
  }

  _unlockApp() {
    const wrap = document.getElementById('pepak-app-wrapper');
    if (wrap) { wrap.removeAttribute('inert'); wrap.style.display = ''; }
  }

  /* ══════════════════════════════════════════════════════════════════════
     BOOTSTRAP SUPER ADMIN
     Tampil HANYA jika belum ada admin approved di sistem.
  ══════════════════════════════════════════════════════════════════════ */
  _showBootstrapForm() {
    /* Sembunyikan gate biasa */
    const gate = document.getElementById('pepak-login-gate');
    if (gate) gate.style.display = 'none';

    /* Buat overlay bootstrap jika belum ada */
    if (document.getElementById('pepak-bootstrap-gate')) {
      document.getElementById('pepak-bootstrap-gate').style.display = 'flex';
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'pepak-bootstrap-gate';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:radial-gradient(ellipse at 60% 10%,rgba(212,166,76,0.10) 0%,transparent 55%),
        linear-gradient(160deg,#1A0F08 0%,#0D0704 100%);
      display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto;`;

    overlay.innerHTML = `
      <div style="background:linear-gradient(160deg,#2C1D10,#1A0F08);
        border:2px solid rgba(230,57,70,0.5);border-radius:22px;
        width:100%;max-width:440px;padding:2.2rem 1.8rem 2rem;
        box-shadow:0 30px 70px rgba(0,0,0,0.88),0 0 40px rgba(230,57,70,0.08);
        position:relative;">

        <!-- Ornamen atas -->
        <div style="position:absolute;top:-1px;left:24px;right:24px;height:3px;
          background:linear-gradient(90deg,transparent,#E63946 30%,#FF9E9E 50%,#E63946 70%,transparent);
          border-radius:9999px;"></div>

        <div style="text-align:center;margin-bottom:1.6rem;">
          <div style="width:66px;height:66px;background:linear-gradient(135deg,#3A0A0A,#2A1B10);
            border:2px solid #E63946;border-radius:16px;display:flex;align-items:center;
            justify-content:center;font-size:1.9rem;margin:0 auto 0.9rem;
            box-shadow:0 6px 20px rgba(230,57,70,0.25);">🛡️</div>
          <div style="font-family:'Cinzel',serif;font-size:1.3rem;font-weight:900;color:#E63946;letter-spacing:1px;">
            Buat Super Admin
          </div>
          <div style="font-size:0.8rem;color:#8E7A68;margin-top:0.3rem;">
            Sistem belum memiliki Admin. Buat akun Admin pertama untuk mulai mengelola Pepak Digital.
          </div>
        </div>

        <div id="bootstrap-msg" style="display:none;font-size:0.82rem;font-weight:600;
          padding:0.6rem 0.9rem;border-radius:10px;margin-bottom:0.9rem;"></div>

        <form onsubmit="window.pepakAuthUI.submitBootstrap(event)"
          style="display:flex;flex-direction:column;gap:0.95rem;">

          <div style="display:flex;flex-direction:column;gap:0.32rem;">
            <label style="font-size:0.78rem;font-weight:700;color:#C8B89E;">👤 Nama Lengkap</label>
            <input id="bs-name" type="text" required placeholder="Nama Admin"
              style="background:rgba(10,6,3,0.75);border:1.5px solid rgba(230,57,70,0.3);
              border-radius:12px;padding:0.72rem 1rem;min-height:48px;color:#F0E6D2;
              font-family:'Plus Jakarta Sans',sans-serif;font-size:0.92rem;outline:none;" />
          </div>

          <div style="display:flex;flex-direction:column;gap:0.32rem;">
            <label style="font-size:0.78rem;font-weight:700;color:#C8B89E;">📧 Email</label>
            <input id="bs-email" type="email" required placeholder="admin@sekolah.id"
              style="background:rgba(10,6,3,0.75);border:1.5px solid rgba(230,57,70,0.3);
              border-radius:12px;padding:0.72rem 1rem;min-height:48px;color:#F0E6D2;
              font-family:'Plus Jakarta Sans',sans-serif;font-size:0.92rem;outline:none;" />
          </div>

          <div style="display:flex;flex-direction:column;gap:0.32rem;">
            <label style="font-size:0.78rem;font-weight:700;color:#C8B89E;">🔒 Kata Sandi (min. 8 karakter)</label>
            <input id="bs-password" type="password" required minlength="8" placeholder="Buat kata sandi kuat"
              style="background:rgba(10,6,3,0.75);border:1.5px solid rgba(230,57,70,0.3);
              border-radius:12px;padding:0.72rem 1rem;min-height:48px;color:#F0E6D2;
              font-family:'Plus Jakarta Sans',sans-serif;font-size:0.92rem;outline:none;" />
          </div>

          <button type="submit" id="bs-btn"
            style="background:linear-gradient(135deg,#FF6B6B,#E63946);color:#fff;
            font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:0.98rem;
            padding:0.88rem;min-height:52px;border:none;border-radius:12px;cursor:pointer;
            box-shadow:0 4px 18px rgba(230,57,70,0.35);transition:all 0.22s ease;margin-top:0.2rem;">
            🛡️ Buat Akun Super Admin
          </button>
        </form>

        <div style="text-align:center;font-size:0.75rem;color:#8E7A68;margin-top:1.1rem;line-height:1.5;">
          ⚠️ Akun ini akan memiliki akses penuh ke seluruh sistem.<br>
          Simpan kredensial di tempat yang aman.
        </div>
      </div>`;

    document.body.appendChild(overlay);
  }

  async submitBootstrap(e) {
    e.preventDefault();
    const name     = document.getElementById('bs-name')?.value?.trim();
    const email    = document.getElementById('bs-email')?.value?.trim();
    const password = document.getElementById('bs-password')?.value;
    const btn      = document.getElementById('bs-btn');
    const msgEl    = document.getElementById('bootstrap-msg');

    if (btn) { btn.disabled = true; btn.textContent = '⏳ Membuat akun...'; }

    setTimeout(async () => {
      const result = await window.pepakAuth?.bootstrapSuperAdmin(name, email, password);

      if (!result?.ok) {
        if (msgEl) {
          msgEl.style.cssText = 'display:block;background:rgba(230,57,70,0.14);color:#FF7B84;border:1px solid rgba(230,57,70,0.3);font-size:0.82rem;font-weight:600;padding:0.6rem 0.9rem;border-radius:10px;margin-bottom:0.9rem;';
          msgEl.textContent = result?.error || 'Gagal membuat akun.';
        }
        if (btn) { btn.disabled = false; btn.textContent = '🛡️ Buat Akun Super Admin'; }
        return;
      }

      /* Langsung login */
      const loginResult = await window.pepakAuth?.login(email, password);
      if (loginResult?.ok) {
        document.getElementById('pepak-bootstrap-gate').style.display = 'none';
        this._enterApp(loginResult.session, true);
      }
    }, 350);
  }

  /* ══════════════════════════════════════════════════════════════════════
     ENTER APP
  ══════════════════════════════════════════════════════════════════════ */
  _enterApp(session, animate = true) {
    this._unlockApp();
    if (animate) this._hideGate();
    else {
      const gate = document.getElementById('pepak-login-gate');
      if (gate) gate.style.display = 'none';
    }

    const ready = () => {
      if (window.app) {
        window.app.updateStatsHUD?.();

        if (session.role === 'guru') {
          window.pepakState?.setRole('guru');
        } else if (session.role === 'admin') {
          window.pepakState?.setRole('admin');
          const adminBtn = document.getElementById('nav-admin-btn');
          if (adminBtn) adminBtn.style.display = '';
          /* Update badge pending */
          this._updatePendingBadge();
        }

        this._renderNavUserSlot(session);
      } else {
        setTimeout(ready, 100);
      }
    };
    setTimeout(ready, 50);
  }

  /* ══════════════════════════════════════════════════════════════════════
     NAVBAR SLOT — dropdown dengan Profil, Ganti Sandi, Logout
  ══════════════════════════════════════════════════════════════════════ */
  _renderNavUserSlot(session) {
    const slot = document.getElementById('auth-nav-slot');
    if (!slot) return;

    const roleBadgeClass = session.role === 'admin' ? 'admin'
                         : session.role === 'guru'  ? 'guru' : '';
    const roleLabel = session.role === 'admin' ? 'ADMIN'
                    : session.role === 'guru'  ? 'GURU' : 'SISWA';

    slot.innerHTML = `
      <div class="auth-nav-dropdown" id="auth-nav-dropdown">

        <!-- Tombol trigger -->
        <button class="auth-nav-user" id="auth-nav-trigger"
          onclick="window.pepakAuthUI.toggleNavDropdown(event)"
          aria-haspopup="true" aria-expanded="false"
          aria-label="Menu akun ${session.name}">
          <span class="auth-nav-avatar">${session.avatar || '🎭'}</span>
          <span class="auth-nav-name">${session.name.split(' ')[0]}</span>
          <span class="auth-nav-role-badge ${roleBadgeClass}">${roleLabel}</span>
          <span class="auth-nav-chevron">▾</span>
        </button>

        <!-- Menu dropdown -->
        <div class="auth-nav-menu" id="auth-nav-menu" role="menu">
          <div class="auth-nav-menu-header">
            <span class="auth-nav-menu-name">${session.name}</span>
            <span class="auth-nav-menu-email">${session.email}</span>
          </div>
          <div class="auth-nav-menu-divider"></div>
          <button class="auth-nav-menu-item" role="menuitem"
            onclick="window.app?.navigateTo('profile'); window.pepakAuthUI.closeNavDropdown();">
            <span>⚙️</span> Profil &amp; Akun
          </button>
          <button class="auth-nav-menu-item" role="menuitem"
            onclick="window.pepakAuthUI.openChangePassword()">
            <span>🔒</span> Ganti Kata Sandi
          </button>
          <div class="auth-nav-menu-divider"></div>
          <button class="auth-nav-menu-item auth-nav-menu-item--danger" role="menuitem"
            onclick="window.pepakAuthUI.logout()">
            <span>🚪</span> Keluar (Logout)
          </button>
        </div>

      </div>`;
  }

  /* Toggle buka/tutup dropdown */
  toggleNavDropdown(e) {
    e.stopPropagation();
    const menu    = document.getElementById('auth-nav-menu');
    const trigger = document.getElementById('auth-nav-trigger');
    if (!menu) return;
    const isOpen = menu.classList.toggle('open');
    if (trigger) trigger.setAttribute('aria-expanded', isOpen);
    /* Tutup otomatis saat klik di luar */
    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('click', this._closeDropdownOutside, { once: true });
      }, 10);
    }
  }

  closeNavDropdown() {
    const menu    = document.getElementById('auth-nav-menu');
    const trigger = document.getElementById('auth-nav-trigger');
    if (menu) menu.classList.remove('open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  /* Handler klik luar dropdown */
  _closeDropdownOutside = () => {
    this.closeNavDropdown();
  };

  /* ── MODAL GANTI KATA SANDI ── */
  openChangePassword() {
    this.closeNavDropdown();

    /* Hapus modal lama jika ada */
    document.getElementById('auth-change-pw-modal')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'auth-change-pw-modal';
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.82);
      backdrop-filter:blur(8px);z-index:9000;
      display:flex;align-items:center;justify-content:center;padding:1rem;`;

    overlay.innerHTML = `
      <div style="background:linear-gradient(160deg,#2A1B10,#1A0F08);
        border:1.5px solid rgba(212,166,76,0.42);border-radius:20px;
        max-width:400px;width:100%;padding:1.8rem;
        box-shadow:0 30px 70px rgba(0,0,0,0.85);position:relative;
        animation:authSlideIn 0.28s cubic-bezier(0.2,0.8,0.2,1);">

        <button onclick="document.getElementById('auth-change-pw-modal').remove()"
          style="position:absolute;top:0.9rem;right:0.9rem;width:34px;height:34px;
          border-radius:50%;background:rgba(42,27,16,0.8);border:1px solid rgba(212,166,76,0.22);
          color:#C8B89E;font-size:0.95rem;cursor:pointer;
          display:flex;align-items:center;justify-content:center;">✕</button>

        <h3 style="font-family:'Cinzel',serif;font-size:1.1rem;color:#D4A64C;
          margin-bottom:0.4rem;">🔒 Ganti Kata Sandi</h3>
        <p style="font-size:0.8rem;color:#8E7A68;margin-bottom:1.3rem;">
          Masukkan kata sandi lama dan kata sandi baru Anda.
        </p>

        <div id="cpw-msg" style="display:none;font-size:0.82rem;font-weight:600;
          padding:0.6rem 0.9rem;border-radius:10px;margin-bottom:0.9rem;"></div>

        <form onsubmit="window.pepakAuthUI.submitChangePassword(event)"
          style="display:flex;flex-direction:column;gap:0.9rem;">

          <div style="display:flex;flex-direction:column;gap:0.3rem;">
            <label style="font-size:0.77rem;font-weight:700;color:#C8B89E;">Kata Sandi Lama</label>
            <div style="position:relative;">
              <input id="cpw-old" type="password" required
                placeholder="Kata sandi saat ini"
                style="width:100%;background:rgba(10,6,3,0.75);border:1.5px solid rgba(212,166,76,0.2);
                border-radius:11px;padding:0.7rem 2.8rem 0.7rem 1rem;color:#F0E6D2;
                font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;outline:none;
                min-height:46px;box-sizing:border-box;" />
              <button type="button" onclick="window.pepakAuthUI.togglePw('cpw-old',this)"
                style="position:absolute;right:0.8rem;top:50%;transform:translateY(-50%);
                background:none;border:none;color:#8E7A68;cursor:pointer;font-size:0.95rem;">👁</button>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:0.3rem;">
            <label style="font-size:0.77rem;font-weight:700;color:#C8B89E;">Kata Sandi Baru (min. 6 karakter)</label>
            <div style="position:relative;">
              <input id="cpw-new" type="password" required minlength="6"
                placeholder="Kata sandi baru"
                style="width:100%;background:rgba(10,6,3,0.75);border:1.5px solid rgba(212,166,76,0.2);
                border-radius:11px;padding:0.7rem 2.8rem 0.7rem 1rem;color:#F0E6D2;
                font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;outline:none;
                min-height:46px;box-sizing:border-box;" />
              <button type="button" onclick="window.pepakAuthUI.togglePw('cpw-new',this)"
                style="position:absolute;right:0.8rem;top:50%;transform:translateY(-50%);
                background:none;border:none;color:#8E7A68;cursor:pointer;font-size:0.95rem;">👁</button>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:0.3rem;">
            <label style="font-size:0.77rem;font-weight:700;color:#C8B89E;">Konfirmasi Kata Sandi Baru</label>
            <input id="cpw-confirm" type="password" required minlength="6"
              placeholder="Ulangi kata sandi baru"
              style="width:100%;background:rgba(10,6,3,0.75);border:1.5px solid rgba(212,166,76,0.2);
              border-radius:11px;padding:0.7rem 1rem;color:#F0E6D2;
              font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;outline:none;
              min-height:46px;box-sizing:border-box;" />
          </div>

          <button type="submit" id="cpw-btn"
            style="background:linear-gradient(135deg,#F3E7C4,#D4A64C,#A67C2E);color:#1A0F08;
            font-weight:800;font-size:0.95rem;padding:0.82rem;min-height:50px;
            border:none;border-radius:11px;cursor:pointer;
            box-shadow:0 4px 16px rgba(212,166,76,0.32);transition:all 0.2s ease;">
            🔒 Simpan Kata Sandi Baru
          </button>
        </form>
      </div>`;

    /* Tutup dengan klik luar */
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  async submitChangePassword(e) {
    e.preventDefault();
    const oldPw   = document.getElementById('cpw-old')?.value;
    const newPw   = document.getElementById('cpw-new')?.value;
    const confirm = document.getElementById('cpw-confirm')?.value;
    const btn     = document.getElementById('cpw-btn');
    const msgEl   = document.getElementById('cpw-msg');
    const showMsg = (type, text) => {
      const colors = {
        error:   'rgba(230,57,70,0.14);color:#FF7B84;border:1px solid rgba(230,57,70,0.3)',
        success: 'rgba(46,196,182,0.14);color:#2EC4B6;border:1px solid rgba(46,196,182,0.3)'
      };
      msgEl.style.cssText = `display:block;font-size:0.82rem;font-weight:600;padding:0.6rem 0.9rem;border-radius:10px;margin-bottom:0.9rem;background:${colors[type]||colors.error};`;
      msgEl.textContent = text;
    };
    if (newPw !== confirm) { showMsg('error','Konfirmasi kata sandi tidak cocok.'); return; }
    if (newPw.length < 6)  { showMsg('error','Kata sandi baru minimal 6 karakter.'); return; }
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Menyimpan...'; }
    const result = await window.pepakAuth?.changePassword(oldPw, newPw);
    if (!result?.ok) {
      showMsg('error', result?.error || 'Gagal mengganti kata sandi.');
      if (btn) { btn.disabled = false; btn.textContent = '🔒 Simpan Kata Sandi Baru'; }
      return;
    }
    showMsg('success','✅ Kata sandi berhasil diperbarui!');
    if (btn) btn.textContent = '✅ Tersimpan';
    setTimeout(() => document.getElementById('auth-change-pw-modal')?.remove(), 1500);
  }

  _clearNavUserSlot() {
    const slot = document.getElementById('auth-nav-slot');
    if (slot) slot.innerHTML = '';
  }

  /* ══════════════════════════════════════════════════════════════════════
     ROLE SELECTOR
  ══════════════════════════════════════════════════════════════════════ */
  selectRole(role) {
    this._activeRole = role;

    ['siswa','guru','admin'].forEach(r => {
      const card = document.getElementById(`gate-role-${r}`);
      if (card) card.classList.toggle('active', r === role);
    });

    const submitBtn = document.getElementById('gate-submit-btn');
    const labels = {
      siswa: '🚀 Masuk sebagai Siswa',
      guru:  '👨‍🏫 Masuk sebagai Guru',
      admin: '🛡️ Masuk sebagai Admin'
    };
    if (submitBtn) submitBtn.textContent = labels[role];

    /* Update placeholder email di login form */
    const emailInput = document.getElementById('gate-email');
    if (emailInput) emailInput.placeholder = `Email ${role}@domain.com`;

    /* Sembunyikan tab "Daftar" saat role Admin dipilih — pendaftaran admin ditutup */
    const tabReg = document.getElementById('gate-tab-register');
    if (tabReg) {
      if (role === 'admin') {
        tabReg.style.display = 'none';
        /* Paksa ke tab login jika sedang di tab daftar */
        this.switchTab('login');
      } else {
        tabReg.style.display = '';
      }
    }

    this._setMsg('', '');
  }

  /* ══════════════════════════════════════════════════════════════════════
     SUBMIT LOGIN
  ══════════════════════════════════════════════════════════════════════ */
  async submitLogin(e) {
    e.preventDefault();
    const email    = document.getElementById('gate-email')?.value?.trim();
    const password = document.getElementById('gate-password')?.value;
    const btn      = document.getElementById('gate-submit-btn');

    if (!email || !password) { this._setMsg('error','Email dan kata sandi wajib diisi.'); return; }
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Memverifikasi...'; }

    const result = await window.pepakAuth?.login(email, password);

    if (!result?.ok) {
      if (result?.pendingApproval) {
        this._setMsg('pending', '⏳ ' + (result.error || 'Akun Anda masih menunggu persetujuan Admin.'));
      } else if (result?.rejected) {
        this._setMsg('rejected', '❌ ' + (result.error || 'Pendaftaran Anda ditolak. Hubungi Admin.'));
      } else {
        this._setMsg('error', result?.error || 'Login gagal.');
      }
      if (btn) {
        btn.disabled = false;
        const labels = { siswa:'🚀 Masuk sebagai Siswa', guru:'👨‍🏫 Masuk sebagai Guru', admin:'🛡️ Masuk sebagai Admin' };
        btn.textContent = labels[this._activeRole] || 'Masuk';
      }
      return;
    }

    if (result.session.role !== this._activeRole) {
      const roleNames = { siswa:'Siswa', guru:'Guru', admin:'Admin' };
      this._setMsg('error', `Akun ini terdaftar sebagai ${roleNames[result.session.role]}, bukan ${roleNames[this._activeRole]}. Pilih peran yang sesuai.`);
      window.pepakAuth?.logout();
      if (btn) {
        btn.disabled = false;
        const labels = { siswa:'🚀 Masuk sebagai Siswa', guru:'👨‍🏫 Masuk sebagai Guru', admin:'🛡️ Masuk sebagai Admin' };
        btn.textContent = labels[this._activeRole] || 'Masuk';
      }
      return;
    }

    this._setMsg('success', `Sugeng rawuh, ${result.session.name}! 🎉`);
    setTimeout(() => this._enterApp(result.session, true), 600);
  }

  /* ══════════════════════════════════════════════════════════════════════
     SUBMIT REGISTER
  ══════════════════════════════════════════════════════════════════════ */
  async submitRegister(e) {
    e.preventDefault();
    const name     = document.getElementById('gate-reg-name')?.value?.trim();
    const email    = document.getElementById('gate-reg-email')?.value?.trim();
    const password = document.getElementById('gate-reg-password')?.value;
    const role     = document.querySelector('input[name="gate-reg-role"]:checked')?.value || 'siswa';
    const btn      = document.getElementById('gate-reg-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Mendaftarkan...'; }

    const result = await window.pepakAuth?.register(name, email, password, role);

    if (!result?.ok) {
      this._setMsg('error', result?.error || 'Pendaftaran gagal.');
      if (btn) { btn.disabled = false; btn.textContent = '✨ Buat Akun Gratis'; }
      return;
    }
    if (result.pendingApproval) {
      const roleLabel = role === 'guru' ? 'Guru' : 'Admin';
      this._setMsg('pending',
        `✅ Pendaftaran berhasil, ${result.name}!\n\nAkun ${roleLabel} Anda sedang menunggu persetujuan Admin. Silakan coba login kembali setelah mendapat konfirmasi.`
      );
      if (btn) { btn.disabled = false; btn.textContent = '✨ Buat Akun Gratis'; }
      setTimeout(() => this.switchTab('login'), 3500);
      return;
    }
    this._setMsg('success', `Akun berhasil dibuat! Selamat datang, ${result.session?.name}! 🎉`);
    setTimeout(() => this._enterApp(result.session, true), 700);
  }

  /* ══════════════════════════════════════════════════════════════════════
     LOGOUT
  ══════════════════════════════════════════════════════════════════════ */
  async logout() {
    window.pepakAuth?.logout();
    window.pepakState?.setRole('siswa');
    const adminBtn = document.getElementById('nav-admin-btn');
    if (adminBtn) adminBtn.style.display = 'none';
    this._clearNavUserSlot();
    this._lockApp();
    this._showLoadingGate();
    try {
      const needs = await window.pepakAuth?.needsBootstrap();
      this._hideLoadingGate();
      needs ? this._showBootstrapForm() : this._showGate();
    } catch(e) {
      this._hideLoadingGate();
      this._showGate();
    }
    const emailInput = document.getElementById('gate-email');
    const passInput  = document.getElementById('gate-password');
    if (emailInput) emailInput.value = '';
    if (passInput)  passInput.value  = '';
    this._setMsg('', '');
    this.switchTab('login');
    this.selectRole('siswa');
  }

  /* ══════════════════════════════════════════════════════════════════════
     TAB SWITCH
  ══════════════════════════════════════════════════════════════════════ */
  switchTab(tab) {
    const loginForm = document.getElementById('gate-form-login');
    const regForm   = document.getElementById('gate-form-register');
    const tabLogin  = document.getElementById('gate-tab-login');
    const tabReg    = document.getElementById('gate-tab-register');

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
     TOGGLE PASSWORD
  ══════════════════════════════════════════════════════════════════════ */
  togglePw(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    if (btn) btn.textContent = isHidden ? '🙈' : '👁';
  }

  /* ══════════════════════════════════════════════════════════════════════
     PESAN FEEDBACK
  ══════════════════════════════════════════════════════════════════════ */
  _setMsg(type, text) {
    const el = document.getElementById('gate-message');
    if (!el) return;

    const styles = {
      error:   'background:rgba(230,57,70,0.14);color:#FF7B84;border:1px solid rgba(230,57,70,0.3);',
      success: 'background:rgba(46,196,182,0.14);color:#2EC4B6;border:1px solid rgba(46,196,182,0.3);',
      pending: 'background:rgba(255,158,0,0.14);color:#FF9E00;border:1px solid rgba(255,158,0,0.3);',
      rejected:'background:rgba(230,57,70,0.14);color:#FF7B84;border:1px solid rgba(230,57,70,0.3);'
    };

    if (!type) {
      el.style.display = 'none';
      el.textContent = '';
      return;
    }

    el.style.cssText = (styles[type] || '') +
      'display:block;font-size:0.82rem;font-weight:600;padding:0.6rem 0.9rem;' +
      'border-radius:10px;line-height:1.45;white-space:pre-line;margin-bottom:0.3rem;';
    el.textContent = text;
  }

  /* ══════════════════════════════════════════════════════════════════════
     ADMIN PANEL — TAB SWITCH
  ══════════════════════════════════════════════════════════════════════ */
  showAdminTab(tab) {
    const usersPanel    = document.getElementById('admin-panel-users');
    const approvalPanel = document.getElementById('admin-panel-approvals');
    if (!usersPanel || !approvalPanel) return;
    if (tab === 'users') {
      usersPanel.style.display    = '';
      approvalPanel.style.display = 'none';
      this.renderAdminPanel();
    } else {
      usersPanel.style.display    = 'none';
      approvalPanel.style.display = '';
      this.renderApprovalPanel();
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     ADMIN PANEL — DAFTAR PENGGUNA
  ══════════════════════════════════════════════════════════════════════ */
  async renderAdminPanel() {
    if (!window.pepakAuth?.isAdmin()) return;

    /* Loading state */
    const tbody = document.getElementById('admin-users-tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="padding:2rem;text-align:center;color:#8E7A68;">⏳ Memuat data...</td></tr>`;

    const accounts = await window.pepakAuth.getAllAccounts();

    const statsEl = document.getElementById('admin-stats-row');
    if (statsEl) {
      const total = accounts.length;
      const siswa = accounts.filter(a => a.role === 'siswa').length;
      const guru  = accounts.filter(a => a.role === 'guru').length;
      statsEl.innerHTML = `
        <div class="admin-stat-card"><span class="admin-stat-num">${total}</span><span class="admin-stat-lbl">Total Aktif</span></div>
        <div class="admin-stat-card"><span class="admin-stat-num">${siswa}</span><span class="admin-stat-lbl">🎒 Siswa</span></div>
        <div class="admin-stat-card"><span class="admin-stat-num">${guru}</span><span class="admin-stat-lbl">👨‍🏫 Guru</span></div>`;
    }

    if (!tbody) return;

    if (accounts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="padding:2rem;text-align:center;color:#8E7A68;">Belum ada pengguna terdaftar.</td></tr>`;
      return;
    }

    const currentId = window.pepakAuth.getSession()?.id;
    tbody.innerHTML = accounts.map(acc => `
      <tr>
        <td style="font-size:1.3rem;">${acc.avatar || '👤'}</td>
        <td style="font-weight:700;color:#F0E6D2;">${acc.name}${acc.id === currentId ? ' <span style="color:#D4A64C;font-size:0.7rem;">(Anda)</span>' : ''}</td>
        <td style="color:#C8B89E;">${acc.email}</td>
        <td><span class="auth-nav-role-badge ${acc.role==='admin'?'admin':acc.role==='guru'?'guru':''}">${acc.role.toUpperCase()}</span></td>
        <td><span style="font-size:0.72rem;font-weight:800;background:rgba(46,196,182,0.15);color:#2EC4B6;padding:0.15rem 0.5rem;border-radius:6px;">AKTIF</span></td>
        <td>
          <select class="admin-role-select"
            onchange="window.pepakAuthUI.changeRole('${acc.id}',this.value)"
            ${acc.id === currentId ? 'disabled' : ''}>
            <option value="siswa" ${acc.role==='siswa'?'selected':''}>Siswa</option>
            <option value="guru"  ${acc.role==='guru' ?'selected':''}>Guru</option>
            <option value="admin" ${acc.role==='admin'?'selected':''}>Admin</option>
          </select>
        </td>
        <td>
          <button class="admin-del-btn"
            onclick="window.pepakAuthUI.deleteUser('${acc.id}')"
            ${acc.id === currentId ? 'disabled' : ''}>🗑 Hapus</button>
        </td>
      </tr>`).join('');
  }

  async changeRole(accountId, newRole) {
    const ok = await window.pepakAuth?.updateRole(accountId, newRole);
    if (ok) this.renderAdminPanel();
  }

  async deleteUser(accountId) {
    if (!confirm('Hapus akun ini secara permanen?')) return;
    const ok = await window.pepakAuth?.deleteAccount(accountId);
    if (ok) this.renderAdminPanel();
  }

  /* ══════════════════════════════════════════════════════════════════════
     ADMIN PANEL — PERSETUJUAN AKUN PENDING
  ══════════════════════════════════════════════════════════════════════ */
  async renderApprovalPanel() {
    if (!window.pepakAuth?.isAdmin()) return;

    const tbody = document.getElementById('admin-approvals-tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="padding:2rem;text-align:center;color:#8E7A68;">⏳ Memuat data...</td></tr>`;

    const pending  = await window.pepakAuth.getPendingAccounts();
    const rejected = await window.pepakAuth.getRejectedAccounts();

    if (!tbody) return;

    /* Update badge */
    this._updatePendingBadge();

    if (pending.length === 0 && rejected.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="padding:2rem;text-align:center;color:#8E7A68;">✅ Tidak ada pendaftar yang menunggu persetujuan.</td></tr>`;
      return;
    }

    const pendingRows = pending.map(acc => `
      <tr id="approval-row-${acc.id}">
        <td style="font-weight:700;color:#F0E6D2;">${acc.name}</td>
        <td style="color:#C8B89E;">${acc.email}</td>
        <td><span class="auth-nav-role-badge ${acc.role==='guru'?'guru':''}">${acc.role.toUpperCase()}</span></td>
        <td style="color:#8E7A68;font-size:0.84rem;">${(acc.created_at||'').split('T')[0]}</td>
        <td style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button onclick="window.pepakAuthUI.approveAccount('${acc.id}')"
            style="background:rgba(46,196,182,0.15);border:1px solid rgba(46,196,182,0.4);
            color:#2EC4B6;font-size:0.8rem;font-weight:700;padding:0.35rem 0.8rem;
            border-radius:8px;cursor:pointer;">✅ Setujui</button>
          <button onclick="window.pepakAuthUI.rejectAccount('${acc.id}')"
            style="background:rgba(230,57,70,0.12);border:1px solid rgba(230,57,70,0.35);
            color:#E63946;font-size:0.8rem;font-weight:700;padding:0.35rem 0.8rem;
            border-radius:8px;cursor:pointer;">❌ Tolak</button>
        </td>
      </tr>`).join('');

    const rejectedRows = rejected.map(acc => `
      <tr style="opacity:0.55;">
        <td style="color:#8E7A68;">${acc.name}</td>
        <td style="color:#8E7A68;">${acc.email}</td>
        <td><span class="auth-nav-role-badge ${acc.role==='guru'?'guru':''}">${acc.role.toUpperCase()}</span></td>
        <td style="color:#8E7A68;font-size:0.84rem;">${(acc.created_at||'').split('T')[0]}</td>
        <td style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <span style="font-size:0.72rem;font-weight:800;background:rgba(230,57,70,0.15);
            color:#E63946;padding:0.15rem 0.55rem;border-radius:6px;">DITOLAK</span>
          <button onclick="window.pepakAuthUI.deleteUser('${acc.id}')"
            style="background:transparent;border:1px solid rgba(230,57,70,0.25);
            color:#E63946;font-size:0.76rem;font-weight:700;padding:0.25rem 0.6rem;
            border-radius:6px;cursor:pointer;">🗑 Hapus</button>
        </td>
      </tr>`).join('');

    tbody.innerHTML = pendingRows + (rejectedRows ? `
      <tr><td colspan="5" style="padding:0.6rem 1rem;background:rgba(13,7,4,0.5);
        font-size:0.72rem;color:#8E7A68;font-weight:700;letter-spacing:0.5px;">
        DITOLAK SEBELUMNYA
      </td></tr>` + rejectedRows : '');
  }

  async approveAccount(accountId) {
    const result = await window.pepakAuth?.approveAccount(accountId);
    if (result?.ok) {
      const row = document.getElementById(`approval-row-${accountId}`);
      if (row) {
        row.style.transition = 'opacity 0.3s ease';
        row.style.opacity = '0';
        setTimeout(() => this.renderApprovalPanel(), 320);
      } else {
        this.renderApprovalPanel();
      }
      this._showToast('✅ Akun berhasil disetujui. Pengguna sekarang bisa login.', '#2EC4B6');
    } else {
      this._showToast('❌ Gagal menyetujui akun: ' + result?.error, '#E63946');
    }
  }

  async rejectAccount(accountId) {
    if (!confirm('Tolak pendaftaran ini? Pengguna tidak akan bisa login.')) return;
    const result = await window.pepakAuth?.rejectAccount(accountId);
    if (result?.ok) {
      this.renderApprovalPanel();
      this._showToast('Pendaftaran ditolak.', '#FF9E00');
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     BADGE PENDING DI TAB
  ══════════════════════════════════════════════════════════════════════ */
  async _updatePendingBadge() {
    const count = await window.pepakAuth?.getPendingCount() || 0;
    const badge = document.getElementById('admin-pending-badge');
    if (!badge) return;
    if (count > 0) {
      badge.style.display = 'flex';
      badge.textContent   = count > 9 ? '9+' : String(count);
    } else {
      badge.style.display = 'none';
    }
  }

  /* Tab switch admin */
  showAdminTab(tab) {
    const usersPanel    = document.getElementById('admin-panel-users');
    const approvalPanel = document.getElementById('admin-panel-approvals');
    if (!usersPanel || !approvalPanel) return;
    if (tab === 'users') {
      usersPanel.style.display    = '';
      approvalPanel.style.display = 'none';
      this.renderAdminPanel();
    } else {
      usersPanel.style.display    = 'none';
      approvalPanel.style.display = '';
      this.renderApprovalPanel();
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     TOAST NOTIFIKASI
  ══════════════════════════════════════════════════════════════════════ */
  _showToast(text, color = '#D4A64C') {
    const existing = document.getElementById('auth-ui-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'auth-ui-toast';
    toast.style.cssText = `
      position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);
      background:#1A0F08;border:1.5px solid ${color};color:#F0E6D2;
      font-size:0.88rem;font-weight:600;padding:0.85rem 1.5rem;
      border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,0.7);
      z-index:9998;max-width:90vw;white-space:pre-line;
      animation:rbacToastIn 0.25s ease;`;
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }
}

/* ── INISIALISASI ─────────────────────────────────────────────────────────── */
window.pepakAuthUI = new PepakAuthUI();

document.addEventListener('DOMContentLoaded', () => {
  window.pepakAuthUI.init();
});

/**
 * PEPAK DIGITAL — RBAC (Role-Based Access Control)
 * ═══════════════════════════════════════════════════════════════════════
 * Mengatur visibilitas UI, proteksi route, dan hak akses berdasarkan role
 * yang tersimpan di sesi login (auth.js).
 *
 * File ini TIDAK mengubah kode yang sudah ada — hanya menambahkan lapisan
 * kontrol di atasnya dengan cara:
 *   1. Menyembunyikan/menampilkan elemen berdasarkan role
 *   2. Memblokir navigasi ke view yang tidak diizinkan
 *   3. Memberi akses PRO otomatis untuk guru & admin
 *   4. Menyimpan state belajar per-akun (bukan global)
 *
 * Role & Hak Akses:
 *   siswa  → view standar, konten PRO terkunci kecuali berlangganan
 *   guru   → semua siswa + akses PRO penuh + mode guru otomatis
 *   admin  → semua guru + panel admin + kelola pengguna
 * ═══════════════════════════════════════════════════════════════════════
 */

class PepakRBAC {

  constructor() {
    /* View yang boleh diakses per role */
    this.ALLOWED_VIEWS = {
      siswa: ['home','characters','pepak','arena','dictionary','leaderboard','profile','pricing','checkout'],
      guru:  ['home','characters','pepak','arena','dictionary','leaderboard','profile','pricing','checkout','teacher'],
      admin: ['home','characters','pepak','arena','dictionary','leaderboard','profile','pricing','checkout','teacher','admin']
    };

    /* Key localStorage untuk state per-akun */
    this.PER_ACCOUNT_KEY = 'pepak_state_per_account_v1';
  }

  /* ════════════════════════════════════════════════════════════════════
     INIT — dipanggil dari auth-ui.js setelah app siap
  ════════════════════════════════════════════════════════════════════ */
  apply(session) {
    if (!session) return;

    const role = session.role || 'siswa';

    /* 1. Muat state belajar akun ini (progress per-akun) */
    this._loadAccountState(session.id, session);

    /* 2. Terapkan hak akses PRO */
    this._applyProAccess(role);

    /* 3. Sembunyikan/tampilkan elemen UI sesuai role */
    this._applyUIVisibility(role);

    /* 4. Pasang proteksi route */
    this._applyRouteGuard(role);

    /* 5. Mode guru otomatis */
    if (role === 'guru' || role === 'admin') {
      this._activateGuruMode();
    }

    /* 6. Patch navigateTo agar proteksi berjalan saat navigasi hash */
    this._patchNavigateTo(role);

    console.log(`[RBAC] Role "${role}" diterapkan untuk akun ${session.id}`);
  }

  /* ════════════════════════════════════════════════════════════════════
     1. STATE PER-AKUN
     Progress XP, streak, nyawa, unit selesai → disimpan per accountId
  ════════════════════════════════════════════════════════════════════ */
  _loadAccountState(accountId, session) {
    if (!accountId || !window.pepakState) return;

    try {
      const allStates = JSON.parse(localStorage.getItem(this.PER_ACCOUNT_KEY) || '{}');

      if (allStates[accountId]) {
        /* Ada state tersimpan untuk akun ini → muat */
        const saved = allStates[accountId];
        window.pepakState.state = {
          ...window.pepakState.getDefaultState(),
          ...saved,
          user: {
            ...window.pepakState.getDefaultState().user,
            ...saved.user,
            /* Pastikan nama & role selalu sinkron dengan akun login */
            name:   session.name,
            email:  session.email,
            role:   session.role,
            avatar: session.avatar
          }
        };
      } else {
        /* Akun baru — buat state fresh dengan data dari sesi */
        const fresh = window.pepakState.getDefaultState();
        fresh.user.name   = session.name;
        fresh.user.email  = session.email;
        fresh.user.role   = session.role;
        fresh.user.avatar = session.avatar;
        /* XP awal berbeda per role */
        fresh.user.xp     = session.role === 'admin' ? 9999
                          : session.role === 'guru'  ? 5000 : 0;
        fresh.user.levelTitle = session.role === 'admin' ? 'Admin Pepak Digital'
                              : session.role === 'guru'  ? 'Ki Pamong Belajar' : 'Ksatria Pemula';
        window.pepakState.state = fresh;
        allStates[accountId] = fresh;
        localStorage.setItem(this.PER_ACCOUNT_KEY, JSON.stringify(allStates));
      }

      /* Override saveState agar otomatis simpan ke slot akun ini */
      const _origSave = window.pepakState.saveState.bind(window.pepakState);
      window.pepakState.saveState = () => {
        _origSave();
        try {
          const all = JSON.parse(localStorage.getItem(this.PER_ACCOUNT_KEY) || '{}');
          all[accountId] = window.pepakState.state;
          localStorage.setItem(this.PER_ACCOUNT_KEY, JSON.stringify(all));
        } catch(e) { /* silent */ }
      };

    } catch(e) {
      console.warn('[RBAC] Gagal muat state per-akun:', e);
    }
  }

  /* ════════════════════════════════════════════════════════════════════
     2. AKSES PRO OTOMATIS (GURU & ADMIN)
     Mengoverride isPremiumUser() agar selalu true untuk guru/admin
  ════════════════════════════════════════════════════════════════════ */
  _applyProAccess(role) {
    if (!window.pepakState) return;

    if (role === 'guru' || role === 'admin') {
      /* Override isPremiumUser — tidak ubah kode asli, hanya patch di runtime */
      window.pepakState.isPremiumUser = () => true;

      /* Set subscription display agar terlihat "PRO Guru" */
      window.pepakState.state.subscription = {
        planId:        'school',
        planName:      role === 'admin' ? 'Admin (Akses Penuh)' : 'Guru / Pamong (Akses PRO Penuh)',
        status:        'active',
        startDate:     new Date().toISOString().split('T')[0],
        expiresAt:     '2099-12-31',
        autoRenew:     false,
        priceFormatted:'Rp 0 (Akses Resmi)'
      };

      /* Nyawa keris tak terbatas */
      window.pepakState.state.user.hearts    = 99;
      window.pepakState.state.user.maxHearts = 99;

      /* Override loseHeart agar tidak berkurang */
      window.pepakState.loseHeart = () => '∞';
    }
  }

  /* ════════════════════════════════════════════════════════════════════
     3. VISIBILITAS UI
     Sembunyikan/tampilkan elemen HTML sesuai role menggunakan
     atribut data-role-show dan data-role-hide yang kita set di sini.
  ════════════════════════════════════════════════════════════════════ */
  _applyUIVisibility(role) {
    /* Daftar aturan: selector → role mana yang BOLEH melihat */
    const showRules = [
      /* Tombol Admin di navbar — hanya admin */
      { sel: '#nav-admin-btn',                        roles: ['admin'] },
      /* Tombol Kemitraan Sekolah di navbar — guru & admin */
      { sel: '[data-view="teacher"]',                 roles: ['guru','admin'] },
      /* Pengaturan mode guru di profil — guru & admin */
      { sel: '#rbac-guru-settings-notice',            roles: ['guru','admin'] },
      /* Tombol Reset Progres di profil — semua (sudah ada) */
    ];

    showRules.forEach(rule => {
      document.querySelectorAll(rule.sel).forEach(el => {
        el.style.display = rule.roles.includes(role) ? '' : 'none';
      });
    });

    /* ── Khusus siswa: sembunyikan nav "Kemitraan Sekolah" ── */
    if (role === 'siswa') {
      document.querySelectorAll('[data-view="teacher"]').forEach(el => {
        el.style.display = 'none';
      });
    }

    /* ── Tampilkan badge role di halaman profil ── */
    this._injectRoleBadgeInProfile(role);

    /* ── Tambahkan notice khusus guru di bagian pengaturan profil ── */
    this._injectGuruNotice(role);

    /* ── Tambahkan panel ringkasan kelas di view teacher untuk guru/admin ── */
    if (role === 'guru' || role === 'admin') {
      this._injectGuruClassSummary();
    }

    /* ── Admin: tampilkan notif di profil ── */
    if (role === 'admin') {
      this._injectAdminQuickAccess();
    }
  }

  /* Inject badge peran di kartu profil */
  _injectRoleBadgeInProfile(role) {
    /* Tambahkan setelah elemen profile-display-role jika belum ada */
    const roleEl = document.getElementById('profile-display-role');
    if (!roleEl || document.getElementById('rbac-role-badge')) return;

    const colors = {
      siswa: 'rgba(212,166,76,0.2)',
      guru:  'rgba(58,134,255,0.2)',
      admin: 'rgba(230,57,70,0.2)'
    };
    const textColors = { siswa:'#D4A64C', guru:'#3A86FF', admin:'#E63946' };
    const borders = { siswa:'rgba(212,166,76,0.4)', guru:'rgba(58,134,255,0.4)', admin:'rgba(230,57,70,0.4)' };
    const labels = { siswa:'🎒 Siswa', guru:'👨‍🏫 Guru / Pamong', admin:'🛡️ Administrator' };

    const badge = document.createElement('span');
    badge.id = 'rbac-role-badge';
    badge.style.cssText = `
      display:inline-block; margin-top:0.4rem;
      background:${colors[role]}; color:${textColors[role]};
      border:1px solid ${borders[role]};
      font-size:0.72rem; font-weight:800; letter-spacing:0.5px;
      padding:0.2rem 0.65rem; border-radius:9999px;`;
    badge.textContent = labels[role] || role.toUpperCase();

    roleEl.insertAdjacentElement('afterend', badge);
  }

  /* Inject notice khusus guru di pengaturan pembelajaran */
  _injectGuruNotice(role) {
    if (role !== 'guru' && role !== 'admin') return;
    if (document.getElementById('rbac-guru-settings-notice')) return;

    /* Cari box pengaturan pembelajaran */
    const settingsBoxes = document.querySelectorAll('.modal-info-box');
    let targetBox = null;
    settingsBoxes.forEach(b => {
      if (b.querySelector('.box-head')?.textContent?.includes('Pengaturan')) {
        targetBox = b;
      }
    });
    if (!targetBox) return;

    const notice = document.createElement('div');
    notice.id = 'rbac-guru-settings-notice';
    notice.style.cssText = `
      margin-top:1rem; padding:0.9rem 1.1rem;
      background:rgba(58,134,255,0.1); border:1px solid rgba(58,134,255,0.3);
      border-radius:12px; font-size:0.85rem; color:#A0C4FF; line-height:1.55;`;
    notice.innerHTML = role === 'admin'
      ? `🛡️ <strong style="color:#E63946;">Mode Admin Aktif.</strong> Anda memiliki akses penuh ke seluruh konten, data pengguna, dan konfigurasi sistem.
         <br><button onclick="window.app.navigateTo('admin')" style="margin-top:0.6rem;display:inline-flex;align-items:center;gap:0.4rem;background:rgba(230,57,70,0.15);border:1px solid rgba(230,57,70,0.4);color:#E63946;font-size:0.8rem;font-weight:700;padding:0.35rem 0.9rem;border-radius:8px;cursor:pointer;">
           🛡️ Buka Panel Admin
         </button>`
      : `👨‍🏫 <strong style="color:#3A86FF;">Mode Guru / Pamong aktif.</strong> Anda memiliki akses PRO penuh ke seluruh 20 unit & konten untuk keperluan mengajar.
         <br><button onclick="window.app.navigateTo('teacher')" style="margin-top:0.6rem;display:inline-flex;align-items:center;gap:0.4rem;background:rgba(58,134,255,0.15);border:1px solid rgba(58,134,255,0.4);color:#3A86FF;font-size:0.8rem;font-weight:700;padding:0.35rem 0.9rem;border-radius:8px;cursor:pointer;">
           📊 Buka Dashboard Kelas
         </button>`;

    targetBox.appendChild(notice);
  }

  /* Inject ringkasan progres siswa di atas teacher dashboard */
  _injectGuruClassSummary() {
    if (document.getElementById('rbac-guru-class-summary')) return;

    /* Pasang observer — tunggu view-teacher aktif */
    const observer = new MutationObserver(() => {
      const container = document.getElementById('teacher-dashboard-container');
      if (!container || document.getElementById('rbac-guru-class-summary')) return;

      const summary = document.createElement('div');
      summary.id = 'rbac-guru-class-summary';
      summary.style.cssText = `
        background:rgba(58,134,255,0.08); border:1px solid rgba(58,134,255,0.25);
        border-radius:16px; padding:1.2rem 1.4rem; margin-bottom:1.5rem;`;
      summary.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.9rem;">
          <span style="font-size:1.4rem;">👨‍🏫</span>
          <div>
            <div style="font-family:'Cinzel',serif; font-size:1rem; color:#3A86FF; font-weight:800;">
              Mode Guru / Pamong Aktif
            </div>
            <div style="font-size:0.8rem; color:#8E7A68;">
              Akses PRO penuh aktif • Semua unit & konten terbuka untuk mengajar
            </div>
          </div>
          <span style="margin-left:auto; font-size:0.72rem; font-weight:800; padding:0.2rem 0.65rem;
            background:rgba(58,134,255,0.15); color:#3A86FF; border:1px solid rgba(58,134,255,0.35);
            border-radius:9999px;">GURU PRO</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:0.7rem;">
          ${this._buildGuruStatCards()}
        </div>`;

      container.insertBefore(summary, container.firstChild);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  _buildGuruStatCards() {
    /* Ambil data siswa dari teacherClassData yang sudah ada */
    const data = window.PEPAK_DATA?.teacherClassData || {};
    const students = data.students || [];
    const avgXP    = students.length
      ? Math.round(students.reduce((s,st) => s + (st.avgQuizScore || 0), 0) / students.length)
      : 0;

    const cards = [
      { icon:'👥', val: data.totalStudents || students.length, lbl:'Total Siswa' },
      { icon:'📊', val: (data.averageScore || avgXP) + '%', lbl:'Rata-rata Nilai' },
      { icon:'✅', val: data.activeSubscribers || students.length, lbl:'Siswa Aktif' },
      { icon:'📚', val: '20 Unit', lbl:'Akses Penuh' }
    ];

    return cards.map(c => `
      <div style="background:rgba(13,7,4,0.5); border:1px solid rgba(58,134,255,0.18);
        border-radius:12px; padding:0.85rem 0.7rem; text-align:center;">
        <span style="font-size:1.3rem;">${c.icon}</span>
        <div style="font-family:'Cinzel',serif; font-size:1.2rem; font-weight:800;
          color:#3A86FF; margin:0.2rem 0;">${c.val}</div>
        <div style="font-size:0.72rem; color:#8E7A68;">${c.lbl}</div>
      </div>`).join('');
  }

  /* Inject quick-access admin di profil */
  _injectAdminQuickAccess() {
    if (document.getElementById('rbac-admin-quick-access')) return;

    /* Pasang setelah profile-subscription-card */
    const subCard = document.getElementById('profile-subscription-card');
    if (!subCard) return;

    const panel = document.createElement('div');
    panel.id = 'rbac-admin-quick-access';
    panel.style.cssText = `
      background:rgba(230,57,70,0.08); border:1px solid rgba(230,57,70,0.25);
      border-radius:16px; padding:1.2rem 1.4rem; margin-bottom:1.5rem;`;
    panel.innerHTML = `
      <h3 style="font-family:'Cinzel',serif; font-size:1rem; color:#E63946; margin-bottom:0.8rem;">
        🛡️ Panel Admin — Akses Cepat
      </h3>
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
        <button onclick="window.app.navigateTo('admin')"
          style="display:flex;align-items:center;gap:0.4rem;background:rgba(230,57,70,0.15);
          border:1px solid rgba(230,57,70,0.4);color:#E63946;font-size:0.85rem;font-weight:700;
          padding:0.5rem 1rem;border-radius:10px;cursor:pointer;">
          👥 Kelola Pengguna
        </button>
        <button onclick="window.app.navigateTo('teacher')"
          style="display:flex;align-items:center;gap:0.4rem;background:rgba(58,134,255,0.12);
          border:1px solid rgba(58,134,255,0.35);color:#3A86FF;font-size:0.85rem;font-weight:700;
          padding:0.5rem 1rem;border-radius:10px;cursor:pointer;">
          📊 Dashboard Kelas
        </button>
        <button onclick="window.rbac._showAdminDataPanel()"
          style="display:flex;align-items:center;gap:0.4rem;background:rgba(212,166,76,0.12);
          border:1px solid rgba(212,166,76,0.3);color:#D4A64C;font-size:0.85rem;font-weight:700;
          padding:0.5rem 1rem;border-radius:10px;cursor:pointer;">
          📋 Semua Transaksi
        </button>
        <button onclick="window.rbac._showGrantProModal()"
          style="display:flex;align-items:center;gap:0.4rem;background:rgba(46,196,182,0.12);
          border:1px solid rgba(46,196,182,0.3);color:#2EC4B6;font-size:0.85rem;font-weight:700;
          padding:0.5rem 1rem;border-radius:10px;cursor:pointer;">
          👑 Beri Akses PRO
        </button>
      </div>`;

    subCard.insertAdjacentElement('afterend', panel);
  }

  /* ════════════════════════════════════════════════════════════════════
     4. PROTEKSI ROUTE
     Blokir akses langsung ke view yang tidak diizinkan untuk role ini
  ════════════════════════════════════════════════════════════════════ */
  _applyRouteGuard(role) {
    /* Simpan allowed views untuk dipakai oleh patch navigateTo */
    this._currentAllowed = this.ALLOWED_VIEWS[role] || this.ALLOWED_VIEWS['siswa'];

    /* Cek hash URL saat ini — jika tidak boleh, redirect ke home */
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && !this._currentAllowed.includes(currentHash)) {
      this._showAccessDenied(currentHash, role);
      window.location.hash = 'home';
    }
  }

  /* Patch window.app.navigateTo agar memeriksa izin sebelum navigasi */
  _patchNavigateTo(role) {
    if (!window.app || window.app._rbacPatched) return;

    const _origNav = window.app.navigateTo.bind(window.app);
    const allowed  = this.ALLOWED_VIEWS[role] || this.ALLOWED_VIEWS['siswa'];

    window.app.navigateTo = (viewName) => {
      if (!allowed.includes(viewName)) {
        this._showAccessDenied(viewName, role);
        return;
      }
      _origNav(viewName);
    };

    window.app._rbacPatched = true;
  }

  /* Tampilkan notifikasi akses ditolak (ringan, tidak redirect paksa) */
  _showAccessDenied(view, role) {
    const roleNames = { siswa:'Siswa', guru:'Guru', admin:'Admin' };
    const viewNames = { teacher:'Dashboard Guru', admin:'Panel Admin', checkout:'Checkout' };

    /* Buat toast notifikasi */
    const existing = document.getElementById('rbac-access-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'rbac-access-toast';
    toast.style.cssText = `
      position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%);
      background:#1A0F08; border:1.5px solid #E63946;
      color:#F0E6D2; font-size:0.88rem; font-weight:600;
      padding:0.85rem 1.5rem; border-radius:12px;
      box-shadow:0 8px 28px rgba(0,0,0,0.7);
      z-index:9998; display:flex; align-items:center; gap:0.6rem;
      max-width:90vw; animation:rbacToastIn 0.25s ease;`;
    toast.innerHTML = `
      <span>🚫</span>
      <span>Halaman <strong>${viewNames[view] || view}</strong> tidak tersedia untuk peran <strong>${roleNames[role] || role}</strong>.</span>`;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  /* ════════════════════════════════════════════════════════════════════
     5. MODE GURU OTOMATIS
  ════════════════════════════════════════════════════════════════════ */
  _activateGuruMode() {
    /* Gunakan setRole yang sudah ada di state.js */
    window.pepakState?.setRole('guru');
  }

  /* ════════════════════════════════════════════════════════════════════
     ADMIN TOOLS
  ════════════════════════════════════════════════════════════════════ */

  /* Tampilkan panel semua transaksi (semua akun) */
  _showAdminDataPanel() {
    const accounts = window.pepakAuth?.getAllAccounts() || [];

    /* Kumpulkan semua invoice dari semua akun di per-account storage */
    let allTx = [];
    try {
      const allStates = JSON.parse(localStorage.getItem(this.PER_ACCOUNT_KEY) || '{}');
      accounts.forEach(acc => {
        const st = allStates[acc.id];
        if (st?.invoices) {
          st.invoices.forEach(inv => {
            allTx.push({ ...inv, _accountName: acc.name, _accountEmail: acc.email });
          });
        }
      });
    } catch(e) { /* silent */ }

    /* Tampilkan di modal ringan */
    this._openModal('📋 Semua Riwayat Transaksi', `
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.84rem;">
          <thead>
            <tr style="background:rgba(13,7,4,0.85);">
              <th style="padding:0.7rem;text-align:left;color:#D4A64C;font-size:0.72rem;">Akun</th>
              <th style="padding:0.7rem;text-align:left;color:#D4A64C;font-size:0.72rem;">Invoice</th>
              <th style="padding:0.7rem;text-align:left;color:#D4A64C;font-size:0.72rem;">Paket</th>
              <th style="padding:0.7rem;text-align:left;color:#D4A64C;font-size:0.72rem;">Nominal</th>
              <th style="padding:0.7rem;text-align:left;color:#D4A64C;font-size:0.72rem;">Tanggal</th>
              <th style="padding:0.7rem;text-align:left;color:#D4A64C;font-size:0.72rem;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${allTx.length === 0
              ? `<tr><td colspan="6" style="padding:1.5rem;text-align:center;color:#8E7A68;">Belum ada transaksi tercatat.</td></tr>`
              : allTx.map(t => `
                <tr style="border-bottom:1px solid rgba(212,166,76,0.07);">
                  <td style="padding:0.7rem;color:#C8B89E;">${t._accountName}<br><span style="font-size:0.72rem;color:#8E7A68;">${t._accountEmail}</span></td>
                  <td style="padding:0.7rem;color:#D4A64C;font-family:monospace;font-size:0.78rem;">${t.id}</td>
                  <td style="padding:0.7rem;">${t.planName}</td>
                  <td style="padding:0.7rem;font-weight:700;color:#F0E6D2;">${t.amountFormatted}</td>
                  <td style="padding:0.7rem;color:#8E7A68;">${t.date}</td>
                  <td style="padding:0.7rem;"><span style="font-size:0.72rem;font-weight:800;background:rgba(46,196,182,0.15);color:#2EC4B6;padding:0.15rem 0.5rem;border-radius:6px;">${t.status}</span></td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>`);
  }

  /* Beri akses PRO gratis ke akun tertentu */
  _showGrantProModal() {
    const accounts = window.pepakAuth?.getAllAccounts() || [];
    const options = accounts
      .filter(a => a.role === 'siswa')
      .map(a => `<option value="${a.id}">${a.name} (${a.email})</option>`)
      .join('');

    if (!options) {
      this._openModal('👑 Beri Akses PRO', '<p style="color:#8E7A68;padding:1rem;">Tidak ada akun siswa terdaftar.</p>');
      return;
    }

    this._openModal('👑 Beri Akses PRO Gratis', `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <p style="color:#C8B89E;font-size:0.88rem;">
          Pilih akun siswa yang ingin diberikan akses PRO gratis (disimpan di localStorage).
        </p>
        <select id="rbac-grant-select"
          style="background:rgba(13,7,4,0.8);border:1.5px solid rgba(212,166,76,0.3);
          color:#F0E6D2;border-radius:10px;padding:0.7rem 1rem;font-size:0.9rem;outline:none;">
          ${options}
        </select>
        <select id="rbac-grant-duration"
          style="background:rgba(13,7,4,0.8);border:1.5px solid rgba(212,166,76,0.3);
          color:#F0E6D2;border-radius:10px;padding:0.7rem 1rem;font-size:0.9rem;outline:none;">
          <option value="30">30 Hari</option>
          <option value="90">3 Bulan</option>
          <option value="180">6 Bulan</option>
          <option value="365" selected>1 Tahun</option>
          <option value="36500">Selamanya</option>
        </select>
        <button onclick="window.rbac._grantPro()"
          style="background:linear-gradient(135deg,#F3E7C4,#D4A64C);color:#1A0F08;font-weight:800;
          padding:0.8rem;border:none;border-radius:10px;cursor:pointer;font-size:0.95rem;">
          👑 Berikan Akses PRO
        </button>
      </div>`);
  }

  _grantPro() {
    const accountId = document.getElementById('rbac-grant-select')?.value;
    const days      = parseInt(document.getElementById('rbac-grant-duration')?.value || '365');
    if (!accountId) return;

    try {
      const allStates = JSON.parse(localStorage.getItem(this.PER_ACCOUNT_KEY) || '{}');
      if (!allStates[accountId]) allStates[accountId] = {};

      const expiry = new Date();
      expiry.setDate(expiry.getDate() + days);

      allStates[accountId].subscription = {
        planId:        'yearly',
        planName:      'Ksatria Maharesi PRO (Pemberian Admin)',
        status:        'active',
        startDate:     new Date().toISOString().split('T')[0],
        expiresAt:     expiry.toISOString().split('T')[0],
        autoRenew:     false,
        priceFormatted:'Rp 0 (Gratis dari Admin)'
      };

      localStorage.setItem(this.PER_ACCOUNT_KEY, JSON.stringify(allStates));
      document.getElementById('rbac-modal-overlay')?.remove();
      alert(`✅ Akses PRO berhasil diberikan selama ${days} hari.`);
    } catch(e) {
      alert('Terjadi kesalahan: ' + e.message);
    }
  }

  /* Reset progres akun tertentu (admin) */
  resetAccountProgress(accountId) {
    if (!window.pepakAuth?.isAdmin()) return false;
    try {
      const allStates = JSON.parse(localStorage.getItem(this.PER_ACCOUNT_KEY) || '{}');
      delete allStates[accountId];
      localStorage.setItem(this.PER_ACCOUNT_KEY, JSON.stringify(allStates));
      return true;
    } catch(e) { return false; }
  }

  /* ════════════════════════════════════════════════════════════════════
     MODAL HELPER (ringan, tanpa library)
  ════════════════════════════════════════════════════════════════════ */
  _openModal(title, bodyHtml) {
    document.getElementById('rbac-modal-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'rbac-modal-overlay';
    overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.82);
      backdrop-filter:blur(8px); z-index:9000;
      display:flex; align-items:center; justify-content:center; padding:1rem;`;

    overlay.innerHTML = `
      <div style="background:linear-gradient(160deg,#2A1B10,#1A0F08);
        border:1.5px solid rgba(212,166,76,0.38); border-radius:20px;
        max-width:680px; width:100%; max-height:85vh; overflow-y:auto;
        padding:1.8rem; box-shadow:0 30px 70px rgba(0,0,0,0.85); position:relative;">
        <button onclick="document.getElementById('rbac-modal-overlay').remove()"
          style="position:absolute;top:0.9rem;right:0.9rem;width:36px;height:36px;
          border-radius:50%;background:rgba(42,27,16,0.8);border:1px solid rgba(212,166,76,0.25);
          color:#C8B89E;font-size:1rem;cursor:pointer;display:flex;
          align-items:center;justify-content:center;">✕</button>
        <h3 style="font-family:'Cinzel',serif;font-size:1.15rem;color:#D4A64C;margin-bottom:1.2rem;">
          ${title}
        </h3>
        ${bodyHtml}
      </div>`;

    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   CSS untuk toast notifikasi
────────────────────────────────────────────────────────────────────────── */
(function injectRBACStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rbacToastIn {
      from { opacity:0; transform:translateX(-50%) translateY(12px); }
      to   { opacity:1; transform:translateX(-50%) translateY(0); }
    }
    /* Sembunyikan nav Kemitraan Sekolah untuk siswa — override saat DOM siap */
    body.rbac-role-siswa [data-view="teacher"] { display:none !important; }
  `;
  document.head.appendChild(style);
})();

/* ──────────────────────────────────────────────────────────────────────────
   INISIALISASI GLOBAL
────────────────────────────────────────────────────────────────────────── */
window.rbac = new PepakRBAC();

/* Hook ke auth-ui._enterApp — patch ringan agar RBAC terpanggil setelah login */
(function hookAuthUI() {
  const waitForAuthUI = setInterval(() => {
    if (!window.pepakAuthUI) return;
    clearInterval(waitForAuthUI);

    const _origEnter = window.pepakAuthUI._enterApp.bind(window.pepakAuthUI);

    window.pepakAuthUI._enterApp = function(session, animate) {
      _origEnter(session, animate);

      /* Terapkan RBAC setelah app siap */
      const applyRBAC = () => {
        if (window.app && window.pepakState) {
          window.rbac.apply(session);
          /* Tambahkan class role ke body untuk CSS targeting */
          document.body.className = document.body.className
            .replace(/rbac-role-\w+/g, '')
            .trim();
          document.body.classList.add(`rbac-role-${session.role}`);
          /* Refresh HUD & profil */
          window.app.updateStatsHUD?.();
          if (window.app.currentView === 'profile') window.app.renderProfile?.();
        } else {
          setTimeout(applyRBAC, 120);
        }
      };
      setTimeout(applyRBAC, 150);
    };

  }, 50);
})();

/**
 * PEPAK DIGITAL - MAIN APPLICATION COORDINATOR
 * Mengatur router SPA, 20 Unit Duolingo, Flashcards, Kamus 500+, Arena 8 Tipe Soal & Spaced Repetition
 */

class PepakApp {
  constructor() {
    this.currentView = "home";
    this.views = ["home", "characters", "pepak", "arena", "leaderboard", "dictionary", "profile", "pricing", "checkout", "teacher", "admin"];
  }

  init() {
    // 1. Inisialisasi State
    window.pepakState?.checkAndUpdateStreak();
    this.updateStatsHUD();

    // 2. Inisialisasi Modul
    window.charactersModule?.init();
    window.dictionaryModule?.init();
    window.paymentEngine?.init();
    window.teacherModule?.init();

    // 3. Render Komponen Utama
    this.renderDuolingoSkillTree();
    this.renderLeaderboard();
    this.renderProfile();
    this.initNavbarSearch();
    this.initMobileNav();

    // 4. Handle URL Hash Router
    window.addEventListener("hashchange", () => this.handleHashChange());
    this.handleHashChange();

    // 5. Subscribe state listener
    window.pepakState?.subscribe(() => {
      this.updateStatsHUD();
      this.renderDuolingoSkillTree();
      this.renderLeaderboard();
      this.renderProfile();
      window.charactersModule?.renderCharacterGrid();
      if (this.currentView === "pricing") window.paymentEngine?.renderPricingPage();
      if (this.currentView === "dictionary") window.dictionaryModule?.renderDictionary();
    });

    console.log("🌸 Pepak Digital Web App (20 Unit, 500+ Kosakata & Spaced Repetition) Siap!");
  }

  // --- SPA ROUTER NAVIGATION ---
  navigateTo(viewName) {
    if (!this.views.includes(viewName)) viewName = "home";
    this.currentView = viewName;
    window.location.hash = viewName;

    // Sembunyikan semua section view
    document.querySelectorAll(".spa-view-section").forEach(sec => {
      sec.classList.remove("active-view");
    });

    // Tampilkan view yang aktif
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add("active-view");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Update active nav button
    document.querySelectorAll(".nav-link-btn").forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Jalankan inisialisasi spesifik view
    if (viewName === "home") {
      window.dictionaryModule?.renderWordOfTheDay();
    } else if (viewName === "characters") {
      window.charactersModule?.renderCharacterGrid();
    } else if (viewName === "pepak") {
      this.renderDuolingoSkillTree();
    } else if (viewName === "pricing") {
      window.paymentEngine?.renderPricingPage();
    } else if (viewName === "checkout") {
      window.paymentEngine?.renderCheckoutSummary();
    } else if (viewName === "teacher") {
      window.teacherModule?.renderTeacherDashboard();
    } else if (viewName === "dictionary") {
      window.dictionaryModule?.renderDictionary();
    } else if (viewName === "leaderboard") {
      this.renderLeaderboard();
    } else if (viewName === "profile") {
      this.renderProfile();
    } else if (viewName === "admin") {
      window.pepakAuthUI?.renderAdminPanel();
    }
  }

  handleHashChange() {
    const hash = window.location.hash.replace("#", "");
    if (hash && this.views.includes(hash)) {
      this.navigateTo(hash);
    } else {
      this.navigateTo("home");
    }
  }

  // --- TOP HUD BAR UPDATER ---
  updateStatsHUD() {
    const state = window.pepakState?.state || {};
    const user = state.user || {};
    const isPro = window.pepakState?.isPremiumUser();

    const heartsEl = document.querySelectorAll(".hud-hearts-val");
    const streakEl = document.querySelectorAll(".hud-streak-val");
    const xpEl = document.querySelectorAll(".hud-xp-val");
    const levelEl = document.querySelectorAll(".hud-level-val");

    heartsEl.forEach(el => {
      el.textContent = isPro ? "∞" : `${user.hearts || 5}/${user.maxHearts || 5}`;
    });
    streakEl.forEach(el => el.textContent = `${user.streak || 1} Dina`);
    xpEl.forEach(el => el.textContent = `${user.xp || 0} XP`);
    levelEl.forEach(el => el.textContent = user.levelTitle || "Ksatria Pemula");

    const navSubPill = document.getElementById("nav-sub-status-pill");
    if (navSubPill) {
      if (isPro) {
        navSubPill.innerHTML = `👑 PRO AKTIF`;
        navSubPill.className = "nav-pro-badge active";
      } else {
        navSubPill.innerHTML = `👑 Upgrade PRO`;
        navSubPill.className = "nav-pro-badge upgrade";
      }
    }
  }

  // --- DUOLINGO SKILL TREE RENDERER (20 UNIT PROGRESIF) ---
  renderDuolingoSkillTree() {
    const container = document.getElementById("duolingo-path-container");
    if (!container) return;

    const units = window.PEPAK_DATA?.units || [];
    const state = window.pepakState?.state || {};
    const completed = state.completedNodes || {};
    const unlocked = state.unlockedNodes || ["node-1-1"];
    const isProUser = window.pepakState?.isPremiumUser();

    let html = "";

    // Header Tingkatan Kasatriyan
    const tierLabels = {
      1: "TINGKAT 1: KASATRIYAN DHASAR (Unit 1 - 5)",
      6: "TINGKAT 2: KASATRIYAN MADYA (Unit 6 - 10)",
      11: "TINGKAT 3: KASATRIYAN UTAMA (Unit 11 - 15)",
      16: "TINGKAT 4: KASATRIYAN MAHARESI (Unit 16 - 20)"
    };

    units.forEach((unit, unitIdx) => {
      const isUnitLockedByPaywall = unit.isPremium && !isProUser;

      if (tierLabels[unit.number]) {
        html += `
          <div class="duo-tier-divider">
            <span class="tier-divider-badge">${tierLabels[unit.number]}</span>
          </div>
        `;
      }

      html += `
        <div class="duo-unit-section ${isUnitLockedByPaywall ? 'unit-paywall-locked' : ''}" style="--unit-theme: ${unit.themeColor};">
          <div class="duo-unit-banner" onclick="${isUnitLockedByPaywall ? `window.paymentEngine.showPaywall('${unit.title}')` : ''}" style="${isUnitLockedByPaywall ? 'cursor:pointer;' : ''}">
            <div class="unit-banner-left">
              <span class="unit-icon-badge">${unit.icon}</span>
              <div>
                <h3 class="unit-title">
                  ${unit.title}
                  ${unit.isPremium ? `<span class="pro-badge-pill">PRO</span>` : ""}
                </h3>
                <p class="unit-desc">${unit.description}</p>
              </div>
            </div>
            <div class="unit-banner-right">
              ${isUnitLockedByPaywall ? `
                <span class="unit-progress-tag" style="background:rgba(212,166,76,0.3); border-color:#D4A64C;">🔒 Butuh Langganan PRO</span>
              ` : `
                <span class="unit-progress-tag">${this.calculateUnitProgress(unit, completed)}% Rampung</span>
              `}
            </div>
          </div>

          <div class="duo-nodes-track">
            ${unit.nodes.map((node, nodeIdx) => {
              const isDone = !!completed[node.id];
              const isUnlocked = (isDone || unlocked.includes(node.id) || (nodeIdx === 0 && unitIdx === 0)) && !isUnitLockedByPaywall;
              const stars = isDone ? (completed[node.id].stars || 3) : 0;
              
              const offsetPattern = [0, 50, 0, -50, 0];
              const offsetX = offsetPattern[nodeIdx % offsetPattern.length];

              return `
                <div class="duo-node-wrapper" style="transform: translateX(${offsetX}px);">
                  <button class="duo-circle-node ${isDone ? "completed" : ""} ${isUnlocked ? "unlocked" : "locked"} ${isUnitLockedByPaywall ? 'paywall-node' : ''}"
                    data-node-id="${node.id}"
                    onclick="window.app.handleNodeClick('${node.id}', ${isUnlocked}, ${isUnitLockedByPaywall}, '${unit.title}')">
                    
                    <div class="node-inner-circle">
                      <span class="node-main-icon">${isUnitLockedByPaywall ? "🔒" : isUnlocked ? node.icon : "🔒"}</span>
                    </div>

                    ${isDone ? `
                      <div class="node-stars-crown">
                        ${Array(3).fill(0).map((_, s) => `
                          <span class="crown-star ${s < stars ? "active" : ""}">⭐</span>
                        `).join("")}
                      </div>
                    ` : ""}

                    ${isUnlocked && !isDone ? `<div class="node-pulse-ring"></div>` : ""}
                  </button>

                  <div class="node-info-label">
                    <span class="node-label-title">${node.title}</span>
                    <span class="node-label-xp">+${node.xp} XP</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  calculateUnitProgress(unit, completedNodes) {
    if (!unit.nodes || unit.nodes.length === 0) return 0;
    const finishedCount = unit.nodes.filter(n => !!completedNodes[n.id]).length;
    return Math.round((finishedCount / unit.nodes.length) * 100);
  }

  handleNodeClick(nodeId, isUnlocked, isUnitLockedByPaywall, unitTitle) {
    if (isUnitLockedByPaywall) {
      window.paymentEngine?.showPaywall(unitTitle);
      return;
    }

    if (!isUnlocked) {
      window.audioEngine?.playError();
      alert("⚠️ Bab iki taksih kuncèn (terkunci). Rampungake piwulang sadurunge kanggo mbukak!");
      return;
    }

    window.audioEngine?.playClick();
    window.quizEngine?.startLesson(nodeId);
  }

  // --- LEADERBOARD RENDERER ---
  renderLeaderboard() {
    const container = document.getElementById("leaderboard-rows-container");
    const podiumContainer = document.getElementById("leaderboard-podium-container");
    if (!container) return;

    const list = (window.PEPAK_DATA?.leaderboard || []).slice();
    const userRow = list.find(r => r.isCurrentUser);
    if (userRow) {
      userRow.xp = window.pepakState?.state.user.xp || 450;
      userRow.streak = window.pepakState?.state.user.streak || 3;
      userRow.name = `${window.pepakState?.state.user.name} (Panjenengan)`;
    }

    list.sort((a, b) => b.xp - a.xp);

    if (podiumContainer && list.length >= 3) {
      podiumContainer.innerHTML = `
        <div class="podium-item rank-2">
          <div class="podium-crown">🥈</div>
          <div class="podium-avatar">${this.getLeaderboardAvatarSvg(list[1].avatar)}</div>
          <h4 class="podium-name">${list[1].name}</h4>
          <span class="podium-xp">${list[1].xp} XP</span>
          <div class="podium-pillar pillar-2">2</div>
        </div>

        <div class="podium-item rank-1">
          <div class="podium-crown">👑 1</div>
          <div class="podium-avatar champion">${this.getLeaderboardAvatarSvg(list[0].avatar)}</div>
          <h4 class="podium-name gold-text">${list[0].name}</h4>
          <span class="podium-xp">${list[0].xp} XP</span>
          <div class="podium-pillar pillar-1">1</div>
        </div>

        <div class="podium-item rank-3">
          <div class="podium-crown">🥉</div>
          <div class="podium-avatar">${this.getLeaderboardAvatarSvg(list[2].avatar)}</div>
          <h4 class="podium-name">${list[2].name}</h4>
          <span class="podium-xp">${list[2].xp} XP</span>
          <div class="podium-pillar pillar-3">3</div>
        </div>
      `;
    }

    container.innerHTML = list.map((item, idx) => `
      <tr class="leader-row ${item.isCurrentUser ? "current-user-row" : ""}">
        <td class="leader-col-rank">
          <span class="rank-badge ${idx < 3 ? "rank-top" : ""}">${idx + 1}</span>
        </td>
        <td class="leader-col-user">
          <div class="leader-user-info">
            <div class="mini-avatar-ico">${this.getLeaderboardAvatarSvg(item.avatar, 36)}</div>
            <div>
              <strong>${item.name}</strong>
              <span class="leader-user-title">${item.badge}</span>
            </div>
          </div>
        </td>
        <td class="leader-col-streak">
          <span class="streak-badge">🔥 ${item.streak} dina</span>
        </td>
        <td class="leader-col-xp">
          <span class="xp-badge">⚡ ${item.xp} XP</span>
        </td>
      </tr>
    `).join("");
  }

  getLeaderboardAvatarSvg(avatarType, size = 50) {
    return `<div class="avatar-svg-circle" style="width:${size}px; height:${size}px; display:inline-flex; align-items:center; justify-content:center; background:#2A1B10; border-radius:50%; border:1px solid #D4A64C55;">🎭</div>`;
  }

  // --- PROFIL, STATUS SUBSCRIPTION & INVOICES RENDERER ---
  renderProfile() {
    const state = window.pepakState?.state || {};
    const user = state.user || {};
    const sub = state.subscription || {};
    const invoices = state.invoices || [];
    const favorites = state.favoriteWords || [];
    const mistakes = state.mistakeBank || [];
    const achievements = window.PEPAK_DATA?.achievements || [];
    const isPro = window.pepakState?.isPremiumUser();

    const nameDisplay = document.getElementById("profile-display-name");
    const roleDisplay = document.getElementById("profile-display-role");
    const levelDisplay = document.getElementById("profile-display-level");
    const xpDisplay = document.getElementById("profile-display-xp");
    const streakDisplay = document.getElementById("profile-display-streak");
    const badgesContainer = document.getElementById("profile-badges-container");

    if (nameDisplay) nameDisplay.textContent = user.name;
    if (roleDisplay) roleDisplay.textContent = user.role === "guru" ? "👨‍🏫 Guru / Pamong Belajar" : "🎒 Siswa Ksatria Jawa";
    if (levelDisplay) levelDisplay.textContent = user.levelTitle;
    if (xpDisplay) xpDisplay.textContent = `${user.xp} XP`;
    if (streakDisplay) streakDisplay.textContent = `${user.streak} Dina Beruntun`;

    // Render Subscription Status Card
    const subCard = document.getElementById("profile-subscription-card");
    if (subCard) {
      subCard.innerHTML = `
        <div class="profile-sub-box">
          <div class="sub-header-row">
            <div>
              <span class="pro-badge-pill" style="font-size:0.8rem; margin:0 0 0.4rem 0;">STATUS BERLANGGANAN</span>
              <h3 class="sub-plan-title">${sub.planName || "Ksatria Siswa (Gratis)"}</h3>
              <p class="text-muted" style="font-size:0.85rem;">
                ${isPro ? `Masa Aktif Hingga: <strong>${sub.expiresAt || 'Aktif'}</strong> (Perpanjangan Otomatis: ${sub.autoRenew ? 'Ya' : 'Tidak'})` : 'Akses terbatas Unit 1-2 & 5 Tokoh wayang.'}
              </p>
            </div>
            <div>
              <button class="btn-gold-action" onclick="window.app.navigateTo('pricing')">
                ${isPro ? "👑 Kelola / Ganti Paket" : "⭐ Upgrade ke Premium (Buka Semua 20 Unit)"}
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // Render Spaced Repetition / Learning Stats Card
    const reviewStatsBox = document.getElementById("profile-learning-stats-box");
    if (reviewStatsBox) {
      reviewStatsBox.innerHTML = `
        <div class="review-stats-card">
          <div>
            <h4 style="color:var(--gold-light); font-size:1.15rem; margin-bottom:0.3rem;">📊 Ringkasan Penguasaan Kosakata</h4>
            <p style="font-size:0.88rem; color:var(--text-secondary);">
              ⭐ <strong>${favorites.length}</strong> Kata Disimpan ke Favorit • 
              📝 <strong>${mistakes.length}</strong> Soal dalam Bank Kesalahan (Spaced Repetition)
            </p>
          </div>
          <div style="display:flex; gap:0.8rem; flex-wrap:wrap;">
            <button class="btn-gold-action" onclick="window.quizEngine.startSpacedRepetitionQuiz()">
              🔄 Latihan Soal Sulit (${mistakes.length})
            </button>
            <button class="btn-outline-gold" onclick="window.app.navigateTo('dictionary'); window.dictionaryModule.setFavoritesOnly(true);">
              ⭐ Buka Kata Favorit
            </button>
          </div>
        </div>
      `;
    }

    // Render Invoices Table
    const invTbody = document.getElementById("profile-invoices-tbody");
    if (invTbody) {
      if (invoices.length === 0) {
        invTbody.innerHTML = `<tr><td colspan="6" class="empty-table-cell">Belum ada riwayat transaksi.</td></tr>`;
      } else {
        invTbody.innerHTML = invoices.map(inv => `
          <tr>
            <td><strong>${inv.id}</strong></td>
            <td>${inv.date}</td>
            <td>${inv.planName}</td>
            <td><strong>${inv.amountFormatted}</strong></td>
            <td><span class="status-pill status-sangat-baik">${inv.status}</span></td>
            <td>
              <button class="mini-sound-btn" onclick="window.paymentEngine.openInvoiceModal(${JSON.stringify(inv).replace(/"/g, '&quot;')})" title="Lihat & Unduh Invoice">
                📄 Unduh Invoice
              </button>
            </td>
          </tr>
        `).join("");
      }
    }

    if (badgesContainer) {
      badgesContainer.innerHTML = achievements.map(ach => `
        <div class="badge-card ${ach.unlocked ? "unlocked" : "locked"}">
          <div class="badge-icon-wrap">${ach.icon}</div>
          <div class="badge-text-wrap">
            <h4 class="badge-title">${ach.title}</h4>
            <p class="badge-desc">${ach.desc}</p>
          </div>
          <span class="badge-status-pill">${ach.unlocked ? "Kagayuh" : "Terkunci"}</span>
        </div>
      `).join("");
    }
  }

  // --- NAVBAR SEARCH AUTOCOMPLETE ---
  initNavbarSearch() {
    const searchInputs = document.querySelectorAll(".global-character-search");
    searchInputs.forEach(input => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const query = input.value.trim();
          if (query) {
            window.charactersModule?.setSearch(query);
            this.navigateTo("characters");
          }
        }
      });
    });
  }

  // --- MOBILE NAVIGATION TOGGLE ---
  initMobileNav() {
    const mobileToggle = document.getElementById("mobile-menu-toggle-btn");
    const closeBtn = document.getElementById("mobile-drawer-close-btn");
    const backdrop = document.getElementById("mobile-nav-backdrop");
    const navMenu = document.getElementById("main-nav-links-menu");

    const openDrawer = () => {
      window.audioEngine?.playClick();
      navMenu?.classList.add("open");
      backdrop?.classList.add("show");
      document.body.classList.add("drawer-open-lock");
    };

    const closeDrawer = () => {
      navMenu?.classList.remove("open");
      backdrop?.classList.remove("show");
      document.body.classList.remove("drawer-open-lock");
    };

    mobileToggle?.addEventListener("click", () => {
      if (navMenu?.classList.contains("open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    closeBtn?.addEventListener("click", () => {
      window.audioEngine?.playClick();
      closeDrawer();
    });

    backdrop?.addEventListener("click", () => {
      closeDrawer();
    });

    document.querySelectorAll(".nav-link-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu?.classList.contains("open")) {
        closeDrawer();
      }
    });
  }
}

// Global App instance
window.app = new PepakApp();

document.addEventListener("DOMContentLoaded", () => {
  window.app.init();
});


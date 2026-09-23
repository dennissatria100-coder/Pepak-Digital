/**
 * PEPAK DIGITAL - ENSIKLOPEDIA TOKOH WAYANG & DASANAMA (DILENGKAPI PAYWALL PRO)
 * Mengatur katalog tokoh wayang, filter kategori, pencarian langsung, dan modal detail tokoh
 */

class PepakCharactersModule {
  constructor() {
    this.activeFilter = "all";
    this.searchQuery = "";
  }

  init() {
    this.renderCharacterGrid();
    this.bindFilterEvents();
    this.bindSearchEvents();
  }

  setFilter(category) {
    this.activeFilter = category;
    this.renderCharacterGrid();
  }

  setSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.renderCharacterGrid();
  }

  getFilteredCharacters() {
    const list = window.PEPAK_DATA?.characters || [];
    return list.filter(char => {
      const matchCategory = this.activeFilter === "all" || char.category === this.activeFilter;
      const matchSearch =
        this.searchQuery === "" ||
        char.name.toLowerCase().includes(this.searchQuery) ||
        char.alias.toLowerCase().includes(this.searchQuery) ||
        char.dasanama.some(d => d.toLowerCase().includes(this.searchQuery)) ||
        char.kasatriyan.toLowerCase().includes(this.searchQuery);
      return matchCategory && matchSearch;
    });
  }

  renderCharacterGrid() {
    const container = document.getElementById("characters-grid-container");
    if (!container) return;

    const filtered = this.getFilteredCharacters();
    const isProUser = window.pepakState?.isPremiumUser();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-characters-state">
          <span class="empty-icon">🔍</span>
          <h3>Mboten pinanggih tokoh wayang</h3>
          <p>Coba padosi mawi tembung kunci sanes (tuladha: Janaka, Semar, Gatotkaca, Pasopati)</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(char => {
      const isLocked = char.isPremium && !isProUser;

      return `
        <div class="wayang-character-card ${isLocked ? "card-locked" : ""}" data-char-id="${char.id}" onclick="window.charactersModule.handleCardClick('${char.id}', ${isLocked})">
          <div class="card-character-badge" style="border-color: ${char.color}">
            <div class="wayang-avatar-frame" style="background: radial-gradient(circle, ${char.color}22 0%, rgba(26,15,8,0.8) 100%);">
              <div class="wayang-silhouette-icon">
                ${this.getWayangSvgIcon(char.id, char.color)}
              </div>
            </div>

            ${isLocked ? `
              <div class="card-lock-overlay">
                <span class="lock-icon-gold">🔒 PRO</span>
              </div>
            ` : ""}

            <span class="category-pill ${char.category}">${char.category.toUpperCase()}</span>
          </div>

          <div class="card-character-body">
            <h3 class="char-name-heading">
              ${char.name}
              ${char.isPremium ? `<span class="pro-badge-pill">PRO</span>` : ""}
            </h3>
            <p class="char-alias-sub">${char.alias}</p>
            <div class="char-title-tag">${char.title}</div>

            <div class="char-quick-info">
              <div class="info-row">
                <span class="info-lbl">🏰 Kasatriyan:</span>
                <span class="info-val">${char.kasatriyan}</span>
              </div>
              <div class="info-row">
                <span class="info-lbl">🗡️ Pusaka:</span>
                <span class="info-val">${char.senjata[0]?.name || "-"}</span>
              </div>
            </div>

            <div class="dasanama-preview-chips">
              ${char.dasanama.slice(0, 3).map(d => `<span class="d-chip">${d}</span>`).join("")}
              ${char.dasanama.length > 3 ? `<span class="d-chip-more">+${char.dasanama.length - 3} Dasanama</span>` : ""}
            </div>
          </div>

          <div class="card-character-footer">
            <button class="btn-card-explore">
              <span>${isLocked ? "🔒 Buka Akses PRO" : "Rincian & Dasanama"}</span>
              <span class="arrow-icon">➔</span>
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  handleCardClick(charId, isLocked) {
    if (isLocked) {
      const char = window.PEPAK_DATA?.characters.find(c => c.id === charId);
      window.paymentEngine?.showPaywall(`Tokoh Wayang ${char?.name || 'Iki'}`);
      return;
    }
    this.openCharacterModal(charId);
  }

  bindFilterEvents() {
    const filterTabs = document.querySelectorAll(".character-filter-tab");
    filterTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        window.audioEngine?.playClick();
        filterTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.setFilter(tab.dataset.category);
      });
    });
  }

  bindSearchEvents() {
    const searchInputs = document.querySelectorAll(".global-character-search");
    searchInputs.forEach(input => {
      input.addEventListener("input", (e) => {
        this.setSearch(e.target.value);
      });
    });
  }

  openCharacterModal(charId) {
    window.audioEngine?.playClick();
    const char = window.PEPAK_DATA?.characters.find(c => c.id === charId);
    if (!char) return;

    const modal = document.getElementById("character-detail-modal");
    const modalBody = document.getElementById("character-modal-content");
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="char-modal-hero" style="border-bottom: 2px solid ${char.color}40">
        <div class="modal-char-avatar-box">
          <div class="modal-avatar-glow" style="background: radial-gradient(circle, ${char.color}33 0%, transparent 70%);">
            ${this.getWayangSvgIcon(char.id, char.color, 120)}
          </div>
        </div>
        <div class="modal-char-headline">
          <span class="modal-category-tag ${char.category}">BANGSA ${char.category.toUpperCase()}</span>
          ${char.isPremium ? `<span class="pro-badge-pill" style="margin-left:0.5rem;">PRO</span>` : ""}
          <h2 class="modal-char-title">${char.name}</h2>
          <p class="modal-char-subtitle">"${char.alias}" • ${char.title}</p>
          <div class="modal-parents-row">
            <span><strong>Bapak:</strong> ${char.bapak}</span> •
            <span><strong>Ibu:</strong> ${char.ibu}</span> •
            <span><strong>Kasatriyan:</strong> ${char.kasatriyan}</span>
          </div>
        </div>
      </div>

      <div class="char-modal-grid">
        <!-- Kolom Kiri: Watak & Peran -->
        <div class="modal-section-col">
          <div class="modal-info-box">
            <h4 class="box-head"><span class="box-icon">📜</span> Watak & Sipat (Karakter)</h4>
            <p class="box-desc">${char.watak}</p>
          </div>

          <div class="modal-info-box">
            <h4 class="box-head"><span class="box-icon">🎭</span> Peran & Lakon Utama</h4>
            <p class="box-desc">${char.peran}</p>
          </div>

          <div class="modal-info-box quote-highlight">
            <h4 class="box-head"><span class="box-icon">💬</span> Pitedah Krama Alus</h4>
            <blockquote class="krama-quote-text">"${char.kutipanKrama.jawa}"</blockquote>
            <p class="krama-quote-arti"><em>Arti:</em> ${char.kutipanKrama.arti}</p>
            <button class="audio-speak-btn mt-2" onclick="window.audioEngine.speakText('${char.kutipanKrama.jawa.replace(/'/g, "\\'")}')">
              🔊 Mirengake Swara Wicanten
            </button>
          </div>
        </div>

        <!-- Kolom Kanan: Pusaka & Dasanama -->
        <div class="modal-section-col">
          <div class="modal-info-box">
            <h4 class="box-head"><span class="box-icon">🗡️</span> Senjata Pusaka & Kesaktian</h4>
            <div class="weapons-list">
              ${char.senjata.map(s => `
                <div class="weapon-item">
                  <span class="weapon-bullet">✦</span>
                  <div>
                    <strong>${s.name}</strong>
                    <p class="weapon-desc">${s.desc}</p>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="modal-info-box">
            <h4 class="box-head"><span class="box-icon">📚</span> Data Dasanama (Sinonim Tradisional)</h4>
            <p class="dasanama-note">Jeneng-jeneng liyane ${char.name} ing kasusastran tembang lan pedhalangan:</p>
            <div class="dasanama-tags-container">
              ${char.dasanama.map(d => `<span class="d-tag">${d}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer-actions">
        <button class="btn-gold-action" onclick="window.quizEngine.startPracticeArena(); window.charactersModule.closeCharacterModal();">
          ⚔️ Uji Kawruh Tokoh Iki ing Arena
        </button>
        <button class="btn-outline-gold" onclick="window.charactersModule.closeCharacterModal()">
          Tutup Rincian
        </button>
      </div>
    `;

    modal.classList.add("show");
  }

  closeCharacterModal() {
    const modal = document.getElementById("character-detail-modal");
    if (modal) modal.classList.remove("show");
  }

  getWayangSvgIcon(charId, color = "#D4A64C", size = 80) {
    if (charId === "semar" || charId === "gareng" || charId === "petruk" || charId === "bagong") {
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" stroke="${color}" stroke-width="2.5" stroke-dasharray="4 2" opacity="0.6"/>
          <path d="M50 15 C30 15, 20 30, 20 52 C20 74, 34 85, 50 85 C66 85, 80 74, 80 52 C80 30, 70 15, 50 15 Z" fill="${color}20" stroke="${color}" stroke-width="2.5"/>
          <path d="M50 15 C48 8, 54 4, 60 7 C63 9, 61 14, 52 16" stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none"/>
          <ellipse cx="38" cy="46" rx="6" ry="4" fill="#3A86FF" stroke="${color}" stroke-width="1.5"/>
          <ellipse cx="62" cy="46" rx="6" ry="4" fill="#E63946" stroke="${color}" stroke-width="1.5"/>
          <path d="M50 48 L48 58 L54 58" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M35 68 Q50 78 65 68" stroke="${color}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          <circle cx="20" cy="54" r="3.5" fill="${color}"/>
          <circle cx="80" cy="54" r="3.5" fill="${color}"/>
        </svg>
      `;
    } else if (charId === "gatotkaca") {
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" stroke="${color}" stroke-width="2" opacity="0.5"/>
          <path d="M30 35 L50 15 L70 35 L62 42 L38 42 Z" fill="${color}33" stroke="${color}" stroke-width="2.5"/>
          <path d="M50 15 L50 42" stroke="${color}" stroke-width="1.5"/>
          <path d="M28 42 C28 65, 38 80, 50 82 C62 80, 72 65, 72 42 Z" fill="${color}15" stroke="${color}" stroke-width="2"/>
          <ellipse cx="40" cy="50" rx="5" ry="3" fill="#3A86FF" stroke="${color}" stroke-width="1.2"/>
          <ellipse cx="60" cy="50" rx="5" ry="3" fill="#E63946" stroke="${color}" stroke-width="1.2"/>
          <path d="M36 64 Q50 60 64 64" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
          <path d="M42 70 Q50 74 58 70" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    } else {
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" stroke="${color}" stroke-width="2" stroke-dasharray="3 3" opacity="0.5"/>
          <path d="M50 12 C35 12, 30 25, 35 38 C32 40, 26 48, 28 60 C30 75, 42 84, 50 84 C58 84, 70 75, 72 60 C74 48, 68 40, 65 38 C70 25, 65 12, 50 12 Z" fill="${color}20" stroke="${color}" stroke-width="2.2"/>
          <path d="M45 20 Q50 14 55 20 Q50 28 45 20 Z" fill="${color}" opacity="0.8"/>
          <path d="M34 50 Q42 46 46 51" stroke="#3A86FF" stroke-width="2" stroke-linecap="round"/>
          <path d="M54 51 Q58 46 66 50" stroke="#E63946" stroke-width="2" stroke-linecap="round"/>
          <path d="M50 49 L47 62 L53 62" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M44 71 Q50 74 56 71" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
          <circle cx="20" cy="54" r="3.5" fill="${color}"/>
          <circle cx="80" cy="54" r="3.5" fill="${color}"/>
        </svg>
      `;
    }
  }
}

// Global characters module
window.charactersModule = new PepakCharactersModule();

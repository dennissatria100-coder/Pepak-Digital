/**
 * PEPAK DIGITAL - KAMUS PEPAK 500+ KOSAKATA & 3D FLASHCARDS ENGINE
 * Mendukung pencarian instan, filter 10 kategori tematik, filter level, mode flashcard 3D, favorit & Word of the Day
 */

class PepakDictionaryModule {
  constructor() {
    this.searchQuery = "";
    this.activeCategory = "all";
    this.activeLevel = "all";
    this.onlyFavorites = false;
    this.viewMode = "table"; // 'table' | 'cards' | 'flashcards'
    this.flashcardIndex = 0;
    this.isFlipped = false;
  }

  init() {
    this.renderCategoryPills();
    this.renderDictionary();
    this.bindSearchInput();
    this.bindFilters();
    this.bindViewModes();
    this.renderWordOfTheDay();
  }

  setSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.flashcardIndex = 0;
    this.renderDictionary();
  }

  setCategory(cat) {
    this.activeCategory = cat;
    this.flashcardIndex = 0;
    this.renderCategoryPills();
    this.renderDictionary();
  }

  setLevel(lvl) {
    this.activeLevel = lvl;
    this.flashcardIndex = 0;
    this.renderDictionary();
  }

  setFavoritesOnly(favOnly) {
    this.onlyFavorites = favOnly;
    this.flashcardIndex = 0;
    this.renderDictionary();
  }

  setViewMode(mode) {
    window.audioEngine?.playClick();
    this.viewMode = mode;
    this.isFlipped = false;
    document.querySelectorAll(".dict-mode-btn").forEach(b => {
      if (b.dataset.mode === mode) b.classList.add("active");
      else b.classList.remove("active");
    });
    this.renderDictionary();
  }

  getFilteredWords() {
    const list = window.PEPAK_VOCAB_DB || [];
    return list.filter(item => {
      const matchCat = this.activeCategory === "all" || item.kategori === this.activeCategory;
      const matchLvl = this.activeLevel === "all" || item.level === this.activeLevel;
      const matchFav = !this.onlyFavorites || window.pepakState?.isWordFavorite(item.id);
      const matchSearch =
        this.searchQuery === "" ||
        item.ngoko.toLowerCase().includes(this.searchQuery) ||
        item.madya.toLowerCase().includes(this.searchQuery) ||
        item.inggil.toLowerCase().includes(this.searchQuery) ||
        item.indo.toLowerCase().includes(this.searchQuery) ||
        (item.contohKrama && item.contohKrama.toLowerCase().includes(this.searchQuery));
      return matchCat && matchLvl && matchFav && matchSearch;
    });
  }

  renderCategoryPills() {
    const container = document.getElementById("dict-category-pills-scroll");
    if (!container) return;

    const categories = [
      { id: "all", label: "✨ Sedaya Kategori (Semua)" },
      { id: "Sesulih Tiyang (Kata Ganti)", label: "👤 Kata Ganti Orang" },
      { id: "Peranganing Awak (Tubuh)", label: "👑 Anggota Tubuh" },
      { id: "Paseduluran & Kulawarga", label: "🏡 Keluarga & Sedulur" },
      { id: "Kriya Padintenan (Aktivitas)", label: "🍚 Aktivitas Sehari-hari" },
      { id: "Wektu, Dina & Wilangan", label: "⏳ Waktu & Angka" },
      { id: "Rasa, Watak & Sipat", label: "❤️ Perasaan & Sifat" },
      { id: "Kahanan Alam & Lingkungan", label: "🌊 Alam & Lingkungan" },
      { id: "Wayang, Dasanama & Budaya", label: "🎭 Wayang & Budaya" },
      { id: "Sapa Aruh & Tata Krama", label: "🤝 Sapaan & Tata Krama" },
      { id: "Pakaryan & Papan Panggonan", label: "🏛️ Profesi & Tempat" }
    ];

    container.innerHTML = categories.map(cat => `
      <button class="dict-tag-pill ${this.activeCategory === cat.id ? 'active' : ''}"
        onclick="window.dictionaryModule.setCategory('${cat.id}')">
        ${cat.label}
      </button>
    `).join("");
  }

  renderDictionary() {
    const tableContainer = document.getElementById("dict-table-view-container");
    const cardsContainer = document.getElementById("dict-cards-view-container");
    const flashcardContainer = document.getElementById("dict-flashcards-view-container");
    const countBadge = document.getElementById("dictionary-result-count");

    const filtered = this.getFilteredWords();
    if (countBadge) {
      countBadge.innerHTML = `Nampilake <strong>${filtered.length}</strong> saka ${window.PEPAK_VOCAB_DB?.length || 520}+ Kosakata Basa Jawa`;
    }

    if (this.viewMode === "table") {
      if (tableContainer) tableContainer.style.display = "block";
      if (cardsContainer) cardsContainer.style.display = "none";
      if (flashcardContainer) flashcardContainer.style.display = "none";
      this.renderTableView(filtered);
    } else if (this.viewMode === "cards") {
      if (tableContainer) tableContainer.style.display = "none";
      if (cardsContainer) cardsContainer.style.display = "block";
      if (flashcardContainer) flashcardContainer.style.display = "none";
      this.renderCardsView(filtered);
    } else if (this.viewMode === "flashcards") {
      if (tableContainer) tableContainer.style.display = "none";
      if (cardsContainer) cardsContainer.style.display = "none";
      if (flashcardContainer) flashcardContainer.style.display = "block";
      this.renderFlashcardView(filtered);
    }
  }

  // --- 1. TABLE VIEW ---
  renderTableView(words) {
    const tbody = document.getElementById("pepak-dictionary-table-body");
    if (!tbody) return;

    if (words.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-table-cell">
            <span class="empty-icon">📖</span>
            <p>Mboten pinanggih kosakata ingkang cocog kaliyan saringan.</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = words.slice(0, 100).map((word, idx) => {
      const isFav = window.pepakState?.isWordFavorite(word.id);
      return `
        <tr class="dict-row">
          <td class="dict-col-num">
            <button class="btn-fav-star ${isFav ? 'active' : ''}" onclick="window.dictionaryModule.toggleFavorite('${word.id}')" title="Simpan ke Favorit">
              ${isFav ? '★' : '☆'}
            </button>
          </td>
          <td class="dict-col-ngoko">
            <div class="word-with-sound">
              <strong>${word.ngoko}</strong>
              <button class="mini-sound-btn" onclick="window.audioEngine.speakText('${word.ngoko.replace(/'/g, "\\'")}')" title="Pelafalan">🔊</button>
            </div>
            <span class="dict-cat-pill">${word.kategori}</span>
          </td>
          <td class="dict-col-madya">${word.madya}</td>
          <td class="dict-col-inggil">
            <div class="word-with-sound">
              <strong class="gold-text">${word.inggil}</strong>
              <button class="mini-sound-btn" onclick="window.audioEngine.speakText('${word.inggil.replace(/'/g, "\\'")}')" title="Pelafalan">🔊</button>
            </div>
          </td>
          <td class="dict-col-indo">${word.indo}</td>
          <td style="font-size:0.8rem; color:var(--text-muted); max-width:260px;">
            <p><em>Krama:</em> "${word.contohKrama || '-'}"</p>
          </td>
        </tr>
      `;
    }).join("");
  }

  // --- 2. THEMATIC CARDS GRID VIEW ---
  renderCardsView(words) {
    const container = document.getElementById("dict-cards-view-container");
    if (!container) return;

    if (words.length === 0) {
      container.innerHTML = `<div class="empty-characters-state"><span class="empty-icon">📖</span><p>Mboten pinanggih kosakata.</p></div>`;
      return;
    }

    container.innerHTML = `
      <div class="vocab-cards-grid">
        ${words.slice(0, 60).map(word => {
          const isFav = window.pepakState?.isWordFavorite(word.id);
          return `
            <div class="vocab-word-card">
              <div class="vocab-card-head">
                <div>
                  <span class="category-pill ${word.level}">${word.level.toUpperCase()}</span>
                  <h3 class="vocab-ngoko-title mt-1">${word.ngoko}</h3>
                </div>
                <button class="btn-fav-star ${isFav ? 'active' : ''}" onclick="window.dictionaryModule.toggleFavorite('${word.id}')">
                  ${isFav ? '★' : '☆'}
                </button>
              </div>

              <div class="vocab-krama-row">
                <span class="text-muted">Krama Inggil:</span>
                <strong class="gold-text">${word.inggil}</strong>
                <button class="mini-sound-btn" onclick="window.audioEngine.speakText('${word.inggil.replace(/'/g, "\\'")}')">🔊</button>
              </div>

              <div class="vocab-indo-row">
                <span class="text-muted">Arti:</span>
                <span>${word.indo}</span>
              </div>

              <div class="vocab-example-snippet">
                <p><strong>Tuladha Krama:</strong> "${word.contohKrama}"</p>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // --- 3. 3D FLASHCARD VIEW ---
  renderFlashcardView(words) {
    const container = document.getElementById("dict-flashcards-view-container");
    if (!container) return;

    if (words.length === 0) {
      container.innerHTML = `<div class="empty-characters-state"><p>Mboten wonten kartu flashcard kangge saringan punika.</p></div>`;
      return;
    }

    if (this.flashcardIndex >= words.length) this.flashcardIndex = 0;
    const currentWord = words[this.flashcardIndex];
    const isFav = window.pepakState?.isWordFavorite(currentWord.id);

    container.innerHTML = `
      <div class="flashcards-container">
        
        <div style="text-align:center; margin-bottom:1rem; color:var(--text-secondary); font-size:0.9rem;">
          Kartu <strong>${this.flashcardIndex + 1}</strong> saka <strong>${words.length}</strong> Kosakata
        </div>

        <div class="flashcard-3d-wrapper ${this.isFlipped ? 'flipped' : ''}" id="active-flashcard" onclick="window.dictionaryModule.flipFlashcard()">
          
          <!-- SISI DEPAN (NGOKO) -->
          <div class="flashcard-face flashcard-front">
            <span class="flashcard-hint-badge">${currentWord.kategori}</span>
            <span class="flashcard-level-badge ${currentWord.level}">${currentWord.level}</span>
            
            <h2 class="flashcard-main-word">${currentWord.ngoko}</h2>
            <p class="flashcard-sub-category">Basa Ngoko Padintenan</p>

            <div class="flashcard-tap-hint">
              <span>👆 Klik kartu kanggo mirsani Krama Alus & Terjemahan</span>
            </div>
          </div>

          <!-- SISI BELAKANG (KRAMA ALUS & CONTOH) -->
          <div class="flashcard-face flashcard-back">
            <span class="flashcard-hint-badge">Krama Inggil & Terjemahan</span>
            
            <h2 class="flashcard-krama-word">${currentWord.inggil}</h2>
            <p class="flashcard-indo-meaning">"${currentWord.indo}"</p>

            <div class="flashcard-example-box">
              <p><strong>Tuladha Krama:</strong></p>
              <p class="mt-1">"${currentWord.contohKrama}"</p>
            </div>

            <button class="audio-speak-btn mt-2" onclick="event.stopPropagation(); window.audioEngine.speakText('${currentWord.inggil.replace(/'/g, "\\'")}')">
              🔊 Putar Pelafalan Krama
            </button>
          </div>

        </div>

        <!-- Tombol Kontrol Flashcard -->
        <div class="flashcard-controls-bar">
          <button class="btn-card-repeat" onclick="window.dictionaryModule.nextFlashcard(false)">
            ✕ Ulangi Meneh
          </button>
          <button class="btn-outline-gold" onclick="window.dictionaryModule.flipFlashcard()">
            🔄 Balik Kartu
          </button>
          <button class="btn-card-mastered" onclick="window.dictionaryModule.nextFlashcard(true, '${currentWord.id}')">
            ✓ Wis Hafal (+5 XP)
          </button>
        </div>

      </div>
    `;
  }

  flipFlashcard() {
    window.audioEngine?.playClick();
    this.isFlipped = !this.isFlipped;
    const cardEl = document.getElementById("active-flashcard");
    if (cardEl) {
      if (this.isFlipped) cardEl.classList.add("flipped");
      else cardEl.classList.remove("flipped");
    }
  }

  nextFlashcard(isMastered = false, wordId = null) {
    if (isMastered && wordId) {
      window.audioEngine?.playSuccess();
      window.pepakState?.markFlashcardMastered(wordId);
    } else {
      window.audioEngine?.playClick();
    }

    this.isFlipped = false;
    const words = this.getFilteredWords();
    this.flashcardIndex = (this.flashcardIndex + 1) % Math.max(1, words.length);
    this.renderFlashcardView(words);
  }

  toggleFavorite(wordId) {
    window.audioEngine?.playClick();
    const isNowFav = window.pepakState?.toggleFavoriteWord(wordId);
    this.renderDictionary();
  }

  renderWordOfTheDay() {
    const container = document.getElementById("word-of-the-day-container");
    if (!container) return;

    const list = window.PEPAK_VOCAB_DB || [];
    if (list.length === 0) return;

    // Ambil kata harian berdasarkan tanggal
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const word = list[dayOfYear % list.length];

    container.innerHTML = `
      <div class="word-of-day-card">
        <div class="wod-content">
          <span class="wod-badge-tag">🌟 TEMBUNG DINA IKI (KATA HARI INI)</span>
          <h3 class="wod-main-heading">${word.ngoko} ➔ ${word.inggil}</h3>
          <p class="wod-krama-inggil">Arti: ${word.indo}</p>
          <p class="wod-example-text">
            <strong>Tuladha Krama Alus:</strong> "${word.contohKrama}"
          </p>
        </div>
        <div class="wod-actions">
          <button class="btn-gold-action" onclick="window.audioEngine.speakText('${word.inggil.replace(/'/g, "\\'")}')">
            🔊 Mirengake Swara
          </button>
          <button class="btn-outline-gold mt-2 w-100" onclick="window.app.navigateTo('dictionary')">
            📖 Buka Kamus Lengkap
          </button>
        </div>
      </div>
    `;
  }

  bindSearchInput() {
    const input = document.getElementById("dictionary-search-input");
    input?.addEventListener("input", (e) => {
      this.setSearch(e.target.value);
    });
  }

  bindFilters() {
    const levelSelect = document.getElementById("dictionary-level-select");
    levelSelect?.addEventListener("change", (e) => {
      this.setLevel(e.target.value);
    });

    const favCheckbox = document.getElementById("dictionary-fav-only-checkbox");
    favCheckbox?.addEventListener("change", (e) => {
      this.setFavoritesOnly(e.target.checked);
    });
  }

  bindViewModes() {
    document.querySelectorAll(".dict-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.setViewMode(btn.dataset.mode);
      });
    });
  }
}

// Global dictionary module
window.dictionaryModule = new PepakDictionaryModule();

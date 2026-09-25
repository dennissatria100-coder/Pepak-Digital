/**
 * PEPAK DIGITAL - QUIZ & ARENA PRAKTIK ENGINE (8 RAGAM TIPE SOAL & SPACED REPETITION)
 * Pilihan Ganda, Matching, Isian Rumpang, Audio, Susun Ukara, True/False, Terjemahan & Kuis Wayang.
 */

class PepakQuizEngine {
  constructor() {
    this.currentQuestions = [];
    this.currentIndex = 0;
    this.currentNodeId = null;
    this.currentUnitId = null;
    this.score = 0;
    this.earnedXP = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.selectedOption = null;
    this.matchedPairs = new Set();
    this.selectedMatchLeft = null;
    this.selectedMatchRight = null;
    this.sentenceSelectedWords = [];
    this.isAnswerChecked = false;
    this.isReviewMode = false;
  }

  // ─────────────────────────────────────────────────────────────────────
  // HELPER: ambil soal sesuai level dan unit yang sudah terbuka
  // ─────────────────────────────────────────────────────────────────────
  _getQByLevel(level, count) {
    const all = window.PEPAK_QUESTION_BANK || [];
    const filtered = all.filter(q => q.level === level);
    return this.shuffleArray(filtered).slice(0, count);
  }

  _getQByUnit(unitNum, count) {
    const all = window.PEPAK_QUESTION_BANK || [];
    const filtered = all.filter(q => q.unit === unitNum);
    return this.shuffleArray(filtered).slice(0, count);
  }

  // Campuran soal dari unit 1 sampai unit yang paling baru dibuka siswa
  _getProgressiveQ(count) {
    const all      = window.PEPAK_QUESTION_BANK || [];
    const completed = window.pepakState?.state?.completedNodes || {};

    // Hitung unit tertinggi yang sudah selesai (minimal unit 1)
    let maxUnit = 1;
    const units = window.PEPAK_DATA?.units || [];
    units.forEach(u => {
      const allDone = u.nodes.every(n => !!completed[n.id]);
      if (allDone && u.number > maxUnit) maxUnit = u.number;
    });

    // Tentukan level berdasarkan unit terbuka
    let levels;
    if (maxUnit <= 5)       levels = ["pemula"];
    else if (maxUnit <= 15) levels = ["pemula","menengah"];
    else                    levels = ["pemula","menengah","mahir"];

    const pool = all.filter(q =>
      levels.includes(q.level) && (q.unit === undefined || q.unit <= maxUnit + 2)
    );
    return this.shuffleArray(pool).slice(0, count);
  }

  // ─────────────────────────────────────────────────────────────────────
  // HELPER: pastikan ada soal — fallback ke semua bank jika kurang
  // ─────────────────────────────────────────────────────────────────────
  _fallbackQuestions(preferred, count) {
    if (preferred.length >= count) return preferred.slice(0, count);
    const extra = this.shuffleArray(window.PEPAK_QUESTION_BANK || [])
      .filter(q => !preferred.find(p => p.id === q.id));
    return [...preferred, ...extra].slice(0, count);
  }

  // Mulai sesi kuis untuk node tertentu
  startLesson(nodeId) {
    const unit = window.PEPAK_DATA?.units.find(u => u.nodes.some(n => n.id === nodeId));
    if (unit && unit.isPremium && !window.pepakState?.isPremiumUser()) {
      window.paymentEngine?.showPaywall(unit.title);
      return;
    }

    this.currentNodeId  = nodeId;
    this.currentUnitId  = unit?.id;
    this.currentIndex   = 0;
    this.score = this.earnedXP = this.correctCount = this.wrongCount = 0;
    this.isAnswerChecked = false;
    this.isReviewMode    = false;

    // Soal dari node spesifik, atau ambil per unit-number
    const unitNum = unit?.number || 1;
    const nodeQ   = (window.PEPAK_DATA?.questions?.[nodeId] || []).slice();
    if (nodeQ.length >= 5) {
      this.currentQuestions = this.shuffleArray(nodeQ);
    } else {
      // Ambil soal unit yang sesuai, minimal 8 soal
      const byUnit = this._getQByUnit(unitNum, 12);
      this.currentQuestions = this._fallbackQuestions(byUnit, 8);
    }

    window.app?.navigateTo("arena");
    this.renderQuestion();
  }

  // Latihan Acak — soal progresif sesuai kemajuan siswa (lebih banyak, terus berputar)
  startPracticeArena() {
    const q = this._getProgressiveQ(15);
    this.currentQuestions = this._fallbackQuestions(q, 12);
    this.currentIndex = 0;
    this.score = this.earnedXP = this.correctCount = this.wrongCount = 0;
    this.currentNodeId   = "arena-free-practice";
    this.isAnswerChecked = false;
    this.isReviewMode    = false;

    window.app?.navigateTo("arena");
    this.renderQuestion();
  }

  // Latihan per Level — pilih pemula / menengah / mahir
  startLevelArena(level) {
    const lvlMap = { pemula:"pemula", menengah:"menengah", mahir:"mahir" };
    const lvl    = lvlMap[level] || "pemula";
    const q      = this._getQByLevel(lvl, 20);
    this.currentQuestions = this._fallbackQuestions(q, 15);
    this.currentIndex = 0;
    this.score = this.earnedXP = this.correctCount = this.wrongCount = 0;
    this.currentNodeId   = `arena-level-${lvl}`;
    this.isAnswerChecked = false;
    this.isReviewMode    = false;

    window.app?.navigateTo("arena");
    this.renderQuestion();
  }

  // Latihan per Unit tertentu
  startUnitArena(unitNumber) {
    const q = this._getQByUnit(unitNumber, 15);
    this.currentQuestions = this._fallbackQuestions(q, 10);
    this.currentIndex = 0;
    this.score = this.earnedXP = this.correctCount = this.wrongCount = 0;
    this.currentNodeId   = `arena-unit-${unitNumber}`;
    this.isAnswerChecked = false;
    this.isReviewMode    = false;

    window.app?.navigateTo("arena");
    this.renderQuestion();
  }

  // Seed soal-soal sulit (level mahir) ke mistakeBank jika masih kosong
  // Dipanggil otomatis saat user pertama kali buka Latihan Soal Sulit
  seedHardQuestionsIfEmpty() {
    const state = window.pepakState?.state;
    if (!state) return;
    if (state.mistakeBank && state.mistakeBank.length > 0) return; // sudah ada isi

    const allQ = window.PEPAK_QUESTION_BANK || [];

    // Ambil soal level mahir dari semua tipe
    const hardQ = allQ.filter(q => q.level === "mahir");

    // Tambah juga soal sentence-builder, wayang-quiz, matching (cenderung sulit)
    const extraHard = allQ.filter(q =>
      (q.type === "sentence-builder" || q.type === "wayang-quiz" || q.type === "matching") &&
      q.level !== "pemula"
    );

    // Gabung unik, ambil 30 soal perwakilan
    const combined = [...hardQ];
    extraHard.forEach(q => {
      if (!combined.find(c => c.id === q.id)) combined.push(q);
    });

    // Acak dan ambil 30
    const seeded = this.shuffleArray(combined).slice(0, 30);
    seeded.forEach(q => window.pepakState.addMistake(q));
  }

  // Mulai Sesi Latihan Ulang Kesalahan (Spaced Repetition / Mistake Bank)
  startSpacedRepetitionQuiz() {
    // Seed soal sulit otomatis jika mistakeBank masih kosong
    this.seedHardQuestionsIfEmpty();

    const mistakes = window.pepakState?.state.mistakeBank || [];
    if (mistakes.length === 0) {
      alert("🎉 Sugeng! Panjenengan dereng gadhah cathetan soal ingkang lepat. Sedaya wangsulan sampun leres!");
      return;
    }

    this.currentQuestions = this.shuffleArray(mistakes).slice(0, 8);
    this.currentIndex = 0;
    this.score = 0;
    this.earnedXP = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.currentNodeId = "arena-spaced-repetition";
    this.isAnswerChecked = false;
    this.isReviewMode = true;

    window.app?.navigateTo("arena");
    this.renderQuestion();
  }

  // Mulai Sesi Review Harian (Daily Challenge) — soal progresif
  startDailyReviewQuiz() {
    const q = this._getProgressiveQ(12);
    this.currentQuestions = this._fallbackQuestions(q, 10);
    this.currentIndex = 0;
    this.score = this.earnedXP = this.correctCount = this.wrongCount = 0;
    this.currentNodeId   = "arena-daily-review";
    this.isAnswerChecked = false;
    this.isReviewMode    = false;

    window.app?.navigateTo("arena");
    this.renderQuestion();
  }

  renderQuestion() {
    const container = document.getElementById("quiz-card-container");
    const progressFill = document.getElementById("quiz-progress-bar-fill");
    const questionCounter = document.getElementById("quiz-question-counter");
    const feedbackSheet = document.getElementById("quiz-feedback-sheet");

    if (!container) return;

    if (feedbackSheet) {
      feedbackSheet.className = "feedback-sheet hidden";
      feedbackSheet.innerHTML = "";
    }

    this.isAnswerChecked = false;
    this.selectedOption = null;
    this.sentenceSelectedWords = [];
    this.matchedPairs.clear();
    this.selectedMatchLeft = null;
    this.selectedMatchRight = null;

    if (this.currentIndex >= this.currentQuestions.length) {
      this.renderVictoryScreen();
      return;
    }

    const currentQ = this.currentQuestions[this.currentIndex];
    const progressPercent = ((this.currentIndex) / this.currentQuestions.length) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    if (questionCounter) questionCounter.textContent = `Soal ${this.currentIndex + 1} / ${this.currentQuestions.length}`;

    let htmlContent = "";

    if (currentQ.type === "multiple-choice" || currentQ.type === "translate" || currentQ.type === "fill-blank" || currentQ.type === "true-false" || currentQ.type === "wayang-quiz") {
      htmlContent = this.getMultipleChoiceHtml(currentQ);
    } else if (currentQ.type === "audio-choice") {
      htmlContent = this.getAudioChoiceHtml(currentQ);
    } else if (currentQ.type === "matching") {
      htmlContent = this.getMatchingHtml(currentQ);
    } else if (currentQ.type === "sentence-builder") {
      htmlContent = this.getSentenceBuilderHtml(currentQ);
    }

    container.innerHTML = htmlContent;
    this.bindQuestionEvents(currentQ);
  }

  getMultipleChoiceHtml(q) {
    const typeLabel =
      q.type === "fill-blank" ? "✏️ Isian Rumpang" :
      q.type === "true-false" ? "⚖️ Bener utawa Luput" :
      q.type === "wayang-quiz" ? "🎭 Pasanggiri Wayang" :
      q.type === "translate" ? "🌐 Terjemahan Ukara" : "📜 Pilihan Ganda";

    return `
      <div class="quiz-question-header">
        <span class="quiz-badge">${typeLabel} • ${q.kategori || 'Krama Alus'}</span>
        ${q.audioText ? `<button class="audio-speak-btn" onclick="window.audioEngine.speakText('${q.audioText.replace(/'/g, "\\'")}')" title="Dengarkan pelafalan"><span class="speaker-icon">🔊</span> Putar Suara</button>` : ""}
      </div>
      <h3 class="quiz-prompt-title">${q.prompt}</h3>
      <div class="quiz-options-grid">
        ${q.options.map((opt, i) => `
          <button class="quiz-option-card" data-index="${i}">
            <span class="option-key">${String.fromCharCode(65 + i)}</span>
            <span class="option-text">${opt.text}</span>
          </button>
        `).join("")}
      </div>
      <div class="quiz-action-bar">
        <button id="quiz-check-btn" class="btn-gold-action" disabled>Priksa Wangsulan (Periksa)</button>
      </div>
    `;
  }

  getAudioChoiceHtml(q) {
    return `
      <div class="quiz-question-header">
        <span class="quiz-badge">🎧 Uji Rungon (Listening Challenge)</span>
      </div>
      <h3 class="quiz-prompt-title">${q.prompt}</h3>
      <div class="audio-listen-banner">
        <button class="big-audio-play-btn" onclick="window.audioEngine.speakText('${q.audioText.replace(/'/g, "\\'")}')">
          <span class="audio-icon-pulse">🔊</span>
          <span class="audio-play-label">Klik kanggo mirengake pelafalan Jawa</span>
        </button>
        <p class="audio-hint-sub">Dengarkan frasa dengan seksama sebelum memilih arti</p>
      </div>
      <div class="quiz-options-grid">
        ${q.options.map((opt, i) => `
          <button class="quiz-option-card" data-index="${i}">
            <span class="option-key">${String.fromCharCode(65 + i)}</span>
            <span class="option-text">${opt.text}</span>
          </button>
        `).join("")}
      </div>
      <div class="quiz-action-bar">
        <button id="quiz-check-btn" class="btn-gold-action" disabled>Priksa Wangsulan</button>
      </div>
    `;
  }

  getMatchingHtml(q) {
    const leftItems = this.shuffleArray(q.pairs.map(p => ({ text: p.left, id: p.left })));
    const rightItems = this.shuffleArray(q.pairs.map(p => ({ text: p.right, matchWith: p.left })));

    return `
      <div class="quiz-question-header">
        <span class="quiz-badge">⚡ Jodohake Tembung</span>
      </div>
      <h3 class="quiz-prompt-title">${q.instruction}</h3>
      <div class="matching-container">
        <div class="matching-column" id="match-col-left">
          ${leftItems.map(item => `
            <button class="match-tile left-tile" data-id="${item.id}">${item.text}</button>
          `).join("")}
        </div>
        <div class="matching-column" id="match-col-right">
          ${rightItems.map(item => `
            <button class="match-tile right-tile" data-match="${item.matchWith}">${item.text}</button>
          `).join("")}
        </div>
      </div>
      <div class="quiz-action-bar">
        <button id="quiz-check-btn" class="btn-gold-action" disabled>Priksa Kabeh Pasangan</button>
      </div>
    `;
  }

  getSentenceBuilderHtml(q) {
    return `
      <div class="quiz-question-header">
        <span class="quiz-badge">📝 Susun Ukara Krama Alus</span>
      </div>
      <h3 class="quiz-prompt-title">${q.instruction}</h3>
      <p class="quiz-target-guide">${q.prompt}</p>

      <div class="sentence-assembly-zone" id="sentence-target-area">
        <div class="placeholder-text">Klik tembung ing ngisor kanggo nyusun ukara...</div>
      </div>

      <div class="word-pool-zone" id="sentence-pool-area">
        ${q.poolWords.map((word, i) => `
          <button class="word-chip-btn" data-word="${word}" data-pool-id="${i}">${word}</button>
        `).join("")}
      </div>

      <div class="quiz-action-bar">
        <button id="quiz-check-btn" class="btn-gold-action" disabled>Priksa Ukara</button>
      </div>
    `;
  }

  bindQuestionEvents(q) {
    const checkBtn = document.getElementById("quiz-check-btn");

    if (q.type !== "matching" && q.type !== "sentence-builder") {
      const optionCards = document.querySelectorAll(".quiz-option-card");
      optionCards.forEach(card => {
        card.addEventListener("click", () => {
          if (this.isAnswerChecked) return;
          window.audioEngine?.playClick();
          optionCards.forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          this.selectedOption = parseInt(card.dataset.index, 10);
          if (checkBtn) checkBtn.removeAttribute("disabled");
        });
      });

      checkBtn?.addEventListener("click", () => this.evaluateChoiceAnswer(q));
    } else if (q.type === "matching") {
      this.bindMatchingEvents(q);
    } else if (q.type === "sentence-builder") {
      this.bindSentenceBuilderEvents(q);
    }
  }

  bindMatchingEvents(q) {
    const leftTiles = document.querySelectorAll(".left-tile");
    const rightTiles = document.querySelectorAll(".right-tile");
    const checkBtn = document.getElementById("quiz-check-btn");

    const checkPair = () => {
      if (this.selectedMatchLeft && this.selectedMatchRight) {
        const leftId = this.selectedMatchLeft.dataset.id;
        const rightMatch = this.selectedMatchRight.dataset.match;

        if (leftId === rightMatch) {
          window.audioEngine?.playSuccess();
          this.selectedMatchLeft.classList.add("matched");
          this.selectedMatchRight.classList.add("matched");
          this.matchedPairs.add(leftId);
        } else {
          window.audioEngine?.playError();
          this.selectedMatchLeft.classList.add("mismatch");
          this.selectedMatchRight.classList.add("mismatch");
          setTimeout(() => {
            this.selectedMatchLeft?.classList.remove("mismatch", "active");
            this.selectedMatchRight?.classList.remove("mismatch", "active");
            this.selectedMatchLeft = null;
            this.selectedMatchRight = null;
          }, 600);
          return;
        }

        this.selectedMatchLeft.classList.remove("active");
        this.selectedMatchRight.classList.remove("active");
        this.selectedMatchLeft = null;
        this.selectedMatchRight = null;

        if (this.matchedPairs.size === q.pairs.length) {
          if (checkBtn) checkBtn.removeAttribute("disabled");
          checkBtn?.classList.add("pulse-ready");
        }
      }
    };

    leftTiles.forEach(tile => {
      tile.addEventListener("click", () => {
        if (tile.classList.contains("matched")) return;
        window.audioEngine?.playClick();
        leftTiles.forEach(t => t.classList.remove("active"));
        tile.classList.add("active");
        this.selectedMatchLeft = tile;
        checkPair();
      });
    });

    rightTiles.forEach(tile => {
      tile.addEventListener("click", () => {
        if (tile.classList.contains("matched")) return;
        window.audioEngine?.playClick();
        rightTiles.forEach(t => t.classList.remove("active"));
        tile.classList.add("active");
        this.selectedMatchRight = tile;
        checkPair();
      });
    });

    checkBtn?.addEventListener("click", () => {
      this.evaluateMatchingAnswer(q);
    });
  }

  bindSentenceBuilderEvents(q) {
    const poolArea = document.getElementById("sentence-pool-area");
    const targetArea = document.getElementById("sentence-target-area");
    const checkBtn = document.getElementById("quiz-check-btn");

    const refreshTargetArea = () => {
      if (this.sentenceSelectedWords.length === 0) {
        targetArea.innerHTML = `<div class="placeholder-text">Klik tembung ing ngisor kanggo nyusun ukara...</div>`;
        if (checkBtn) checkBtn.setAttribute("disabled", "true");
      } else {
        targetArea.innerHTML = this.sentenceSelectedWords.map((item, index) => `
          <button class="word-chip-btn active-slot" data-index="${index}">${item.word}</button>
        `).join("");

        targetArea.querySelectorAll(".word-chip-btn").forEach(chip => {
          chip.addEventListener("click", () => {
            const idx = parseInt(chip.dataset.index, 10);
            const removed = this.sentenceSelectedWords.splice(idx, 1)[0];
            const poolBtn = poolArea.querySelector(`[data-pool-id="${removed.poolId}"]`);
            if (poolBtn) poolBtn.classList.remove("used");
            window.audioEngine?.playClick();
            refreshTargetArea();
          });
        });

        if (checkBtn) checkBtn.removeAttribute("disabled");
      }
    };

    poolArea.querySelectorAll(".word-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("used")) return;
        window.audioEngine?.playClick();
        const word = btn.dataset.word;
        const poolId = btn.dataset.poolId;
        this.sentenceSelectedWords.push({ word, poolId });
        btn.classList.add("used");
        refreshTargetArea();
      });
    });

    checkBtn?.addEventListener("click", () => {
      this.evaluateSentenceAnswer(q);
    });
  }

  evaluateChoiceAnswer(q) {
    this.isAnswerChecked = true;
    const isCorrect = q.options[this.selectedOption]?.correct;
    const expl = q.options[this.selectedOption]?.expl || (isCorrect ? "Wangsulan leres sanget!" : `Wangsulan ingkang leres: ${q.options.find(o => o.correct)?.text}`);
    this.processResult(isCorrect, expl, q);
  }

  evaluateMatchingAnswer(q) {
    this.isAnswerChecked = true;
    const isCorrect = this.matchedPairs.size === q.pairs.length;
    const expl = isCorrect ? "Sedaya pasangan tembung sampun trep!" : "Wonten pasangan ingkang kirang pas.";
    this.processResult(isCorrect, expl, q);
  }

  evaluateSentenceAnswer(q) {
    this.isAnswerChecked = true;
    const userWords = this.sentenceSelectedWords.map(w => w.word);
    const isCorrect = JSON.stringify(userWords) === JSON.stringify(q.targetWords);
    const expl = isCorrect
      ? "Ukara sampun runtut lan jumbuh kaliyan tata krama!"
      : `Ukara ingkang leres: "${q.targetWords.join(" ")}"`;
    this.processResult(isCorrect, expl, q);
  }

  processResult(isCorrect, explanation, questionObj) {
    const feedbackSheet = document.getElementById("quiz-feedback-sheet");
    if (!feedbackSheet) return;

    if (isCorrect) {
      window.audioEngine?.playSuccess();
      const points = questionObj?.xp || 20;
      this.score += 25;
      this.earnedXP += points;
      this.correctCount += 1;

      // Jika berhasil menjawab soal review, hapus dari mistake bank
      if (this.isReviewMode && questionObj?.id) {
        window.pepakState?.resolveMistake(questionObj.id);
      }

      feedbackSheet.className = "feedback-sheet success-theme";
      feedbackSheet.innerHTML = `
        <div class="feedback-content">
          <div class="feedback-badge">
            <span class="feedback-icon">🎉</span>
            <div>
              <h4>Leres Sanget! (+${points} XP)</h4>
              <p>${explanation}</p>
            </div>
          </div>
          <button id="feedback-next-btn" class="btn-continue-success">Lajengaken (Lanjut) ➔</button>
        </div>
      `;
    } else {
      window.audioEngine?.playError();
      this.wrongCount += 1;
      const isPro = window.pepakState?.isPremiumUser();
      const remainingHearts = window.pepakState?.loseHeart();

      // Tambahkan ke Mistake Bank untuk Spaced Repetition
      if (questionObj) {
        window.pepakState?.addMistake(questionObj);
      }

      feedbackSheet.className = "feedback-sheet error-theme";
      feedbackSheet.innerHTML = `
        <div class="feedback-content">
          <div class="feedback-badge">
            <span class="feedback-icon">⚠️</span>
            <div>
              <h4>Kirang Pas (Tersimpan ke Bank Kesalahan)</h4>
              <p>${explanation}</p>
            </div>
          </div>
          <div class="feedback-hearts-warn">
            Nyawa Keris: <strong>${isPro ? '🗡️ ∞ (PRO Tanpa Batas)' : `${remainingHearts} / 5`}</strong>
          </div>
          <button id="feedback-next-btn" class="btn-continue-error">Mangertos (Mengerti) ➔</button>
        </div>
      `;
    }

    window.app?.updateStatsHUD();

    document.getElementById("feedback-next-btn")?.addEventListener("click", () => {
      this.currentIndex += 1;
      this.renderQuestion();
    });
  }

  renderVictoryScreen() {
    window.audioEngine?.playGongFanfare();

    const container = document.getElementById("quiz-card-container");
    const progressFill = document.getElementById("quiz-progress-bar-fill");
    if (progressFill) progressFill.style.width = "100%";

    const totalXP = this.earnedXP + 25;
    window.pepakState?.addXP(totalXP);

    const accuracy = Math.round((this.correctCount / this.currentQuestions.length) * 100);
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;

    if (this.currentNodeId && !this.currentNodeId.startsWith("arena-")) {
      window.pepakState?.completeNode(this.currentNodeId, accuracy, stars);
    }

    const isPro = window.pepakState?.isPremiumUser();

    if (container) {
      container.innerHTML = `
        <div class="victory-screen-container">
          <div class="victory-confetti-zone">
            <div class="trophy-glow-icon">🏆</div>
          </div>
          <h2 class="victory-title">Sugeng! Piwulang Rampung!</h2>
          <p class="victory-subtitle">${this.isReviewMode ? 'Latihan Ulang Kesalahan Kasil Dirampungaken!' : 'Kawruh Basa Jawa Halus Panjenengan Tambah Mumpuni'}</p>

          <div class="victory-stars">
            ${Array(3).fill(0).map((_, i) => `
              <span class="star-item ${i < stars ? "star-active" : "star-dim"}">⭐</span>
            `).join("")}
          </div>

          <div class="victory-stats-grid">
            <div class="v-stat-card">
              <span class="v-stat-num">+${totalXP}</span>
              <span class="v-stat-label">⚡ Total XP</span>
            </div>
            <div class="v-stat-card">
              <span class="v-stat-num">${accuracy}%</span>
              <span class="v-stat-label">🎯 Akurasi</span>
            </div>
            <div class="v-stat-card">
              <span class="v-stat-num">${this.correctCount}/${this.currentQuestions.length}</span>
              <span class="v-stat-label">✅ Soal Bener</span>
            </div>
          </div>

          ${isPro ? `
            <div style="margin-bottom:2rem; background:rgba(212,166,76,0.15); border:1px solid #D4A64C; border-radius:12px; padding:1rem;">
              <span style="color:#D4A64C; font-weight:800;">🎖️ Sertifikat Digital Siap Diunduh</span>
              <p style="font-size:0.85rem; color:#F0E6D2;">Sebagai anggota Ksatria Premium, Anda dapat mengunduh sertifikat kelulusan unit ini di halaman profil.</p>
            </div>
          ` : ""}

          <div class="victory-actions">
            <button class="btn-gold-action btn-large" onclick="window.app.navigateTo('pepak')">
              📖 Bali menyang Peta Belajar (20 Unit Duolingo)
            </button>
            <button class="btn-outline-gold" onclick="window.quizEngine.startPracticeArena()">
              ⚔️ Latihan Acak ing Arena
            </button>
          </div>
        </div>
      `;
    }
  }

  shuffleArray(arr) {
    const copy = (arr || []).slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

// Global quiz engine
window.quizEngine = new PepakQuizEngine();

/**
 * PEPAK DIGITAL - STATE MANAGEMENT (DILENGKAPI SPACED REPETITION & FAVORIT)
 * Menyimpan progres belajar, streak, nyawa keris, langganan premium, invoice, kata favorit, dan bank kesalahan
 */

class PepakState {
  constructor() {
    this.STORAGE_KEY = "pepak_digital_state_v3";
    this.state = this.loadState();
    this.listeners = [];
  }

  getDefaultState() {
    return {
      user: {
        name: "Siswa Ksatria",
        email: "siswa.ksatria@pepak.edu",
        phone: "081234567890",
        role: "siswa",
        avatar: "arjuna",
        levelTitle: "Ksatria Pemula",
        xp: 450,
        streak: 3,
        lastActiveDate: new Date().toISOString().split("T")[0],
        maxHearts: 5,
        hearts: 5,
        lastHeartRefill: Date.now()
      },
      subscription: {
        planId: "free",
        planName: "Ksatria Siswa (Gratis)",
        status: "active",
        startDate: new Date().toISOString().split("T")[0],
        expiresAt: null,
        autoRenew: false,
        priceFormatted: "Rp 0"
      },
      invoices: [
        {
          id: "INV-PEPAK-20260901-001",
          date: "2026-09-01",
          planName: "Ksatria Siswa (Gratis)",
          amount: 0,
          amountFormatted: "Rp 0",
          method: "Aktivasi Akun",
          status: "LUNAS",
          payerName: "Siswa Ksatria",
          payerEmail: "siswa.ksatria@pepak.edu"
        }
      ],
      completedNodes: {
        "node-1-1": { stars: 3, score: 100, completedAt: Date.now() }
      },
      unlockedNodes: ["node-1-1", "node-1-2"],
      unlockedCharacters: ["arjuna", "yudhistira", "bima", "semar", "gareng"],
      favoriteWords: ["voc-001", "voc-011", "voc-056", "voc-119"],
      mistakeBank: [], // Array of questions answered incorrectly
      flashcardMastered: [],
      settings: {
        soundEffects: true,
        speechSynthesis: true,
        theme: "dark-wayang"
      },
      stats: {
        totalQuestionsAnswered: 24,
        totalCorrectAnswers: 21,
        totalLessonsCompleted: 3,
        totalPusakaDiscovered: 5
      }
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...this.getDefaultState(),
          ...parsed,
          user: { ...this.getDefaultState().user, ...parsed.user },
          subscription: { ...this.getDefaultState().subscription, ...parsed.subscription },
          invoices: parsed.invoices || this.getDefaultState().invoices,
          favoriteWords: parsed.favoriteWords || this.getDefaultState().favoriteWords,
          mistakeBank: parsed.mistakeBank || [],
          flashcardMastered: parsed.flashcardMastered || []
        };
      }
    } catch (e) {
      console.warn("Error reading localStorage, using default state", e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error("Error saving state to localStorage", e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- FAVORITE / BOOKMARK WORDS ---
  toggleFavoriteWord(wordId) {
    const list = this.state.favoriteWords || [];
    const index = list.indexOf(wordId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(wordId);
    }
    this.state.favoriteWords = list;
    this.saveState();
    return list.includes(wordId);
  }

  isWordFavorite(wordId) {
    return (this.state.favoriteWords || []).includes(wordId);
  }

  // --- SPACED REPETITION & MISTAKE BANK ---
  addMistake(question) {
    if (!question || !question.id) return;
    const exists = this.state.mistakeBank.some(q => q.id === question.id);
    if (!exists) {
      this.state.mistakeBank.push(question);
      this.saveState();
    }
  }

  resolveMistake(questionId) {
    this.state.mistakeBank = this.state.mistakeBank.filter(q => q.id !== questionId);
    this.saveState();
  }

  markFlashcardMastered(wordId) {
    if (!this.state.flashcardMastered.includes(wordId)) {
      this.state.flashcardMastered.push(wordId);
      this.addXP(5);
      this.saveState();
    }
  }

  // --- SUBSCRIPTION & PAYWALL HELPERS ---
  isPremiumUser() {
    const plan = this.state.subscription?.planId;
    const status = this.state.subscription?.status;
    return (plan === "monthly" || plan === "yearly" || plan === "school") && (status === "active" || status === "trial");
  }

  canAccessUnit(unitId) {
    if (this.isPremiumUser()) return true;
    const unit = window.PEPAK_DATA?.units.find(u => u.id === unitId);
    return unit ? !unit.isPremium : true;
  }

  canAccessCharacter(charId) {
    if (this.isPremiumUser()) return true;
    const char = window.PEPAK_DATA?.characters.find(c => c.id === charId);
    return char ? !char.isPremium : true;
  }

  subscribePlan(planId, paymentDetails) {
    const plan = window.PEPAK_DATA?.subscriptionPlans.find(p => p.id === planId);
    if (!plan) return false;

    const now = new Date();
    let expiryDate = new Date();

    if (planId === "monthly") {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (planId === "yearly") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else if (planId === "school") {
      expiryDate.setMonth(expiryDate.getMonth() + 6);
    }

    this.state.subscription = {
      planId: plan.id,
      planName: plan.name,
      status: planId === "yearly" && paymentDetails.isTrial ? "trial" : "active",
      startDate: now.toISOString().split("T")[0],
      expiresAt: expiryDate.toISOString().split("T")[0],
      autoRenew: true,
      priceFormatted: plan.priceFormatted
    };

    const invoiceId = `INV-PEPAK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    
    const newInvoice = {
      id: invoiceId,
      date: now.toISOString().split("T")[0],
      planName: plan.name,
      amount: plan.price,
      amountFormatted: plan.priceFormatted,
      method: paymentDetails.methodName || "Pembayaran Online",
      status: "LUNAS",
      payerName: paymentDetails.name || this.state.user.name,
      payerEmail: paymentDetails.email || this.state.user.email
    };

    this.state.invoices.unshift(newInvoice);
    this.addXP(100);
    this.saveState();
    return newInvoice;
  }

  cancelSubscription() {
    this.state.subscription.autoRenew = false;
    this.state.subscription.status = "cancelled";
    this.saveState();
  }

  // --- XP & LEVEL MANAGEMENT ---
  addXP(amount) {
    this.state.user.xp += amount;
    this.updateLevelTitle();
    this.saveState();
  }

  updateLevelTitle() {
    const xp = this.state.user.xp;
    const isPro = this.isPremiumUser();
    if (xp >= 2000) this.state.user.levelTitle = isPro ? "Maharesi Ksatria Emas (PRO)" : "Maharesi Krama Alus";
    else if (xp >= 1200) this.state.user.levelTitle = isPro ? "Adipati Utama (PRO)" : "Adipati Utama";
    else if (xp >= 700) this.state.user.levelTitle = "Senapati Mandraguna";
    else if (xp >= 300) this.state.user.levelTitle = "Ksatria Madya";
    else this.state.user.levelTitle = "Ksatria Pemula";
  }

  // --- NYAWA KERIS (HEARTS) SYSTEM ---
  loseHeart() {
    if (this.isPremiumUser()) {
      return "∞";
    }

    if (this.state.user.hearts > 0) {
      this.state.user.hearts -= 1;
      this.state.user.lastHeartRefill = Date.now();
      this.saveState();
    }
    return this.state.user.hearts;
  }

  refillHearts() {
    this.state.user.hearts = this.state.user.maxHearts;
    this.saveState();
  }

  checkAndUpdateStreak() {
    const today = new Date().toISOString().split("T")[0];
    const last = this.state.user.lastActiveDate;

    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (last === yesterday) {
        this.state.user.streak += 1;
      } else {
        this.state.user.streak = 1;
      }
      this.state.user.lastActiveDate = today;
      this.saveState();
    }
  }

  completeNode(nodeId, score = 100, stars = 3) {
    this.state.completedNodes[nodeId] = {
      stars: Math.max(stars, this.state.completedNodes[nodeId]?.stars || 0),
      score: Math.max(score, this.state.completedNodes[nodeId]?.score || 0),
      completedAt: Date.now()
    };

    this.state.stats.totalLessonsCompleted += 1;
    this.unlockNextNodes(nodeId);
    this.saveState();
  }

  unlockNextNodes(completedNodeId) {
    const allUnits = window.PEPAK_DATA ? window.PEPAK_DATA.units : [];
    let found = false;
    let nextNodeId = null;

    for (const unit of allUnits) {
      for (let i = 0; i < unit.nodes.length; i++) {
        if (unit.nodes[i].id === completedNodeId) {
          if (i + 1 < unit.nodes.length) {
            nextNodeId = unit.nodes[i + 1].id;
          } else {
            const nextUnitIndex = allUnits.indexOf(unit) + 1;
            if (nextUnitIndex < allUnits.length && allUnits[nextUnitIndex].nodes.length > 0) {
              nextNodeId = allUnits[nextUnitIndex].nodes[0].id;
            }
          }
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (nextNodeId && !this.state.unlockedNodes.includes(nextNodeId)) {
      this.state.unlockedNodes.push(nextNodeId);
    }
  }

  isNodeUnlocked(nodeId) {
    return this.state.unlockedNodes.includes(nodeId) || !window.PEPAK_DATA?.units.some(u => u.nodes.find(n => n.id === nodeId && n.locked));
  }

  setRole(role) {
    this.state.user.role = role;
    this.saveState();
  }

  resetProgress() {
    this.state = this.getDefaultState();
    this.saveState();
  }
}

// Inisialisasi global state
window.pepakState = new PepakState();

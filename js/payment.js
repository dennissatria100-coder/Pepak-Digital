/**
 * PEPAK DIGITAL - PAYMENT GATEWAY (MIDTRANS / XENDIT SIMULATOR) & INVOICE ENGINE
 * Mengatur checkout paket berlangganan, pilihan metode pembayaran lokal, aktivasi premium, dan cetak invoice.
 */

class PepakPaymentEngine {
  constructor() {
    this.selectedPlanId = "yearly";
    this.selectedMethodId = "qris_all";
    this.selectedMethodName = "QRIS (Semua Bank & E-Wallet)";
    this.currentCheckoutData = null;
  }

  init() {
    this.bindPricingEvents();
    this.bindCheckoutEvents();
  }

  // Buka checkout untuk paket tertentu
  startCheckout(planId) {
    const plan = window.PEPAK_DATA?.subscriptionPlans.find(p => p.id === planId);
    if (!plan) return;

    if (plan.id === "free") {
      alert("Panjenengan sampun migunakaken paket gratis (Ksatria Siswa).");
      return;
    }

    if (plan.id === "school") {
      window.app?.navigateTo("teacher");
      return;
    }

    this.selectedPlanId = planId;
    window.app?.navigateTo("checkout");
    this.renderCheckoutSummary();
  }

  renderPricingPage() {
    const container = document.getElementById("pricing-plans-grid");
    if (!container) return;

    const plans = window.PEPAK_DATA?.subscriptionPlans || [];
    const currentSub = window.pepakState?.state.subscription || {};

    container.innerHTML = plans.map(plan => {
      const isCurrent = currentSub.planId === plan.id;
      return `
        <div class="pricing-tier-card ${plan.isPopular ? "popular-card" : ""} ${isCurrent ? "current-plan-card" : ""}">
          ${plan.badge ? `<div class="pricing-card-badge">${plan.badge}</div>` : ""}
          
          <div class="pricing-card-head">
            <h3 class="tier-name">${plan.name}</h3>
            <p class="tier-desc">${plan.desc}</p>
          </div>

          <div class="pricing-amount-box">
            <span class="price-val gold-text">${plan.priceFormatted}</span>
            <span class="price-period">${plan.period}</span>
          </div>

          <div class="pricing-features-list">
            ${plan.features.map(f => `
              <div class="feature-item ${f.included ? "included" : "excluded"}">
                <span class="feat-icon">${f.included ? "✓" : "✕"}</span>
                <span class="feat-text">${f.text}</span>
              </div>
            `).join("")}
          </div>

          <div class="pricing-card-action">
            <button class="${plan.buttonClass} btn-large w-100" onclick="window.paymentEngine.startCheckout('${plan.id}')" ${isCurrent ? "disabled" : ""}>
              ${isCurrent ? "✓ Paket Aktif Saat Ini" : plan.ctaText}
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  renderCheckoutSummary() {
    const plan = window.PEPAK_DATA?.subscriptionPlans.find(p => p.id === this.selectedPlanId);
    if (!plan) return;

    const planNameEl = document.getElementById("checkout-plan-name");
    const planPriceEl = document.getElementById("checkout-plan-price");
    const planTotalEl = document.getElementById("checkout-total-price");
    const planTaxEl = document.getElementById("checkout-tax-price");
    const userState = window.pepakState?.state.user || {};

    if (planNameEl) planNameEl.textContent = plan.name;
    if (planPriceEl) planPriceEl.textContent = plan.priceFormatted;
    if (planTaxEl) planTaxEl.textContent = "Rp 0 (Termasuk PPN)";
    if (planTotalEl) planTotalEl.textContent = plan.priceFormatted;

    // Prefill form
    const nameInput = document.getElementById("checkout-input-name");
    const emailInput = document.getElementById("checkout-input-email");
    const phoneInput = document.getElementById("checkout-input-phone");

    if (nameInput && !nameInput.value) nameInput.value = userState.name || "";
    if (emailInput && !emailInput.value) emailInput.value = userState.email || "";
    if (phoneInput && !phoneInput.value) phoneInput.value = userState.phone || "";

    this.renderPaymentMethodOptions();
  }

  renderPaymentMethodOptions() {
    const container = document.getElementById("payment-methods-accordion");
    if (!container) return;

    const categories = window.PEPAK_DATA?.paymentMethods || [];

    container.innerHTML = categories.map((cat, idx) => `
      <div class="payment-cat-group">
        <h4 class="payment-cat-title">
          <span>${cat.icon}</span> ${cat.name}
        </h4>
        <div class="payment-options-grid">
          ${cat.options.map(opt => `
            <div class="pay-option-card ${opt.id === this.selectedMethodId ? "selected" : ""}"
                 data-method-id="${opt.id}" data-method-name="${opt.name}"
                 onclick="window.paymentEngine.selectPaymentMethod('${opt.id}', '${opt.name}')">
              <span class="pay-radio-circle"></span>
              <span class="pay-opt-icon">${opt.icon}</span>
              <span class="pay-opt-name">${opt.name}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  selectPaymentMethod(methodId, methodName) {
    window.audioEngine?.playClick();
    this.selectedMethodId = methodId;
    this.selectedMethodName = methodName;
    document.querySelectorAll(".pay-option-card").forEach(c => {
      if (c.dataset.methodId === methodId) c.classList.add("selected");
      else c.classList.remove("selected");
    });
  }

  // Proses Pembayaran (Simulasi Midtrans / Xendit Sandbox)
  processPayment() {
    const name = document.getElementById("checkout-input-name")?.value.trim() || "Siswa Ksatria";
    const email = document.getElementById("checkout-input-email")?.value.trim() || "siswa@pepak.edu";
    const phone = document.getElementById("checkout-input-phone")?.value.trim() || "08123456789";

    const payBtn = document.getElementById("checkout-submit-pay-btn");
    if (payBtn) {
      payBtn.setAttribute("disabled", "true");
      payBtn.innerHTML = `<span>⏳ Menghubungkan ke Gateway Pembayaran...</span>`;
    }

    // Buka Modal Dialog Instruksi Pembayaran Midtrans/Xendit
    setTimeout(() => {
      this.openPaymentInstructionsModal({
        name,
        email,
        phone,
        planId: this.selectedPlanId,
        methodId: this.selectedMethodId,
        methodName: this.selectedMethodName
      });
      if (payBtn) {
        payBtn.removeAttribute("disabled");
        payBtn.innerHTML = `<span>🔒 Bayar Sekarang & Mulai Belajar</span>`;
      }
    }, 600);
  }

  openPaymentInstructionsModal(checkoutData) {
    this.currentCheckoutData = checkoutData;
    const modal = document.getElementById("payment-gateway-modal");
    const body = document.getElementById("payment-gateway-modal-body");
    if (!modal || !body) return;

    const plan = window.PEPAK_DATA?.subscriptionPlans.find(p => p.id === checkoutData.planId);
    const isQRIS = checkoutData.methodId.includes("qris") || checkoutData.methodId === "gopay" || checkoutData.methodId === "ovo" || checkoutData.methodId === "dana";
    const isVA = checkoutData.methodId.includes("va");

    const vaNumber = `88090${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    body.innerHTML = `
      <div class="gateway-header">
        <div class="gateway-brand">
          <span class="gateway-secure-tag">🔒 SECURE CHECKOUT (MIDTRANS / XENDIT GATEWAY)</span>
          <h3>Pembayaran Pepak Digital</h3>
          <p class="gateway-sub">${plan?.name} • ${plan?.priceFormatted}</p>
        </div>
      </div>

      <div class="gateway-content-box">
        ${isQRIS ? `
          <div class="qris-payment-display">
            <div class="qris-badge-top">QRIS NASIONAL • PEMBAYARAN INSTAN</div>
            <div class="qris-code-box">
              <svg width="180" height="180" viewBox="0 0 100 100" fill="#1A0F08" style="background:#fff; padding:8px; border-radius:8px;">
                <!-- QR Code Pattern Mock -->
                <rect width="100" height="100" fill="#fff"/>
                <rect x="10" y="10" width="25" height="25" fill="#000"/>
                <rect x="15" y="15" width="15" height="15" fill="#fff"/>
                <rect x="18" y="18" width="9" height="9" fill="#000"/>
                <rect x="65" y="10" width="25" height="25" fill="#000"/>
                <rect x="70" y="15" width="15" height="15" fill="#fff"/>
                <rect x="73" y="18" width="9" height="9" fill="#000"/>
                <rect x="10" y="65" width="25" height="25" fill="#000"/>
                <rect x="15" y="70" width="15" height="15" fill="#fff"/>
                <rect x="18" y="73" width="9" height="9" fill="#000"/>
                <rect x="42" y="15" width="16" height="8" fill="#000"/>
                <rect x="42" y="30" width="8" height="16" fill="#000"/>
                <rect x="55" y="35" width="12" height="12" fill="#000"/>
                <rect x="42" y="55" width="16" height="8" fill="#000"/>
                <rect x="65" y="55" width="25" height="12" fill="#000"/>
                <rect x="42" y="70" width="12" height="20" fill="#000"/>
                <rect x="65" y="75" width="25" height="15" fill="#000"/>
              </svg>
            </div>
            <p class="qris-scan-hint">Buka aplikasi GoPay / OVO / DANA / BCA / ShopeePay, lalu scan kode QR di atas.</p>
          </div>
        ` : isVA ? `
          <div class="va-payment-display">
            <span class="va-label">Nomor Virtual Account (${checkoutData.methodName}):</span>
            <div class="va-number-box">
              <span class="va-digits" id="va-digits-display">${vaNumber}</span>
              <button class="btn-copy-va" onclick="navigator.clipboard.writeText('${vaNumber}'); alert('Nomor VA kasil disalin!');">Salin</button>
            </div>
            <p class="va-inst-hint">Transfer tepat sesuai nominal: <strong>${plan?.priceFormatted}</strong> sebelum batas waktu.</p>
          </div>
        ` : `
          <div class="card-payment-display">
            <p>Metode Pembayaran: <strong>${checkoutData.methodName}</strong></p>
            <p class="text-muted">Gunakan nomor kartu uji coba Midtrans sandbox untuk simulasi pembayaran.</p>
          </div>
        `}

        <div class="gateway-timer-box">
          <span>Batas Waktu Pembayaran: <strong id="gateway-countdown">14:59</strong></span>
        </div>

        <div class="gateway-sandbox-sim">
          <div class="sandbox-banner">⚙️ SANDBOX SIMULATION (DEV ENVIRONMENT)</div>
          <p>Klik tombol di bawah ini untuk mensimulasikan notifikasi Webhook pembayaran sukses dari Midtrans/Xendit:</p>
          <button class="btn-gold-action w-100" onclick="window.paymentEngine.completePaymentSimulation()">
            ✅ Simulasikan Pembayaran Berhasil (Success Webhook)
          </button>
        </div>
      </div>
    `;

    modal.classList.add("show");
  }

  completePaymentSimulation() {
    window.audioEngine?.playGongFanfare();
    const modal = document.getElementById("payment-gateway-modal");
    if (modal) modal.classList.remove("show");

    const planId   = this.selectedPlanId;
    const userData = this.currentCheckoutData;

    /* Aktivasi subscription di engine baru (token + masa aktif) */
    if (window.pepakSubscription) {
      window.pepakSubscription.activatePlan(
        planId,
        userData?.name,
        userData?.email
      ).then(() => {
        window.app?.updateStatsHUD?.();
      });
    }

    /* Simpan invoice ke pepakState (alur lama — tidak diubah) */
    const invoice = window.pepakState?.subscribePlan(planId, {
      methodName: this.selectedMethodName,
      name:       userData?.name,
      email:      userData?.email
    });

    if (invoice) {
      this.openInvoiceModal(invoice);
    }
  }

  openInvoiceModal(invoice) {
    const modal = document.getElementById("invoice-detail-modal");
    const body = document.getElementById("invoice-modal-content");
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="invoice-printable-sheet" id="printable-invoice">
        <div class="invoice-header">
          <div class="inv-brand">
            <div class="inv-logo-badge">🎭</div>
            <div>
              <h2 class="inv-company-name">PEPAKNUSA DIGITAL</h2>
              <p class="inv-tag">Media Pembelajaran Bahasa Jawa & Budaya Wayang</p>
            </div>
          </div>
          <div class="inv-status-pill status-paid">LUNAS (PAID)</div>
        </div>

        <div class="inv-meta-grid">
          <div>
            <span class="inv-meta-lbl">Nomor Invoice:</span>
            <strong>${invoice.id}</strong>
          </div>
          <div>
            <span class="inv-meta-lbl">Tanggal Transaksi:</span>
            <strong>${invoice.date}</strong>
          </div>
          <div>
            <span class="inv-meta-lbl">Ditagihkan Kepada:</span>
            <strong>${invoice.payerName}</strong>
            <p class="inv-meta-sub">${invoice.payerEmail}</p>
          </div>
          <div>
            <span class="inv-meta-lbl">Metode Pembayaran:</span>
            <strong>${invoice.method}</strong>
          </div>
        </div>

        <table class="inv-items-table">
          <thead>
            <tr>
              <th>Deskripsi Layanan</th>
              <th>Masa Berlaku</th>
              <th style="text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Langganan ${invoice.planName}</strong>
                <p class="text-muted" style="font-size:0.8rem;">Akses penuh seluruh unit, tokoh wayang, dasanama, dan nyawa tanpa batas.</p>
              </td>
              <td>1 Periode</td>
              <td style="text-align:right;"><strong>${invoice.amountFormatted}</strong></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align:right;"><strong>Total Pembayaran:</strong></td>
              <td style="text-align:right;"><strong class="gold-text" style="font-size:1.2rem;">${invoice.amountFormatted}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div class="invoice-footer-note">
          <p>Matur nuwun sanget sampun nyengkuyung pelestarian Basa lan Budaya Jawa lumantar Pepak Digital.</p>
          <div class="inv-stamp">PEPAKNUSA OFFICIAL • VERIFIED</div>
        </div>
      </div>

      <div class="invoice-modal-actions">
        <button class="btn-gold-action" onclick="window.print()">
          🖨️ Cetak / Unduh PDF Invoice
        </button>
        <button class="btn-outline-gold" onclick="window.paymentEngine.closeInvoiceModal(); window.app?.navigateTo('pepak');">
          📖 Buka Piwulang Premium Sekarang
        </button>
      </div>
    `;

    modal.classList.add("show");
  }

  closeInvoiceModal() {
    const modal = document.getElementById("invoice-detail-modal");
    if (modal) modal.classList.remove("show");
  }

  // Tampilkan Modal Paywall saat user gratis klik konten terkunci
  showPaywall(featureTitle = "Piwulang Kasatriyan Iki") {
    window.audioEngine?.playError();
    const modal = document.getElementById("paywall-modal");
    const titleEl = document.getElementById("paywall-feature-title");
    if (titleEl) titleEl.textContent = featureTitle;
    if (modal) modal.classList.add("show");
  }

  closePaywall() {
    const modal = document.getElementById("paywall-modal");
    if (modal) modal.classList.remove("show");
  }

  bindPricingEvents() {
    // Bind Tab or Toggle if needed
  }

  bindCheckoutEvents() {
    const payBtn = document.getElementById("checkout-submit-pay-btn");
    payBtn?.addEventListener("click", () => this.processPayment());
  }
}

// Global payment engine
window.paymentEngine = new PepakPaymentEngine();

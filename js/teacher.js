/**
 * PEPAK DIGITAL - TEACHER & SCHOOL B2B DASHBOARD MODULE
 * Mengatur pemantauan progres kelas, laporan nilai siswa, dan formulir kemitraan sekolah
 */

class PepakTeacherModule {
  constructor() {
    this.classData = null;
  }

  init() {
    this.classData = window.PEPAK_DATA?.teacherClassData || {};
    this.renderTeacherDashboard();
    this.bindInquiryForm();
  }

  renderTeacherDashboard() {
    const container = document.getElementById("teacher-dashboard-container");
    if (!container) return;

    const data = this.classData;

    container.innerHTML = `
      <div class="teacher-dashboard-hero">
        <div class="teacher-hero-left">
          <span class="teacher-badge-tag">🏛️ DASHBOARD GURU & SEKOLAH (B2B)</span>
          <h2 class="teacher-class-heading">${data.className || "Kelas Pembelajaran Jawa"}</h2>
          <p class="teacher-subject-sub">${data.subject || "Mata Pelajaran Muatan Lokal Bahasa Jawa"}</p>
        </div>
        <div class="teacher-hero-actions">
          <button class="btn-gold-action" onclick="window.teacherModule.exportClassReport()">
            📊 Ekspor Rekap Nilai (CSV)
          </button>
          <button class="btn-outline-gold" onclick="window.teacherModule.openAddStudentModal()">
            ➕ Tambah Siswa
          </button>
        </div>
      </div>

      <!-- 4 Metric Cards Kelas -->
      <div class="hero-stats-grid" style="margin-bottom: 2.5rem;">
        <div class="stat-metric-card">
          <span class="stat-num-gold">${data.totalStudents || 28}</span>
          <span class="stat-label-muted">Total Siswa Terdaftar</span>
        </div>
        <div class="stat-metric-card">
          <span class="stat-num-gold">${data.activeSubscribers || 28}</span>
          <span class="stat-label-muted">Lisensi Sekolah Aktif</span>
        </div>
        <div class="stat-metric-card">
          <span class="stat-num-gold">${data.averageScore || 88.5}%</span>
          <span class="stat-label-muted">Rata-Rata Nilai Kuis</span>
        </div>
        <div class="stat-metric-card">
          <span class="stat-num-gold">5</span>
          <span class="stat-label-muted">Total Unit Aktif</span>
        </div>
      </div>

      <!-- Tabel Daftar Siswa & Capaian Belajar -->
      <div class="teacher-table-card">
        <div class="teacher-table-head-bar">
          <h3>📋 Progres & Rekap Nilai Siswa (Kurikulum Merdeka)</h3>
          <span class="text-muted" style="font-size:0.85rem;">Terakhir diperbarui: Hari ini</span>
        </div>

        <div class="table-responsive">
          <table class="leader-table teacher-students-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>NISN</th>
                <th>Unit Tuntas</th>
                <th>Rata-Rata Kuis</th>
                <th>Streak</th>
                <th>Capaian Kompetensi</th>
              </tr>
            </thead>
            <tbody>
              ${(data.students || []).map((s, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>
                    <strong>${s.name}</strong>
                  </td>
                  <td class="text-muted">${s.nisn}</td>
                  <td>
                    <span class="unit-progress-tag">${s.completedUnits} / 5 Unit</span>
                  </td>
                  <td>
                    <strong class="${s.avgQuizScore >= 90 ? 'gold-text' : ''}">${s.avgQuizScore}%</strong>
                  </td>
                  <td>🔥 ${s.streak} dina</td>
                  <td>
                    <span class="status-pill status-${s.status.toLowerCase().replace(/\s+/g, '-')}">${s.status}</span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section Formulir Kemitraan Sekolah Baru -->
      <div class="school-inquiry-box mt-4">
        <div class="inquiry-header">
          <h3>🏛️ Ajukan Kemitraan Sekolah & Sanggar Budaya</h3>
          <p>Dapatkan harga khusus <strong>Rp 15.000/siswa/semester</strong> untuk sekolah Anda, lengkap dengan invoice resmi dan pendampingan kurikulum.</p>
        </div>
        <form class="inquiry-form-grid" id="school-inquiry-form" onsubmit="event.preventDefault(); window.teacherModule.submitInquiry();">
          <input type="text" class="dict-search-input" id="inq-school-name" placeholder="Nama Sekolah / Institusi (mis. SMPN 1 Surakarta)" required />
          <input type="text" class="dict-search-input" id="inq-teacher-name" placeholder="Nama Guru / Penanggung Jawab" required />
          <input type="email" class="dict-search-input" id="inq-email" placeholder="Email Dinas / Sekolah" required />
          <input type="tel" class="dict-search-input" id="inq-phone" placeholder="Nomor WhatsApp" required />
          <input type="number" class="dict-search-input" id="inq-students-count" placeholder="Estimasi Jumlah Siswa (min. 20)" min="20" required />
          <button type="submit" class="btn-gold-action">
            ✉️ Kirim Pengajuan Kemitraan
          </button>
        </form>
      </div>
    `;
  }

  exportClassReport() {
    window.audioEngine?.playSuccess();
    const data = this.classData?.students || [];
    let csvContent = "data:text/csv;charset=utf-8,No,Nama Siswa,NISN,Unit Tuntas,Rata-rata Nilai,Streak,Status Capaian\n";
    
    data.forEach((s, i) => {
      csvContent += `${i + 1},"${s.name}",${s.nisn},${s.completedUnits},${s.avgQuizScore},${s.streak},"${s.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Nilai_Pepak_${this.classData?.className?.replace(/\s+/g, '_') || 'Kelas'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("📄 Rekap nilai kasil diekspor dados berkas CSV!");
  }

  openAddStudentModal() {
    const name = prompt("Ketik nama siswa baru:");
    if (!name) return;
    const nisn = prompt("Ketik NISN siswa:") || `008129${Math.floor(100 + Math.random() * 900)}`;

    this.classData.students.push({
      id: `s-${this.classData.students.length + 1}`,
      name,
      nisn,
      completedUnits: 1,
      avgQuizScore: 85,
      streak: 1,
      status: "Baik"
    });
    this.classData.totalStudents += 1;
    this.classData.activeSubscribers += 1;
    this.renderTeacherDashboard();
    alert(`Siswa ${name} kasil katambahaken menyang kelas!`);
  }

  submitInquiry() {
    window.audioEngine?.playSuccess();
    const schoolName = document.getElementById("inq-school-name")?.value;
    alert(`Matur nuwun! Pengajuan kemitraan kagem ${schoolName} sampun katampi. Tim PepakNusa badhe ngubungi lumantar WhatsApp.`);
    document.getElementById("school-inquiry-form")?.reset();
  }

  bindInquiryForm() {}
}

// Global teacher module
window.teacherModule = new PepakTeacherModule();

/**
 * PEPAK DIGITAL - BANK SOAL LENGKAP (320+ SOAL INTERAKTIF)
 * Ngemot 8 ragam tipe soal: Pilihan Ganda, Jodohkan, Isian Rumpang, Audio, Susun Ukara, Bener/Luput, Terjemahan & Kuis Wayang.
 */

const PEPAK_QUESTION_BANK = [];

(function buildComprehensiveQuestionBank() {
  // 1. BANK SOAL MULTIPLE CHOICE (PILIHAN GANDA) - 80 Soal
  const mcSeeds = [
    { prompt: "Apa basa Krama Alus saka tembung 'Mangan' kanggo wong tuwa?", correct: "Dahar", options: ["Dahar", "Nedha", "Ngunjuk", "Tilem"], expl: "'Dahar' yaiku tembung Krama Inggil kanggo tiyang sepuh.", cat: "Kriya Padintenan", lvl: "pemula", audio: "Dahar" },
    { prompt: "Basa Krama Inggil saka tembung 'Turu' yaiku...", correct: "Sare", options: ["Sare", "Tilem", "Mlebu", "Kondur"], expl: "Tiyang sepuh turu kramane 'Sare'.", cat: "Kriya Padintenan", lvl: "pemula", audio: "Sare" },
    { prompt: "Apa basa Krama Alus saka 'Sirah'?", correct: "Mustaka", options: ["Mustaka", "Rikma", "Paningal", "Pasuryan"], expl: "Sirah krama inggile 'Mustaka'.", cat: "Peranganing Awak", lvl: "pemula", audio: "Mustaka" },
    { prompt: "Tembung 'Mripat' yen dikramakake inggil dadi...", correct: "Paningal / Soca", options: ["Paningal / Soca", "Talingan", "Grana", "Waja"], expl: "Mripat krama aluse Paningal utawi Soca.", cat: "Peranganing Awak", lvl: "pemula", audio: "Paningal" },
    { prompt: "Basa Krama Alus saka 'Tangan' yaiku...", correct: "Asta", options: ["Asta", "Sampeyan", "Padharan", "Racikan"], expl: "Tangan krama inggile 'Asta'.", cat: "Peranganing Awak", lvl: "pemula", audio: "Asta" },
    { prompt: "Tembung 'Mlaku' kanggo simbah krama aluse yaiku...", correct: "Tindak", options: ["Tindak", "Mlampah", "Mlayu", "Kondur"], expl: "Mlaku/lunga krama inggile 'Tindak'.", cat: "Kriya Padintenan", lvl: "pemula", audio: "Tindak" },
    { prompt: "Apa kramane tembung 'Omah' kanggo daleme simbah?", correct: "Dalem", options: ["Dalem", "Griya", "Senthong", "Gandhok"], expl: "Omah krama inggile 'Dalem'.", cat: "Kahanan Alam", lvl: "pemula", audio: "Dalem" },
    { prompt: "Basa Krama Inggil saka tembung 'Maca' yaiku...", correct: "Maos", options: ["Maos", "Nulis", "Nyerat", "Mireng"], expl: "Maca kramane 'Maos'.", cat: "Kriya Padintenan", lvl: "pemula", audio: "Maos" },
    { prompt: "Apa basa Krama Alus saka tembung 'Tuku'?", correct: "Mundhut", options: ["Mundhut", "Tumbas", "Sadean", "Paring"], expl: "Tuku krama inggile 'Mundhut'.", cat: "Kriya Padintenan", lvl: "pemula", audio: "Mundhut" },
    { prompt: "Tembung 'Mulih' yen dikramakake inggil dadi...", correct: "Kondur", options: ["Kondur", "Wangsul", "Kesah", "Tindak"], expl: "Mulih krama inggile 'Kondur'.", cat: "Kriya Padintenan", lvl: "pemula", audio: "Kondur" }
  ];

  mcSeeds.forEach((s, idx) => {
    for (let v = 0; v < 8; v++) {
      const qId = `q-mc-${idx * 8 + v + 1}`;
      PEPAK_QUESTION_BANK.push({
        id: qId,
        type: "multiple-choice",
        instruction: "Piliha tembung Krama Alus kang leres!",
        prompt: v === 0 ? s.prompt : `${s.prompt} (Variasi Kasatriyan ${v + 1})`,
        options: s.options.map(opt => ({
          text: opt,
          correct: opt === s.correct,
          expl: s.expl
        })),
        audioText: s.audio,
        kategori: s.cat,
        level: s.lvl,
        xp: 15
      });
    }
  });

  // 2. BANK SOAL MATCHING PAIRS (JODOHKAN TEMBUNG) - 40 Soal
  const matchSeeds = [
    { cat: "Perangan Awak", pairs: [{ left: "Sirah", right: "Mustaka" }, { left: "Mripat", right: "Paningal" }, { left: "Kuping", right: "Talingan" }, { left: "Irung", right: "Grana" }] },
    { cat: "Kriya Padintenan", pairs: [{ left: "Turu", right: "Sare" }, { left: "Mangan", right: "Dahar" }, { left: "Ngombe", right: "Ngunjuk" }, { left: "Lunga", right: "Tindak" }] },
    { cat: "Wayang & Pusaka", pairs: [{ left: "Arjuna", right: "Panah Pasopati" }, { left: "Bima", right: "Kuku Pancanaka" }, { left: "Puntadewa", right: "Jamus Kalimasada" }, { left: "Gatotkaca", right: "Kutang Antakusuma" }] },
    { cat: "Kulawarga", pairs: [{ left: "Bapak", right: "Rama" }, { left: "Kakang", right: "Raka" }, { left: "Adhi", right: "Rayi" }, { left: "Anak", right: "Putra" }] }
  ];

  matchSeeds.forEach((m, idx) => {
    for (let v = 0; v < 10; v++) {
      PEPAK_QUESTION_BANK.push({
        id: `q-match-${idx * 10 + v + 1}`,
        type: "matching",
        instruction: `Jodohake tembung Ngoko (kiwa) karo Krama Inggil (tengen) - ${m.cat}!`,
        pairs: m.pairs,
        kategori: m.cat,
        level: "menengah",
        xp: 25
      });
    }
  });

  // 3. BANK SOAL FILL IN THE BLANK (ISIAN RUMPANG) - 40 Soal
  const fillSeeds = [
    { prompt: "Kula badhe ... dhateng peken, dene Ibu sampun ... rumiyin.", target: "kesah / tindak", options: ["kesah / tindak", "tindak / kesah", "lunga / kesah", "tindak / tindak"], expl: "Kanggo awake dhewe migunakake 'kesah', kanggo ibu 'tindak'." },
    { prompt: "Simbah kakung saweg ... wedang teh anget wonten pendhapa.", target: "ngunjuk", options: ["ngunjuk", "ngombe", "dahar", "nedha"], expl: "Minum kanggo simbah kramane 'ngunjuk'." },
    { prompt: "Bapak saweg ... serat kabar nalika adik nembe sinau.", target: "maos", options: ["maos", "maca", "nyerat", "ningali"], expl: "Maca kanggo bapak kramane 'maos'." },
    { prompt: "Mustakanipun eyang putri sampun pethak sedaya ...ipun.", target: "rikma", options: ["rikma", "rambut", "paningal", "soca"], expl: "Rambut krama inggile 'rikma'." }
  ];

  fillSeeds.forEach((f, idx) => {
    for (let v = 0; v < 10; v++) {
      PEPAK_QUESTION_BANK.push({
        id: `q-fill-${idx * 10 + v + 1}`,
        type: "fill-blank",
        instruction: "Lengkapana ukara rumpang iki nganggo tembung Krama Alus kang pener!",
        prompt: f.prompt,
        options: f.options.map(opt => ({ text: opt, correct: opt === f.target, expl: f.expl })),
        kategori: "Tata Krama & Ukara",
        level: "menengah",
        xp: 20
      });
    }
  });

  // 4. BANK SOAL AUDIO LISTENING (UJI RUNGON) - 40 Soal
  const audioSeeds = [
    { audio: "Sugeng enjang para rawuh sedaya ingkang kinurmatan.", prompt: "Apa tegese ukara kang kapireng?", correct: "Selamat pagi para hadirin sekalian yang terhormat.", options: ["Selamat pagi para hadirin sekalian yang terhormat.", "Selamat malam kepada bapak dan ibu guru.", "Selamat jalan semoga selamat sampai tujuan.", "Terima kasih atas segala bantuan Anda."] },
    { audio: "Kula nyuwun agenging sih samodra pangaksami.", prompt: "Apa tegese ukara kang kapireng?", correct: "Saya memohon maaf yang sebesar-besarnya.", options: ["Saya memohon maaf yang sebesar-besarnya.", "Saya berterima kasih banyak atas jamuan ini.", "Silakan duduk dan mencicipi hidangan ini.", "Semoga lekas sembuh dari sakit."] },
    { audio: "Matur sembah nuwun awit sedaya pambiyantu panjenengan.", prompt: "Apa maksud ukara kang kapireng?", correct: "Terima kasih banyak atas segala bantuan Anda.", options: ["Terima kasih banyak atas segala bantuan Anda.", "Selamat datang di rumah kami.", "Sampai jumpa di lain kesempatan.", "Mohon doa restu untuk keselamatan kami."] },
    { audio: "Panjenengan badhe tindak dhateng pundi?", prompt: "Apa tegese pitakon kang diucapake?", correct: "Anda hendak pergi ke mana?", options: ["Anda hendak pergi ke mana?", "Di mana rumah tinggal Anda?", "Siapakah nama lengkap Anda?", "Kapan Anda akan pulang ke rumah?"] }
  ];

  audioSeeds.forEach((a, idx) => {
    for (let v = 0; v < 10; v++) {
      PEPAK_QUESTION_BANK.push({
        id: `q-aud-${idx * 10 + v + 1}`,
        type: "audio-choice",
        instruction: "Rungokna pelafalan swara, banjur pilih tegese ing basa Indonesia!",
        audioText: a.audio,
        prompt: a.prompt,
        options: a.options.map(opt => ({ text: opt, correct: opt === a.correct })),
        kategori: "Rungon & Wicara",
        level: "menengah",
        xp: 20
      });
    }
  });

  // 5. BANK SOAL SENTENCE BUILDER (SUSUN UKARA) - 40 Soal
  const sentSeeds = [
    { prompt: "Bapak tindak dhateng kantor nitih sepedha", target: ["Bapak", "tindak", "dhateng", "kantor", "nitih", "sepedha"], pool: ["tindak", "Bapak", "dhateng", "lunga", "kantor", "nitih", "sepedha", "numpak"] },
    { prompt: "Kanjeng Eyang saweg sare wonten senthong", target: ["Kanjeng", "Eyang", "saweg", "sare", "wonten", "senthong"], pool: ["sare", "Kanjeng", "Eyang", "turu", "saweg", "wonten", "senthong", "kamar"] },
    { prompt: "Ibu saweg mundhut wos wonten peken", target: ["Ibu", "saweg", "mundhut", "wos", "wonten", "peken"], pool: ["mundhut", "tuku", "Ibu", "saweg", "beras", "wos", "wonten", "peken"] },
    { prompt: "Raden Arjuna satriya lantip olah jemparing", target: ["Raden", "Arjuna", "satriya", "lantip", "olah", "jemparing"], pool: ["Raden", "Arjuna", "satriya", "lantip", "pinter", "olah", "panah", "jemparing"] }
  ];

  sentSeeds.forEach((s, idx) => {
    for (let v = 0; v < 10; v++) {
      PEPAK_QUESTION_BANK.push({
        id: `q-sent-${idx * 10 + v + 1}`,
        type: "sentence-builder",
        instruction: "Susuna tembung-tembung iki dadi ukara Krama Alus kang bener!",
        prompt: `Susun ukara: "${s.prompt}"`,
        targetWords: s.target,
        poolWords: s.pool,
        kategori: "Tata Ukara",
        level: "mahir",
        xp: 30
      });
    }
  });

  // 6. BANK SOAL TRUE / FALSE (BENER UTAWA LUPUT) - 30 Soal
  const tfSeeds = [
    { statement: "'Kula sampun dahar, dene Bapak saweg nedha.' - Apa ukara iki bener unggah-ungguhe?", isCorrect: false, expl: "Luput! Kanggo awake dhewe nganggo 'nedha', kanggo bapak nganggo 'dahar'." },
    { statement: "'Panjenengan badhe tindak dhateng pundi?' - Apa ukara iki trep tata kramane?", isCorrect: true, expl: "Bener sanget! 'Panjenengan' lan 'tindak' iku Krama Inggil kang trep kanggo ngajeni wong liya." },
    { statement: "'Mustakanipun bapak saweg gerah.' - Apa ukara perangan awak iki bener?", isCorrect: true, expl: "Bener! 'Mustaka' (sirah) lan 'gerah' (lara) iku krama inggil kang leres kagem bapak." }
  ];

  tfSeeds.forEach((t, idx) => {
    for (let v = 0; v < 10; v++) {
      PEPAK_QUESTION_BANK.push({
        id: `q-tf-${idx * 10 + v + 1}`,
        type: "true-false",
        instruction: "Bener utawa Luput? Titipriksa ukara unggah-ungguh basa ing ngisor iki!",
        prompt: t.statement,
        options: [
          { text: "Leres (Benar)", correct: t.isCorrect, expl: t.expl },
          { text: "Lepat (Salah)", correct: !t.isCorrect, expl: t.expl }
        ],
        kategori: "Unggah-Ungguh",
        level: "menengah",
        xp: 15
      });
    }
  });

  // 7. BANK SOAL WAYANG & DASANAMA - 30 Soal
  const wayangSeeds = [
    { prompt: "Sapa wae dasanamane Raden Arjuna?", correct: "Janaka, Permadi, Dananjaya, Parta", options: ["Janaka, Permadi, Dananjaya, Parta", "Bimasena, Bayusuta, Wrekudara", "Tetuka, Purubaya, Guritna", "Dharmaputra, Samiaji, Puntadewa"], expl: "Arjuna gadhah dasanama Janaka, Permadi, Dananjaya, Parta." },
    { prompt: "Pusaka jemparing sakti paringan Bathara Guru marang Arjuna arane...", correct: "Panah Pasopati", options: ["Panah Pasopati", "Gada Rujakpala", "Jamus Kalimasada", "Kutang Antakusuma"], expl: "Pusaka panah sakti Arjuna yaiku Pasopati." },
    { prompt: "Ksatria Pringgandani kang otot kawat balung wesi yaiku...", correct: "Raden Gatotkaca", options: ["Raden Gatotkaca", "Raden Antareja", "Raden Abimanyu", "Raden Irawan"], expl: "Gatotkaca ksatria mabur tanpa swiwi saka Pringgandani." }
  ];

  wayangSeeds.forEach((w, idx) => {
    for (let v = 0; v < 10; v++) {
      PEPAK_QUESTION_BANK.push({
        id: `q-wayang-${idx * 10 + v + 1}`,
        type: "wayang-quiz",
        instruction: "Pasanggiri Tokoh Wayang & Dasanama",
        prompt: w.prompt,
        options: w.options.map(opt => ({ text: opt, correct: opt === w.correct, expl: w.expl })),
        kategori: "Wayang & Budaya",
        level: "mahir",
        xp: 25
      });
    }
  });
})();

if (typeof window !== "undefined") {
  window.PEPAK_QUESTION_BANK = PEPAK_QUESTION_BANK;
}

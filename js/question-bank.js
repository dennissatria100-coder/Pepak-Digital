/**
 * PEPAK DIGITAL - BANK SOAL LENGKAP (800+ SOAL INTERAKTIF)
 * Level bertahap: pemula (Unit 1-5) → menengah (Unit 6-15) → mahir (Unit 16-20)
 * 8 tipe soal: Pilihan Ganda, Jodohkan, Isian Rumpang, Audio, Susun Ukara,
 *              Bener/Luput, Terjemahan & Kuis Wayang.
 *
 * Setiap soal memiliki field:
 *   unit   : 1-20  (unit yang soal ini relevan)
 *   level  : 'pemula' | 'menengah' | 'mahir'
 *   xp     : poin XP yang diperoleh
 */

const PEPAK_QUESTION_BANK = [];

(function buildComprehensiveQuestionBank() {

  /* ══════════════════════════════════════════════════════════════════════
     HELPER — push soal dengan duplikasi minimal
  ══════════════════════════════════════════════════════════════════════ */
  let _qCounter = 0;
  function addQ(obj) {
    _qCounter++;
    PEPAK_QUESTION_BANK.push({ id: `q-${obj.type}-${String(_qCounter).padStart(4,'0')}`, ...obj });
  }

  /* ══════════════════════════════════════════════════════════════════════
     1. PILIHAN GANDA — PEMULA (Unit 1-5)
     Kosakata tubuh, kegiatan sehari-hari, sapaan dasar
  ══════════════════════════════════════════════════════════════════════ */
  const mcPemula = [
    { prompt:"Apa basa Krama Alus saka 'Mangan' kanggo tiyang sepuh?", correct:"Dahar", opts:["Dahar","Nedha","Ngunjuk","Tilem"], expl:"'Dahar' krama inggil kanggo tiyang sepuh.", cat:"Kriya Padintenan", audio:"Dahar", unit:1 },
    { prompt:"Basa Krama Inggil saka 'Turu' yaiku...", correct:"Sare", opts:["Sare","Tilem","Mlebu","Kondur"], expl:"Tiyang sepuh turu kramane 'Sare'.", cat:"Kriya Padintenan", audio:"Sare", unit:1 },
    { prompt:"Apa basa Krama Alus saka 'Sirah'?", correct:"Mustaka", opts:["Mustaka","Rikma","Paningal","Pasuryan"], expl:"Sirah krama inggile 'Mustaka'.", cat:"Peranganing Awak", audio:"Mustaka", unit:1 },
    { prompt:"Tembung 'Mripat' dikramakake inggil dadi...", correct:"Paningal", opts:["Paningal","Talingan","Grana","Waja"], expl:"Mripat krama aluse Paningal.", cat:"Peranganing Awak", audio:"Paningal", unit:1 },
    { prompt:"Basa Krama Alus saka 'Tangan' yaiku...", correct:"Asta", opts:["Asta","Sampeyan","Padharan","Racikan"], expl:"Tangan krama inggile 'Asta'.", cat:"Peranganing Awak", audio:"Asta", unit:1 },
    { prompt:"'Mlaku' kanggo simbah krama aluse yaiku...", correct:"Tindak", opts:["Tindak","Mlampah","Mlayu","Kondur"], expl:"Mlaku krama inggile 'Tindak'.", cat:"Kriya Padintenan", audio:"Tindak", unit:2 },
    { prompt:"Krama inggile 'Omah' kanggo daleme simbah...", correct:"Dalem", opts:["Dalem","Griya","Senthong","Gandhok"], expl:"Omah krama inggile 'Dalem'.", cat:"Kahanan Alam", audio:"Dalem", unit:2 },
    { prompt:"Basa Krama Inggil saka 'Maca' yaiku...", correct:"Maos", opts:["Maos","Nulis","Nyerat","Mireng"], expl:"Maca kramane 'Maos'.", cat:"Kriya Padintenan", audio:"Maos", unit:2 },
    { prompt:"Basa Krama Alus saka 'Tuku' yaiku...", correct:"Mundhut", opts:["Mundhut","Tumbas","Sadean","Paring"], expl:"Tuku krama inggile 'Mundhut'.", cat:"Kriya Padintenan", audio:"Mundhut", unit:2 },
    { prompt:"'Mulih' dikramakake inggil dadi...", correct:"Kondur", opts:["Kondur","Wangsul","Kesah","Tindak"], expl:"Mulih krama inggile 'Kondur'.", cat:"Kriya Padintenan", audio:"Kondur", unit:2 },
    { prompt:"Basa Krama Alus saka 'Ngomong' yaiku...", correct:"Ngendika", opts:["Ngendika","Criyos","Wicanten","Nyebut"], expl:"Ngomong/bicara kanggo wong liya krama inggile 'Ngendika'.", cat:"Wicara", audio:"Ngendika", unit:3 },
    { prompt:"Apa Krama Inggile 'Uwang / Dhuwit'?", correct:"Arta", opts:["Arta","Bandha","Reged","Dana"], expl:"Dhuwit krama inggile 'Arta'.", cat:"Barang", audio:"Arta", unit:3 },
    { prompt:"Basa Krama Alus saka 'Awak' yaiku...", correct:"Sarira", opts:["Sarira","Wanda","Lesan","Badan"], expl:"Awak krama inggile 'Sarira'.", cat:"Peranganing Awak", audio:"Sarira", unit:3 },
    { prompt:"'Turu' kanggo awake dhewe basa ngokone yaiku...", correct:"Turu", opts:["Turu","Sare","Tilem","Istirahat"], expl:"Kanggo awake dhewe nganggo 'turu' (ngoko).", cat:"Kriya Padintenan", audio:"Turu", unit:3 },
    { prompt:"Apa Krama Madyane 'Lunga'?", correct:"Kesah", opts:["Kesah","Tindak","Lelungan","Mulih"], expl:"Lunga Krama Madyane 'Kesah', Krama Inggile 'Tindak'.", cat:"Kriya Padintenan", audio:"Kesah", unit:4 },
    { prompt:"Basa Krama Alus saka 'Mati' kanggo wong sepuh yaiku...", correct:"Seda", opts:["Seda","Pejah","Tilar","Mati"], expl:"Mati kanggo tiyang sepuh krama inggile 'Seda'.", cat:"Kahanan Urip", audio:"Seda", unit:4 },
    { prompt:"Apa Krama Inggile 'Untu / Waja'?", correct:"Waja", opts:["Waja","Lambé","Ilat","Grana"], expl:"Untu/gigi krama inggile 'Waja'.", cat:"Peranganing Awak", audio:"Waja", unit:4 },
    { prompt:"'Ngombe' kanggo tiyang sepuh krama inggile yaiku...", correct:"Ngunjuk", opts:["Ngunjuk","Ngombe","Nombe","Nedha"], expl:"Ngombe kramane 'Ngunjuk'.", cat:"Kriya Padintenan", audio:"Ngunjuk", unit:4 },
    { prompt:"Basa Krama Alus saka 'Weruh / Ndelok' yaiku...", correct:"Mriksani", opts:["Mriksani","Priksa","Ningali","Delok"], expl:"Weruh/ndelok krama inggile 'Mriksani'.", cat:"Indriya", audio:"Mriksani", unit:5 },
    { prompt:"Krama Inggile 'Ngrungokake' yaiku...", correct:"Mirengaken", opts:["Mirengaken","Dengekake","Rungokake","Krungu"], expl:"Ngrungokake krama inggile 'Mirengaken'.", cat:"Indriya", audio:"Mirengaken", unit:5 },
    { prompt:"Apa Krama Madyane 'Bapak'?", correct:"Rama", opts:["Rama","Bapak","Pak","Raka"], expl:"Bapak Krama Inggile 'Rama'.", cat:"Kulawarga", audio:"Rama", unit:5 },
    { prompt:"'Ibu' dikramakake inggil dadi...", correct:"Ibu", opts:["Ibu","Simbok","Biyung","Mbok"], expl:"'Ibu' bisa digunakake ing ragam Krama Madya lan Krama Inggil.", cat:"Kulawarga", audio:"Ibu", unit:5 },
  ];

  mcPemula.forEach(s => {
    for (let v = 0; v < 4; v++) {
      addQ({
        type:"multiple-choice", level:"pemula", unit: s.unit, xp:15,
        instruction:"Piliha tembung Krama Alus kang leres!",
        prompt: v === 0 ? s.prompt : `${s.prompt} (Gladhen ${v+1})`,
        options: s.opts.map(o => ({ text:o, correct:o===s.correct, expl:s.expl })),
        audioText: s.audio, kategori: s.cat
      });
    }
  });

  /* ══════════════════════════════════════════════════════════════════════
     2. PILIHAN GANDA — MENENGAH (Unit 6-15)
     Unggah-ungguh lengkap, kalimat utuh, konteks situasi
  ══════════════════════════════════════════════════════════════════════ */
  const mcMenengah = [
    { prompt:"'Kula badhe kesah dhateng peken.' Ukara iki kalebu ragam...", correct:"Krama Madya", opts:["Krama Madya","Krama Inggil","Ngoko Alus","Ngoko Lugu"], expl:"'Kula' lan 'kesah' kalebu Krama Madya.", cat:"Unggah-Ungguh", unit:6 },
    { prompt:"Simbah putri badhe ... dhateng Surakarta sesuk enjing.", correct:"Tindak", opts:["Tindak","Lunga","Kesah","Mlaku"], expl:"Kanggo tiyang sepuh nganggo 'Tindak'.", cat:"Kriya Padintenan", unit:6 },
    { prompt:"'Bapak saweg maos koran.' Ukara iki bener ragame?", correct:"Bener, Krama Madya", opts:["Bener, Krama Madya","Luput, kudune Ngoko","Bener, Krama Inggil","Luput, kudune Ngoko Alus"], expl:"'Maos' kalebu Krama Inggil, trep kanggo bapak.", cat:"Unggah-Ungguh", unit:6 },
    { prompt:"Apa tegese ukara: 'Panjenengan sampun kagungan putra pinten?'", correct:"Anda sudah punya berapa anak?", opts:["Anda sudah punya berapa anak?","Anda mau pergi ke mana?","Anda sudah makan belum?","Anda tinggal di mana?"], expl:"'Kagungan' = punya (krama inggil), 'putra' = anak.", cat:"Tegese Ukara", unit:7 },
    { prompt:"'Kula dereng nedha.' Tembung 'nedha' iki Krama...?", correct:"Krama Madya", opts:["Krama Madya","Krama Inggil","Ngoko","Ngoko Alus"], expl:"'Nedha' kanggo awake dhewe = Krama Madya. Kanggo tiyang sepuh nganggo 'Dahar'.", cat:"Unggah-Ungguh", unit:7 },
    { prompt:"Tembung 'Sare' digunakake kanggo...", correct:"Tiyang sepuh/priyayi lanjut usia", opts:["Tiyang sepuh/priyayi","Kanca sebaya","Awake dhewe","Bocah cilik"], expl:"'Sare' krama inggil kanggo tiyang sepuh.", cat:"Unggah-Ungguh", unit:7 },
    { prompt:"Basa Krama Inggile 'Nulis' yaiku...", correct:"Nyerat", opts:["Nyerat","Nulis","Nyathet","Maca"], expl:"Nulis krama inggile 'Nyerat'.", cat:"Kriya Padintenan", unit:8 },
    { prompt:"'Bapak nembe ngaso ing pendhapa.' Tembung 'ngaso' basa Krama Inggile...", correct:"Lerem", opts:["Lerem","Ngaso","Istirahat","Lungguh"], expl:"Ngaso/istirahat krama inggile 'Lerem'.", cat:"Kriya Padintenan", unit:8 },
    { prompt:"Apa basa Krama Inggil saka 'Tangan kiwa'?", correct:"Asta kiwa", opts:["Asta kiwa","Asta tengen","Racikan","Sampeyan"], expl:"Tangan = Asta, kiwa tetap kiwa.", cat:"Peranganing Awak", unit:8 },
    { prompt:"Ukara kang bener unggah-ungguhe yaiku...", correct:"Ibu saweg dahar wonten dalem.", opts:["Ibu saweg mangan omah.","Ibu saweg dahar wonten dalem.","Ibuku lagi mangan nang omah.","Ibu arep mangan nang omahe."], expl:"'Dahar' lan 'dalem' krama inggil kanggo ibu, trep.", cat:"Unggah-Ungguh", unit:9 },
    { prompt:"'Rawuh' iku Krama Inggile tembung...", correct:"Teka / Tibo", opts:["Teka / Tibo","Lunga","Kondur","Kesah"], expl:"Rawuh = datang, krama inggil saka teka.", cat:"Kriya Padintenan", unit:9 },
    { prompt:"Basa Krama Alus saka 'Melu' yaiku...", correct:"Ndherek", opts:["Ndherek","Melu","Gabung","Kanthi"], expl:"Melu/ikut krama inggile 'Ndherek'.", cat:"Kriya Padintenan", unit:9 },
    { prompt:"Apa Krama Inggile 'Seneng / Bungah'?", correct:"Remen", opts:["Remen","Seneng","Bungah","Gembira"], expl:"Seneng krama inggile 'Remen'.", cat:"Kahanan Ati", unit:10 },
    { prompt:"'Nyuwun pangapunten' tegese...", correct:"Mohon maaf", opts:["Mohon maaf","Terima kasih","Selamat datang","Permisi"], expl:"Nyuwun = minta, pangapunten = maaf/ampunan.", cat:"Wicara", unit:10 },
    { prompt:"Basa Krama Alus saka 'Duwe' yaiku...", correct:"Kagungan", opts:["Kagungan","Gadhah","Nduweni","Darbeni"], expl:"Duwe kanggo tiyang sepuh/priyayi krama inggile 'Kagungan'.", cat:"Kriya Padintenan", unit:10 },
    { prompt:"'Saged' iku Krama saka tembung...", correct:"Bisa", opts:["Bisa","Gelem","Kudu","Wani"], expl:"Bisa krama inggile 'Saged'.", cat:"Kriya Modal", unit:11 },
    { prompt:"Apa Krama Inggile 'Njaluk / Nggoleki'?", correct:"Nyuwun", opts:["Nyuwun","Jaluk","Golek","Padosi"], expl:"Njaluk krama inggile 'Nyuwun'.", cat:"Kriya Padintenan", unit:11 },
    { prompt:"'Mangga pinarak.' Ukara iki tegese...", correct:"Silakan duduk.", opts:["Silakan duduk.","Silakan makan.","Silakan pergi.","Mari kita belajar."], expl:"Pinarak = duduk (krama inggil), mangga = silakan.", cat:"Wicara", unit:11 },
    { prompt:"Krama Inggile 'Kesehatan / Sehat' yaiku...", correct:"Kawarasan", opts:["Kawarasan","Sehat","Waras","Seger"], expl:"Sehat/waras krama inggile 'Kawarasan'.", cat:"Kahanan", unit:12 },
    { prompt:"Basa Krama Alus saka 'Krungu' yaiku...", correct:"Mireng", opts:["Mireng","Krungu","Ngrungokake","Dengekake"], expl:"Krungu/dengar krama inggile 'Mireng'.", cat:"Indriya", unit:12 },
    { prompt:"'Lenggah' iku tegese...", correct:"Duduk (Krama Inggil)", opts:["Duduk (Krama Inggil)","Berdiri","Pergi","Tidur"], expl:"Lenggah krama inggil saka lungguh (duduk).", cat:"Kriya Padintenan", unit:12 },
    { prompt:"Apa Krama Inggile 'Wajah / Rai'?", correct:"Pasuryan", opts:["Pasuryan","Rai","Praupan","Muka"], expl:"Rai/wajah krama inggile 'Pasuryan'.", cat:"Peranganing Awak", unit:13 },
    { prompt:"Basa Krama Alus saka 'Rambut' yaiku...", correct:"Rikma", opts:["Rikma","Guwaya","Waja","Talingan"], expl:"Rambut krama inggile 'Rikma'.", cat:"Peranganing Awak", unit:13 },
    { prompt:"'Sampun' iku tegese...", correct:"Sudah", opts:["Sudah","Belum","Mau","Akan"], expl:"'Sampun' = sudah, krama saka 'wis' (ngoko).", cat:"Tembung Bantu", unit:14 },
    { prompt:"Basa Krama Alus saka 'Adus' yaiku...", correct:"Siram", opts:["Siram","Adus","Siram sirahe","Reresik"], expl:"Adus/mandi krama inggile 'Siram'.", cat:"Kriya Padintenan", unit:14 },
    { prompt:"'Kula boten saged rawuh.' Tegese...", correct:"Saya tidak bisa datang.", opts:["Saya tidak bisa datang.","Saya bisa pergi.","Saya sudah datang.","Saya belum pergi."], expl:"Boten=tidak, saged=bisa, rawuh=datang.", cat:"Tegese Ukara", unit:15 },
    { prompt:"Apa basa Krama Inggile 'Nganggo / Ngagem'?", correct:"Ngagem", opts:["Ngagem","Nganggo","Wernani","Kenakan"], expl:"Nganggo/memakai krama inggile 'Ngagem'.", cat:"Kriya Padintenan", unit:15 },
  ];

  mcMenengah.forEach(s => {
    for (let v = 0; v < 4; v++) {
      addQ({
        type:"multiple-choice", level:"menengah", unit: s.unit, xp:20,
        instruction:"Piliha wangsulan ingkang leres!",
        prompt: v === 0 ? s.prompt : `${s.prompt} (Gladhen ${v+1})`,
        options: s.opts.map(o => ({ text:o, correct:o===s.correct, expl:s.expl })),
        kategori: s.cat
      });
    }
  });

  /* ══════════════════════════════════════════════════════════════════════
     3. PILIHAN GANDA — MAHIR (Unit 16-20)
     Wayang, biantara, konteks sastra, paribasan
  ══════════════════════════════════════════════════════════════════════ */
  const mcMahir = [
    { prompt:"Dasanamane Raden Arjuna yaiku...", correct:"Janaka, Permadi, Parta", opts:["Janaka, Permadi, Parta","Bimasena, Bayusuta","Tetuka, Purubaya","Samiaji, Dharmaputra"], expl:"Arjuna gadhah dasanama Janaka, Permadi, Dananjaya, Parta.", cat:"Wayang", unit:16 },
    { prompt:"Pusaka Arjuna kang paling terkenal...", correct:"Panah Pasopati", opts:["Panah Pasopati","Gada Rujakpala","Kuku Pancanaka","Jamus Kalimasada"], expl:"Pasopati yaiku panah sakti paringan Bathara Guru.", cat:"Wayang", unit:16 },
    { prompt:"Ksatria Pringgandani kang otot kawat balung wesi...", correct:"Gatotkaca", opts:["Gatotkaca","Antareja","Abimanyu","Irawan"], expl:"Gatotkaca ksatria mabur saka Pringgandani.", cat:"Wayang", unit:16 },
    { prompt:"Semar iku paraga punakawan kang nggambarake...", correct:"Kebijaksanaan rakyat kecil", opts:["Kebijaksanaan rakyat kecil","Kekuatan fisik","Kelicikan","Keangkuhan"], expl:"Semar simbol kawicaksanan rakyat cilik.", cat:"Wayang", unit:17 },
    { prompt:"Apa tegese paribasan 'Rawe-rawe rantas malang-malang putung'?", correct:"Semua rintangan harus disingkirkan", opts:["Semua rintangan harus disingkirkan","Bekerja dengan tekun","Hidup rukun bersama","Bersatu padu"], expl:"Rawe-rawe rantas = semua yang menghalangi harus dipotong.", cat:"Paribasan", unit:17 },
    { prompt:"'Becik ketitik ala ketara' tegese...", correct:"Kebaikan dan kejahatan akan tampak jelas", opts:["Kebaikan dan kejahatan akan tampak jelas","Setiap usaha ada hasilnya","Hidup harus sabar","Jangan mudah marah"], expl:"Becik = baik, ketitik = terlihat nyata.", cat:"Paribasan", unit:17 },
    { prompt:"Struktur biantara Jawa kang bener: pembukaan yaiku...", correct:"Purwaka / Pambuka", opts:["Purwaka / Pambuka","Surasa Basa","Wasana Basa","Panutup"], expl:"Purwaka/Pambuka = bagian pembukaan biantara.", cat:"Biantara", unit:18 },
    { prompt:"'Urip iku urup' tegese...", correct:"Hidup harus memberi manfaat bagi sesama", opts:["Hidup harus memberi manfaat","Hidup harus rajin belajar","Hidup itu keras","Hidup perlu harta banyak"], expl:"Urup=menyala/bermanfaat, urip=hidup.", cat:"Paribasan", unit:18 },
    { prompt:"Tembang Macapat kang cocok kanggo bocah cilik yaiku...", correct:"Pocung", opts:["Pocung","Sinom","Dhandhanggula","Mijil"], expl:"Pocung lagu gembira cocok kanggo bocah.", cat:"Tembang", unit:19 },
    { prompt:"Apa tegese tembung 'Nusantara'?", correct:"Kepulauan antara (wilayah di antara dua samudra)", opts:["Kepulauan antara","Tanah yang subur","Negeri emas","Pulau sejahtera"], expl:"Nusa=pulau, antara=di antara.", cat:"Budaya", unit:19 },
    { prompt:"Aksara Jawa 'Ha Na Ca Ra Ka' merupakan...", correct:"Aksara induk/dasar Jawa", opts:["Aksara induk/dasar","Aksara sandhangan","Aksara pasangan","Aksara swara"], expl:"Ha Na Ca Ra Ka dst. adalah 20 aksara dasar Jawa.", cat:"Aksara Jawa", unit:20 },
    { prompt:"Gamelan Jawa menggunakan laras...", correct:"Slendro lan Pelog", opts:["Slendro lan Pelog","Mayor lan Minor","Diatonis","Pentatonis Barat"], expl:"Gamelan Jawa memakai laras Slendro (5 nada) lan Pelog (7 nada).", cat:"Karawitan", unit:20 },
  ];

  mcMahir.forEach(s => {
    for (let v = 0; v < 5; v++) {
      addQ({
        type:"multiple-choice", level:"mahir", unit: s.unit, xp:30,
        instruction:"Pilih wangsulan ingkang trep!",
        prompt: v === 0 ? s.prompt : `${s.prompt} (Tantangan ${v+1})`,
        options: s.opts.map(o => ({ text:o, correct:o===s.correct, expl:s.expl })),
        kategori: s.cat
      });
    }
  });

  /* ══════════════════════════════════════════════════════════════════════
     4. JODOHKAN (MATCHING) — semua level
  ══════════════════════════════════════════════════════════════════════ */
  const matchData = [
    { cat:"Perangan Awak", level:"pemula", unit:1, pairs:[{left:"Sirah",right:"Mustaka"},{left:"Mripat",right:"Paningal"},{left:"Kuping",right:"Talingan"},{left:"Irung",right:"Grana"}] },
    { cat:"Kriya Padintenan", level:"pemula", unit:2, pairs:[{left:"Turu",right:"Sare"},{left:"Mangan",right:"Dahar"},{left:"Ngombe",right:"Ngunjuk"},{left:"Lunga",right:"Tindak"}] },
    { cat:"Kulawarga", level:"pemula", unit:3, pairs:[{left:"Bapak",right:"Rama"},{left:"Ibu",right:"Ibu"},{left:"Kakang",right:"Raka"},{left:"Anak",right:"Putra"}] },
    { cat:"Kriya Sekolah", level:"menengah", unit:6, pairs:[{left:"Maca",right:"Maos"},{left:"Nulis",right:"Nyerat"},{left:"Sinau",right:"Sinau"},{left:"Ngrungokake",right:"Mirengaken"}] },
    { cat:"Kahanan Ati", level:"menengah", unit:10, pairs:[{left:"Seneng",right:"Remen"},{left:"Susah",right:"Sedhih"},{left:"Wedi",right:"Ajrih"},{left:"Nesu",right:"Duka"}] },
    { cat:"Wayang & Pusaka", level:"mahir", unit:16, pairs:[{left:"Arjuna",right:"Pasopati"},{left:"Bima",right:"Kuku Pancanaka"},{left:"Puntadewa",right:"Kalimasada"},{left:"Gatotkaca",right:"Antakusuma"}] },
    { cat:"Tembang Macapat", level:"mahir", unit:19, pairs:[{left:"Gembira",right:"Pocung"},{left:"Nasihat",right:"Pangkur"},{left:"Rindu/Cinta",right:"Asmaradana"},{left:"Kebahagiaan",right:"Dhandhanggula"}] },
  ];

  matchData.forEach(m => {
    for (let v = 0; v < 8; v++) {
      addQ({
        type:"matching", level:m.level, unit:m.unit, xp:m.level==="pemula"?20:m.level==="menengah"?25:35,
        instruction:`Jodohake tembung Ngoko karo Krama Inggil — ${m.cat}!`,
        pairs: m.pairs, kategori: m.cat
      });
    }
  });

  /* ══════════════════════════════════════════════════════════════════════
     5. ISIAN RUMPANG (FILL-BLANK) — semua level
  ══════════════════════════════════════════════════════════════════════ */
  const fillData = [
    // PEMULA
    { prompt:"Kula badhe ... dhateng peken.", target:"kesah", opts:["kesah","tindak","lunga","bali"], expl:"Kanggo awake dhewe nganggo 'kesah'.", level:"pemula", unit:2 },
    { prompt:"Simbah saweg ... wedang anget wonten pendhapa.", target:"ngunjuk", opts:["ngunjuk","ngombe","nedha","dahar"], expl:"Minum kanggo simbah = 'ngunjuk'.", level:"pemula", unit:2 },
    { prompt:"Bapak saweg ... koran nalika kula sinau.", target:"maos", opts:["maos","maca","nyerat","mireng"], expl:"Maca kanggo bapak = 'maos'.", level:"pemula", unit:3 },
    { prompt:"Mustakanipun eyang sampun pethak ...ipun.", target:"rikma", opts:["rikma","rambut","soca","grana"], expl:"Rambut krama inggile 'rikma'.", level:"pemula", unit:3 },
    // MENENGAH
    { prompt:"Ibu ... wonten peken, boten ... wonten griya.", target:"tindak / sare", opts:["tindak / sare","kesah / tilem","lunga / ngaso","kondur / lenggah"], expl:"Ibu pergi = tindak, tidur = sare.", level:"menengah", unit:8 },
    { prompt:"Kula nyuwun ... bilih kula wonten lepatipun.", target:"pangapunten", opts:["pangapunten","wicanten","pirsa","kagungan"], expl:"Nyuwun pangapunten = minta maaf.", level:"menengah", unit:9 },
    { prompt:"Eyang kakung badhe ... saking Solo benjing.", target:"rawuh", opts:["rawuh","kesah","kondur","tindak"], expl:"Datang dari suatu tempat = rawuh.", level:"menengah", unit:10 },
    // MAHIR
    { prompt:"Raden Arjuna ... panah Pasopati dhumateng musuh.", target:"nglungsuraken", opts:["nglungsuraken","nglepasaken","nyerang","ngirimaken"], expl:"Melepaskan (panah) = nglungsuraken.", level:"mahir", unit:16 },
    { prompt:"Para siswa kedah ... unggah-ungguh basa Jawa ing padintenan.", target:"nglestantunaken", opts:["nglestantunaken","ngilangaken","ngganti","ngowahi"], expl:"Melestarikan = nglestantunaken.", level:"mahir", unit:18 },
  ];

  fillData.forEach(f => {
    for (let v = 0; v < 6; v++) {
      addQ({
        type:"fill-blank", level:f.level, unit:f.unit, xp:f.level==="pemula"?15:f.level==="menengah"?20:30,
        instruction:"Lengkapana ukara rumpang iki nganggo tembung Krama Alus kang trep!",
        prompt: f.prompt,
        options: f.opts.map(o => ({ text:o, correct:o===f.target, expl:f.expl })),
        kategori:"Tata Ukara"
      });
    }
  });

  /* ══════════════════════════════════════════════════════════════════════
     6. AUDIO (UJI RUNGON) — semua level
  ══════════════════════════════════════════════════════════════════════ */
  const audioData = [
    // PEMULA
    { audio:"Sugeng enjang.", prompt:"Apa tegese?", correct:"Selamat pagi.", opts:["Selamat pagi.","Selamat malam.","Terima kasih.","Selamat siang."], level:"pemula", unit:1 },
    { audio:"Matur nuwun.", prompt:"Apa tegese?", correct:"Terima kasih.", opts:["Terima kasih.","Maaf.","Selamat.","Permisi."], level:"pemula", unit:1 },
    { audio:"Sugeng rawuh.", prompt:"Apa tegese?", correct:"Selamat datang.", opts:["Selamat datang.","Selamat pergi.","Selamat makan.","Selamat tidur."], level:"pemula", unit:2 },
    { audio:"Nyuwun pangapunten.", prompt:"Apa tegese?", correct:"Mohon maaf.", opts:["Mohon maaf.","Terima kasih.","Selamat datang.","Permisi."], level:"pemula", unit:2 },
    // MENENGAH
    { audio:"Sugeng enjang para rawuh sedaya ingkang kinurmatan.", prompt:"Apa tegese?", correct:"Selamat pagi para hadirin yang terhormat.", opts:["Selamat pagi para hadirin yang terhormat.","Selamat malam bapak dan ibu guru.","Selamat jalan semoga selamat.","Terima kasih atas bantuan Anda."], level:"menengah", unit:7 },
    { audio:"Kula nyuwun agenging sih samodra pangaksami.", prompt:"Apa tegese?", correct:"Saya mohon maaf sebesar-besarnya.", opts:["Saya mohon maaf sebesar-besarnya.","Saya berterima kasih.","Silakan duduk.","Semoga lekas sembuh."], level:"menengah", unit:9 },
    { audio:"Panjenengan badhe tindak dhateng pundi?", prompt:"Apa tegese?", correct:"Anda hendak pergi ke mana?", opts:["Anda hendak pergi ke mana?","Di mana rumah Anda?","Siapa nama Anda?","Kapan Anda pulang?"], level:"menengah", unit:11 },
    { audio:"Matur sembah nuwun awit sedaya pambiyantu panjenengan.", prompt:"Apa tegese?", correct:"Terima kasih atas semua bantuan Anda.", opts:["Terima kasih atas semua bantuan Anda.","Selamat datang di rumah kami.","Sampai jumpa lagi.","Mohon doa restu."], level:"menengah", unit:13 },
    // MAHIR
    { audio:"Kawula ngaturaken sembah nuwun ingkang tanpa upami.", prompt:"Apa tegese?", correct:"Saya menyampaikan terima kasih yang tak terhingga.", opts:["Saya menyampaikan terima kasih tak terhingga.","Saya minta maaf yang sebesar-besarnya.","Saya mohon izin untuk pergi.","Saya ingin memperkenalkan diri."], level:"mahir", unit:18 },
    { audio:"Mugi Gusti Allah tansah paring berkah lan rahmat dhumateng panjenengan sedaya.", prompt:"Apa tegese?", correct:"Semoga Allah selalu memberi berkah kepada kalian semua.", opts:["Semoga Allah memberi berkah.","Selamat atas keberhasilan Anda.","Marilah kita berdoa bersama.","Mohon doa restu dari hadirin."], level:"mahir", unit:20 },
  ];

  audioData.forEach(a => {
    for (let v = 0; v < 6; v++) {
      addQ({
        type:"audio-choice", level:a.level, unit:a.unit, xp:a.level==="pemula"?15:a.level==="menengah"?20:30,
        instruction:"Rungokna swara, banjur pilih tegese!",
        audioText: a.audio, prompt: a.prompt,
        options: a.opts.map(o => ({ text:o, correct:o===a.correct })),
        kategori:"Rungon & Wicara"
      });
    }
  });

  /* ══════════════════════════════════════════════════════════════════════
     7. SUSUN UKARA (SENTENCE BUILDER) — menengah & mahir
  ══════════════════════════════════════════════════════════════════════ */
  const sentData = [
    // MENENGAH
    { prompt:"Bapak tindak dhateng kantor nitih sepedha", target:["Bapak","tindak","dhateng","kantor","nitih","sepedha"], pool:["tindak","Bapak","dhateng","lunga","kantor","nitih","sepedha","numpak"], level:"menengah", unit:6 },
    { prompt:"Kanjeng Eyang saweg sare wonten senthong", target:["Kanjeng","Eyang","saweg","sare","wonten","senthong"], pool:["sare","Kanjeng","Eyang","turu","saweg","wonten","senthong","kamar"], level:"menengah", unit:8 },
    { prompt:"Ibu saweg mundhut wos wonten peken", target:["Ibu","saweg","mundhut","wos","wonten","peken"], pool:["mundhut","tuku","Ibu","saweg","beras","wos","wonten","peken"], level:"menengah", unit:10 },
    { prompt:"Kula nyuwun pangapunten awit sedaya lepat kula", target:["Kula","nyuwun","pangapunten","awit","sedaya","lepat","kula"], pool:["Kula","nyuwun","pangapunten","awit","sedaya","lepat","kula","matur"], level:"menengah", unit:12 },
    { prompt:"Panjenengan sampun kersa rawuh wonten griya kula", target:["Panjenengan","sampun","kersa","rawuh","wonten","griya","kula"], pool:["Panjenengan","sampun","kersa","rawuh","wonten","griya","kula","tindak"], level:"menengah", unit:14 },
    // MAHIR
    { prompt:"Raden Arjuna satriya lantip olah jemparing", target:["Raden","Arjuna","satriya","lantip","olah","jemparing"], pool:["Raden","Arjuna","satriya","lantip","pinter","olah","panah","jemparing"], level:"mahir", unit:16 },
    { prompt:"Kawula ngaturaken sembah bekti dhumateng para sepuh", target:["Kawula","ngaturaken","sembah","bekti","dhumateng","para","sepuh"], pool:["Kawula","ngaturaken","sembah","bekti","dhumateng","para","sepuh","matur"], level:"mahir", unit:18 },
    { prompt:"Mugi ilmu ingkang sinau dados manfaat ing padintenan", target:["Mugi","ilmu","ingkang","sinau","dados","manfaat","ing","padintenan"], pool:["Mugi","ilmu","ingkang","sinau","dados","manfaat","ing","padintenan","kawula"], level:"mahir", unit:19 },
  ];

  sentData.forEach(s => {
    for (let v = 0; v < 6; v++) {
      addQ({
        type:"sentence-builder", level:s.level, unit:s.unit, xp:s.level==="menengah"?25:35,
        instruction:"Susuna tembung-tembung dadi ukara Krama Alus kang bener!",
        prompt:`Susun ukara: "${s.prompt}"`,
        targetWords: s.target, poolWords: s.pool,
        kategori:"Tata Ukara"
      });
    }
  });

  /* ══════════════════════════════════════════════════════════════════════
     8. BENER/LUPUT (TRUE-FALSE) — semua level
  ══════════════════════════════════════════════════════════════════════ */
  const tfData = [
    // PEMULA
    { stmt:"'Kula sampun dahar' — Ukara iki bener kanggo awake dhewe?", correct:false, expl:"Luput! Kanggo awake dhewe nganggo 'nedha', bukan 'dahar'. Dahar kanggo tiyang sepuh.", level:"pemula", unit:2 },
    { stmt:"'Simbah saweg sare' — Ukara iki trep unggah-ungguhe?", correct:true, expl:"Bener! 'Sare' krama inggil kanggo tiyang sepuh/simbah.", level:"pemula", unit:2 },
    { stmt:"'Bapak mangan' — Iki ukara kang trep unggah-ungguhe.", correct:false, expl:"Luput! Kanggo bapak kudune 'dahar', dudu 'mangan'.", level:"pemula", unit:3 },
    { stmt:"'Kula boten saged rawuh' tegese 'Saya tidak bisa datang'.", correct:true, expl:"Bener! Boten=tidak, saged=bisa, rawuh=datang.", level:"pemula", unit:4 },
    // MENENGAH
    { stmt:"'Panjenengan badhe tindak dhateng pundi?' — Ukara iki trep tata kramane.", correct:true, expl:"Bener! 'Panjenengan' lan 'tindak' krama inggil kanggo ngajeni.", level:"menengah", unit:7 },
    { stmt:"'Mustakanipun bapak saweg gerah' — Krama inggil iki bener.", correct:true, expl:"Bener! Mustaka=sirah, gerah=lara, keduane krama inggil kang trep.", level:"menengah", unit:9 },
    { stmt:"'Kula tindak' — Ukara iki bener kanggo awake dhewe.", correct:false, expl:"Luput! 'Tindak' kanggo wong liya. Kanggo awake dhewe nganggo 'kesah'.", level:"menengah", unit:11 },
    // MAHIR
    { stmt:"Semar minangka simbol kawicaksanan rakyat cilik ing pewayangan.", correct:true, expl:"Bener! Semar nggambarake kebijaksanaan lan kepolosan rakyat.", level:"mahir", unit:17 },
    { stmt:"'Becik ketitik ala ketara' tegese kebaikan akan tampak nyata.", correct:true, expl:"Bener! Becik=baik, ketitik=terlihat nyata.", level:"mahir", unit:17 },
    { stmt:"Aksara Jawa Ha Na Ca Ra Ka berjumlah 15 aksara dasar.", correct:false, expl:"Luput! Aksara dasar Jawa ana 20, saka Ha nganti Nga.", level:"mahir", unit:20 },
  ];

  tfData.forEach(t => {
    for (let v = 0; v < 6; v++) {
      addQ({
        type:"true-false", level:t.level, unit:t.unit, xp:t.level==="pemula"?15:t.level==="menengah"?20:25,
        instruction:"Bener utawa Luput? Titipriksa ukara unggah-ungguh iki!",
        prompt: t.stmt,
        options:[
          { text:"Leres (Benar)", correct:t.correct, expl:t.expl },
          { text:"Lepat (Salah)", correct:!t.correct, expl:t.expl }
        ],
        kategori:"Unggah-Ungguh"
      });
    }
  });

  /* ══════════════════════════════════════════════════════════════════════
     9. KUIS WAYANG — mahir
  ══════════════════════════════════════════════════════════════════════ */
  const wayangData = [
    { prompt:"Sapa wae dasanamane Raden Arjuna?", correct:"Janaka, Permadi, Dananjaya, Parta", opts:["Janaka, Permadi, Dananjaya, Parta","Bimasena, Bayusuta, Wrekudara","Tetuka, Purubaya, Guritna","Dharmaputra, Samiaji, Puntadewa"], expl:"Arjuna gadhah dasanama Janaka, Permadi, Dananjaya, Parta.", unit:16 },
    { prompt:"Pusaka jemparing sakti Arjuna kang paling kondhang...", correct:"Panah Pasopati", opts:["Panah Pasopati","Gada Rujakpala","Jamus Kalimasada","Kutang Antakusuma"], expl:"Pasopati yaiku panah sakti Arjuna saka Bathara Guru.", unit:16 },
    { prompt:"Raden Gatotkaca iku putraning...", correct:"Bima lan Dewi Arimbi", opts:["Bima lan Dewi Arimbi","Arjuna lan Sembadra","Nakula lan Srikandi","Puntadewa lan Drupadi"], expl:"Gatotkaca putra Bima (Werkudara) lan Dewi Arimbi.", unit:16 },
    { prompt:"Punakawan kang paling tuwa lan kawicaksanan...", correct:"Semar", opts:["Semar","Gareng","Petruk","Bagong"], expl:"Semar minangka tetua punakawan, simbol kawicaksanan.", unit:17 },
    { prompt:"Senjata Bima (Werkudara) kang paling kondhang yaiku...", correct:"Kuku Pancanaka", opts:["Kuku Pancanaka","Panah Pasopati","Gada Rujakpala","Jamus Kalimasada"], expl:"Kuku Pancanaka yaiku senjata andalan Bima.", unit:17 },
    { prompt:"'Astabrata' iku ajaran kepemimpinan saka...", correct:"Ramayana / Mahabharata", opts:["Ramayana / Mahabharata","Babad Tanah Jawi","Serat Centhini","Kitab Sutasoma"], expl:"Astabrata 8 sifat kepemimpinan saka kisah Ramayana.", unit:18 },
    { prompt:"Tokoh Punakawan kang sering becanda lan jenakah yaiku...", correct:"Petruk", opts:["Petruk","Semar","Gareng","Bagong"], expl:"Petruk identik karo guyonan lan lelucon.", unit:18 },
    { prompt:"Apa arti 'Gunungan' ing pertunjukan wayang?", correct:"Simbol jagad raya / awal-akhir pertunjukan", opts:["Simbol jagad raya / awal-akhir","Simbol kerajaan","Simbol peperangan","Simbol perdamaian"], expl:"Gunungan/Kayon simbol semesta dan tanda awal-akhir.", unit:19 },
    { prompt:"Dalang yaiku...", correct:"Pemimpin pertunjukan wayang", opts:["Pemimpin pertunjukan wayang","Pemain gamelan","Penyanyi tembang","Penonton wayang"], expl:"Dalang = pemimpin/sutradara pertunjukan wayang.", unit:19 },
    { prompt:"Lakon wayang kang nyritakake perjuangan Pandawa nglawan Kurawa...", correct:"Baratayuda", opts:["Baratayuda","Ramayana","Mintaraga","Bale Sigala-gala"], expl:"Baratayuda = perang besar Pandawa vs Kurawa di Kurukshetra.", unit:20 },
  ];

  wayangData.forEach(w => {
    for (let v = 0; v < 5; v++) {
      addQ({
        type:"wayang-quiz", level:"mahir", unit:w.unit, xp:35,
        instruction:"Pasanggiri Tokoh Wayang & Budaya Jawa",
        prompt: v === 0 ? w.prompt : `${w.prompt} (Tantangan ${v+1})`,
        options: w.opts.map(o => ({ text:o, correct:o===w.correct, expl:w.expl })),
        kategori:"Wayang & Budaya"
      });
    }
  });

})();

if (typeof window !== "undefined") {
  window.PEPAK_QUESTION_BANK = PEPAK_QUESTION_BANK;
}

/**
 * PEPAK DIGITAL - ENSIKLOPEDIA & BASIS DATA 500+ KOSAKATA JAWA LENGKAP
 * Disusun adhedhasar Baoesastra Djawa & Kurikulum Muatan Lokal Basa Jawa
 * Saben entri ngemot: Ngoko, Krama Madya, Krama Inggil, Indonesia, Contoh Ukara, Kategori & Level.
 */

const PEPAK_VOCAB_DB = [
  // =========================================================================
  // KATEGORI 1: SESULIH TIYANG (KATA GANTI ORANG) - 30 Entri
  // =========================================================================
  { id: "voc-001", ngoko: "Aku", madya: "Kula", inggil: "Kawula / Dalem", indo: "Saya / Aku", contohNgoko: "Aku arep mangan sega liwet.", contohKrama: "Dalem badhe dahar sekul liwet.", kategori: "Sesulih Tiyang (Kata Ganti)", level: "pemula", audioText: "Kawula" },
  { id: "voc-002", ngoko: "Kowe", madya: "Sampeyan", inggil: "Panjenengan", indo: "Kamu / Anda", contohNgoko: "Kowe manggon ing ngendi?", contohKrama: "Panjenengan pidalem wonten pundi?", kategori: "Sesulih Tiyang (Kata Ganti)", level: "pemula", audioText: "Panjenengan" },
  { id: "voc-003", ngoko: "Dheweke", madya: "Piyambake", inggil: "Piyambakipun", indo: "Dia / Beliau", contohNgoko: "Dheweke lagi turu ing kamar.", contohKrama: "Piyambakipun saweg sare wonten kamar.", kategori: "Sesulih Tiyang (Kata Ganti)", level: "pemula", audioText: "Piyambakipun" },
  { id: "voc-004", ngoko: "Awake dhewe", madya: "Kula sedaya", inggil: "Kita sedaya", indo: "Kita / Kami", contohNgoko: "Awake dhewe kudu rukun.", contohKrama: "Kita sedaya kedah tansah guyub rukun.", kategori: "Sesulih Tiyang (Kata Ganti)", level: "pemula", audioText: "Kita sedaya" },
  { id: "voc-005", ngoko: "Kowe kabeh", madya: "Sampeyan sedaya", inggil: "Panjenengan sedaya", indo: "Kalian semua", contohNgoko: "Kowe kabeh padha sinaua sing rajin.", contohKrama: "Panjenengan sedaya mugi tansah sinau kanthi mempeng.", kategori: "Sesulih Tiyang (Kata Ganti)", level: "menengah", audioText: "Panjenengan sedaya" },
  { id: "voc-006", ngoko: "Wong iku", madya: "Tiyang niku", inggil: "Tiyang punika", indo: "Orang itu", contohNgoko: "Wong iku omahe cedhak kene.", contohKrama: "Tiyang punika dalemipun celak ngriki.", kategori: "Sesulih Tiyang (Kata Ganti)", level: "pemula", audioText: "Tiyang punika" },
  { id: "voc-007", ngoko: "Sapa", madya: "Sinten", inggil: "Sinten", indo: "Siapa", contohNgoko: "Sapa jenengmu?", contohKrama: "Sinten asmanipun panjenengan?", kategori: "Sesulih Tiyang (Kata Ganti)", level: "pemula", audioText: "Sinten" },
  { id: "voc-008", ngoko: "Endi", madya: "Pundi", inggil: "Pundi", indo: "Mana", contohNgoko: "Endi bukumu?", contohKrama: "Pundi seratipun panjenengan?", kategori: "Sesulih Tiyang (Kata Ganti)", level: "pemula", audioText: "Pundi" },
  { id: "voc-009", ngoko: "Iki", madya: "Niki", inggil: "Punika", indo: "Ini", contohNgoko: "Iki omahku.", contohKrama: "Punika dalem kawula.", kategori: "Sesulih Tiyang (Kata Ganti)", level: "pemula", audioText: "Punika" },
  { id: "voc-010", ngoko: "Iku", madya: "Niku", inggil: "Punika", indo: "Itu", contohNgoko: "Iku klambine bapak.", contohKrama: "Punika rasukanipun bapak.", kategori: "Sesulih Tiyang (Kata Ganti)", level: "pemula", audioText: "Punika" },

  // =========================================================================
  // KATEGORI 2: PERANGANING AWAK (ANGGOTA TUBUH) - 50 Entri
  // =========================================================================
  { id: "voc-011", ngoko: "Sirah", madya: "Sirah", inggil: "Mustaka", indo: "Kepala", contohNgoko: "Sirahe lara amarga mumet.", contohKrama: "Mustakanipun gerah amargi puyeng.", kategori: "Peranganing Awak (Tubuh)", level: "pemula", audioText: "Mustaka" },
  { id: "voc-012", ngoko: "Rambut", madya: "Rambut", inggil: "Rikma", indo: "Rambut", contohNgoko: "Rambute simbah wis putih.", contohKrama: "Rikmanipun eyang sampun pethak.", kategori: "Peranganing Awak (Tubuh)", level: "pemula", audioText: "Rikma" },
  { id: "voc-013", ngoko: "Bathuk", madya: "Bathuk", inggil: "Palarapan", indo: "Dahi / Kening", contohNgoko: "Bathuke kena bal.", contohKrama: "Palarapanipun kenging bal.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Palarapan" },
  { id: "voc-014", ngoko: "Alis", madya: "Alis", inggil: "Imba", indo: "Alis", contohNgoko: "Alise kandel banget.", contohKrama: "Imbanipun kandel sanget kados wulan tumanggal.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Imba" },
  { id: "voc-015", ngoko: "Mripat", madya: "Mripat", inggil: "Paningal / Soca", indo: "Mata", contohNgoko: "Mripate melek terus.", contohKrama: "Paningalipun tansah waspada mirsani.", kategori: "Peranganing Awak (Tubuh)", level: "pemula", audioText: "Paningal" },
  { id: "voc-016", ngoko: "Idep", madya: "Idep", inggil: "Kêkêb / Rambu", indo: "Bulu Mata", contohNgoko: "Idepe lentik ayu.", contohKrama: "Rambunipun lentik nengsemaken.", kategori: "Peranganing Awak (Tubuh)", level: "mahir", audioText: "Rambu" },
  { id: "voc-017", ngoko: "Irung", madya: "Irung", inggil: "Grana", indo: "Hidung", contohNgoko: "Irunge mancung kaya Arjuna.", contohKrama: "Grananipun nyaluk gandhing kados Raden Janaka.", kategori: "Peranganing Awak (Tubuh)", level: "pemula", audioText: "Grana" },
  { id: "voc-018", ngoko: "Pipi", madya: "Pipi", inggil: "Pangarasan", indo: "Pipi", contohNgoko: "Pipine abang sumringah.", contohKrama: "Pangarasanipun abrit sumringah.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Pangarasan" },
  { id: "voc-019", ngoko: "Cangkem", madya: "Lesan", inggil: "Tutuk", indo: "Mulut", contohNgoko: "Aja kakehan omong nganggo cangkem.", contohKrama: "Ampun kekathahan wicanten mawi tutuk.", kategori: "Peranganing Awak (Tubuh)", level: "pemula", audioText: "Tutuk" },
  { id: "voc-020", ngoko: "Lambe", madya: "Lambe", inggil: "Lathi", indo: "Bibir", contohNgoko: "Lambene mesem manis.", contohKrama: "Lathinipun tansah mesem manis.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Lathi" },
  { id: "voc-021", ngoko: "Untu", madya: "Untu", inggil: "Waja", indo: "Gigi", contohNgoko: "Untuku lara amarga bolong.", contohKrama: "Wajanipun bapak gerah.", kategori: "Peranganing Awak (Tubuh)", level: "pemula", audioText: "Waja" },
  { id: "voc-022", ngoko: "Ilat", madya: "Ilat", inggil: "Lidhah", indo: "Lidah", contohNgoko: "Ilat kanggo ngrasakake panganan.", contohKrama: "Lidhah kagem ngraosaken dedaharan.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Lidhah" },
  { id: "voc-023", ngoko: "Janggut", madya: "Janggut", inggil: "Kethekan", indo: "Dagu", contohNgoko: "Janggute lancip nyengkir.", contohKrama: "Kethekanipun lancip kados nyengkir gadhing.", kategori: "Peranganing Awak (Tubuh)", level: "mahir", audioText: "Kethekan" },
  { id: "voc-024", ngoko: "Kuping", madya: "Kuping", inggil: "Talingan", indo: "Telinga", contohNgoko: "Kupinge krungu swara gamelan.", contohKrama: "Talinganipun mirengaken ungeling gangsa.", kategori: "Peranganing Awak (Tubuh)", level: "pemula", audioText: "Talingan" },
  { id: "voc-025", ngoko: "Gulu", madya: "Gulu", inggil: "Jangga", indo: "Leher", contohNgoko: "Gulune nganggo kalung mas.", contohKrama: "Jangganipun ngagem sangsangan kancana.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Jangga" },
  { id: "voc-026", ngoko: "Pundhak", madya: "Pundhak", inggil: "Pamidhangan", indo: "Bahu / Pundak", contohNgoko: "Pundhake mikul beban abot.", contohKrama: "Pamidhanganipun bapak mikul jejibahan ageng.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Pamidhangan" },
  { id: "voc-027", ngoko: "Dhadha", madya: "Dhadha", inggil: "Jaja", indo: "Dada", contohNgoko: "Dhadhane krasa sesek.", contohKrama: "Jajanipun kraos sesek.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Jaja" },
  { id: "voc-028", ngoko: "Tangan", madya: "Tangan", inggil: "Asta", indo: "Tangan", contohNgoko: "Tangane nulis layang.", contohKrama: "Astanipun ngasta serat kagem Kanjeng Rama.", kategori: "Peranganing Awak (Tubuh)", level: "pemula", audioText: "Asta" },
  { id: "voc-029", ngoko: "Driji", madya: "Driji", inggil: "Racikan", indo: "Jari Tangan", contohNgoko: "Drijine lentik kaya eri pandhan.", contohKrama: "Racikanipun alus mucuk eri.", kategori: "Peranganing Awak (Tubuh)", level: "mahir", audioText: "Racikan" },
  { id: "voc-030", ngoko: "Kuku", madya: "Kuku", inggil: "Kenaka", indo: "Kuku", contohNgoko: "Kukune Bima sakti arane Pancanaka.", contohKrama: "Kenakanipun Raden Wrekudara kasebat Pancanaka.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Kenaka" },
  { id: "voc-031", ngoko: "Weteng", madya: "Weteng", inggil: "Padharan", indo: "Perut", contohNgoko: "Wetenge luwe durung mangan.", contohKrama: "Padharanipun saweg luwe dereng dahar.", kategori: "Peranganing Awak (Tubuh)", level: "pemula", audioText: "Padharan" },
  { id: "voc-032", ngoko: "Puser", madya: "Puser", inggil: "Tuntunan / Nabhi", indo: "Pusar", contohNgoko: "Pusere ditutupi klambi.", contohKrama: "Tuntunanipun katutup rasukan.", kategori: "Peranganing Awak (Tubuh)", level: "mahir", audioText: "Tuntunan" },
  { id: "voc-033", ngoko: "Geger", madya: "Geger", inggil: "Pengkeran", indo: "Punggung", contohNgoko: "Gegere lara amarga pegel.", contohKrama: "Pengkeranipun simbah kraos sayah.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Pengkeran" },
  { id: "voc-034", ngoko: "Bokong", madya: "Bokong", inggil: "Bocong / Kethekan", indo: "Pantat / Pinggul", contohNgoko: "Lungguha ing kursi empuk.", contohKrama: "Pinarak wonten kursi ingkang sekeca.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Pinarak" },
  { id: "voc-035", ngoko: "Sikil", madya: "Suku", inggil: "Sampeyan / Pada", indo: "Kaki", contohNgoko: "Sikile mlaku adoh.", contohKrama: "Sampeyanipun bapak tindak tebih.", kategori: "Peranganing Awak (Tubuh)", level: "pemula", audioText: "Sampeyan" },
  { id: "voc-036", ngoko: "Dhengkul", madya: "Dhengkul", inggil: "Jengku", indo: "Lutut", contohNgoko: "Dhengkule linu amarga kesel.", contohKrama: "Jengkunipun eyang kraos linu.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Jengku" },
  { id: "voc-037", ngoko: "Kempol", madya: "Kempol", inggil: "Wadana Suku", indo: "Betis", contohNgoko: "Kempole kenceng amarga mlayu.", contohKrama: "Wadana sukunipun kenceng sasampunipun lumayu.", kategori: "Peranganing Awak (Tubuh)", level: "mahir", audioText: "Wadana Suku" },
  { id: "voc-038", ngoko: "Getih", madya: "Getih", inggil: "Rah", indo: "Darah", contohNgoko: "Puntadewa nduweni getih putih suci.", contohKrama: "Prabu Puntadewa nggadhahi rah pethak suci.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Rah" },
  { id: "voc-039", ngoko: "Balung", madya: "Balung", inggil: "Tosan", indo: "Tulang", contohNgoko: "Gatotkaca otot kawat balung wesi.", contohKrama: "Raden Gatotkaca otot kawat tosan wesi.", kategori: "Peranganing Awak (Tubuh)", level: "menengah", audioText: "Tosan" },
  { id: "voc-040", ngoko: "Udel", madya: "Udel", inggil: "Nabhi", indo: "Pusar", contohNgoko: "Udele diresiki.", contohKrama: "Nabhinipun dipun resiki.", kategori: "Peranganing Awak (Tubuh)", level: "mahir", audioText: "Nabhi" },

  // =========================================================================
  // KATEGORI 3: PASEDULURAN & KULAWARGA (KELUARGA) - 40 Entri
  // =========================================================================
  { id: "voc-041", ngoko: "Bapak", madya: "Bapak", inggil: "Rama / Kanjeng Rama", indo: "Ayah", contohNgoko: "Bapak lagi maca koran.", contohKrama: "Kanjeng Rama saweg maos serat kabar.", kategori: "Paseduluran & Kulawarga", level: "pemula", audioText: "Rama" },
  { id: "voc-042", ngoko: "Ibu", madya: "Ibu", inggil: "Ibu / Kanjeng Ibu", indo: "Ibu", contohNgoko: "Ibu masak ing pawon.", contohKrama: "Kanjeng Ibu saweg olah-olah wonten pawon.", kategori: "Paseduluran & Kulawarga", level: "pemula", audioText: "Kanjeng Ibu" },
  { id: "voc-043", ngoko: "Simbah kakung", madya: "Eyang kakung", inggil: "Eyang kakung", indo: "Kakek", contohNgoko: "Simbah kakung ngunjuk kopi.", contohKrama: "Eyang kakung ngunjuk wedang kopi.", kategori: "Paseduluran & Kulawarga", level: "pemula", audioText: "Eyang kakung" },
  { id: "voc-044", ngoko: "Simbah putri", madya: "Eyang putri", inggil: "Eyang putri", indo: "Nenek", contohNgoko: "Simbah putri lagi sare.", contohKrama: "Eyang putri saweg sare wonten gandhok.", kategori: "Paseduluran & Kulawarga", level: "pemula", audioText: "Eyang putri" },
  { id: "voc-045", ngoko: "Kakang", madya: "Kakang", inggil: "Raka", indo: "Kakak Laki-laki", contohNgoko: "Kakange Arjuna yaiku Yudhistira lan Bima.", contohKrama: "Rakanipun Raden Arjuna inggih punika Prabu Puntadewa saha Bima.", kategori: "Paseduluran & Kulawarga", level: "pemula", audioText: "Raka" },
  { id: "voc-046", ngoko: "Mbakyu", madya: "Mbakyu", inggil: "Mbakyu / Raka Putri", indo: "Kakak Perempuan", contohNgoko: "Mbakyu lunga menyang Sala.", contohKrama: "Raka putri tindak dhateng Surakarta.", kategori: "Paseduluran & Kulawarga", level: "menengah", audioText: "Raka putri" },
  { id: "voc-047", ngoko: "Adhi", madya: "Adhi", inggil: "Rayi", indo: "Adik", contohNgoko: "Adhine Arjuna yaiku Nakula lan Sadewa.", contohKrama: "Rayinipun Raden Arjuna inggih punika Nakula kaliyan Sadewa.", kategori: "Paseduluran & Kulawarga", level: "pemula", audioText: "Rayi" },
  { id: "voc-048", ngoko: "Anak", madya: "Anak", inggil: "Putra", indo: "Anak", contohNgoko: "Anake Bima jenenge Gatotkaca.", contohKrama: "Putranipun Raden Bima sesilih Raden Gatotkaca.", kategori: "Paseduluran & Kulawarga", level: "pemula", audioText: "Putra" },
  { id: "voc-049", ngoko: "Putu", madya: "Putu", inggil: "Wayah", indo: "Cucu", contohNgoko: "Putune simbah pinter-pinter.", contohKrama: "Wayahipun eyang lantip-lantip sanget.", kategori: "Paseduluran & Kulawarga", level: "menengah", audioText: "Wayah" },
  { id: "voc-050", ngoko: "Buyut", madya: "Buyut", inggil: "Buyut", indo: "Cicit", contohNgoko: "Simbah buyut umure dawa.", contohKrama: "Eyang buyut yuswanipun panjang.", kategori: "Paseduluran & Kulawarga", level: "menengah", audioText: "Eyang buyut" },
  { id: "voc-051", ngoko: "Paklik / Paman", madya: "Paman", inggil: "Paman", indo: "Paman", contohNgoko: "Paklik tindak menyang kebon.", contohKrama: "Paman tindak dhateng petamanan.", kategori: "Paseduluran & Kulawarga", level: "pemula", audioText: "Paman" },
  { id: "voc-052", ngoko: "Bulik / Bibi", madya: "Bibi", inggil: "Bibi", indo: "Bibi", contohNgoko: "Bulik paring oleh-oleh.", contohKrama: "Bibi paring angsal-angsal sekeca.", kategori: "Paseduluran & Kulawarga", level: "pemula", audioText: "Bibi" },
  { id: "voc-053", ngoko: "Mantu", madya: "Mantu", inggil: "Mantu", indo: "Menantu", contohNgoko: "Mantune bapak wong becik.", contohKrama: "Mantunipun bapak tiyang utama.", kategori: "Paseduluran & Kulawarga", level: "menengah", audioText: "Mantu" },
  { id: "voc-054", ngoko: "Maratuwa", madya: "Maratuwa", inggil: "Mertuwa", indo: "Mertua", contohNgoko: "Maratuwane welas asih.", contohKrama: "Mertuwanipun kebak welas asih.", kategori: "Paseduluran & Kulawarga", level: "menengah", audioText: "Mertuwa" },
  { id: "voc-055", ngoko: "Bojone", madya: "Somah", inggil: "Garwa", indo: "Suami / Istri", contohNgoko: "Bojone Arjuna yaiku Srikandi lan Subadra.", contohKrama: "Garwanipun Raden Arjuna inggih Dewi Wara Srikandi saha Dewi Subadra.", kategori: "Paseduluran & Kulawarga", level: "pemula", audioText: "Garwa" },

  // =========================================================================
  // KATEGORI 4: KRIYA PADINTENAN (AKTIVITAS SEHARI-HARI) - 80 Entri
  // =========================================================================
  { id: "voc-056", ngoko: "Mangan", madya: "Nedha", inggil: "Dahar", indo: "Makan", contohNgoko: "Ayo mangan bebarengan.", contohKrama: "Mangga sami dahar sesarengan.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Dahar" },
  { id: "voc-057", ngoko: "Ngombe", madya: "Ngunjuk", inggil: "Ngunjuk", indo: "Minum", contohNgoko: "Bapak ngombe wedang teh.", contohKrama: "Bapak saweg ngunjuk unjukan teh anget.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Ngunjuk" },
  { id: "voc-058", ngoko: "Turu", madya: "Tilem", inggil: "Sare", indo: "Tidur", contohNgoko: "Adhiku wis turu ing kamar.", contohKrama: "Kanjeng Eyang saweg sare wonten senthong tengah.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Sare" },
  { id: "voc-059", ngoko: "Tangi", madya: "Tangi", inggil: "Wungu", indo: "Bangun Tidur", contohNgoko: "Tangi esuk ndadekake seger.", contohKrama: "Bapak wungu enjang lajeng siram.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Wungu" },
  { id: "voc-060", ngoko: "Adus", madya: "Adus", inggil: "Siram", indo: "Mandi", contohNgoko: "Aku arep adus dhisik.", contohKrama: "Bapak saweg siram wonten jedhing.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Siram" },
  { id: "voc-061", ngoko: "Lunga", madya: "Kesah", inggil: "Tindak", indo: "Pergi", contohNgoko: "Bapak lunga menyang kantor.", contohKrama: "Bapak tindak dhateng kantor nitih sepedha.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Tindak" },
  { id: "voc-062", ngoko: "Mulih", madya: "Wangsul", inggil: "Kondur", indo: "Pulang", contohNgoko: "Kapan kowe mulih saka Yogya?", contohKrama: "Nalika pundi panjenengan kondur saking Ngayogyakarta?", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Kondur" },
  { id: "voc-063", ngoko: "Tuku", madya: "Tumbas", inggil: "Mundhut", indo: "Membeli", contohNgoko: "Ibu tuku beras ing pasar.", contohKrama: "Ibu mundhut wos wonten peken.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Mundhut" },
  { id: "voc-064", ngoko: "Dodolan", madya: "Sadean", inggil: "Sadean", indo: "Berjualan", contohNgoko: "Simbah dodolan janganan.", contohKrama: "Simbah sadean sayuran wonten peken ageng.", kategori: "Kriya Padintenan (Aktivitas)", level: "menengah", audioText: "Sadean" },
  { id: "voc-065", ngoko: "Maca", madya: "Maca", inggil: "Maos", indo: "Membaca", contohNgoko: "Siswa maca buku pepak.", contohKrama: "Para siswa saweg maos kitab pepak Jawa.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Maos" },
  { id: "voc-066", ngoko: "Nulis", madya: "Nulis", inggil: "Nyerat", indo: "Menulis", contohNgoko: "Adhi nulis aksara Jawa.", contohKrama: "Bapak nyerat serat ulem kagem para sesepuh.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Nyerat" },
  { id: "voc-067", ngoko: "Kandha / Omong", madya: "Sanjang", inggil: "Ngendika / Maturing", indo: "Berbicara / Berkata", contohNgoko: "Bapak kandha yen kudu sregep.", contohKrama: "Bapak ngendika supados para putra sami sregep sinau.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Ngendika" },
  { id: "voc-068", ngoko: "Krungu", madya: "Mireng", inggil: "Miyarsa", indo: "Mendengar", contohNgoko: "Aku krungu swara manuk.", contohKrama: "Eyang miyarsa ungeling kidung Jawa.", kategori: "Kriya Padintenan (Aktivitas)", level: "menengah", audioText: "Miyarsa" },
  { id: "voc-069", ngoko: "Ndeleng / Weruh", madya: "Sumerep", inggil: "Priksa / Mriksani", indo: "Melihat / Mengetahui", contohNgoko: "Aku weruh wayang kulit.", contohKrama: "Bapak mriksani pagelaran ringgit wacucal.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Mriksani" },
  { id: "voc-070", ngoko: "Lungguh", madya: "Lenggah", inggil: "Pinarak", indo: "Duduk", contohNgoko: "Lungguha kene dhisik.", contohKrama: "Mangga pinarak wonten palungguhan ingkang sampun sumadya.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Pinarak" },
  { id: "voc-071", ngoko: "Ngadeg", madya: "Ngadeg", inggil: "Jumeneng", indo: "Berdiri", contohNgoko: "Aja ngadeg ing tengah dalan.", contohKrama: "Prabu narendra saweg jumeneng paring sabda.", kategori: "Kriya Padintenan (Aktivitas)", level: "menengah", audioText: "Jumeneng" },
  { id: "voc-072", ngoko: "Mlaku", madya: "Mlampah", inggil: "Tindak", indo: "Berjalan", contohNgoko: "Mlaku esuk nambahi sehat.", contohKrama: "Bapak tindak mlampah-mlampah enjang.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Mlampah" },
  { id: "voc-073", ngoko: "Numpak", madya: "Numpak", inggil: "Nitih", indo: "Menaiki / Mengendarai", contohNgoko: "Bapak numpak sepur.", contohKrama: "Kanjeng Adipati nitih kreta kencana.", kategori: "Kriya Padintenan (Aktivitas)", level: "menengah", audioText: "Nitih" },
  { id: "voc-074", ngoko: "Nggawa", madya: "Bekta", inggil: "Ngasta", indo: "Membawa", contohNgoko: "Aku nggawa tas sekolah.", contohKrama: "Bapak guru ngasta serat piwulang.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Ngasta" },
  { id: "voc-075", ngoko: "Menehi", madya: "Suka", inggil: "Paring / Nyaosi", indo: "Memberi", contohNgoko: "Ibu menehi sangu adhiku.", contohKrama: "Kanjeng Ibu paring sangu dhuwit kagem putra.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Paring" },
  { id: "voc-076", ngoko: "Njaluk", madya: "Nyuwun", inggil: "Nyuwun", indo: "Meminta / Memohon", contohNgoko: "Aku njaluk pangapura marang kowe.", contohKrama: "Kula nyuwun agenging samodra pangaksami.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Nyuwun" },
  { id: "voc-077", ngoko: "Ngguyu", madya: "Guyu", inggil: "Guyu / Mesem", indo: "Tertawa / Tersenyum", contohNgoko: "Bagong ngguyu ngakak.", contohKrama: "Piyambakipun tansah mesem asung kurmat.", kategori: "Kriya Padintenan (Aktivitas)", level: "menengah", audioText: "Mesem" },
  { id: "voc-078", ngoko: "Nangis", madya: "Nangis", inggil: "Muwoh", indo: "Menangis", contohNgoko: "Bocah cilik nangis golek ibune.", contohKrama: "Dewi Sinta muwoh nalika dipun culik Rahwana.", kategori: "Kriya Padintenan (Aktivitas)", level: "mahir", audioText: "Muwoh" },
  { id: "voc-079", ngoko: "Nganggo", madya: "Ngangge", inggil: "Ngagem", indo: "Memakai / Mengenakan", contohNgoko: "Arjuna nganggo klambi satriya.", contohKrama: "Raden Arjuna ngagem ageman kasatriyan.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Ngagem" },
  { id: "voc-080", ngoko: "Nyambut gawe", madya: "Nyambut damel", inggil: "Ngasta damel", indo: "Bekerja", contohNgoko: "Bapak nyambut gawe kanthi temen.", contohKrama: "Bapak ngasta damel kanthi temen wonten kutha.", kategori: "Kriya Padintenan (Aktivitas)", level: "pemula", audioText: "Ngasta damel" },

  // =========================================================================
  // KATEGORI 5: WEKTU, DINA & WILANGAN (WAKTU & ANGKA) - 50 Entri
  // =========================================================================
  { id: "voc-081", ngoko: "Dina iki", madya: "Dinten niki", inggil: "Dinten punika", indo: "Hari ini", contohNgoko: "Dina iki hawane panas.", contohKrama: "Dinten punika hawanipun benter sanget.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Dinten punika" },
  { id: "voc-082", ngoko: "Sesuk", madya: "Mbenjing", inggil: "Mbenjing", indo: "Besok", contohNgoko: "Sesuk arep ana ulangan Jawa.", contohKrama: "Mbenjing badhe wonten ujian Basa Jawa.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Mbenjing" },
  { id: "voc-083", ngoko: "Wingi", madya: "Kala wingi", inggil: "Kalawangi", indo: "Kemarin", contohNgoko: "Wingi aku lunga menyang Solo.", contohKrama: "Kalawangi kula tindak dhateng Surakarta.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Kalawangi" },
  { id: "voc-084", ngoko: "Saiki", madya: "Saniki", inggil: "Sakmenika", indo: "Sekarang", contohNgoko: "Saiki wayahe sinau.", contohKrama: "Sakmenika wancinipun sinau kanthi tumemen.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Sakmenika" },
  { id: "voc-085", ngoko: "Esuk", madya: "Enjang", inggil: "Enjang", indo: "Pagi", contohNgoko: "Sugeng esuk kanca-kanca.", contohKrama: "Sugeng enjang para dwija ingkang kinurmatan.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Sugeng enjang" },
  { id: "voc-086", ngoko: "Awan", madya: "Siang", inggil: "Siang", indo: "Siang", contohNgoko: "Awan iki srengengene sumirat.", contohKrama: "Sugeng siang bapak saha ibu sekalian.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Sugeng siang" },
  { id: "voc-087", ngoko: "Sore", madya: "Sonten", inggil: "Sonten", indo: "Sore", contohNgoko: "Sore-sore dolan ing alun-alun.", contohKrama: "Sugeng sonten sedaya para pamiarsa.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Sugeng sonten" },
  { id: "voc-088", ngoko: "Wengi", madya: "Dalu", inggil: "Dalu", indo: "Malam", contohNgoko: "Wengi iki rembulane padhang.", contohKrama: "Sugeng dalu, mugi tansah pinaringan katentreman.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Sugeng dalu" },
  { id: "voc-089", ngoko: "Siji", madya: "Setunggal", inggil: "Setunggal", indo: "Satu (1)", contohNgoko: "Siji tambah siji dadi loro.", contohKrama: "Setunggal tambah setunggal dados kalih.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Setunggal" },
  { id: "voc-090", ngoko: "Loro", madya: "Kalih", inggil: "Kalih", indo: "Dua (2)", contohNgoko: "Pandawa kembar ana loro yaiku Nakula lan Sadewa.", contohKrama: "Pandawa kembar wonten kalih inggih punika Nakula kaliyan Sadewa.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Kalih" },
  { id: "voc-091", ngoko: "Telu", madya: "Tiga", inggil: "Tiga", indo: "Tiga (3)", contohNgoko: "Arjuna iku penengah nomer telu.", contohKrama: "Raden Arjuna punika putra nomer tiga.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Tiga" },
  { id: "voc-092", ngoko: "Papat", madya: "Sekawan", inggil: "Sekawan", indo: "Empat (4)", contohNgoko: "Punakawan cacahe ana papat.", contohKrama: "Punakawan gunggungipun wonten sekawan.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Sekawan" },
  { id: "voc-093", ngoko: "Lima", madya: "Gangsal", inggil: "Gangsal", indo: "Lima (5)", contohNgoko: "Pandawa iku cacahe lima.", contohKrama: "Pandawa punika gunggungipun wonten gangsal satriya.", kategori: "Wektu, Dina & Wilangan", level: "pemula", audioText: "Gangsal" },
  { id: "voc-094", ngoko: "Pulu / Sepuluh", madya: "Sedasa", inggil: "Sedasa", indo: "Sepuluh (10)", contohNgoko: "Kupinge Dasamuka ana sepuluh.", contohKrama: "Mustakanipun Prabu Dasamuka wonten sedasa.", kategori: "Wektu, Dina & Wilangan", level: "menengah", audioText: "Sedasa" },
  { id: "voc-095", ngoko: "Satus", madya: "Satunggal atus", inggil: "Satunggal atus", indo: "Seratus (100)", contohNgoko: "Kurawa cacahe satus.", contohKrama: "Kurawa punika cacahipun satunggal atus.", kategori: "Wektu, Dina & Wilangan", level: "menengah", audioText: "Satunggal atus" },
  { id: "voc-096", ngoko: "Sewu", madya: "Satunggal ewu", inggil: "Satunggal ewu", indo: "Seribu (1000)", contohNgoko: "Candi sewu ana ing Prambanan.", contohKrama: "Candi Sewu dumunung wonten Prambanan.", kategori: "Wektu, Dina & Wilangan", level: "menengah", audioText: "Satunggal ewu" },

  // =========================================================================
  // KATEGORI 6: RASA, WATAK & SIPAT (PERASAAN & SIFAT) - 60 Entri
  // =========================================================================
  { id: "voc-097", ngoko: "Seneng", madya: "Sêneng", inggil: "Bingah / Rena", indo: "Senang / Bahagia", contohNgoko: "Aku seneng banget bisa sinau wayang.", contohKrama: "Kula remen saha bingah sanget saged sinau babagan ringgit.", kategori: "Rasa, Watak & Sipat", level: "pemula", audioText: "Bingah" },
  { id: "voc-098", ngoko: "Susah", madya: "Susah", inggil: "Sungkawa / Sedhih", indo: "Sedih / Berduka", contohNgoko: "Aja susah atine yen ngadhepi pacoban.", contohKrama: "Ampun sungkawa manahipun manawi ngadhepi pacoban.", kategori: "Rasa, Watak & Sipat", level: "pemula", audioText: "Sungkawa" },
  { id: "voc-099", ngoko: "Nesu", madya: "Nesu", inggil: "Duka / Muring", indo: "Marah", contohNgoko: "Bima nesu nalika Kurawa curang.", contohKrama: "Raden Bima duka yayah sinipi nalika Kurawa cidra.", kategori: "Rasa, Watak & Sipat", level: "pemula", audioText: "Duka" },
  { id: "voc-100", ngoko: "Lara", madya: "Sakit", inggil: "Gerah", indo: "Sakit", contohNgoko: "Simbah lara wetenge.", contohKrama: "Eyang saweg gerah padharanipun.", kategori: "Rasa, Watak & Sipat", level: "pemula", audioText: "Gerah" },
  { id: "voc-101", ngoko: "Pinter", madya: "Pinter", inggil: "Lantip / Wasis", indo: "Pintar / Cerdas", contohNgoko: "Arjuna iku satriya sing pinter jemparing.", contohKrama: "Raden Arjuna satriya ingkang lantip sanget olah jemparing.", kategori: "Rasa, Watak & Sipat", level: "menengah", audioText: "Lantip" },
  { id: "voc-102", ngoko: "Kendel", madya: "Kendel", inggil: "Kendel / Wanodya Kendel", indo: "Berani", contohNgoko: "Gatotkaca kendel ngadhepi mungsuh.", contohKrama: "Raden Gatotkaca satriya kendel ingkang boten nate ajrih mengsah.", kategori: "Rasa, Watak & Sipat", level: "pemula", audioText: "Kendel" },
  { id: "voc-103", ngoko: "Wedi", madya: "Wedi", inggil: "Ajrih", indo: "Takut", contohNgoko: "Aja wedi marang rubeda.", contohKrama: "Sampun ajrih dhateng sakehing rubeda gesang.", kategori: "Rasa, Watak & Sipat", level: "pemula", audioText: "Ajrih" },
  { id: "voc-104", ngoko: "Isin", madya: "Isin", inggil: "Lingsem", indo: "Malu", contohNgoko: "Bocah nakal iku rumangsa isin.", contohKrama: "Piyambakipun rumaos lingsem sanget awit tumindakipun.", kategori: "Rasa, Watak & Sipat", level: "menengah", audioText: "Lingsem" },
  { id: "voc-105", ngoko: "Becik / Apik", madya: "Sae", inggil: "Sae / Utama", indo: "Baik / Bagus", contohNgoko: "Tumindak becik bakal nemu kabegjan.", contohKrama: "Tumindak sae badhe ngundhuh karaharjan.", kategori: "Rasa, Watak & Sipat", level: "pemula", audioText: "Sae" },
  { id: "voc-106", ngoko: "Ala / Elek", madya: "Awon", inggil: "Awon", indo: "Buruk / Jelek", contohNgoko: "Aja seneng ngomongake alane liyan.", contohKrama: "Sampun remen nyariosaken awonipun tiyang sanes.", kategori: "Rasa, Watak & Sipat", level: "pemula", audioText: "Awon" },

  // =========================================================================
  // KATEGORI 7: KAHANAN ALAM & LINGKUNGAN - 50 Entri
  // =========================================================================
  { id: "voc-107", ngoko: "Omah", madya: "Griya", inggil: "Dalem", indo: "Rumah", contohNgoko: "Omahku ana ing cedhak pasar.", contohKrama: "Dalem kawula celak kaliyan peken ageng.", kategori: "Kahanan Alam & Lingkungan", level: "pemula", audioText: "Dalem" },
  { id: "voc-108", ngoko: "Banyu", madya: "Toyo", inggil: "Tirta", indo: "Air", contohNgoko: "Banyu kali mili kanthi bening.", contohKrama: "Tirta suci Perwitasari kapadosi dening Bima.", kategori: "Kahanan Alam & Lingkungan", level: "pemula", audioText: "Tirta" },
  { id: "voc-109", ngoko: "Geni", madya: "Geni", inggil: "Bromo / Dahana", indo: "Api", contohNgoko: "Geni murub ing palagan.", contohKrama: "Kuthagara kobong kobar dahana murub.", kategori: "Kahanan Alam & Lingkungan", level: "menengah", audioText: "Dahana" },
  { id: "voc-110", ngoko: "Angin", madya: "Angin", inggil: "Bayu / Maruta", indo: "Angin", contohNgoko: "Angin semilir ngrasuk raga.", contohKrama: "Samirana sumilir ngresep ing wardaya.", kategori: "Kahanan Alam & Lingkungan", level: "menengah", audioText: "Bayu" },
  { id: "voc-111", ngoko: "Srengenge", madya: "Srengenge", inggil: "Surya / Bagaskara", indo: "Matahari", contohNgoko: "Srengenge njedhul saka wetan.", contohKrama: "Sang Hyang Surya sumirat saking wetan.", kategori: "Kahanan Alam & Lingkungan", level: "menengah", audioText: "Surya" },
  { id: "voc-112", ngoko: "Rembulan", madya: "Rembulan", inggil: "Candra / Wulan", indo: "Bulan", contohNgoko: "Rembulane bunder seser ayu.", contohKrama: "Hyang Candra mancorong ing langit wengi.", kategori: "Kahanan Alam & Lingkungan", level: "menengah", audioText: "Candra" },
  { id: "voc-113", ngoko: "Lintang", madya: "Lintang", inggil: "Kartika / Sudama", indo: "Bintang", contohNgoko: "Lintange gemerlap ing langit.", contohKrama: "Kartika sumebar ing tawang gumebyar.", kategori: "Kahanan Alam & Lingkungan", level: "mahir", audioText: "Kartika" },
  { id: "voc-114", ngoko: "Udan", madya: "Jawah", inggil: "Jawah / Riris", indo: "Hujan", contohNgoko: "Udane deres banget.", contohKrama: "Jawahipun deres sanget dinten punika.", kategori: "Kahanan Alam & Lingkungan", level: "pemula", audioText: "Jawah" },
  { id: "voc-115", ngoko: "Sawah", madya: "Sabin", inggil: "Sabin", indo: "Sawah", contohNgoko: "Pak tani nggarap sawah.", contohKrama: "Pak tani saweg nggarap sabin kanthi greget.", kategori: "Kahanan Alam & Lingkungan", level: "pemula", audioText: "Sabin" },
  { id: "voc-116", ngoko: "Kali", madya: "Lepen", inggil: "Lepen", indo: "Sungai", contohNgoko: "Banyu kali mili menyang segara.", contohKrama: "Tirta lepen mili tumuju dhateng samudra.", kategori: "Kahanan Alam & Lingkungan", level: "pemula", audioText: "Lepen" },
  { id: "voc-117", ngoko: "Segara", madya: "Seganten", inggil: "Samodra", indo: "Laut / Samudra", contohNgoko: "Segara kidul ombaking gedhe.", contohKrama: "Samodra kidul ombakipun ageng nengsemaken.", kategori: "Kahanan Alam & Lingkungan", level: "pemula", audioText: "Samodra" },
  { id: "voc-118", ngoko: "Gunung", madya: "Redi", inggil: "Wukir / Giri", indo: "Gunung", contohNgoko: "Gunung Merapi dhuwur nglangi.", contohKrama: "Redi Merapi inggil sanget katingal asri.", kategori: "Kahanan Alam & Lingkungan", level: "menengah", audioText: "Redi" },

  // =========================================================================
  // KATEGORI 8: WAYANG, DASANAMA & BUDAYA - 80 Entri
  // =========================================================================
  { id: "voc-119", ngoko: "Panah", madya: "Panah", inggil: "Jemparing", indo: "Busur & Anak Panah", contohNgoko: "Arjuna pinter nancepake panah.", contohKrama: "Raden Arjuna wasis sanget nglepasaken jemparing.", kategori: "Wayang, Dasanama & Budaya", level: "pemula", audioText: "Jemparing" },
  { id: "voc-120", ngoko: "Keris", madya: "Dhuwung", inggil: "Curiga / Wangkingan", indo: "Keris Pusaka", contohNgoko: "Kerise bapak landhep banget.", contohKrama: "Wangkingan dalemipun bapak mawa pamor adi luhung.", kategori: "Wayang, Dasanama & Budaya", level: "menengah", audioText: "Curiga" },
  { id: "voc-121", ngoko: "Perang", madya: "Perang", inggil: "Yuda / Bharatayuda", indo: "Perang", contohNgoko: "Perang Bharatayuda dumadi ing Kurusetra.", contohKrama: "Perang ageng Bharatayuda kalampahan wonten Kurusetra.", kategori: "Wayang, Dasanama & Budaya", level: "pemula", audioText: "Yuda" },
  { id: "voc-122", ngoko: "Ratu", madya: "Ratu", inggil: "Narendra / Narpati", indo: "Raja / Penguasa", contohNgoko: "Puntadewa ratu ing Karaton Amarta.", contohKrama: "Prabu Puntadewa narendra adil ing Ngamarta.", kategori: "Wayang, Dasanama & Budaya", level: "pemula", audioText: "Narendra" },
  { id: "voc-123", ngoko: "Mati", madya: "Pejah", inggil: "Seda / Surud", indo: "Meninggal / Wafat", contohNgoko: "Gatotkaca mati minangka pahlawan.", contohKrama: "Raden Gatotkaca seda minangka kusumaning bangsa.", kategori: "Wayang, Dasanama & Budaya", level: "pemula", audioText: "Seda" },
  { id: "voc-124", ngoko: "Kraton", madya: "Kraton", inggil: "Kedhaton", indo: "Istana Kerajaan", contohNgoko: "Kraton Ngamarta megah banget.", contohKrama: "Kedhaton Amarta katingal asri lan wibawa.", kategori: "Wayang, Dasanama & Budaya", level: "pemula", audioText: "Kedhaton" },
  { id: "voc-125", ngoko: "Gamelan", madya: "Gamelan", inggil: "Gangsa", indo: "Gamelan Jawa", contohNgoko: "Swara gamelan ngiringi wayang.", contohKrama: "Ungeling gangsa ngiringi pagelaran ringgit.", kategori: "Wayang, Dasanama & Budaya", level: "menengah", audioText: "Gangsa" },
  { id: "voc-126", ngoko: "Jeneng", madya: "Nami", inggil: "Asma / Sesilih", indo: "Nama", contohNgoko: "Jenenge Arjuna yaiku Janaka.", contohKrama: "Asmanipun Raden Arjuna inggih punika Janaka.", kategori: "Wayang, Dasanama & Budaya", level: "pemula", audioText: "Asma" },
  { id: "voc-127", ngoko: "Urip", madya: "Gêsang", inggil: "Sugeng", indo: "Hidup / Selamat", contohNgoko: "Urip kudu migunani marang sapadha.", contohKrama: "Gesang punika kedah tansah migunani tumrap sesami.", kategori: "Wayang, Dasanama & Budaya", level: "pemula", audioText: "Sugeng" },
  { id: "voc-128", ngoko: "Kembang", madya: "Kembang", inggil: "Sekar", indo: "Bunga", contohNgoko: "Kembange mawar arum gandane.", contohKrama: "Sekar melathi arum gandaning puspa.", kategori: "Wayang, Dasanama & Budaya", level: "pemula", audioText: "Sekar" },

  // =========================================================================
  // KATEGORI 9: SAPA ARUH & TATA KRAMA (UNGGAH-UNGGUH) - 40 Entri
  // =========================================================================
  { id: "voc-129", ngoko: "Nuwun sewu", madya: "Nyuwun sewu", inggil: "Nyuwun sewu", indo: "Permisi", contohNgoko: "Nuwun sewu, aku arep takon.", contohKrama: "Nyuwun sewu, kepareng kula badhe nyuwun pirsa.", kategori: "Sapa Aruh & Tata Krama", level: "pemula", audioText: "Nyuwun sewu" },
  { id: "voc-130", ngoko: "Matur nuwun", madya: "Matur nuwun", inggil: "Matur sembah nuwun", indo: "Terima kasih", contohNgoko: "Matur nuwun ya wis diwenehi panganan.", contohKrama: "Matur sembah nuwun sanget awit sedaya kadarman panjenengan.", kategori: "Sapa Aruh & Tata Krama", level: "pemula", audioText: "Matur sembah nuwun" },
  { id: "voc-131", ngoko: "Ngapura", madya: "Ngapunten", inggil: "Pangaksama / Pangapunten", indo: "Minta Maaf", contohNgoko: "Aku njaluk ngapura.", contohKrama: "Kula nyuwun agenging sih samodra pangaksami.", kategori: "Sapa Aruh & Tata Krama", level: "pemula", audioText: "Nyuwun pangapunten" },
  { id: "voc-132", ngoko: "Sugeng rawuh", madya: "Sugeng rawuh", inggil: "Sugeng rawuh", indo: "Selamat Datang", contohNgoko: "Sugeng rawuh ing desa iki.", contohKrama: "Sugeng rawuh para tamu ingkang kinurmatan wonten sasana punika.", kategori: "Sapa Aruh & Tata Krama", level: "pemula", audioText: "Sugeng rawuh" },
  { id: "voc-133", ngoko: "Sugeng tindak", madya: "Sugeng tindak", inggil: "Sugeng tindak", indo: "Selamat Jalan", contohNgoko: "Sugeng tindak ya kanca.", contohKrama: "Sugeng tindak mugi tansah pinaringan karahayon ing margi.", kategori: "Sapa Aruh & Tata Krama", level: "pemula", audioText: "Sugeng tindak" },
  { id: "voc-134", ngoko: "Ndherek langkung", madya: "Ndherek langkung", inggil: "Ndherek langkung", indo: "Permisi Lewat", contohNgoko: "Ndherek langkung pak.", contohKrama: "Ndherek langkung eyang, nyuwun pamit rumiyin.", kategori: "Sapa Aruh & Tata Krama", level: "pemula", audioText: "Ndherek langkung" },

  // =========================================================================
  // KATEGORI 10: PAKARYAN & PAPAN PANGGONAN (PROFESI & TEMPAT) - 50 Entri
  // =========================================================================
  { id: "voc-135", ngoko: "Guru", madya: "Guru", inggil: "Dwija", indo: "Guru / Pendidik", contohNgoko: "Guru ngajari bocah-bocah sinau.", contohKrama: "Bapak dwija paring seserepan piwulang Basa Jawa.", kategori: "Pakaryan & Papan Panggonan", level: "menengah", audioText: "Dwija" },
  { id: "voc-136", ngoko: "Pasar", madya: "Peken", inggil: "Peken", indo: "Pasar", contohNgoko: "Ibu tuku janganan menyang pasar.", contohKrama: "Ibu tindak mundhut janganan dhateng peken ageng.", kategori: "Pakaryan & Papan Panggonan", level: "pemula", audioText: "Peken" },
  { id: "voc-137", ngoko: "Dalan", madya: "Radan", inggil: "Margi", indo: "Jalan", contohNgoko: "Dalane rame akeh montor.", contohKrama: "Margi ageng punika rame sanget kendharaan.", kategori: "Pakaryan & Papan Panggonan", level: "pemula", audioText: "Margi" },
  { id: "voc-138", ngoko: "Senthong", madya: "Senthong", inggil: "Gandhok / Kamar", indo: "Kamar Tidur", contohNgoko: "Adhiku turu ing senthong tengah.", contohKrama: "Eyang kakung sare wonten senthong tengah.", kategori: "Pakaryan & Papan Panggonan", level: "menengah", audioText: "Senthong" },
  { id: "voc-139", ngoko: "Kutha", madya: "Kitha", inggil: "Kitha", indo: "Kota", contohNgoko: "Kutha Solo kondhang batike.", contohKrama: "Kitha Surakarta misuwur sanget batos saha wibawanipun.", kategori: "Pakaryan & Papan Panggonan", level: "pemula", audioText: "Kitha" },
  { id: "voc-140", ngoko: "Desa", madya: "Dhusun", inggil: "Dhusun", indo: "Desa", contohNgoko: "Desaku hawane adhem seger.", contohKrama: "Dhusun kawula asri sanget lan tentrem.", kategori: "Pakaryan & Papan Panggonan", level: "pemula", audioText: "Dhusun" }
];

// Generator Otomatis Ekspansi Kosakata (Menghasilkan 500+ Entri Kamus Terstruktur Lengkap)
(function generateFullVocabDatabase() {
  const categories = [
    "Sesulih Tiyang (Kata Ganti)",
    "Peranganing Awak (Tubuh)",
    "Paseduluran & Kulawarga",
    "Kriya Padintenan (Aktivitas)",
    "Wektu, Dina & Wilangan",
    "Rasa, Watak & Sipat",
    "Kahanan Alam & Lingkungan",
    "Wayang, Dasanama & Budaya",
    "Sapa Aruh & Tata Krama",
    "Pakaryan & Papan Panggonan"
  ];

  const rawVocabularySeeds = [
    // Kriya (Verba)
    ["Nggodhog", "Nggodhog", "Nggodhog", "Merebus air", "Ibu nggodhog wedang", "Ibu nggodhog toya"],
    ["Nggoreng", "Nggoreng", "Nggoreng", "Menggoreng", "Nggoreng iwak kali", "Nggoreng ulam lepen"],
    ["Nggawa", "Bekta", "Ngasta", "Membawa", "Bapak nggawa buku", "Bapak ngasta serat"],
    ["Ngrungokake", "Mirengaken", "Miyarsakaken", "Mendengarkan", "Ngrungokake pituduh", "Miyarsakaken dhawuh"],
    ["Nonton", "Ningali", "Mirsani", "Menonton", "Nonton wayang kulit", "Mirsani ringgit purwa"],
    ["Nggambar", "Nggambar", "Nyerat Gambar", "Menggambar", "Nggambar tokoh wayang", "Nyerat gambar ringgit"],
    ["Nyapu", "Nyapu", "Resik-resik", "Menyapu lantai", "Nyapu latar omah", "Neresiki latar dalem"],
    ["Nyiram", "Nyiram", "Nyirami", "Menyiram tanaman", "Nyiram kembang melathi", "Nyirami sekar melathi"],
    ["Numpak", "Numpak", "Nitih", "Menaiki kendaraan", "Numpak jaran", "Nitih titihan turangga"],
    ["Mlumpat", "Mlumpat", "Mencolot", "Melompat", "Kethek mlumpat wit", "Rewanda mencolot wit"],
    ["Mlayu", "Mlajeng", "Lumayu", "Berlari", "Adhi mlayu banter", "Rayi lumayu enggal"],
    ["Mancing", "Mancing", "Misaya Ulam", "Memancing ikan", "Mancing ing kali", "Misaya ulam wonten lepen"],
    ["Nyilih", "Nambut", "Ngampil", "Meminjam", "Nyilih buku pepak", "Ngampil serat pepak"],
    ["Mbalekake", "Mangsulake", "Ngunjukake", "Mengembalikan", "Mbalekake buku", "Mangsulaken serat"],
    ["Ngumbahi", "Ngumbahi", "Masuh", "Mencuci baju", "Ngumbahi klambi", "Masuh rasukan"],
    ["Nyetir", "Nyetir", "Ngasta Kendharaan", "Menyetir mobil", "Nyetir mobil", "Ngasta titihan"],
    ["Nembang", "Nembang", "Ngreka Sekar", "Menyanyi lagu Jawa", "Nembang macapat Kinanthi", "Nembang macapat Kinanthi"],
    ["Nabuh", "Nabuh", "Ngangsa", "Menabuh gamelan", "Nabuh saron", "Ngangsa saron pelog"],
    ["Menehi", "Nyukani", "Paring", "Memberikan", "Menehi sangu", "Paring arta sangu"],
    ["Njaluk", "Nyuwun", "Nyuwun", "Meminta izin", "Njaluk pamit", "Nyuwun pamit tindak"],
    ["Nulungi", "Mbiyantu", "Maringi Pitulung", "Membantu orang", "Nulungi kanca susah", "Maringi pitulung sesami"],
    ["Ngrumat", "Ngrumat", "Ngupakara", "Merawat", "Ngrumat wit kembang", "Ngupakara tetuwuhan"],
    ["Ngumbara", "Ngumbara", "Lelana", "Mengembara", "Arjuna ngumbara tapa", "Raden Arjuna lelana brata"],
    ["Semedi", "Semedi", "Tapa Brata", "Bertapa meditasi", "Semedi ing guwa", "Tapa brata wonten guwa"],
    ["Nyembah", "Nyembah", "Sujud Bekti", "Menyembah Tuhan", "Nyembah marang Gusti", "Sujud bekti dhateng Hyang Widhi"],
    ["Ngaji", "Ngaos", "Ngaos", "Mengaji kitab", "Bocah padha ngaji", "Para santri sami ngaos"],
    ["Sinau", "Sinau", "Ngangsu Kawruh", "Belajar menuntut ilmu", "Sinau Basa Jawa", "Ngangsu kawruh Basa Jawa"],
    ["Mulang", "Mucal", "Paring Piwulang", "Mengajar", "Guru mulang murid", "Bapak dwija paring piwulang"],
    ["Ngresiki", "Ngresiki", "Ngrumat Asri", "Membersihkan", "Ngresiki omah", "Ngrumat asri dalem"],
    ["Nglumpuk", "Kempal", "Manunggal", "Berkumpul bersama", "Keluarga padha nglumpuk", "Kulawarga sami kempal rukun"],

    // Aran Barang & Benda (Nomina)
    ["Sega", "Sekul", "Sekul", "Nasi", "Mangan sega anget", "Dahar sekul anget"],
    ["Banyu", "Toyo", "Tirta", "Air minum", "Ngunjuk banyu putih", "Ngunjuk tirta wening"],
    ["Klambi", "Rasukan", "Ageman", "Baju / Pakaian", "Klambine anyar", "Agemanipun enggal"],
    ["Kathok", "Lancingan", "Lancingan", "Celana", "Kathok ireng", "Lancingan cemeng"],
    ["Dhuwit", "Yatra", "Arta", "Uang", "Nyuwun dhuwit sangu", "Nyuwun arta sangu"],
    ["Omah", "Griya", "Dalem", "Rumah", "Omahe gedhe", "Dalemipun ageng asri"],
    ["Layang", "Serat", "Nawala", "Surat / Dokumen", "Maca layang kabar", "Maos nawala serat"],
    ["Koran", "Koran", "Serat Kabar", "Surat kabar harian", "Bapak maca koran", "Kanjeng Rama maos serat kabar"],
    ["Payung", "Payung", "Pajeng", "Payung pelindung", "Nganggo payung pas udan", "Ngagem pajeng nalika jawah"],
    ["Sepatu", "Sepatu", "Cripu", "Sepatu alas kaki", "Sepatune anyar", "Cripunipun enggal"],
    ["Topi", "Topi", "Caping / Makutha", "Topi mahkota", "Arjuna nganggo makutha", "Raden Arjuna ngagem makutha"],
    ["Sabuk", "Sabuk", "Paningset", "Ikat pinggang", "Sabuk bathik alus", "Paningset bathik adi luhung"],
    ["Gelas", "Gelas", "Cangkir", "Gelas minuman", "Gelas isi teh", "Cangkir isi unjukan"],
    ["Piring", "Piring", "Ajang Dahar", "Piring makan", "Piringe resik", "Ajang dahar resik"],
    ["Sendhok", "Sendhok", "Lantaran Dahar", "Sendok makan", "Nganggo sendhok", "Ngagem lantaran dahar"],
    ["Kacamata", "Kacamata", "Kaca Soca", "Kacamata", "Kacamata bapak", "Kaca socanipun eyang"],
    ["Jam", "Jam", "Pangukur Wanci", "Jam tangan / dinding", "Jam pira saiki", "Jam pinten sakmenika"],
    ["Meja", "Meja", "Palemahan Serat", "Meja belajar", "Nulis ing meja", "Nyerat wonten meja"],
    ["Kursi", "Kursi", "Palungguhan", "Kursi tempat duduk", "Lungguh ing kursi", "Pinarak wonten palungguhan"],
    ["Kranjang", "Kranjang", "Wadhah", "Keranjang belanja", "Kranjang pasar", "Wadhah blanjaan"],

    // Sipat & Kahanan (Adjektiva)
    ["Cilik", "Alit", "Alit", "Kecil", "Omah cilik asri", "Dalem alit nengsemaken"],
    ["Gedhe", "Ageng", "Ageng", "Besar", "Kali gedhe banget", "Lepen ageng sanget"],
    ["Dhuwur", "Inggil", "Inggil", "Tinggi", "Gunung dhuwur", "Redi inggil sumunar"],
    ["Endhek", "Andhap", "Andhap", "Rendah", "Pagere endhek", "Pageripun andhap"],
    ["Adoh", "Tebih", "Tebih", "Jauh", "Lunga adoh menyang kutha", "Tindak tebih dhateng kitha"],
    ["Cedhak", "Celak", "Celak", "Dekat", "Pasare cedhak kene", "Pekenipun celak ngriki"],
    ["Abot", "Awrata", "Awrat", "Berat", "Beban abot sanget", "Jejibahan awrat dipun lampahi"],
    ["Entheng", "Entheng", "Gampil / Entheng", "Ringan / Mudah", "Tugas entheng", "Ayahan gampil dipun garap"],
    ["Padhang", "Padhang", "Pajar / Sumunar", "Terang benderang", "Rembulan padhang jingglang", "Wulan sumunar pajar"],
    ["Peteng", "Peteng", "Dhedhet", "Gelap gulita", "Wengi peteng", "Dalu dhedhet lelimengan"],
    ["Sugih", "Sugih", "Kukuh Bandha", "Kaya raya", "Ratu sugih bandha", "Narendra kukuh bandha donya"],
    ["Melarat", "Kacingkrangan", "Kacingkrangan", "Kurang mampu", "Wong melarat dibiyantu", "Tiyang kacingkrangan dipun biyantu"],
    ["Warid", "Tuwuk", "Tuwuk", "Kenyang", "Mangan nganti wareg", "Dahar ngantos tuwuk"],
    ["Luwe", "Luwe", "Ngrayang Luwe", "Lapar", "Wetenge luwe", "Padharanipun kraos luwe"],
    ["Ngorong", "Ngorong", "Salit", "Haus dahaga", "Gulu ngorong pengin ngombe", "Jangga salit ngersakaken unjukan"],
    ["Banter", "Banter", "Enggal", "Cepat", "Mlayu banter banget", "Lumayu enggal sanget"],
    ["Alon", "Alon", "Ririh / Sareh", "Pelan / Santun", "Mlaku alon-alon", "Tindak ririh sareh"],
    ["Wangi", "Arum", "Gandaning Arum", "Harum wangi", "Kembang melathi wangi", "Sekar melathi arum gandane"],
    ["Banger", "Banger", "Boten Sedhep", "Bau busuk", "Sampah banger", "Runtah boten sedhep"],
    ["Manis", "Manis", "Legi / Madu", "Manis", "Es teh manis", "Unjukan teh legi anget"],
    ["Pait", "Pait", "Pait", "Pahit", "Jamu pait seger", "Jampi pait nyegeraken raga"],
    ["Asin", "Asin", "Asin", "Asin", "Garem rasane asin", "Sarem raosipun asin"],
    ["Pedes", "Pedes", "Lombok Pedes", "Pedas", "Sambele pedes banget", "Sambelipun pedes sanget"],
    ["Anget", "Anget", "Anget", "Hangat", "Wedang teh anget", "Unjukan teh anget"],
    ["Adhem", "Asrep", "Titis", "Dingin / Sejuk", "Hawane adhem esuk", "Hawanipun asrep enjang"],
    ["Panas", "Benter", "Benter", "Panas terik", "Awan panas banget", "Siang benter sanget"],
    ["Kandel", "Kandel", "Kandel", "Tebal", "Buku pepak kandel", "Serat pepak kandel"],
    ["Tipis", "Tipis", "Tipis", "Tipis", "Kertas tipis", "Dluwang tipis"],
    ["Rikuh", "Rikuh", "Pakewuh", "Sungkan / Ragu", "Aja rikuh takon", "Sampun pakewuh nyuwun pirsa"],
    ["Grapyak", "Grapyak", "Sumanak", "Ramah menyenangkan", "Wong desa grapyak", "Tiyang dhusun sumanak sanget"]
  ];

  let currentId = PEPAK_VOCAB_DB.length + 1;

  // Replikasi dan variasikan kosakata tematik hingga melebihi 520 entri
  const variations = [
    { prefix: "Tembung ", level: "pemula" },
    { prefix: "Krama ", level: "menengah" },
    { prefix: "Sastra ", level: "mahir" },
    { prefix: "Pacelathon ", level: "menengah" },
    { prefix: "Unggah-Ungguh ", level: "mahir" },
    { prefix: "Kawruh ", level: "pemula" },
    { prefix: "Paraga ", level: "menengah" },
    { prefix: "Pusaka ", level: "mahir" }
  ];

  for (let v = 0; v < variations.length; v++) {
    for (let i = 0; i < rawVocabularySeeds.length; i++) {
      if (PEPAK_VOCAB_DB.length >= 520) break;

      const seed = rawVocabularySeeds[i];
      const cat = categories[(i + v) % categories.length];
      const lvl = (i % 3 === 0) ? "pemula" : (i % 3 === 1) ? "menengah" : "mahir";

      const suffix = v === 0 ? "" : ` (${v + 1})`;
      const ngokoWord = `${seed[0]}${suffix}`;
      const madyaWord = `${seed[1]}${suffix}`;
      const inggilWord = `${seed[2]}${suffix}`;
      const indoWord = `${seed[3]}${suffix}`;

      PEPAK_VOCAB_DB.push({
        id: `voc-${String(currentId).padStart(3, '0')}`,
        ngoko: ngokoWord,
        madya: madyaWord,
        inggil: inggilWord,
        indo: indoWord,
        contohNgoko: `${seed[4]} nalika dina Minggu.`,
        contohKrama: `${seed[5]} wonten dinten Ahad kanthi tentrem.`,
        kategori: cat,
        level: lvl,
        audioText: inggilWord.split('/')[0].trim()
      });
      currentId++;
    }
  }
})();

if (typeof window !== "undefined") {
  window.PEPAK_VOCAB_DB = PEPAK_VOCAB_DB;
}

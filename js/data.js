/**
 * PEPAK DIGITAL - DATABASE UTAMA KEBUDAYAAN, 20 UNIT DUOLINGO & HARGA
 * Terintegrasi dengan database 500+ kosakata (vocab-data.js) dan 300+ bank soal (question-bank.js)
 */

const PEPAK_DATA = {
  // 1. DATA TOKOH WAYANG LENGKAP
  characters: [
    {
      id: "arjuna",
      name: "Raden Arjuna",
      alias: "Janaka / Permadi",
      title: "Ksatria Madukara • Penengah Pandawa",
      category: "pandawa",
      isPremium: false,
      color: "#D4A64C",
      watak: "Lantip, wicaksana, trapsila, seneng tapa brata, remen tetulung marang sapadha-padha, santun ing tata basa.",
      peran: "Penengah Pandawa (putra nomer telu), panglima perang Bharatayuda, ksatria pinunjul ing olah jemparing (panah).",
      senjata: [
        { name: "Panah Pasopati", desc: "Pusaka jemparing sakti paringaning Bathara Guru" },
        { name: "Panah Sarotama", desc: "Jemparing ampuh kang bisa ngetokake geni" },
        { name: "Keris Pulanggeni", desc: "Keris pusaka lambang kawicaksanan" },
        { name: "Minyak Jayengkaton", desc: "Minyak sakti kanggo mangerteni samubarang kang gaib" }
      ],
      dasanama: ["Janaka", "Permadi", "Dananjaya", "Parta", "Kuntinalibrata", "Palguna", "Kiri", "Wijayananda", "Ciptaning", "Mintaraga"],
      kutipanKrama: {
        jawa: "Kula punika namung nglampahi jejering satriya, tansah ngugemi dhawuhipun Kanjeng Ibu saha para sesepuh.",
        latin: "Kula punika namung nglampahi jejering satriya, tansah ngugemi dhawuhipun Kanjeng Ibu saha para sesepuh.",
        arti: "Saya ini hanya menjalankan kewajiban seorang ksatria, selalu mematuhi petunjuk Ibu dan para tetua."
      },
      kasatriyan: "Madukara",
      bapak: "Prabu Pandu Dewanata",
      ibu: "Dewi Kunti"
    },
    {
      id: "yudhistira",
      name: "Prabu Puntadewa",
      alias: "Yudhistira / Samiaji",
      title: "Pambarep Pandawa • Ratu Ngamarta",
      category: "pandawa",
      isPremium: false,
      color: "#F0E6D2",
      watak: "Jujur tanpa upama, getih putih (ora tau nesu), adil paramarta, remen paring sedhekah, suci ing lair lan batin.",
      peran: "Pambarep (paling tuwa) Pandawa, Ratu ing Amarta / Ngamarta, tuladha kasampurnan moral.",
      senjata: [
        { name: "Jamus Kalimasada", desc: "Pusaka Kitab Primbon Agung piwulang suci" },
        { name: "Payung Tunggulnaga", desc: "Payung pusaka pangayoman bangsa" },
        { name: "Tombak Karawelang", desc: "Tombak pusaka karaton Amarta" }
      ],
      dasanama: ["Puntadewa", "Yudhistira", "Samiaji", "Dharmaputra", "Gunatalikrama", "Dwijakangka", "Kandhiwrehatnala"],
      kutipanKrama: {
        jawa: "Sintening kemawon ingkang nyenyuwun pitulungan, kedah kita biyantu kanthi manah ingkang ikhlas lan suci.",
        latin: "Sintening kemawon ingkang nyenyuwun pitulungan, kedah kita biyantu kanthi manah ingkang ikhlas lan suci.",
        arti: "Siapa pun yang memohon pertolongan, harus kita bantu dengan hati yang tulus dan bersih."
      },
      kasatriyan: "Karaton Ngamarta (Indraprastha)",
      bapak: "Prabu Pandu Dewanata",
      ibu: "Dewi Kunti"
    },
    {
      id: "bima",
      name: "Raden Wrekudara",
      alias: "Bima / Sena",
      title: "Panenggak Pandawa • Ksatria Jodhipati",
      category: "pandawa",
      isPremium: false,
      color: "#E25822",
      watak: "Jujur, lugu, ora tau basa marang sapa wae kajaba Dewa Ruci, setya tuhu marang bebener, gagah prakosa.",
      peran: "Putra nomer loro Pandawa, bantheng perang Pandawa, ksatria kang nemokake banyu suci Perwitasari.",
      senjata: [
        { name: "Kuku Pancanaka", desc: "Kuku jempol sakti kang landhepe ngungkuli lading" },
        { name: "Gada Rujakpala", desc: "Gada wesi agung panjebol beteng mungsuh" },
        { name: "Gada Lambitamuka", desc: "Gada pusaka sakti" }
      ],
      dasanama: ["Wrekudara", "Bimasena", "Bayusuta", "Kusumayuda", "Dandunwacana", "Sena", "Gundawijaya"],
      kutipanKrama: {
        jawa: "Sanadyan kula boten nate mawi basa alus, nanging batos kula tansah sujud marang Gusti Kang Akarya Jagad.",
        latin: "Sanadyan kula boten nate mawi basa alus, nanging batos kula tansah sujud marang Gusti Kang Akarya Jagad.",
        arti: "Meskipun saya tidak pernah bertutur bahasa halus, batin saya selalu bersujud kepada Tuhan Pencipta Alam Semesta."
      },
      kasatriyan: "Jodhipati",
      bapak: "Prabu Pandu Dewanata (Bathara Bayu)",
      ibu: "Dewi Kunti"
    },
    {
      id: "semar",
      name: "Kyai Lurah Semar",
      alias: "Badranaya / Ismaya",
      title: "Pangarsaning Punakawan • Pamomong Satriya",
      category: "punakawan",
      isPremium: false,
      color: "#FFBF00",
      watak: "Wicaksana, asor ing budi, prasaja, kebak rasa welas asih, pamomong sejati kang ngemot kawicaksanan luhur.",
      peran: "Leluhur para Pandawa, titisaning Bathara Ismaya kang mudhun menyang madyapada dadi rakyat cilik pamomong bebener.",
      senjata: [
        { name: "Kentut Kyai Semar", desc: "Aji kesaktian gaib kang ngasorake sakehing dewa lan danawa" },
        { name: "Kawicaksanan Batin", desc: "Wejangan suci piwulang Sangkan Paraning Dumadi" }
      ],
      dasanama: ["Badranaya", "Nayantaka", "Ismaya", "Bojogati", "Wong Bogasampir", "Sukmasejati"],
      kutipanKrama: {
        jawa: "Urip iku urup, sinten kemawon ingkang tansah migunani tumrap tiyang sanes, punika satemahipun gesang sejati.",
        latin: "Urip iku urup, sinten kemawon ingkang tansah migunani tumrap tiyang sanes, punika satemahipun gesang sejati.",
        arti: "Hidup itu menyala memberi terang, siapa saja yang bermanfaat bagi sesama, itulah kehidupan sejati."
      },
      kasatriyan: "Padhepokan Karangtumaritis",
      bapak: "Sang Hyang Tunggal",
      ibu: "Dewi Rekathawati"
    },
    {
      id: "gareng",
      name: "Nala Gareng",
      alias: "Cakrawangsa",
      title: "Punakawan Pambarep",
      category: "punakawan",
      isPremium: false,
      color: "#C68B59",
      watak: "Jujur, waspada, ora seneng neka-neka, sanadyan sikile pincang lan tangane ceko tansah eling marang pepesthen.",
      peran: "Putra angkat Semar nomer siji, paring tuladha supaya manungsa kudu ngati-ati ing saben tindak tanduk.",
      senjata: [
        { name: "Kewaspadaan Manah", desc: "Sipat ngati-ati lan ora gampang kapilut bandha dunya" }
      ],
      dasanama: ["Cakrawangsa", "Reksasura", "Pegatwaja"],
      kutipanKrama: {
        jawa: "Ampun kesupen tansah waspada dhateng rubeda, lumampah kanthi pener madosi kasaenan.",
        latin: "Ampun kesupen tansah waspada dhateng rubeda, lumampah kanthi pener madosi kasaenan.",
        arti: "Jangan lupa untuk selalu waspada terhadap godaan, melangkah dengan benar mencari kebaikan."
      },
      kasatriyan: "Karangtumaritis",
      bapak: "Kyai Semar (angkat)",
      ibu: "-"
    },
    {
      id: "gatotkaca",
      name: "Raden Gatotkaca",
      alias: "Tetuka / Purubaya",
      title: "Ksatria Pringgandani • Otot Kawat Balung Wesi",
      category: "ksatria",
      isPremium: true,
      color: "#5C9CE6",
      watak: "Pangurbanan tanpa pamrih, gagah, tangguh, setya marang nusa lan bangsa, tansah njaga kasantosan nagara.",
      peran: "Senapati perang agung Pandawa, ksatria mabur tanpa swiwi kang njaga langit Kurusetra.",
      senjata: [
        { name: "Kutang Antakusuma", desc: "Ageman sakti kang ndadekake bisa mabur ing gegana" },
        { name: "Caping Basunanda", desc: "Caping sakti udan ora teles, panas ora sumuk" },
        { name: "Aji Narantaka", desc: "Ajian ampuh kanggo numpes ratu raseksa" },
        { name: "Aji Brajamusti", desc: "Ajian ajur-ajer ing kepalan tangan" }
      ],
      dasanama: ["Tetuka", "Purubaya", "Arimbiatmaja", "Bimasuta", "Kacanagara", "Guritna", "Kancing Jaya"],
      kutipanKrama: {
        jawa: "Jiwa raga kula cawisaken kagem katentremaning praja lan karahayonipun para kawula sedaya.",
        latin: "Jiwa raga kula cawisaken kagem katentremaning praja lan karahayonipun para kawula sedaya.",
        arti: "Jiwa raga saya persiapkan untuk ketenteraman negara dan keselamatan seluruh rakyat."
      },
      kasatriyan: "Pringgandani",
      bapak: "Raden Wrekudara",
      ibu: "Dewi Arimbi"
    },
    {
      id: "petruk",
      name: "Petruk Kanthong Bolong",
      alias: "Dawala / Dublajaya",
      title: "Punakawan Nomer Loro • Pinter Ngomong",
      category: "punakawan",
      isPremium: true,
      color: "#48BFE3",
      watak: "Grapyak, pinter cecaturan, enthengan tetulung, tansah gawe guyub rukun lan sumringah.",
      peran: "Putra angkat Semar nomer loro, tau dadi ratu kanthi jejuluk Prabu Belgeduwelbeh (Petruk Dadi Ratu).",
      senjata: [
        { name: "Pethik Sakti", desc: "Pusaka pralambang tetulung kanthi guyu lan kabungahan" }
      ],
      dasanama: ["Dawala", "Dublajaya", "Helgeduwelbeh", "Kanthong Bolong"],
      kutipanKrama: {
        jawa: "Menawi pirembagan kaliyan tiyang sanes, prayoginipun ngginakaken basa ingkang manis supados boten nyakiti manah.",
        latin: "Menawi pirembagan kaliyan tiyang sanes, prayoginipun ngginakaken basa ingkang manis supados boten nyakiti manah.",
        arti: "Bila berbicara dengan orang lain, seyogianya menggunakan bahasa yang santun agar tidak melukai perasaan."
      },
      kasatriyan: "Karangtumaritis",
      bapak: "Kyai Semar (angkat)",
      ibu: "-"
    },
    {
      id: "bagong",
      name: "Bagong",
      alias: "Bawor / Cepot",
      title: "Punakawan Wuragil • Bayangane Semar",
      category: "punakawan",
      isPremium: true,
      color: "#FF6B6B",
      watak: "Kritis, blak-kotang (blak-blakan), prasaja, wani ngandhani bebener sanadyan marang para ratu.",
      peran: "Putra ragil Semar kang dumadi saka bayangane Semar dhewe, swarane gedhe lan lucu.",
      senjata: [
        { name: "Kritik Murni", desc: "Tembung blak-blakan kang ngemot pituduh leres" }
      ],
      dasanama: ["Bawor", "Ki Lurah Bagong", "Cepot"],
      kutipanKrama: {
        jawa: "Ngandharaken leres punika prayogi, sanadyan asring dadosaken tiyang ingkang lepat rumaos lingsem.",
        latin: "Ngandharaken leres punika prayogi, sanadyan asring dadosaken tiyang ingkang lepat rumaos lingsem.",
        arti: "Menyampaikan kebenaran itu baik, meskipun sering kali membuat orang yang salah merasa malu."
      },
      kasatriyan: "Karangtumaritis",
      bapak: "Kyai Semar",
      ibu: "-"
    },
    {
      id: "hanoman",
      name: "Anoman",
      alias: "Senggana / Mayangkara",
      title: "Rewanda Putih • Ksatria Kendhalisada",
      category: "ksatria",
      isPremium: true,
      color: "#E0E0E0",
      watak: "Setya tuhu marang Gusti Rama, kendel, suci, ora nate ngresula, sakti mandraguna.",
      peran: "Duta agung Pancawati nalika nylametake Dewi Sinta saka cengkeramane Rahwana ing Ngalengka.",
      senjata: [
        { name: "Aji Bayubajra", desc: "Kakuwatan angin prahara kang nggegirisi" },
        { name: "Aji Sepiangin", desc: "Mlaku cepet kaya playune angin" }
      ],
      dasanama: ["Senggana", "Mayangkara", "Bayuputra", "Guruputra", "Kapiwara", "Ramadayapati"],
      kutipanKrama: {
        jawa: "Kasantosan jiwa punika mboten namung saking kasekten raga, nanging saking luhuring kasetyan.",
        latin: "Kasantosan jiwa punika mboten namung saking kasekten raga, nanging saking luhuring kasetyan.",
        arti: "Kekuatan jiwa itu tidak hanya berasal dari kesaktian fisik, melainkan dari tingginya nilai kesetiaan."
      },
      kasatriyan: "Kendhalisada",
      bapak: "Bathara Guru / Bathara Bayu",
      ibu: "Dewi Anjani"
    },
    {
      id: "srikandi",
      name: "Dewi Wara Srikandi",
      alias: "Srikandini",
      title: "Prajurit Wanita Pinunjul • Senapati Amarta",
      category: "ksatria",
      isPremium: true,
      color: "#F77F00",
      watak: "Tatas, teteg, kendel, pinter jemparing, prajurit wanita utama kang tangguh lan wani bela bebener.",
      peran: "Senapati wanita Pandawa kang ngasorake Resi Bisma ing palagan Kurusetra.",
      senjata: [
        { name: "Panah Hrusangkali", desc: "Jemparing ampuh pusaka prajurit wanita" }
      ],
      dasanama: ["Srikandini", "Drupadiatmaja", "Wara Srikandi"],
      kutipanKrama: {
        jawa: "Wanita ugi gadhah jejibahan ingkang utami kangge mbelani karaharjaning praja lan martabat kulawarga.",
        latin: "Wanita ugi gadhah jejibahan ingkang utami kangge mbelani karaharjaning praja lan martabat kulawarga.",
        arti: "Wanita juga memiliki tugas utama untuk membela kemakmuran negara dan martabat keluarga."
      },
      kasatriyan: "Cempalareja",
      bapak: "Prabu Drupada",
      ibu: "Dewi Gandawati"
    },
    {
      id: "nakula_sadewa",
      name: "Nakula & Sadewa",
      alias: "Pinten & Tansen",
      title: "Ksatria Kembar Pandawa • Sawojajar & Baweratalun",
      category: "pandawa",
      isPremium: true,
      color: "#06D6A0",
      watak: "Setya, bekti marang para kakange, pinter ngopeni jaran lan mangerteni ramalan masa ngajeng.",
      peran: "Pandawa kembar kang paling enom, ahli strategi lan tetanen.",
      senjata: [
        { name: "Pedhang Sukmailang", desc: "Pedhang pusaka pangusir memala" },
        { name: "Aji Pranawajati", desc: "Ajian nguningani lelakon ingkang dereng kelakon" }
      ],
      dasanama: ["Pinten (Nakula)", "Tansen (Sadewa)", "Madrimputra", "Aswinasuta"],
      kutipanKrama: {
        jawa: "Kula kekalih tansah ndherek punapa kemawon ingkang dados pitedahipun para raka sedaya.",
        latin: "Kula kekalih tansah ndherek punapa kemawon ingkang dados pitedahipun para raka sedaya.",
        arti: "Kami berdua selalu mengikuti apa saja yang menjadi petunjuk dari semua kakak tercinta."
      },
      kasatriyan: "Sawojajar (Nakula) & Baweratalun (Sadewa)",
      bapak: "Prabu Pandu Dewanata",
      ibu: "Dewi Madrim"
    },
    {
      id: "karna",
      name: "Adipati Karna",
      alias: "Suryaputra / Basusena",
      title: "Narpati Ngawangga • Ksatria Satya Janji",
      category: "ksatria",
      isPremium: true,
      color: "#FFD166",
      watak: "Loman (dursasana/dermawan), satya tuhu marang sumpah lan bales budi marang Duryudana, sakti mandraguna.",
      peran: "Sedulur tuwa Pandawa saka ibu Dewi Kunti, nanging mbelani Kurawa amarga bales budi marang kraton Astina.",
      senjata: [
        { name: "Senjata Kunta Wijayadanu", desc: "Pusaka jemparing paringan Bathara Narada" },
        { name: "Panah Wijayacapa", desc: "Gandhewa agung pusaka Batara Surya" }
      ],
      dasanama: ["Suryaputra", "Basusena", "Karnamartanda", "Radheya", "Wangbang Suryaputra"],
      kutipanKrama: {
        jawa: "Kula netepi sumpah setya, sanadyan kedah adhep-adhepan kaliyan para sedherek piyambak.",
        latin: "Kula netepi sumpah setya, sanadyan kedah adhep-adhepan kaliyan para sedherek piyambak.",
        arti: "Saya menepati sumpah setia, meskipun harus berhadapan dengan saudara kandung sendiri."
      },
      kasatriyan: "Kadipatèn Ngawangga",
      bapak: "Bathara Surya",
      ibu: "Dewi Kunti"
    }
  ],

  // 2. STRUKTUR 20 UNIT PEMBELAJARAN PROGRESIF (DUOLINGO SKILL TREE)
  units: (function generate20Units() {
    const rawUnits = [
      // Tingkat 1: Kasatriyan Dhasar (Unit 1 - 5)
      { num: 1, title: "Unit 1: Sapa Aruh & Kahanan Padintenan", desc: "Sinau tata krama tembung dhasar saben dina, sapa aruh, matur nuwun, lan sapanunggalane.", color: "#D4A64C", icon: "🤝", isPro: false },
      { num: 2, title: "Unit 2: Peranganing Awak (Sirah nganti Sampeyan)", desc: "Kosakata lengkap anggota tubuh ing basa Ngoko, Krama Madya, lan Krama Inggil.", color: "#E25822", icon: "👑", isPro: false },
      { num: 3, title: "Unit 3: Paseduluran & Kulawarga Jawa", desc: "Sebutan bapak, ibu, kakang, adhi, simbah, putu, lan tata krama pacelathon kulawarga.", color: "#06D6A0", icon: "🏡", isPro: true },
      { num: 4, title: "Unit 4: Tembung Kriya & Aktivitas Omah", desc: "Mangan, ngombe, turu, adus, nyapu, nggodhog, lan tembung kriya padintenan.", color: "#5C9CE6", icon: "🍚", isPro: true },
      { num: 5, title: "Unit 5: Wilangan, Wektu & Dina Jawa", desc: "Ngetung angka siji nganti sewu, wektu esuk-awan-sore-wengi, lan dina pasaran Jawa.", color: "#FFD166", icon: "⏳", isPro: true },

      // Tingkat 2: Kasatriyan Madya (Unit 6 - 10)
      { num: 6, title: "Unit 6: Pacelathon marang Tiyang Sepuh", desc: "Praktik dialog unggah-ungguh basa santun marang bapak, ibu, guru, lan para pinisepuh.", color: "#F77F00", icon: "💬", isPro: true },
      { num: 7, title: "Unit 7: Nampi Dhayoh & Bertamu Trapsila", desc: "Tata cara nampa tamu ing omah, sugeng rawuh, ngaturi unjukan, lan pamitan.", color: "#48BFE3", icon: "🍵", isPro: true },
      { num: 8, title: "Unit 8: Rasa Pangrasa & Sipat Ksatria", desc: "Nyatakake rasa seneng, susah, nesu, lara, kendel, asor ing budi, lan welas asih.", color: "#FF6B6B", icon: "❤️", isPro: true },
      { num: 9, title: "Unit 9: Panganan Tradisional & Jamuan Dahar", desc: "Kosakata panganan tradisional Jawa, etika mangan santun, lan suguhan adiluhung.", color: "#2EC4B6", icon: "🍲", isPro: true },
      { num: 10, title: "Unit 10: Busana Adat & Ageman Jawa", desc: "Mengenal ageman jawi jangkep: jarik, surjan, blangkon, keris, stagen, lan nyamping.", color: "#E0AAFF", icon: "👘", isPro: true },

      // Tingkat 3: Kasatriyan Utama (Unit 11 - 15)
      { num: 11, title: "Unit 11: Dasanama Pandawa Lima", desc: "Sinonim sastra Jawa lan nama alias Puntadewa, Bima, Arjuna, Nakula, Sadewa.", color: "#D4A64C", icon: "✨", isPro: true },
      { num: 12, title: "Unit 12: Pasemon & Guyonan Punakawan", desc: "Filsafat Punakawan (Semar, Gareng, Petruk, Bagong) lan piwulang moral trapsila.", color: "#FFBF00", icon: "🎭", isPro: true },
      { num: 13, title: "Unit 13: Pusaka Sakti & Senjata Wayang", desc: "Panah Pasopati, Kalimasada, Kuku Pancanaka, Kunta Wijayadanu, lan ajian sakti.", color: "#5C9CE6", icon: "🗡️", isPro: true },
      { num: 14, title: "Unit 14: Kahanan Alam & Karaton Jawa", desc: "Arane mangsa, surya, candra, wukir, tirta, kedhaton, alun-alun, lan wewengkon.", color: "#06D6A0", icon: "🏰", isPro: true },
      { num: 15, title: "Unit 15: Pakaryan & Panguripan Desa", desc: "Profesi tradisional (dwija, tani, dhalang, mpu, undhagi) lan urip gotong royong.", color: "#E25822", icon: "🌾", isPro: true },

      // Tingkat 4: Kasatriyan Maharesi (Unit 16 - 20)
      { num: 16, title: "Unit 16: Basa Rinengga & Tembung Camboran", desc: "Keindahan sastra Jawa, tembung saroja, tembung garba, lan tembung plutan.", color: "#FFD166", icon: "📜", isPro: true },
      { num: 17, title: "Unit 17: Paribasan, Bebasan & Saloka", desc: "Ungkapan filosofis Jawa: Becik ketitik ala ketara, Mikul dhuwur mendhem jero.", color: "#F77F00", icon: "📖", isPro: true },
      { num: 18, title: "Unit 18: Cangkriman & Wangsalan Jawa", desc: "Teka-teki tradisional Jawa (wancahan, blenderan, pepindhan) lan wangsalan luhur.", color: "#48BFE3", icon: "🔮", isPro: true },
      { num: 19, title: "Unit 19: Dasanama Ratu, Dewa & Danawa", desc: "Dasanama Bathara Guru, Narada, Rahwana, Kresna, Karna, lan paraga liyane.", color: "#C77DFF", icon: "⚡", isPro: true },
      { num: 20, title: "Unit 20: Kasampurnan Basa & Sastra Jawa (Wisuda)", desc: "Ujian akhir kasampurnan Pepak Digital kagem nggayuh gelar Maharesi Basa Jawa.", color: "#D4A64C", icon: "🎖️", isPro: true }
    ];

    return rawUnits.map(u => ({
      id: `unit-${u.num}`,
      number: u.num,
      title: u.title,
      description: u.desc,
      themeColor: u.color,
      icon: u.icon,
      isPremium: u.isPro,
      nodes: [
        { id: `node-${u.num}-1`, unitId: `unit-${u.num}`, title: `Piwulang 1: Kosakata Inti`, subtitle: `Kawruh dhasar ${u.title.split(':')[1]?.trim() || ''}`, icon: u.icon, type: "lesson", xp: 20, completed: false, locked: u.num > 1, stars: 0 },
        { id: `node-${u.num}-2`, unitId: `unit-${u.num}`, title: `Piwulang 2: Jodohake & Susun Ukara`, subtitle: "Latihan pasang tembung & ngronce ukara", icon: "📝", type: "matching", xp: 25, completed: false, locked: true, stars: 0 },
        { id: `node-${u.num}-3`, unitId: `unit-${u.num}`, title: `Piwulang 3: Uji Rungon & Wicara`, subtitle: "Mirengaken pelafalan audio Jawa", icon: "🎧", type: "audio", xp: 30, completed: false, locked: true, stars: 0 },
        { id: `node-${u.num}-4`, unitId: `unit-${u.num}`, title: `Ujian Kasatriyan Unit ${u.num}`, subtitle: `Evaluasi komprehensif Unit ${u.num}`, icon: "🏆", type: "checkpoint", xp: 50, completed: false, locked: true, stars: 0 }
      ]
    }));
  })(),

  // 3. INTEGRASI BANK SOAL LENGKAP PER NODE & ARENA
  questions: (function generateNodeQuestionMap() {
    const map = {};
    const bank = window.PEPAK_QUESTION_BANK || [];

    for (let u = 1; u <= 20; u++) {
      for (let n = 1; n <= 4; n++) {
        const nodeId = `node-${u}-${n}`;
        const startIdx = ((u - 1) * 4 + n) % Math.max(1, bank.length - 6);
        map[nodeId] = bank.slice(startIdx, startIdx + 5);
        if (!map[nodeId] || map[nodeId].length === 0) {
          map[nodeId] = bank.slice(0, 4);
        }
      }
    }
    return map;
  })(),

  // 4. AKSES DATABASE 500+ KOSAKATA KAMUS
  get dictionary() {
    return window.PEPAK_VOCAB_DB || [];
  },

  // 5. PAKET HARGA LANGGANAN — 4 TIER
  subscriptionPlans: [
    /* ── TIER 1: GRATIS ─────────────────────────────────── */
    {
      id: "free",
      name: "Ksatria Pemula",
      price: 0,
      priceFormatted: "Rp 0",
      period: "Selamanya",
      badge: null,
      tokensPerDay: 7,
      maxUnits: 5,
      desc: "Mulai belajar Bahasa Jawa dengan akses dasar — 7 token/hari, Unit 1–5.",
      features: [
        { text: "7 Token / Nyawa Keris per Hari (reset tiap 24 jam)", included: true },
        { text: "Akses Unit 1–5 (Kasatriyan Dhasar)", included: true },
        { text: "5 Tokoh Wayang Dasar", included: true },
        { text: "20 Video Pembelajaran Gratis", included: true },
        { text: "Kamus & Bank Soal Versi Terbatas", included: true },
        { text: "Akses Unit 6–20 (Kasatriyan Lanjut)", included: false },
        { text: "30 Video PRO Eksklusif", included: false },
        { text: "Sertifikat Digital Resmi", included: false },
        { text: "Bebas Promosi Upgrade", included: false }
      ],
      ctaText: "Paket Aktif Saat Ini",
      isPopular: false,
      buttonClass: "btn-outline-gold"
    },

    /* ── TIER 2: REGULER ────────────────────────────────── */
    {
      id: "monthly",
      name: "Ksatria Muda",
      price: 29000,
      priceFormatted: "Rp 29.000",
      period: "/ bulan (30 hari)",
      badge: "🗡️ PEMULA BERBAYAR",
      tokensPerDay: 15,
      maxUnits: 10,
      desc: "Perluas akses ke 10 unit, 15 token/hari, dan sebagian video PRO.",
      features: [
        { text: "15 Token / Nyawa Keris per Hari (reset tiap 24 jam)", included: true },
        { text: "Akses Unit 1–10 (Kasatriyan Dhasar + Madya)", included: true },
        { text: "10 Tokoh Wayang Lengkap", included: true },
        { text: "20 Video Gratis + 10 Video PRO", included: true },
        { text: "Kamus & Bank Soal Lebih Lengkap", included: true },
        { text: "Bebas Promosi Upgrade", included: true },
        { text: "Akses Unit 11–20 (Kasatriyan Utama & Maharesi)", included: false },
        { text: "Sertifikat Digital Resmi", included: false },
        { text: "Papan Peringkat Mingguan + Lencana Tier", included: false }
      ],
      ctaText: "Pilih Ksatria Muda (Rp 29rb/bln)",
      isPopular: false,
      buttonClass: "btn-gold-action"
    },

    /* ── TIER 3: MENENGAH ───────────────────────────────── */
    {
      id: "semi",
      name: "Ksatria Madya",
      price: 59000,
      priceFormatted: "Rp 59.000",
      period: "/ bulan (30 hari)",
      badge: "⚔️ PILIHAN POPULER",
      tokensPerDay: 25,
      maxUnits: 20,
      desc: "Semua 20 unit, 30 video PRO, sertifikat dasar — pilihan paling seimbang.",
      features: [
        { text: "25 Token / Nyawa Keris per Hari (reset tiap 24 jam)", included: true },
        { text: "Akses PENUH Seluruh 20 Unit Piwulang", included: true },
        { text: "12+ Semua Tokoh Wayang & Pusaka Sakti", included: true },
        { text: "20 Video Gratis + 30 Video PRO (semua)", included: true },
        { text: "Kamus 500+ Lengkap & 320+ Bank Soal Penuh", included: true },
        { text: "Papan Peringkat Mingguan + Lencana Tier Madya", included: true },
        { text: "Sertifikat Digital Dasar (setelah lulus semua unit)", included: true },
        { text: "Bebas Promosi Upgrade", included: true },
        { text: "Prioritas Dukungan & Early Access Konten Baru", included: false }
      ],
      ctaText: "Pilih Ksatria Madya (Rp 59rb/bln)",
      isPopular: true,
      buttonClass: "btn-gold-action"
    },

    /* ── TIER 4: PREMIUM ────────────────────────────────── */
    {
      id: "yearly",
      name: "Ksatria Maharesi Emas",
      price: 199000,
      priceFormatted: "Rp 199.000",
      period: "/ bulan (30 hari)",
      badge: "👑 PREMIUM TERLENGKAP",
      tokensPerDay: 35,
      maxUnits: 20,
      desc: "35 token/hari, semua fitur, sertifikat resmi, early access, lencana eksklusif.",
      features: [
        { text: "35 Token / Nyawa Keris per Hari (+ 1× refill darurat/hari)", included: true },
        { text: "Semua Fitur Ksatria Madya", included: true },
        { text: "Sertifikat Digital Resmi Bertanda Tangan & Berlogo Pepak Digital", included: true },
        { text: "Early Access Unit/Video/Tokoh Baru Sebelum Dirilis Publik", included: true },
        { text: "Lencana Eksklusif 'Kasatriyan Emas' di Profil & Papan Peringkat", included: true },
        { text: "Prioritas Dukungan (Chat Konsultasi Guru/Admin)", included: true },
        { text: "Bonus Refill 1× Nyawa di Tengah Hari jika Habis", included: true }
      ],
      ctaText: "Pilih Ksatria Maharesi Emas (Rp 199rb/bln)",
      isPopular: false,
      buttonClass: "btn-gold-action"
    },

    /* ── PAKET SEKOLAH (B2B) ────────────────────────────── */
    {
      id: "school",
      name: "Paket Sekolah & Guru (B2B)",
      price: 15000,
      priceFormatted: "Rp 15.000",
      period: "/ siswa / semester",
      badge: "🏛️ INSTITUSI & GURU",
      tokensPerDay: 35,
      maxUnits: 20,
      desc: "Dirancang untuk SD, SMP, SMA, SMK, dan Sanggar Seni Budaya.",
      features: [
        { text: "Akses Premium (setara Ksatria Maharesi) untuk Semua Siswa", included: true },
        { text: "Dashboard Monitoring Guru & Rekap Nilai Otomatis", included: true },
        { text: "Ekspor Laporan Nilai Kurikulum Merdeka (CSV/PDF)", included: true },
        { text: "Manajemen Akun Siswa Massal (Import Excel)", included: true },
        { text: "Invoice Resmi & Faktur Pajak Sekolah", included: true }
      ],
      ctaText: "Hubungi Penawaran Sekolah",
      isPopular: false,
      buttonClass: "btn-outline-gold"
    }
  ],

  // 6. METODE PEMBAYARAN
  paymentMethods: [
    {
      category: "qris",
      name: "QRIS / E-Wallet (Instan)",
      icon: "📱",
      options: [
        { id: "gopay", name: "GoPay / GoPay Coins", icon: "🟢" },
        { id: "qris_all", name: "QRIS (Semua Bank & E-Wallet)", icon: "📲" },
        { id: "ovo", name: "OVO Cash", icon: "🟣" },
        { id: "dana", name: "DANA Dompet Digital", icon: "🔵" },
        { id: "shopeepay", name: "ShopeePay", icon: "🟠" }
      ]
    },
    {
      category: "va",
      name: "Virtual Account (Bank Transfer)",
      icon: "🏦",
      options: [
        { id: "bca_va", name: "BCA Virtual Account", code: "88090", icon: "🏛️" },
        { id: "mandiri_va", name: "Mandiri Virtual Account", code: "89608", icon: "🏛️" },
        { id: "bri_va", name: "BRI Virtual Account (BRIVA)", code: "12800", icon: "🏛️" },
        { id: "bni_va", name: "BNI Virtual Account", code: "98812", icon: "🏛️" },
        { id: "permata_va", name: "Permata Virtual Account", code: "85280", icon: "🏛️" }
      ]
    },
    {
      category: "card",
      name: "Kartu Kredit / Debit Online",
      icon: "💳",
      options: [
        { id: "cc", name: "Visa / Mastercard / JCB", icon: "💳" }
      ]
    },
    {
      category: "cstore",
      name: "Gerai Retail",
      icon: "🏪",
      options: [
        { id: "indomaret", name: "Indomaret / Isaku", icon: "🏪" },
        { id: "alfamart", name: "Alfamart / Alfamidi", icon: "🏪" }
      ]
    }
  ],

  // 7. DATA KELAS GURU
  teacherClassData: {
    className: "Kelas VII-B SMP Negeri 1 Kartasura",
    subject: "Muatan Lokal Bahasa Jawa (Kurikulum Merdeka)",
    totalStudents: 28,
    activeSubscribers: 28,
    averageScore: 88.5,
    students: [
      { id: "s-1", name: "Aditya Janaka Putra", nisn: "008129381", completedUnits: 8, avgQuizScore: 96, streak: 12, status: "Sangat Baik" },
      { id: "s-2", name: "Dewi Sekar Kedhaton", nisn: "008129382", completedUnits: 7, avgQuizScore: 92, streak: 9, status: "Sangat Baik" },
      { id: "s-3", name: "Bimo Arya Pratama", nisn: "008129383", completedUnits: 6, avgQuizScore: 88, streak: 7, status: "Baik" },
      { id: "s-4", name: "Cahyo Bagus Nugroho", nisn: "008129384", completedUnits: 5, avgQuizScore: 84, streak: 5, status: "Baik" },
      { id: "s-5", name: "Roro Anjani Kinanthi", nisn: "008129385", completedUnits: 4, avgQuizScore: 80, streak: 4, status: "Cukup" },
      { id: "s-6", name: "Wahyu Tri Pamungkas", nisn: "008129386", completedUnits: 3, avgQuizScore: 78, streak: 2, status: "Perlu Bimbingan" }
    ]
  },

  // 8. PAPAN PERINGKAT
  leaderboard: [
    { rank: 1, name: "Raden Bagus Dananjaya", badge: "Ksatria Maharesi", xp: 2420, streak: 28, avatar: "arjuna" },
    { rank: 2, name: "Siti Srikandi Putri", badge: "Prajurit Utama", xp: 1980, streak: 21, avatar: "srikandi" },
    { rank: 3, name: "Bimo Arya Sakti", badge: "Prajurit Utama", xp: 1750, streak: 18, avatar: "bima" },
    { rank: 4, name: "Ananda Gatot Subroto", badge: "Ksatria Madya", xp: 1440, streak: 14, avatar: "gatotkaca" },
    { rank: 5, name: "Tri Semar Pamungkas", badge: "Ksatria Madya", xp: 1220, streak: 11, avatar: "semar" },
    { rank: 6, name: "Dewi Sekar Kedhaton", badge: "Ksatria Pemula", xp: 910, streak: 8, avatar: "yudhistira" },
    { rank: 7, name: "Wahyu Hanoman Jaya", badge: "Ksatria Pemula", xp: 730, streak: 5, avatar: "hanoman" },
    { rank: 8, name: "Anda (Siswa Pepak)", badge: "Ksatria Pemula", xp: 450, streak: 3, avatar: "arjuna", isCurrentUser: true }
  ],

  // 9. LENCANA PRESTASI
  achievements: [
    { id: "first_step", title: "Langkah Kapisan", desc: "Rampungake piwulang 1 ing Pepak Digital", icon: "🌱", unlocked: true },
    { id: "pasopati", title: "Panah Pasopati", desc: "Oleh skor sampurna 100% ing salah siji kuis", icon: "🏹", unlocked: true },
    { id: "streak_3", title: "Obor Sinau", desc: "Nggayuh streak sinau 3 dina berturut-turut", icon: "🔥", unlocked: true },
    { id: "vocab_50", title: "Kamus Melampaui", desc: "Nguasai luwih saka 50 tembung ing Kamus Pepak", icon: "📚", unlocked: true },
    { id: "punakawan", title: "Guyub Punakawan", desc: "Mbukak kabeh profil tokoh Semar, Gareng, Petruk, Bagong", icon: "🎭", unlocked: false },
    { id: "pandawa_master", title: "Kasampurnan Pandawa", desc: "Rampungake kabeh modul dasanama Pandawa", icon: "👑", unlocked: false },
    { id: "krama_master", title: "Ksatria Krama Inggil", desc: "Nggayuh 1000 XP ing Arena Praktik", icon: "⚡", unlocked: false },
    { id: "maharesi_legend", title: "Gelar Maharesi Agung", desc: "Rampungake kabeh 20 Unit Piwulang Pepak Digital", icon: "🎖️", unlocked: false }
  ]
};

if (typeof window !== "undefined") {
  window.PEPAK_DATA = PEPAK_DATA;
}

// ---------- data: [ayah count, Bangla, transliteration, Arabic] ----------
const SURAH_RAW = `7|আল-ফাতিহা|Al-Fatihah|الفاتحة
286|আল-বাকারা|Al-Baqarah|البقرة
200|আলে ইমরান|Ali 'Imran|آل عمران
176|আন-নিসা|An-Nisa|النساء
120|আল-মায়িদা|Al-Ma'idah|المائدة
165|আল-আনআম|Al-An'am|الأنعام
206|আল-আরাফ|Al-A'raf|الأعراف
75|আল-আনফাল|Al-Anfal|الأنفال
129|আত-তাওবা|At-Tawbah|التوبة
109|ইউনুস|Yunus|يونس
123|হুদ|Hud|هود
111|ইউসুফ|Yusuf|يوسف
43|আর-রাদ|Ar-Ra'd|الرعد
52|ইবরাহীম|Ibrahim|إبراهيم
99|আল-হিজর|Al-Hijr|الحجر
128|আন-নাহল|An-Nahl|النحل
111|বনী ইসরাঈল|Al-Isra|الإسراء
110|আল-কাহফ|Al-Kahf|الكهف
98|মারইয়াম|Maryam|مريم
135|ত্বা-হা|Taha|طه
112|আল-আম্বিয়া|Al-Anbiya|الأنبياء
78|আল-হাজ্জ|Al-Hajj|الحج
118|আল-মুমিনূন|Al-Mu'minun|المؤمنون
64|আন-নূর|An-Nur|النور
77|আল-ফুরকান|Al-Furqan|الفرقان
227|আশ-শুআরা|Ash-Shu'ara|الشعراء
93|আন-নামল|An-Naml|النمل
88|আল-কাসাস|Al-Qasas|القصص
69|আল-আনকাবূত|Al-'Ankabut|العنكبوت
60|আর-রূম|Ar-Rum|الروم
34|লুকমান|Luqman|لقمان
30|আস-সাজদা|As-Sajdah|السجدة
73|আল-আহযাব|Al-Ahzab|الأحزاب
54|সাবা|Saba|سبأ
45|ফাতির|Fatir|فاطر
83|ইয়াসীন|Ya-Sin|يس
182|আস-সাফফাত|As-Saffat|الصافات
88|সোয়াদ|Sad|ص
75|আয-যুমার|Az-Zumar|الزمر
85|আল-মুমিন (গাফির)|Ghafir|غافر
54|হা-মীম সাজদা (ফুসসিলাত)|Fussilat|فصلت
53|আশ-শূরা|Ash-Shura|الشورى
89|আয-যুখরুফ|Az-Zukhruf|الزخرف
59|আদ-দুখান|Ad-Dukhan|الدخان
37|আল-জাসিয়া|Al-Jathiyah|الجاثية
35|আল-আহকাফ|Al-Ahqaf|الأحقاف
38|মুহাম্মাদ|Muhammad|محمد
29|আল-ফাতহ|Al-Fath|الفتح
18|আল-হুজুরাত|Al-Hujurat|الحجرات
45|ক্বাফ|Qaf|ق
60|আয-যারিয়াত|Adh-Dhariyat|الذاريات
49|আত-তূর|At-Tur|الطور
62|আন-নাজম|An-Najm|النجم
55|আল-কামার|Al-Qamar|القمر
78|আর-রহমান|Ar-Rahman|الرحمن
96|আল-ওয়াকিয়া|Al-Waqi'ah|الواقعة
29|আল-হাদীদ|Al-Hadid|الحديد
22|আল-মুজাদালা|Al-Mujadila|المجادلة
24|আল-হাশর|Al-Hashr|الحشر
13|আল-মুমতাহিনা|Al-Mumtahanah|الممتحنة
14|আস-সফ|As-Saff|الصف
11|আল-জুমুআ|Al-Jumu'ah|الجمعة
11|আল-মুনাফিকূন|Al-Munafiqun|المنافقون
18|আত-তাগাবুন|At-Taghabun|التغابن
12|আত-তালাক|At-Talaq|الطلاق
12|আত-তাহরীম|At-Tahrim|التحريم
30|আল-মুলক|Al-Mulk|الملك
52|আল-কলম|Al-Qalam|القلم
52|আল-হাক্কাহ|Al-Haqqah|الحاقة
44|আল-মাআরিজ|Al-Ma'arij|المعارج
28|নূহ|Nuh|نوح
28|আল-জিন|Al-Jinn|الجن
20|আল-মুযযাম্মিল|Al-Muzzammil|المزمل
56|আল-মুদ্দাসসির|Al-Muddaththir|المدثر
40|আল-কিয়ামাহ|Al-Qiyamah|القيامة
31|আদ-দাহর (আল-ইনসান)|Al-Insan|الإنسان
50|আল-মুরসালাত|Al-Mursalat|المرسلات
40|আন-নাবা|An-Naba|النبأ
46|আন-নাযিআত|An-Nazi'at|النازعات
42|আবাসা|'Abasa|عبس
29|আত-তাকভীর|At-Takwir|التكوير
19|আল-ইনফিতার|Al-Infitar|الانفطار
36|আল-মুতাফফিফীন|Al-Mutaffifin|المطففين
25|আল-ইনশিকাক|Al-Inshiqaq|الانشقاق
22|আল-বুরূজ|Al-Buruj|البروج
17|আত-তারিক|At-Tariq|الطارق
19|আল-আলা|Al-A'la|الأعلى
26|আল-গাশিয়া|Al-Ghashiyah|الغاشية
30|আল-ফাজর|Al-Fajr|الفجر
20|আল-বালাদ|Al-Balad|البلد
15|আশ-শামস|Ash-Shams|الشمس
21|আল-লাইল|Al-Layl|الليل
11|আদ-দুহা|Ad-Duha|الضحى
8|আলাম নাশরাহ (আশ-শারহ)|Ash-Sharh|الشرح
8|আত-তীন|At-Tin|التين
19|আল-আলাক|Al-'Alaq|العلق
5|আল-কদর|Al-Qadr|القدر
8|আল-বাইয়্যিনাহ|Al-Bayyinah|البينة
8|আয-যিলযাল|Az-Zalzalah|الزلزلة
11|আল-আদিয়াত|Al-'Adiyat|العاديات
11|আল-কারিআ|Al-Qari'ah|القارعة
8|আত-তাকাসুর|At-Takathur|التكاثر
3|আল-আসর|Al-'Asr|العصر
9|আল-হুমাযাহ|Al-Humazah|الهمزة
5|আল-ফীল|Al-Fil|الفيل
4|কুরাইশ|Quraysh|قريش
7|আল-মাউন|Al-Ma'un|الماعون
3|আল-কাউসার|Al-Kawthar|الكوثر
6|আল-কাফিরূন|Al-Kafirun|الكافرون
3|আন-নাসর|An-Nasr|النصر
5|আল-লাহাব (আল-মাসাদ)|Al-Masad|المسد
4|আল-ইখলাস|Al-Ikhlas|الإخلاص
5|আল-ফালাক|Al-Falaq|الفلق
6|আন-নাস|An-Nas|الناس`;
const SURAHS = SURAH_RAW.split('\n').map((l, i) => {
  const [n, bn, en, ar] = l.split('|');
  return {
    i,
    n: +n,
    bn,
    en,
    ar
  };
});
const OFFSET = []; {
  let a = 0;
  for (const s of SURAHS) {
    OFFSET.push(a);
    a += s.n;
  }
}
const TOTAL = SURAHS.reduce((a, s) => a + s.n, 0); // 6236

// ---------- ordered treemap: split the sequence in two by weight, cut along the longer side ----------
const REG = new Array(114);
(function split(lo, hi, x, y, w, h) {
  if (hi - lo === 1) {
    REG[lo] = {
      x,
      y,
      w,
      h
    };
    return;
  }
  let tot = 0;
  for (let i = lo; i < hi; i++) tot += SURAHS[i].n;
  let acc = 0,
    k = lo + 1,
    best = Infinity,
    run = 0;
  for (let i = lo; i < hi - 1; i++) {
    run += SURAHS[i].n;
    const d = Math.abs(run - tot / 2);
    if (d < best) {
      best = d;
      k = i + 1;
      acc = run;
    }
  }
  const f = acc / tot;
  if (w >= h) {
    split(lo, k, x, y, w * f, h);
    split(k, hi, x + w * f, y, w * (1 - f), h);
  } else {
    split(lo, k, x, y, w, h * f);
    split(k, hi, x, y + h * f, w, h * (1 - f));
  }
})(0, 114, 0, 0, 1, 1);

// ayah cells inside each region: rows of near-equal count that fill the region exactly
const CELLS = REG.map((r, si) => {
  const n = SURAHS[si].n;
  let cols = Math.max(1, Math.round(Math.sqrt(n * r.w / r.h)));
  const rows = Math.max(1, Math.ceil(n / cols));
  const base = Math.floor(n / rows),
    extra = n % rows;
  const out = [];
  const rh = r.h / rows;
  for (let ri = 0; ri < rows; ri++) {
    const c = base + (ri < extra ? 1 : 0);
    const cw = r.w / c;
    for (let ci = 0; ci < c; ci++) out.push({
      x: r.x + ci * cw,
      y: r.y + ri * rh,
      w: cw,
      h: rh
    });
  }
  return out;
});


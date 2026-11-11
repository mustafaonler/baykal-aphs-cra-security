// Tam doğrulama: Word → föy HTML → PDF
//   node tam-dogrula.js            → foyler/DOGRULAMA_RAPORU.md yazar, sayfa görüntülerini araclar/.sayfalar/ içine kaydeder
// Kontroller:
//   1. Her Word paragrafı föy HTML'inde ve PDF metninde (pdftotext) birebir var mı, beklenen yerde mi?
//      (kalın yazı, boşluk ve ➔/→ farkları normalize edilir)
//   2. Soru–cevap eşleşmesi: her cevap paragrafı Word'deki soru numarasıyla aynı numaralı föy sorusunda mı?
//   3. LAB 3 risk tablosu: L, S, E, Skor, Öncelik değerleri Word ile aynı mı?
//   4. Yerleşim: HTML'de taşan / üst üste binen metin, boş cevap alanı; PDF'te kenar ve alt bilgi
//      taşması, üst üste binen metin, sayfa numarası sırası, boş sayfa.
//   5. Föylerde "PaketPro" geçen yerler: şablon metni mi, Word cevabı mı?
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright-core");
const { paragraflar, duzMetin } = require("./word.js");

const KOK = path.resolve(__dirname, "..");
const FOYLER = path.join(KOK, "foyler");
const SAYFA_DIZINI = path.join(__dirname, ".sayfalar");
const RAPOR = path.join(FOYLER, "DOGRULAMA_RAPORU.md");
const BIRLESIK = path.join(FOYLER, "Baykal_APHS_Lab_Foyleri.pdf");
const CHROME = [
  process.env.CHROME_YOLU,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium",
].find((p) => p && fs.existsSync(p));

// ---------- normalizasyon ----------
const latex = (s) => s.replace(/\$([^$]+)\$/g, (_, ic) => ic.replace(/\\times/g, "×").trim());
const norm = (s) => latex(s.normalize("NFKC")).replace(/➔/g, "→").replace(/[\s\u00a0]+/g, " ").trim();
const kucuk = (s) => norm(s).toLocaleLowerCase("tr").replace(/[:\s]+$/, "");
const kisa = (s, n = 70) => { s = norm(s); return (s.length > n ? s.slice(0, n - 1) + "…" : s).replace(/\|/g, "\\|"); };

const kalinBitis = (p) => { let k = 0; while (k < p.length && (p[k].b || !p[k].t.trim())) k++; return k; };
const etiketAt = (s) => s.replace(/^[^:]*?:\s*/, "");
const parantezAt = (s) => s.replace(/^\(\s*[^:]*?:\s*/, "").replace(/\)\s*$/, "");

// ---------- Word paragraflarının föydeki beklenen yeri ----------
// Numaralı sorular ve altındaki maddeler otomatik eşlenir; diğerleri burada tanımlıdır.
const tablo = (satir, sutun, donustur, deger = false) => ({ tur: "tablo", tablo: 1, satir, sutun, donustur, deger });
const OZEL = {
  2: {
    1: { tur: "bolge", bolge: "kutu", donustur: "p", not: "parantez ve \"Varlık listesi:\" etiketi kutu başlığı oldu" },
    ...Object.fromEntries([13, 15, 17, 19, 21, 23].map((i, k) => [i, tablo(k + 1, 0)])),
    ...Object.fromEntries([14, 16, 18, 20, 22, 24].map((i, k) => [i, { ...tablo(k + 1, 2, "e"), not: "\"Seçiminiz + Nedeni:\" etiketi sütun başlığında" }])),
  },
  3: {
    1: { tur: "bolge", bolge: "formul", donustur: "c" },
    2: { tur: "yapisal" }, 24: { tur: "yapisal" },
    10: { tur: "yapisal", not: "aynı etiketin tekrarı (yazım hatalı: \"xf\")" },
    3: { tur: "tablo-baslik", donustur: ":" }, 17: { tur: "tablo-baslik", donustur: ":" },
    ...Object.fromEntries([4, 11, 18].flatMap((b, k) => [
      [b, { ...tablo(k + 1, 0, "e"), not: "\"Senaryo:\" etiketi sütun başlığında" }],
      ...[1, 2, 3, 4, 5].map((s) => [b + s, tablo(k + 1, s, "c", true)]),
    ])),
  },
  4: {
    2: { tur: "bolge", bolge: "mevcut", donustur: ":" }, 7: { tur: "bolge", bolge: "hedef", donustur: ":" },
    ...Object.fromEntries([3, 4, 5, 6].map((i) => [i, { tur: "bolge", bolge: "mevcut" }])),
    ...Object.fromEntries([8, 9, 10, 11, 12].map((i) => [i, { tur: "bolge", bolge: "hedef" }])),
  },
  6: { 1: { tur: "bolge", bolge: "uyari-kutu" } },
  7: {
    1: { tur: "bolge", bolge: "baglam" },
    2: { tur: "akis" },
    ...Object.fromEntries([11, 13, 15].map((i, k) => [i, { ...tablo(k + 1, 0, "c"), not: "\"Başarısızlık:\" etiketi sütun başlığında" }])),
    ...Object.fromEntries([12, 14, 16].map((i, k) => [i, { ...tablo(k + 1, 1, "c"), not: "\"Tanımladığınız güvenli davranış…:\" etiketi sütun başlığında" }])),
  },
};

function plan(n, ps) {
  const out = [];
  let q = null;
  ps.forEach((p, i) => {
    const par = p.parcalar;
    const tum = norm(duzMetin(par));
    if (!tum) return;
    const k = kalinBitis(par);
    const bas = norm(duzMetin(par.slice(0, k)));
    const kalan = norm(duzMetin(par.slice(k)));
    const ozel = OZEL[n] && OZEL[n][i];
    const donustur = (d) => d === "c" ? kalan : d === "e" ? etiketAt(tum) : d === "p" ? parantezAt(kalan) : d === ":" ? tum.replace(/:\s*$/, "") : tum;
    if (i === 0) return out.push({ i, tum, tur: "belge-basligi" });
    if (ozel) return out.push({ i, tum, ...ozel, metin: donustur(ozel.donustur) });
    const m = bas.match(/^(\d+)\.\s*(.*)$/);
    if (m) {
      q = +m[1];
      // LAB 7'de soru paragrafının kalın olmayan kısmı da sorunun parçasıdır
      const soruMetni = n === 7 || !kalan ? tum.replace(/^\d+\.\s*/, "") : m[2];
      return out.push({ i, tum, tur: "soru", q, soruMetni, cevap: n === 7 ? "" : kalan });
    }
    if (!p.liste && bas && !kalan) { q = null; return out.push({ i, tum, tur: "baslik", metin: tum }); }
    if (q != null) return out.push({ i, tum, tur: "cevap", q, metin: tum });
    out.push({ i, tum, tur: "bilinmiyor", metin: tum });
  });
  return out;
}

// ---------- HTML: tarayıcıda bölgeleri ve yerleşimi oku ----------
async function htmlOku(sayfa, dosya) {
  await sayfa.goto(pathToFileURL(dosya).href, { waitUntil: "networkidle" });
  await sayfa.evaluate(() => document.fonts.ready);
  return sayfa.evaluate(() => {
    const t = (e) => (e ? e.innerText.replace(/\s+/g, " ").trim() : "");
    const B = [];
    document.querySelectorAll(".soru").forEach((s) => B.push({ ad: "Soru " + t(s.querySelector(".no")), tur: "soru", no: +t(s.querySelector(".no")), soru: t(s.querySelector(".metin")), cevap: t(s.querySelector(".cevap")), metin: t(s) }));
    document.querySelectorAll("table.tablo").forEach((tb, ti) => {
      const bas = [...tb.querySelectorAll("th")].map(t);
      tb.querySelectorAll("tbody tr").forEach((tr, ri) => B.push({ ad: `Tablo ${ti + 1} satır ${ri + 1}`, tur: "tablo", tablo: ti + 1, satir: ri + 1, hucreler: [...tr.children].map(t), basliklar: bas, metin: t(tr) }));
      if (bas.length) B.push({ ad: `Tablo ${ti + 1} başlık`, tur: "tablo-baslik", metin: bas.join(" | "), hucreler: bas });
    });
    const adlar = { kutu: ".kutu", mevcut: ".ikili .mevcut", hedef: ".ikili .hedef", baglam: ".baglam", "uyari-kutu": ".uyari-kutu", "not-satir": ".not-satir", akis: ".akis", formul: ".formul", bolum: "h2.bolum", bant: ".bant", kimlik: ".kimlik", sema: ".sema", kanit: ".kanit", kapak: ".kapak-sayfa" };
    for (const [ad, sec] of Object.entries(adlar))
      document.querySelectorAll(sec).forEach((e, k) => B.push({ ad: ad + (k ? ` ${k + 1}` : ""), tur: ad, metin: t(e), parcalar: ad === "akis" ? [...e.querySelectorAll(".k")].map(t) : null }));

    // --- yerleşim kontrolleri (yazdırma görünümü) ---
    const sorun = [];
    const ad = (e) => (e.className ? "." + String(e.className).split(" ")[0] : e.tagName.toLowerCase()) + ` "${t(e).slice(0, 35)}"`;
    const pt = 96 / 72;
    const sag = 555 * pt + 1;
    const icerik = document.querySelectorAll("body *");
    for (const e of icerik) {
      if (e.closest("svg") || e.tagName === "STYLE") continue;
      const cs = getComputedStyle(e);
      if (cs.display === "none") continue;
      if (e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0 && !["inline"].includes(cs.display) && !e.closest(".bant") && e.tagName !== "BODY" && e.tagName !== "HTML")
        sorun.push(`yatay taşma: ${ad(e)} (${e.scrollWidth}px > ${e.clientWidth}px)`);
      const r = e.getBoundingClientRect();
      if (!e.closest(".bant") && !e.closest(".kapak-sayfa") && r.width && r.right > sag) sorun.push(`sağ kenar taşması: ${ad(e)} (${(r.right / pt).toFixed(1)}pt > 555pt)`);
    }
    // metin satırlarının üst üste binmesi (farklı metin düğümleri arasında)
    const satirlar = [];
    const yurut = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let d; let no = 0;
    while ((d = yurut.nextNode())) {
      if (!d.textContent.trim() || d.parentElement.closest("style,title,svg")) continue;
      const rg = document.createRange(); rg.selectNodeContents(d);
      for (const r of rg.getClientRects()) if (r.width > 0.5 && r.height > 0.5) satirlar.push({ no, r, e: d.parentElement });
      no++;
    }
    for (let a = 0; a < satirlar.length; a++) for (let b = a + 1; b < satirlar.length; b++) {
      const x = satirlar[a], y = satirlar[b];
      if (x.no === y.no) continue;
      const w = Math.min(x.r.right, y.r.right) - Math.max(x.r.left, y.r.left);
      const h = Math.min(x.r.bottom, y.r.bottom) - Math.max(x.r.top, y.r.top);
      if (w > 1 && h > Math.min(x.r.height, y.r.height) * 0.35) sorun.push(`üst üste binen metin: ${ad(x.e)} ↔ ${ad(y.e)}`);
    }
    document.querySelectorAll(".cevap, .tablo td, .ikili li, .kutu").forEach((e) => { if (!t(e)) sorun.push(`boş alan: ${ad(e)}`); });
    // "PaketPro" geçen metin düğümleri
    const paketpro = [];
    const y2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while ((d = y2.nextNode())) if (/paketpro/i.test(d.textContent)) {
      const kap = d.parentElement.closest(".soru,.tablo td,.baglam,.kutu,.kapak-sayfa > *,.ikili > div,.uyari-kutu,.bant,.not-satir") || d.parentElement;
      const bolum = kap.closest(".soru") ? "Soru " + t(kap.closest(".soru").querySelector(".no")) + (d.parentElement.closest(".cevap") ? " cevabı" : " metni") :
        kap.matches(".tablo td") ? "tablo hücresi" : kap.matches(".baglam") ? "bağlam kutusu" : kap.matches(".kutu") ? "bilgi kutusu (" + t(kap.querySelector("h3")) + ")" : "kapak/diğer";
      paketpro.push({ metin: d.textContent.replace(/\s+/g, " ").trim(), bolum, kapsayan: t(kap) });
    }
    return { bolgeler: B, sorun: [...new Set(sorun)], paketpro };
  });
}

// ---------- PDF: metin (pdftotext) ve geometri (pdf.js) ----------
const ALT_BILGI = /SAFETY 4\.0 BOOTCAMP · [^\n]*?değildir\./g;
function pdfMetni(dosya) {
  const ham = execFileSync("pdftotext", ["-raw", "-enc", "UTF-8", dosya, "-"]).toString("utf8");
  // Föylerde otomatik heceleme yok; satır yalnızca metindeki gerçek tirelerden kırılabilir ("Fail-⏎Safe").
  // Bu yüzden tireyle biten satır sonu boşluksuz birleştirilir.
  return norm(ham.replace(/-\r?\n(?=\S)/g, "-").replace(ALT_BILGI, " ").replace(/^\s*\d+ \/ \d+\s*$/gm, " ").replace(/\f/g, " "));
}

async function pdfGeometri(dosya) {
  const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");
  const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(dosya)), isEvalSupported: false, verbosity: 0 }).promise;
  const sayfalar = [];
  for (let s = 1; s <= doc.numPages; s++) {
    const pg = await doc.getPage(s);
    const tc = await pg.getTextContent();
    const ogeler = tc.items.filter((x) => x.str.trim()).map((x) => {
      const fs_ = Math.hypot(x.transform[0], x.transform[1]);
      return { s: x.str, x: x.transform[4], y: 842 - x.transform[5], w: x.width, h: fs_ };
    });
    const sorun = [];
    const altBilgi = ogeler.filter((o) => o.y > 815);
    const kapak = ogeler.some((o) => /INSPECCO/.test(o.s.replace(/\s/g, "")));
    if (!kapak) {
      for (const o of ogeler) {
        if (o.x < 38 || o.x + o.w > 557.5) sorun.push(`kenar taşması: "${o.s.slice(0, 30)}" (x=${o.x.toFixed(1)}–${(o.x + o.w).toFixed(1)}pt)`);
        if (o.y > 806 && o.y < 815) sorun.push(`alt bilgi bölgesine taşma: "${o.s.slice(0, 30)}" (y=${o.y.toFixed(1)}pt)`);
      }
      if (!altBilgi.some((o) => /SAFETY 4\.0/.test(o.s))) sorun.push("alt bilgi satırı yok");
      if (ogeler.filter((o) => o.y <= 806).length === 0) sorun.push("boş sayfa (yalnızca alt bilgi)");
    }
    for (let a = 0; a < ogeler.length; a++) for (let b = a + 1; b < ogeler.length; b++) {
      const p = ogeler[a], r = ogeler[b];
      const w = Math.min(p.x + p.w, r.x + r.w) - Math.max(p.x, r.x);
      const h = Math.min(p.y + p.h * 0.2, r.y + r.h * 0.2) - Math.max(p.y - p.h * 0.75, r.y - r.h * 0.75);
      if (w > 1.5 && h > Math.min(p.h, r.h) * 0.45) sorun.push(`üst üste binen metin: "${p.s.slice(0, 25)}" ↔ "${r.s.slice(0, 25)}"`);
    }
    const no = (altBilgi.find((o) => /^\d+ \/ \d+$/.test(o.s.trim())) || {}).s;
    sayfalar.push({ sayfa: s, kapak, no: no ? no.trim() : null, sorun: [...new Set(sorun)] });
  }
  return sayfalar;
}

async function sayfaGorselleri(tarayici, dosya) {
  fs.mkdirSync(SAYFA_DIZINI, { recursive: true });
  for (const f of fs.readdirSync(SAYFA_DIZINI)) if (f.endsWith(".png")) fs.unlinkSync(path.join(SAYFA_DIZINI, f));
  const pdfjsYol = pathToFileURL(path.join(__dirname, "node_modules/pdfjs-dist/legacy/build/pdf.js")).href;
  const html = path.join(SAYFA_DIZINI, "gorsel.html");
  fs.writeFileSync(html, `<!doctype html><meta charset=utf-8><script src="${pdfjsYol}"></script>`);
  const sayfa = await tarayici.newPage();
  await sayfa.goto(pathToFileURL(html).href);
  const veri = fs.readFileSync(dosya).toString("base64");
  const resimler = await sayfa.evaluate(async ({ veri, isci }) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = isci;
    const b = Uint8Array.from(atob(veri), (c) => c.charCodeAt(0));
    const doc = await pdfjsLib.getDocument({ data: b, isEvalSupported: false }).promise;
    const out = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const pg = await doc.getPage(i);
      const v = pg.getViewport({ scale: 2 });
      const c = document.createElement("canvas"); c.width = v.width; c.height = v.height;
      await pg.render({ canvasContext: c.getContext("2d"), viewport: v }).promise;
      out.push(c.toDataURL("image/png").split(",")[1]);
    }
    return out;
  }, { veri, isci: pdfjsYol.replace("pdf.js", "pdf.worker.js") });
  resimler.forEach((r, i) => fs.writeFileSync(path.join(SAYFA_DIZINI, `sayfa-${String(i + 1).padStart(2, "0")}.png`), Buffer.from(r, "base64")));
  await sayfa.close();
  return resimler.length;
}

// ---------- ana akış ----------
(async () => {
  const tarayici = await chromium.launch({ executablePath: CHROME, args: ["--allow-file-access-from-files"] });
  const sayfa = await tarayici.newPage({ viewport: { width: 794, height: 1123 } });
  await sayfa.emulateMedia({ media: "print" });

  const birlesikMetin = fs.existsSync(BIRLESIK) ? pdfMetni(BIRLESIK) : "";
  const satirlar = [];
  const yaz = (s = "") => satirlar.push(s);
  const ozet = [];
  const paketproTum = [];

  // Kapak
  const kapakHtml = await htmlOku(sayfa, path.join(FOYLER, "00_kapak", "KAPAK.html"));
  kapakHtml.paketpro.forEach((p) => paketproTum.push({ foy: "Kapak", ...p, kaynak: "şablon metni" }));

  const labBolumleri = [];
  for (let n = 1; n <= 7; n++) {
    const ps = paragraflar(path.join(KOK, "Paketleme", `LABORATUVAR ${n}.docx`));
    const wordMetinleri = ps.map((p) => norm(duzMetin(p.parcalar)));
    const html = await htmlOku(sayfa, path.join(FOYLER, `0${n}_LAB${n}`, `LAB${n}.html`));
    const pdf = pdfMetni(path.join(FOYLER, `0${n}_LAB${n}`, `LAB${n}.pdf`));
    const B = html.bolgeler;
    const icinde = (metin) => B.filter((b) => norm(b.metin).includes(metin)).map((b) => b.ad);
    const farklar = [];
    const tabloSatir = [];
    const plani = plan(n, ps);

    for (const p of plani) {
      let beklenen = "", bulunan = "", htmlOk = true, pdfOk = true, aciklama = p.not || "";
      const pdfVar = (m) => pdf.includes(m) && (!birlesikMetin || birlesikMetin.includes(m));
      if (p.tur === "belge-basligi") { beklenen = "—"; bulunan = "—"; aciklama = "Word belge başlığı; föyde şablonun başlık bandı var"; htmlOk = pdfOk = null; }
      else if (p.tur === "yapisal") { beklenen = "—"; bulunan = "—"; aciklama = aciklama || "Word'deki ara başlık; föyde karşılığı şablon başlığı/tablo"; htmlOk = pdfOk = null; }
      else if (p.tur === "baslik" || p.tur === "tablo-baslik") {
        beklenen = p.tur === "baslik" ? "şablon başlığı" : "tablo sütun başlığı";
        const k = kucuk(p.metin);
        const b = B.find((x) => kucuk(x.metin).includes(k));
        bulunan = b ? b.ad : "YOK"; htmlOk = !!b; pdfOk = kucuk(pdf).includes(k);
        if (b && !norm(b.metin).includes(norm(p.metin))) aciklama = "yalnızca büyük/küçük harf farkı (şablon yazımı korundu)";
      } else if (p.tur === "soru") {
        beklenen = `Soru ${p.q}`;
        const b = B.find((x) => x.tur === "soru" && x.no === p.q);
        const soruOk = b && norm(b.soru) === norm(p.soruMetni);
        const cevapOk = !p.cevap || (b && norm(b.cevap).includes(p.cevap));
        const baska = p.cevap ? B.filter((x) => x.tur === "soru" && x.no !== p.q && norm(x.cevap).includes(p.cevap)).map((x) => x.ad) : [];
        bulunan = b ? b.ad + (baska.length ? ` (+${baska.join(", ")})` : "") : "YOK";
        htmlOk = !!(soruOk && cevapOk && !baska.length);
        pdfOk = pdfVar(norm(p.soruMetni)) && (!p.cevap || pdfVar(p.cevap));
        aciklama = [soruOk ? "soru metni Word ile aynı" : "SORU METNİ FARKLI", p.cevap ? (cevapOk ? "cevap aynı" : "CEVAP BULUNAMADI") : ""].filter(Boolean).join("; ");
        tabloSatir.push({ q: p.q, wordSoru: p.i, cevaplar: p.cevap ? [p.i] : [] });
      } else if (p.tur === "cevap") {
        beklenen = `Soru ${p.q}`;
        const yer = B.filter((x) => x.tur === "soru" && norm(x.cevap).includes(p.metin)).map((x) => x.ad);
        bulunan = yer.join(", ") || "YOK";
        htmlOk = yer.length === 1 && yer[0] === beklenen;
        pdfOk = pdfVar(p.metin);
        const ts = tabloSatir.find((x) => x.q === p.q); if (ts) ts.cevaplar.push(p.i);
      } else if (p.tur === "tablo") {
        const b = B.find((x) => x.tur === "tablo" && x.tablo === p.tablo && x.satir === p.satir);
        const hucre = b ? norm(b.hucreler[p.sutun] || "") : "";
        beklenen = `Tablo satır ${p.satir}, sütun "${b ? b.basliklar[p.sutun] || p.sutun + 1 : p.sutun + 1}"`;
        htmlOk = p.deger ? hucre === p.metin : hucre.includes(p.metin);
        bulunan = htmlOk ? beklenen : `"${kisa(hucre, 40)}"`;
        pdfOk = pdfVar(p.metin);
      } else if (p.tur === "bolge") {
        beklenen = p.bolge;
        const yer = icinde(p.metin);
        bulunan = yer.join(", ") || "YOK"; htmlOk = yer.some((y) => y.startsWith(p.bolge)); pdfOk = pdfVar(p.metin);
      } else if (p.tur === "akis") {
        const i = p.tum.indexOf("(Akış:");
        const once = norm(p.tum.slice(0, i));
        const parca = p.tum.slice(i + 6).replace(/\)\s*$/, "").split("→").map((s) => norm(s));
        const akis = B.find((x) => x.tur === "akis");
        beklenen = "not-satir + akış şeması";
        htmlOk = icinde(once).some((y) => y.startsWith("not-satir")) && !!akis && parca.every((x, k) => norm(akis.parcalar[k] || "") === x);
        bulunan = htmlOk ? beklenen : "FARKLI";
        pdfOk = pdfVar(once) && parca.every((x) => pdfVar(x));
        aciklama = "akış kutuları: " + parca.join(" | ");
      } else { beklenen = "?"; const yer = icinde(p.metin); bulunan = yer.join(", ") || "YOK"; htmlOk = yer.length > 0; pdfOk = pdfVar(p.metin); }
      if (htmlOk === false) farklar.push(`P${p.i}: HTML'de beklenen yerde değil (${beklenen} ↔ ${bulunan})`);
      if (pdfOk === false) farklar.push(`P${p.i}: PDF metninde bulunamadı`);
      p.sonuc = { beklenen, bulunan, htmlOk, pdfOk, aciklama };
    }

    // Soru–cevap eşleşme tablosu (föy tarafından)
    const eslesme = B.filter((x) => x.tur === "soru").map((b) => {
      const ts = tabloSatir.find((x) => x.q === b.no);
      const sorular = plani.filter((p) => p.tur === "soru" && p.q === b.no);
      const cevaplar = plani.filter((p) => (p.tur === "cevap" && p.q === b.no) || (p.tur === "soru" && p.q === b.no && p.cevap));
      const tamam = sorular.length === 1 && sorular[0].sonuc.htmlOk && cevaplar.every((p) => p.sonuc.htmlOk);
      return { no: b.no, soru: b.soru, wordSoru: sorular.map((p) => "P" + p.i).join(", ") || "YOK", cevaplar: cevaplar.map((p) => "P" + p.i).join(", ") || "—", tamam, ts };
    });
    eslesme.forEach((e) => { if (!e.tamam) farklar.push(`Soru ${e.no}: soru–cevap eşleşmesi hatalı`); });

    // LAB 3 değerleri
    let degerler = null;
    if (n === 3) {
      degerler = plani.filter((p) => p.tur === "tablo" && p.deger).map((p) => {
        const b = B.find((x) => x.tur === "tablo" && x.satir === p.satir);
        return { senaryo: p.satir, alan: b.basliklar[p.sutun], word: p.metin, html: norm(b.hucreler[p.sutun]), ok: p.sonuc.htmlOk, pdf: p.sonuc.pdfOk };
      });
    }

    html.sorun.forEach((s) => farklar.push("Yerleşim (HTML): " + s));
    html.paketpro.forEach((p) => {
      const kaynak = wordMetinleri.some((w) => w.includes(norm(p.metin))) ? "Word cevabı" : "şablon metni";
      paketproTum.push({ foy: `LAB ${n}`, ...p, kaynak });
    });
    labBolumleri.push({ n, plani, eslesme, degerler, farklar, sorunHtml: html.sorun });
  }

  // PDF geometri + görseller
  const geo = fs.existsSync(BIRLESIK) ? await pdfGeometri(BIRLESIK) : [];
  const gorselSayisi = fs.existsSync(BIRLESIK) ? await sayfaGorselleri(tarayici, BIRLESIK) : 0;
  await tarayici.close();
  const toplam = geo.length;
  const numaraSorun = geo.filter((g) => !g.kapak).filter((g) => g.no !== `${g.sayfa} / ${toplam}`).map((g) => `sayfa ${g.sayfa}: alt bilgide "${g.no}" yazıyor, "${g.sayfa} / ${toplam}" olmalı`);
  // sayfaları föylere dağıt
  let s = 1;
  const sayfaFoy = {};
  const sayfaSayisi = (f) => { try { return (execFileSync("pdfinfo", [f]).toString().match(/Pages:\s+(\d+)/) || [])[1]; } catch { return null; } };
  for (const [foy, dosya] of [["Kapak", "00_kapak/KAPAK.pdf"], ...[1, 2, 3, 4, 5, 6, 7].map((n) => [`LAB ${n}`, `0${n}_LAB${n}/LAB${n}.pdf`])]) {
    const adet = +(sayfaSayisi(path.join(FOYLER, dosya)) || 0) || null;
    sayfaFoy[foy] = adet ? Array.from({ length: adet }, (_, k) => s + k) : [];
    s += adet || 0;
  }
  for (const L of labBolumleri) for (const sy of sayfaFoy[`LAB ${L.n}`] || []) {
    const g = geo.find((x) => x.sayfa === sy);
    if (g) g.sorun.forEach((m) => L.farklar.push(`Yerleşim (PDF s.${sy}): ${m}`));
  }

  // ---------- rapor ----------
  const tarih = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
  yaz("# Doğrulama Raporu — Baykal APHS Laboratuvar Föyleri");
  yaz();
  yaz(`Oluşturma: ${tarih} · Betik: \`araclar/tam-dogrula.js\``);
  yaz();
  yaz("Kaynak: `Paketleme/LABORATUVAR 1–7.docx` → föy HTML'leri (`foyler/0x_LABx/LABx.html`) → PDF'ler (tek tek ve `Baykal_APHS_Lab_Foyleri.pdf`).");
  yaz("Karşılaştırmada kalın yazı, boşluk/satır sonu ve ➔/→ farkları normalize edilir. Word'de LaTeX olarak kalan `$2 \\times 3 \\times 2 = 12$` ifadeleri `2 × 3 × 2 = 12` kabul edilir.");
  yaz("Word dosyalarında tablo yoktur; tüm içerik paragraf/madde olarak okunur.");
  yaz();
  yaz("## Özet");
  yaz();
  yaz("| Föy | Word paragrafı | HTML | PDF metni | Soru–cevap | Yerleşim | Sonuç |");
  yaz("|---|---|---|---|---|---|---|");
  for (const L of labBolumleri) {
    const kontrol = L.plani.filter((p) => p.sonuc.htmlOk !== null);
    const h = kontrol.filter((p) => p.sonuc.htmlOk).length, pd = kontrol.filter((p) => p.sonuc.pdfOk).length;
    const sc = L.eslesme.filter((e) => e.tamam).length;
    const yer = L.farklar.filter((f) => f.startsWith("Yerleşim")).length;
    const sonuc = L.farklar.length ? `**fark var** (${L.farklar.length})` : "**birebir aynı**";
    yaz(`| LAB ${L.n} | ${L.plani.length} (${kontrol.length} kontrol edildi) | ${h}/${kontrol.length} | ${pd}/${kontrol.length} | ${sc}/${L.eslesme.length} | ${yer ? yer + " sorun" : "sorun yok"} | ${sonuc} |`);
  }
  yaz();
  yaz(`Birleşik PDF: ${toplam} sayfa; sayfa numaraları ${numaraSorun.length ? "**hatalı**: " + numaraSorun.join("; ") : "1–" + toplam + " sıralı ve doğru"}. ` +
      `Sayfa görüntüleri: ${gorselSayisi} adet (\`araclar/.sayfalar/\`, repoya eklenmez).`);
  const kapakGeo = geo.filter((g) => g.kapak).flatMap((g) => g.sorun);
  if (kapakGeo.length || kapakHtml.sorun.length) yaz(`Kapak yerleşim sorunları: ${[...kapakHtml.sorun, ...kapakGeo].join("; ")}`);
  else yaz("Kapak: yerleşim sorunu yok.");
  yaz();

  yaz("## \"PaketPro\" geçen yerler");
  yaz();
  yaz("| Föy | Yer | Metin | Kaynak |");
  yaz("|---|---|---|---|");
  for (const p of paketproTum) yaz(`| ${p.foy} | ${p.bolum} | ${kisa(p.metin, 90)} | ${p.kaynak} |`);
  yaz();

  for (const L of labBolumleri) {
    yaz(`## LAB ${L.n} — ${L.farklar.length ? "fark var" : "birebir aynı"}`);
    yaz();
    if (L.farklar.length) { for (const f of L.farklar) yaz(`- ${f}`); yaz(); }
    yaz("### Soru–cevap eşleşmesi");
    yaz();
    yaz("| Föy sorusu | Föydeki soru metni | Word soru paragrafı | Word cevap paragrafları | Durum |");
    yaz("|---|---|---|---|---|");
    for (const e of L.eslesme) yaz(`| ${e.no} | ${kisa(e.soru, 60)} | ${e.wordSoru} | ${e.cevaplar} | ${e.tamam ? "✔ doğru soruda" : "✘"} |`);
    yaz();
    if (L.degerler) {
      yaz("### Risk tablosu değerleri (Word ↔ föy)");
      yaz();
      yaz("| Senaryo | Alan | Word | Föy (HTML) | HTML | PDF |");
      yaz("|---|---|---|---|---|---|");
      for (const d of L.degerler) yaz(`| ${d.senaryo} | ${d.alan} | ${kisa(d.word, 60)} | ${kisa(d.html, 60)} | ${d.ok ? "✔" : "✘"} | ${d.pdf ? "✔" : "✘"} |`);
      yaz();
    }
    yaz("### Paragraf paragraf karşılaştırma");
    yaz();
    yaz("| Word P | Word metni | Beklenen yer | Bulunan yer | HTML | PDF | Not |");
    yaz("|---|---|---|---|---|---|---|");
    const isaret = (v) => (v === null ? "—" : v ? "✔" : "✘");
    for (const p of L.plani) yaz(`| ${p.i} | ${kisa(p.tum, 55)} | ${p.sonuc.beklenen} | ${p.sonuc.bulunan} | ${isaret(p.sonuc.htmlOk)} | ${isaret(p.sonuc.pdfOk)} | ${p.sonuc.aciklama} |`);
    yaz();
    const sayfalar = sayfaFoy[`LAB ${L.n}`] || [];
    yaz(`PDF sayfaları (birleşik): ${sayfalar.join(", ") || "—"}`);
    yaz();
  }

  const gorselNot = path.join(__dirname, "gorsel-inceleme.md");
  if (fs.existsSync(gorselNot)) { yaz(fs.readFileSync(gorselNot, "utf8").trim()); yaz(); }
  yaz("---");
  yaz("*Bu bir eğitim çıktısıdır, resmî denetim değildir.*");
  fs.writeFileSync(RAPOR, satirlar.join("\n") + "\n");

  const farkSayisi = labBolumleri.reduce((t, L) => t + L.farklar.length, 0) + numaraSorun.length;
  console.log(`Rapor: ${path.relative(KOK, RAPOR)}  ·  ${farkSayisi ? farkSayisi + " fark" : "tüm föyler birebir aynı"}  ·  ${gorselSayisi} sayfa görüntüsü`);
  for (const L of labBolumleri) console.log(`  LAB ${L.n}: ${L.farklar.length ? "fark var\n    - " + L.farklar.join("\n    - ") : "birebir aynı"}`);
  if (numaraSorun.length) console.log("  " + numaraSorun.join("\n  "));
  process.exitCode = farkSayisi ? 1 : 0;
})().catch((e) => { console.error(e); process.exit(2); });

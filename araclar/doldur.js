// Föy HTML'indeki {{P<n>...}} yer tutucularını Word paragraflarıyla AYNEN doldurur.
//   node doldur.js 2   → foyler/02_LAB2/LAB2.html içindeki yer tutucular
// Yer tutucular (n = Word'deki paragraf sırası, 0'dan başlar):
//   {{Pn}}    paragrafın tamamı
//   {{Pn:c}}  baştaki kalın kısım (soru/etiket) atılmış hali → cevap
//   {{Pn:s}}  yalnızca baştaki kalın kısım, numarası ("1. ") atılmış → soru metni
//   {{Pn:q}}  paragrafın tamamı, baştaki numara atılmış → soru metni (kalın kısımlarıyla)
//   {{Pn:e}}  ilk "Etiket: " kısmı atılmış hali (ör. "Seçiminiz + Nedeni: ")
//   {{Pn:p}}  cevap kısmının dış parantezi ve "Etiket: " kısmı atılmış hali
//   {{Pn:o=METİN}}  paragrafın METİN'den önceki kısmı
// Metin hiçbir şekilde yeniden yazılmaz; yalnızca kesilir. Tek dönüşüm: Word'de
// LaTeX olarak kalmış "$2 \times 3 \times 2 = 12$" ifadeleri "2 × 3 × 2 = 12" olarak gösterilir.
const fs = require("fs");
const path = require("path");
const { paragraflar, html, duzMetin, kacis } = require("./word.js");

const KOK = path.resolve(__dirname, "..");

// Parçalardan baştaki n karakteri at
function bastanAt(parcalar, n) {
  const out = [];
  for (const x of parcalar) {
    if (n >= x.t.length) { n -= x.t.length; continue; }
    out.push({ t: x.t.slice(n), b: x.b });
    n = 0;
  }
  return out;
}
// Parçaların ilk n karakterini al
function bastanAl(parcalar, n) {
  const out = [];
  for (const x of parcalar) {
    if (n <= 0) break;
    out.push({ t: x.t.slice(0, n), b: x.b });
    n -= x.t.length;
  }
  return out;
}
const kalinBitis = (p) => {
  let k = 0;
  while (k < p.length && (p[k].b || !p[k].t.trim())) k++;
  return k;
};
const latex = (s) => s.replace(/\$([^$]+)\$/g, (_, ic) => ic.replace(/\\times/g, "×").trim());
const temiz = (s) => latex(s).trim();

function uygula(p, islem) {
  const par = p.parcalar;
  if (!islem) return temiz(html(par));
  if (islem === "c") return temiz(html(par.slice(kalinBitis(par))));
  if (islem === "s") return kacis(duzMetin(par.slice(0, kalinBitis(par))).trim().replace(/^\d+\.\s*/, ""));
  if (islem === "q") {
    const m = duzMetin(par).match(/^\s*\d+\.\s*/);
    return temiz(html(m ? bastanAt(par, m[0].length) : par));
  }
  if (islem === "e") {
    const m = duzMetin(par).match(/^[^:]*?:\s*/);
    return temiz(html(m ? bastanAt(par, m[0].length) : par));
  }
  if (islem === "p") {
    let cev = par.slice(kalinBitis(par));
    let t = duzMetin(cev);
    const bas = t.match(/^\s*\(\s*[^:]*?:\s*/);
    cev = bastanAt(cev, bas[0].length);
    t = duzMetin(cev);
    const son = t.match(/\)\s*$/);
    return temiz(html(bastanAl(cev, t.length - son[0].length)));
  }
  if (islem.startsWith("o=")) {
    const i = duzMetin(par).indexOf(islem.slice(2));
    if (i < 0) throw new Error("bulunamadı: " + islem);
    return temiz(html(bastanAl(par, i)));
  }
  throw new Error("bilinmeyen işlem: " + islem);
}

for (const n of process.argv.slice(2)) {
  const docx = path.join(KOK, "Paketleme", `LABORATUVAR ${n}.docx`);
  const dosya = path.join(KOK, "foyler", `0${n}_LAB${n}`, `LAB${n}.html`);
  const ps = paragraflar(docx);
  let h = fs.readFileSync(dosya, "utf8");
  let sayac = 0;
  h = h.replace(/\{\{P(\d+)(?::([^}]+))?\}\}/g, (_, i, islem) => {
    sayac++;
    if (!ps[+i]) throw new Error(`LAB ${n}: P${i} yok`);
    return uygula(ps[+i], islem);
  });
  fs.writeFileSync(dosya, h);
  console.log(`LAB ${n}: ${sayac} yer tutucu dolduruldu`);
}

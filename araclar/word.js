// Word (.docx) dosyasından paragrafları biçim (kalın) bilgisiyle okur.
// Harici bağımlılık yok: docx bir zip arşividir, word/document.xml açılır.
const fs = require("fs");
const zlib = require("zlib");

function zipOku(buf, ad) {
  const imza = Buffer.from([0x50, 0x4b, 3, 4]);
  let i = 0;
  while ((i = buf.indexOf(imza, i)) >= 0) {
    const yontem = buf.readUInt16LE(i + 8);
    const boy = buf.readUInt32LE(i + 18);
    const adBoy = buf.readUInt16LE(i + 26);
    const ekBoy = buf.readUInt16LE(i + 28);
    const dosya = buf.toString("utf8", i + 30, i + 30 + adBoy);
    const bas = i + 30 + adBoy + ekBoy;
    if (dosya === ad) {
      const veri = buf.subarray(bas, bas + boy);
      return (yontem === 8 ? zlib.inflateRawSync(veri) : veri).toString("utf8");
    }
    i = bas;
  }
  throw new Error(ad + " bulunamadı");
}

const varlik = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
   .replace(/&apos;/g, "'").replace(/&amp;/g, "&");

// Her paragraf: { liste: bool, parcalar: [{ t: metin, b: kalın mı }] }
function paragraflar(dosyaYolu) {
  const xml = zipOku(fs.readFileSync(dosyaYolu), "word/document.xml");
  const govde = xml.split("<w:body>")[1];
  const sonuc = [];
  for (const p of govde.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)) {
    const parcalar = [];
    for (const r of p[0].matchAll(/<w:r[ >][\s\S]*?<\/w:r>/g)) {
      const kalin = /<w:b\/>|<w:b w:val="(1|true)"\/>/.test(r[0]);
      let t = "";
      for (const x of r[0].matchAll(/<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:br\/>/g))
        t += x[1] !== undefined ? varlik(x[1]) : x[0] === "<w:tab/>" ? "\t" : "\n";
      if (t) parcalar.push({ t, b: kalin });
    }
    sonuc.push({ liste: /<w:numPr>/.test(p[0]), parcalar });
  }
  return sonuc;
}

const duzMetin = (parcalar) => parcalar.map((x) => x.t).join("");

const kacis = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Parçaları HTML'e çevirir; kalın parçalar <b> olur. Metin aynen korunur.
function html(parcalar) {
  let out = "";
  for (const x of parcalar) out += x.b && x.t.trim() ? "<b>" + kacis(x.t) + "</b>" : kacis(x.t);
  return out.replace(/<\/b>(\s*)<b>/g, "$1");
}

module.exports = { paragraflar, duzMetin, html, kacis };

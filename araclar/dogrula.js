// Word'deki cevap metinlerinin föy HTML'inde HARFİ HARFİNE bulunduğunu doğrular.
//   node dogrula.js 1      → LAB 1
//   node dogrula.js 1 2 3  → birden fazla lab
// Her Word paragrafı için: paragrafın tamamı ya da baştaki kalın (soru/etiket)
// kısmı atılmış hali HTML metninde aynen geçmelidir. Geçmeyenler listelenir;
// bunlar yalnızca şablonda zaten bulunan başlık/soru satırları olmalıdır.
const fs = require("fs");
const path = require("path");
const { paragraflar, duzMetin } = require("./word.js");

const KOK = path.resolve(__dirname, "..");
const bosluk = (s) => s.replace(/\s+/g, " ").trim();

function htmlMetni(html) {
  return bosluk(
    html.replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  );
}

let hata = 0;
for (const n of process.argv.slice(2)) {
  const docx = path.join(KOK, "Paketleme", `LABORATUVAR ${n}.docx`);
  const html = path.join(KOK, "foyler", `0${n}_LAB${n}`, `LAB${n}.html`);
  const metin = htmlMetni(fs.readFileSync(html, "utf8"));
  console.log(`\n=== LAB ${n} ===`);
  paragraflar(docx).forEach((p, i) => {
    const tum = bosluk(duzMetin(p.parcalar));
    if (!tum) return;
    let k = 0;
    while (k < p.parcalar.length && (p.parcalar[k].b || !p.parcalar[k].t.trim())) k++;
    const kalan = bosluk(duzMetin(p.parcalar.slice(k)));
    if (metin.includes(tum)) return console.log(`  ✔ ${i} (tamamı)`);
    if (kalan && metin.includes(kalan)) return console.log(`  ✔ ${i} (cevap kısmı)`);
    hata++;
    console.log(`  ✘ ${i} BULUNAMADI: ${tum.slice(0, 110)}`);
  });
}
console.log(hata ? `\n${hata} paragraf HTML'de yok — yukarıdakilerin yalnızca başlık/soru olduğunu kontrol edin.` : "\nTüm paragraflar aynen bulundu.");

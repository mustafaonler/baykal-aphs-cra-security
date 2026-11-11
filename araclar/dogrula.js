// Word'deki metinlerin föy HTML'inde HARFİ HARFİNE bulunduğunu doğrular.
//   node dogrula.js 1 2 3 4 5 6 7
// Her Word paragrafı için sırayla denenir:
//   ✔ tamamı          paragrafın tamamı HTML'de aynen var
//   ✔ cevap kısmı     baştaki kalın soru/etiket atılınca kalan metin aynen var
//   ✔ etiket atıldı   "Etiket: " (tablo sütun başlığıyla aynı) atılınca kalan metin aynen var
//   ✔ kutu içinde     "(Etiket: ...)" parantezi ve etiketi atılınca kalan metin aynen var
//   ✔ akış şeması     metin + "Akış:" parçaları şema kutularında aynen var
//   ℹ başlık          şablonda zaten bulunan bölüm/sütun başlığı (büyük-küçük harf ve ➔/→ farkı hariç)
// Ayrıca numaralı sorular için Word'deki soru metninin HTML'de aynen geçtiği kontrol edilir.
const fs = require("fs");
const path = require("path");
const { paragraflar, duzMetin } = require("./word.js");

const KOK = path.resolve(__dirname, "..");
const bosluk = (s) => s.replace(/\s+/g, " ").trim();
const latex = (s) => s.replace(/\$([^$]+)\$/g, (_, ic) => ic.replace(/\\times/g, "×").trim());
const norm = (s) => bosluk(latex(s));
const baslikNorm = (s) => bosluk(s).toLocaleLowerCase("tr").replace(/➔/g, "→").replace(/[:\s]+$/, "");

function htmlMetni(html) {
  return bosluk(
    html.replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<title[\s\S]*?<\/title>/g, " ")
      .replace(/<\/(li|p|td|th|div|span|h\d)>/g, " $&").replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  );
}

// Word'de yalnızca düzen için bulunan, föyde karşılığı şablon başlıkları olan satırlar
const YAPISAL = ["Tablo İçeriği (3 Senaryo):", "Soruların Cevapları:", "Senaryo (kim ➔ kapı ➔ ne yapar ➔ zincir xf fiziksel sonuç):"];

let hata = 0;
for (const n of process.argv.slice(2)) {
  const docx = path.join(KOK, "Paketleme", `LABORATUVAR ${n}.docx`);
  const html = path.join(KOK, "foyler", `0${n}_LAB${n}`, `LAB${n}.html`);
  const ham = fs.readFileSync(html, "utf8");
  if (/\{\{P\d+/.test(ham)) { console.log(`LAB ${n}: doldurulmamış yer tutucu var!`); hata++; }
  const metin = htmlMetni(ham);
  const kucuk = baslikNorm(metin);
  console.log(`\n=== LAB ${n} ===`);
  paragraflar(docx).forEach((p, i) => {
    const tum = norm(duzMetin(p.parcalar));
    if (!tum) return;
    let k = 0;
    while (k < p.parcalar.length && (p.parcalar[k].b || !p.parcalar[k].t.trim())) k++;
    const bas = norm(duzMetin(p.parcalar.slice(0, k)));
    const kalan = norm(duzMetin(p.parcalar.slice(k)));
    const soru = /^\d+\.\s/.test(bas) ? bas.replace(/^\d+\.\s*/, "") : null;
    const soruNotu = soru ? (metin.includes(soru) ? "  [soru metni Word ile aynı]" : "  [!! soru metni Word'den farklı]") : "";
    if (soru && !metin.includes(soru)) hata++;

    if (i === 0 && /^LABORATUVAR \d/.test(tum)) return console.log(`  – ${i} belge başlığı föye konmadı (yerine şablon başlık bandı): ${tum.slice(0, 100)}`);
    if (YAPISAL.includes(tum)) return console.log(`  – ${i} Word'deki ara başlık/tekrar etiket föye konmadı: ${tum}`);
    if (metin.includes(tum)) return console.log(`  ✔ ${i} tamamı${soruNotu}`);
    if (soru && !kalan && metin.includes(soru)) return console.log(`  ✔ ${i} soru${soruNotu}`);
    if (kalan && metin.includes(kalan)) return console.log(`  ✔ ${i} cevap kısmı${soruNotu}`);
    const etiketsiz = tum.replace(/^[^:]*?:\s*/, "");
    if (etiketsiz !== tum && etiketsiz && metin.includes(etiketsiz)) return console.log(`  ✔ ${i} etiket atıldı ("${tum.slice(0, tum.length - etiketsiz.length).trim()}")`);
    const parantezsiz = kalan.replace(/^\(\s*[^:]*?:\s*/, "").replace(/\)\s*$/, "");
    if (parantezsiz !== kalan && metin.includes(parantezsiz)) return console.log(`  ✔ ${i} kutu içinde (parantez ve "${kalan.match(/^\(\s*([^:]*?):/)[1]}:" etiketi kutu başlığı oldu)`);
    const akis = tum.indexOf("(Akış:");
    if (akis > 0) {
      const once = tum.slice(0, akis).trim();
      const parcalar = tum.slice(akis + 6).replace(/\)\s*$/, "").split("➔").map((s) => s.trim());
      if (metin.includes(once) && parcalar.every((x) => metin.includes(x)))
        return console.log(`  ✔ ${i} metin + akış şeması kutuları (${parcalar.join(" | ")})`);
    }
    if (soru && soruNotu.includes("aynı") && !kalan) return console.log(`  ✔ ${i} soru${soruNotu}`);
    if (kucuk.includes(baslikNorm(tum)) || (bas && kucuk.includes(baslikNorm(bas))))
      return console.log(`  ℹ ${i} başlık (şablonda var): ${tum.slice(0, 90)}`);
    hata++;
    console.log(`  ✘ ${i} BULUNAMADI: ${tum.slice(0, 120)}`);
  });
}
console.log(hata ? `\n${hata} sorun var — ✘/!! satırlarını inceleyin.` : "\nTüm Word metinleri föylerde aynen bulundu.");

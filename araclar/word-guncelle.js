// Word (.docx) cevap paragraflarını günceller; soru/etiket kısmına ve diğer paragraflara dokunmaz.
//   node word-guncelle.js            → değişiklikleri uygular, eski/yeni karşılaştırmasını yazdırır
//   node word-guncelle.js --kuru     → yalnızca karşılaştırmayı gösterir, dosyaya yazmaz
// Her değişiklikte paragrafın baştaki "korunan" kısmı (kalın soru metni ya da etiket) aynen kalır;
// ondan sonraki tüm run'lar silinip yerine verilen metin tek, biçimsiz (normal) run olarak yazılır.
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const { paragraflar, duzMetin } = require("./word.js");

const KOK = path.resolve(__dirname, "..");

// korunan: "kalin" → baştaki kalın soru metni; { metin: "..." } → paragrafın bu metne kadar olan kısmı
const DEGISIKLIKLER = {
  "LABORATUVAR 1.docx": [
    { p: 0, korunan: "kalin", yeni: " Baykal Makina / APHS Abkant Pres - Siber Güvenlik ve Ağ Koruma Mimarisi" },
    { p: 1, korunan: "kalin", yeni: " Baykal APHS abkant preste temel tehlike, tonlarca kuvvetle aşağı inen hidrolik üst çene (koç) ile alt kalıp arasındaki kapanma bölgesidir. İnsan (operatör), sac levhayı kalıba yerleştirirken veya büküm sırasında levhayı tutarken ellerinin ve parmaklarının üst çene ile kalıp arasında ezilmesi ya da kopması tehlikesiyle karşı karşıyadır. Ayrıca büküm anında sac levhanın yukarı doğru savrulması ve CNC arka dayama eksenlerinin (X, R, Z) hareketi de çarpma ve sıkışma riski oluşturur." },
    { p: 2, korunan: "kalin", yeni: " Emniyet fonksiyonu, operatörün eli üst çene ile kalıp arasındaki tehlikeli bölgedeyken üst çenenin inmesini engelleyen veya inişi anında durduran \"Işık bariyeri + çift el kumandası → Safety PLC → STO / hidrolik emniyet valfi\" koruma zinciridir." },
    { p: 3, korunan: "kalin", yeni: " Şemadaki alt satırda yer alan \"SAFETY YOLU - koruma - AYRI\" etiketli hattın tamamıdır. İzlediği yol sırasıyla şöyledir: [Işık bariyeri + çift el] → [Safety PLC] → [STO / Emniyet valfi] → [Safe State]" },
    { p: 4, korunan: "kalin", yeni: " Normal PLC, abkant presin büküm programlarını, üst çenenin iniş hızını ve basıncını, CNC arka dayama eksenlerinin konumlandırılmasını ve normal çalışma komutlarını yönetir. Safety PLC ise yalnızca insan güvenliğinden (ışık bariyeri ve çift el kumandasından gelen sinyallerden) sorumludur. En önemli fark, Safety PLC'nin yedekli (redundant) mimariye sahip olması ve kendi iç teşhisini (self-diagnostic) yaparak arıza anında sistemi güvenli duruma geçirmesidir." },
    { p: 5, korunan: "kalin", yeni: " PLr veya SIL, emniyet fonksiyonunun ne kadar güvenilir olması gerektiğini belirten uluslararası standartlardır (PL için ISO 13849-1, SIL için IEC 62061). Abkant preslerde üst çenenin el ve parmakları ezme veya koparma riski çok yüksek olduğu için bu fonksiyon genellikle en yüksek seviyede (PLr e) tasarlanır; böylece elektronik veya yazılımsal bir arıza durumunda dahi emniyetin devre dışı kalmaması garanti edilir. Bu hayati önem taşır." },
    { p: 6, korunan: "kalin", yeni: " Baykal APHS için \"Safe State\", STO (Safe Torque Off) ve hidrolik emniyet valflerinin devreye girerek pompa motorunun enerjisini kesmesi ve üst çenenin hareketini anında durdurması durumudur. Hidrolik preste üst çene kendi ağırlığıyla düşebileceği için safe state yalnızca enerjinin kesilmesi değil, üst çenenin bulunduğu konumda tutulması ve makinenin kendiliğinden yeniden çalışmamasıdır." },
    { p: 8, korunan: "kalin", yeni: " Siber müdahale, şemada sağ üstte yer alan ve internete açık olan uzak bakım modülü üzerinden sisteme sızan bir saldırganın, dijital kesişim noktası yoluyla Normal PLC ve Safety PLC arasındaki haberleşmeyi manipüle etmesiyle gerçekleşir. Saldırgan bu yolla ışık bariyerini veya çift el kumandası denetimini yazılımsal olarak etkisiz hale getirebilir." },
  ],
  "LABORATUVAR 5.docx": [
    { p: 3, korunan: { metin: "Bileşen Var mı?:" }, yeni: " Evet, Baykal APHS Abkant makinesinin CNC kontrol ünitesinde ve PLC firmware altyapısında \"Baykal APHS Component X / CNC/PLC firmware kütüphanesi v2.4\" kullanılmaktadır." },
  ],
};

const kacis = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const runMetni = (r) => [...r.matchAll(/<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>/g)].map((m) => m[1]).join("")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const kalinMi = (r) => /<w:b\/>|<w:b w:val="(1|true)"\/>/.test(r);

// Paragraf XML'inde ilk `kes` karakteri tut, gerisini sil, yeni run ekle
function paragrafGuncelle(pXml, kes, yeni) {
  const bas = pXml.indexOf("</w:pPr>") >= 0 ? pXml.indexOf("</w:pPr>") + 8 : pXml.indexOf(">") + 1;
  const son = pXml.lastIndexOf("</w:p>");
  const icerik = pXml.slice(bas, son);
  const runlar = [...icerik.matchAll(/<w:r[ >][\s\S]*?<\/w:r>/g)];
  let sayac = 0, kesimSonu = 0, tutulan = "";
  for (const r of runlar) {
    const t = runMetni(r[0]);
    if (sayac + t.length <= kes) { sayac += t.length; kesimSonu = r.index + r[0].length; continue; }
    if (sayac < kes) throw new Error("kesim bir run'ın ortasına denk geliyor");
    break;
  }
  if (sayac !== kes) throw new Error(`korunan kısım ${kes} karakter, run sınırı ${sayac}`);
  tutulan = icerik.slice(0, kesimSonu);
  // korunan kısımdan sonra açık kalan proofErr başlangıçlarını temizle (yalnızca etiketler; metin yok)
  const yeniRun = `<w:r><w:t xml:space="preserve">${kacis(yeni)}</w:t></w:r>`;
  return pXml.slice(0, bas) + tutulan + yeniRun + pXml.slice(son);
}

(async () => {
  const kuru = process.argv.includes("--kuru");
  for (const [dosya, liste] of Object.entries(DEGISIKLIKLER)) {
    const yol = path.join(KOK, "Paketleme", dosya);
    const once = paragraflar(yol);
    const zip = await JSZip.loadAsync(fs.readFileSync(yol));
    let xml = await zip.file("word/document.xml").async("string");
    const govdeBas = xml.indexOf("<w:body>") + 8;
    const eslesmeler = [...xml.slice(govdeBas).matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)];
    // sondan başa uygula ki indeksler kaymasın
    for (const d of [...liste].sort((a, b) => b.p - a.p)) {
      const p = once[d.p];
      let kes;
      if (d.korunan === "kalin") { let k = 0; while (k < p.parcalar.length && (p.parcalar[k].b || !p.parcalar[k].t.trim())) k++; kes = duzMetin(p.parcalar.slice(0, k)).length; }
      else { const i = duzMetin(p.parcalar).indexOf(d.korunan.metin); if (i !== 0) throw new Error("etiket bulunamadı"); kes = d.korunan.metin.length; }
      // korunan kısmın sonundaki boşlukları yeni metne bırak (eski cevabın baştaki boşluğu silinir, yenisi " " ile başlar)
      const korunanMetin = duzMetin(p.parcalar).slice(0, kes);
      const tamKes = korunanMetin.replace(/\s+$/, "").length;
      const m = eslesmeler[d.p];
      const yeniP = paragrafGuncelle(m[0], tamKes, d.yeni);
      const mutlak = govdeBas + m.index;
      xml = xml.slice(0, mutlak) + yeniP + xml.slice(mutlak + m[0].length);
    }
    if (!kuru) {
      zip.file("word/document.xml", xml);
      fs.writeFileSync(yol, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } }));
    }
    // doğrulama: değişmeyen paragraflar aynen duruyor mu, değişenlerde korunan kısım aynı mı?
    const sonra = kuru ? null : paragraflar(yol);
    console.log(`\n=== ${dosya} ===`);
    once.forEach((p, i) => {
      const d = liste.find((x) => x.p === i);
      if (!sonra) return;
      const a = JSON.stringify(p.parcalar), b = JSON.stringify(sonra[i].parcalar);
      if (!d && a !== b) throw new Error(`P${i} değişmemeliydi!`);
      if (d) {
        const yeniMetin = duzMetin(sonra[i].parcalar);
        const korunan = yeniMetin.slice(0, yeniMetin.length - d.yeni.length);
        if (!yeniMetin.endsWith(d.yeni)) throw new Error(`P${i}: yeni metin yazılamadı`);
        if (duzMetin(p.parcalar).indexOf(korunan) !== 0) throw new Error(`P${i}: korunan kısım bozuldu`);
        const bicim = sonra[i].parcalar.map((x) => (x.b ? "K" : "n")).join("");
        console.log(`P${i} ✔ korunan: "${korunan.trim()}"  ·  yeni cevap ${d.yeni.trim().length} karakter, biçim: ${sonra[i].parcalar.at(-1).b ? "KALIN" : "normal"}  ·  liste: ${sonra[i].liste === p.liste ? "aynı" : "DEĞİŞTİ"}`);
      }
    });
    if (sonra && sonra.length !== once.length) throw new Error("paragraf sayısı değişti");
    if (sonra) console.log(`Paragraf sayısı: ${once.length} (aynı) · değişmeyen ${once.length - liste.length} paragraf birebir aynı`);
  }
})().catch((e) => { console.error("HATA:", e.message); process.exit(1); });

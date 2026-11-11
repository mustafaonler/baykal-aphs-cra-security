// Föy HTML'lerini Chromium ile A4 PDF'e çevirir.
//   node pdf-uret.js              → her klasörde KAPAK.pdf / LABx.pdf üretir
//   node pdf-uret.js --birlestir  → ayrıca foyler/Baykal_APHS_Lab_Foyleri.pdf oluşturur
// Sayfa numaraları birleşik föye göre verilir (kapak = 1, LAB 1 = 2 ...).
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright-core");
const { PDFDocument } = require("pdf-lib");

const KOK = path.resolve(__dirname, "..", "foyler");
const FOYLER = [
  ["00_kapak", "KAPAK"],
  ["01_LAB1", "LAB1"], ["02_LAB2", "LAB2"], ["03_LAB3", "LAB3"], ["04_LAB4", "LAB4"],
  ["05_LAB5", "LAB5"], ["06_LAB6", "LAB6"], ["07_LAB7", "LAB7"],
].map(([klasor, ad]) => ({ ad, html: path.join(KOK, klasor, ad + ".html"), pdf: path.join(KOK, klasor, ad + ".pdf") }))
 .filter((f) => fs.existsSync(f.html));

const CHROME = [
  process.env.CHROME_YOLU,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium",
].find((p) => p && fs.existsSync(p));

async function yazdir(sayfa, foy, ekStil) {
  await sayfa.goto(pathToFileURL(foy.html).href, { waitUntil: "networkidle" });
  if (ekStil) await sayfa.addStyleTag({ content: ekStil });
  await sayfa.evaluate(() => document.fonts.ready);
  return sayfa.pdf({ preferCSSPageSize: true, printBackground: true });
}

(async () => {
  if (!CHROME) throw new Error("Chrome/Edge bulunamadı; CHROME_YOLU ortam değişkenini ayarlayın.");
  const tarayici = await chromium.launch({ executablePath: CHROME });
  const sayfa = await tarayici.newPage();

  // 1. tur: her föyün kaç sayfa tuttuğunu öğren
  for (const f of FOYLER) f.sayfa = (await PDFDocument.load(await yazdir(sayfa, f))).getPageCount();
  const toplam = FOYLER.reduce((t, f) => t + f.sayfa, 0);

  // 2. tur: doğru sayfa numaralarıyla yaz
  let onceki = 0;
  for (const f of FOYLER) {
    const stil = `html{counter-reset:page ${onceki}} @page{@bottom-right{content:counter(page) " / ${toplam}"}}`;
    fs.writeFileSync(f.pdf, await yazdir(sayfa, f, f.ad === "KAPAK" ? null : stil));
    console.log(`${path.relative(KOK, f.pdf)}  ${f.sayfa} sayfa  (s. ${onceki + 1}–${onceki + f.sayfa} / ${toplam})`);
    onceki += f.sayfa;
  }
  await tarayici.close();

  if (process.argv.includes("--birlestir")) {
    const birlesik = await PDFDocument.create();
    birlesik.setTitle("Baykal APHS — Safety 4.0 Bootcamp Laboratuvar Föyleri");
    birlesik.setAuthor("Mustafa Önler");
    for (const f of FOYLER) {
      const kaynak = await PDFDocument.load(fs.readFileSync(f.pdf));
      for (const s of await birlesik.copyPages(kaynak, kaynak.getPageIndices())) birlesik.addPage(s);
    }
    const hedef = path.join(KOK, "Baykal_APHS_Lab_Foyleri.pdf");
    fs.writeFileSync(hedef, await birlesik.save());
    console.log(`${path.relative(KOK, hedef)}  ${toplam} sayfa`);
  }
})().catch((e) => { console.error(e); process.exit(1); });

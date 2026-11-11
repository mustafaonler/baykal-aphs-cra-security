# Baykal APHS Abkant Pres & Endüstriyel Sistemler Siber Güvenlik ve CRA Uyumluluk Projesi

## 🎯 Projenin Amacı ve Kapsamı
Bu repository, endüstriyel otomasyon sistemlerinin ve siber-fiziksel makinelerin (özelde **Baykal APHS Abkant Pres** sistemlerinin) güvenlik açıklarını, siber saldırı vektörlerini ve 2027 **Cyber Resilience Act (CRA)** uyumluluk süreçlerini incelemek amacıyla oluşturulmuştur. 

Projede temel olarak şunları hedefliyoruz:
*   Endüstriyel makinelerde üretim kontrol mantığı (Normal PLC) ile insan güvenliği mimarisinin (Safety PLC / STO) birbirinden nasıl izole edilmesi gerektiğini modellemek,
*   IEC 62443 standartlarına uygun olarak ağ segmentasyonu (Zones & Conduits) ve güvenli uzaktan erişim mimarileri tasarlamak,
*   Siber-fiziksel risk analizi (L × S × E matrisi) yaparak insana gelebilecek fiziksel zararları önceden tespit etmek ve telafi edici önlemler geliştirmek.

Çalışma, Safety 4.0 Bootcamp dersinin laboratuvar föyleri üzerinden yürütülür. Föyler hocanın PaketPro 3000 şablonunun ([docs/sablon.pdf](docs/sablon.pdf)) görsel tasarımıyla hazırlanmış; cevaplar Baykal APHS abkant prese (hidrolik üst çene, alt kalıp, CNC arka dayama, ışık bariyeri + çift el kumandası → Safety PLC → STO, internete açık uzak bakım modülü) göre yazılmıştır.

## 📘 Laboratuvar Föyleri

**Tümü tek dosyada:** [foyler/Baykal_APHS_Lab_Foyleri.pdf](foyler/Baykal_APHS_Lab_Foyleri.pdf) · **Doğrulama raporu:** [foyler/DOGRULAMA_RAPORU.md](foyler/DOGRULAMA_RAPORU.md)

| Hafta | Föy | Çıktı | Evidence Pack | PDF | HTML |
|---|---|---|---|---|---|
| — | Kapak | — | — | [KAPAK.pdf](foyler/00_kapak/KAPAK.pdf) | [KAPAK.html](foyler/00_kapak/KAPAK.html) |
| 1 | LAB 1 · Safety Architecture | Safety Function Map | EP 03 | [LAB1.pdf](foyler/01_LAB1/LAB1.pdf) | [LAB1.html](foyler/01_LAB1/LAB1.html) |
| 2 | LAB 2 · IEC 62443 Mini Workshop | Zone / Conduit Diagram | EP 05 | [LAB2.pdf](foyler/02_LAB2/LAB2.pdf) | [LAB2.html](foyler/02_LAB2/LAB2.html) |
| 3 | LAB 3 · Threat & Risk + Risk Matrix | Risk Register | EP 04 | [LAB3.pdf](foyler/03_LAB3/LAB3.pdf) | [LAB3.html](foyler/03_LAB3/LAB3.html) |
| 4 | LAB 4 · Secure Remote Access | Secure Architecture | EP 02 + EP 06 | [LAB4.pdf](foyler/04_LAB4/LAB4.pdf) | [LAB4.html](foyler/04_LAB4/LAB4.html) |
| 5 | LAB 5 · SBOM / CVE / Patch | Vulnerability Decision | EP 09 · 10 · 11 | [LAB5.pdf](foyler/05_LAB5/LAB5.pdf) | [LAB5.html](foyler/05_LAB5/LAB5.html) |
| 6 | LAB 6 · CRA Incident Simulation | Incident Workflow | EP 13 | [LAB6.pdf](foyler/06_LAB6/LAB6.pdf) | [LAB6.html](foyler/06_LAB6/LAB6.html) |
| 7 | LAB 7 · AI Safety Challenge | AI Fail-Safe Decision | EP 03 + EP 15 | [LAB7.pdf](foyler/07_LAB7/LAB7.pdf) | [LAB7.html](foyler/07_LAB7/LAB7.html) |

## 📂 İçerik Yapısı
```
foyler/                         Şablon tasarımındaki föyler (HTML kaynak + A4 PDF)
  00_kapak/ … 07_LAB7/          Her klasörde LABx.html ve LABx.pdf
  ortak/foy.css                 Ortak stil (ölçüler şablondan alınmıştır)
  Baykal_APHS_Lab_Foyleri.pdf   Kapak + 7 föy, tek PDF
  DOGRULAMA_RAPORU.md           Word ↔ föy ↔ PDF doğrulama raporu
Paketleme/                      Cevapların kaynağı: LABORATUVAR 1–7 Word dosyaları
docs/sablon.pdf                 Hocanın PaketPro 3000 föy şablonu
araclar/                        Föy üretim araçları (Node.js)
```

## 🛠️ Föyleri Yeniden Üretme
Cevaplar Word dosyalarından elle yazılmadan, programla aktarılır; metin değiştirilmez.

```bash
cd araclar
npm install
node pdf-uret.js --birlestir      # HTML → A4 PDF (Chrome/Edge) + birleşik PDF
node tam-dogrula.js               # Word ↔ HTML ↔ PDF tam doğrulama → foyler/DOGRULAMA_RAPORU.md
```

`doldur.js`, föy HTML'lerindeki `{{P<n>}}` yer tutucularını Word paragraflarıyla doldurmak için kullanıldı.

---
*Bu föyler bir eğitim çıktısıdır, resmî denetim değildir; uygunluk değerlendirmesi veya belgelendirme yerine geçmez.*

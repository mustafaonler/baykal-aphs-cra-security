# Doğrulama Raporu — Baykal APHS Laboratuvar Föyleri

Oluşturma: 11.11.2026 20:17:59 · Betik: `araclar/tam-dogrula.js`

Kaynak: `Paketleme/LABORATUVAR 1–7.docx` → föy HTML'leri (`foyler/0x_LABx/LABx.html`) → PDF'ler (tek tek ve `Baykal_APHS_Lab_Foyleri.pdf`).
Karşılaştırmada kalın yazı, boşluk/satır sonu ve ➔/→ farkları normalize edilir. Word'de LaTeX olarak kalan `$2 \times 3 \times 2 = 12$` ifadeleri `2 × 3 × 2 = 12` kabul edilir.
Word dosyalarında tablo yoktur; tüm içerik paragraf/madde olarak okunur.

## Özet

| Föy | Word paragrafı | HTML | PDF metni | Soru–cevap | Yerleşim | Sonuç |
|---|---|---|---|---|---|---|
| LAB 1 | 9 (8 kontrol edildi) | 8/8 | 8/8 | 8/8 | sorun yok | **birebir aynı** |
| LAB 2 | 25 (24 kontrol edildi) | 24/24 | 24/24 | 3/3 | sorun yok | **birebir aynı** |
| LAB 3 | 27 (23 kontrol edildi) | 23/23 | 23/23 | 2/2 | sorun yok | **birebir aynı** |
| LAB 4 | 16 (15 kontrol edildi) | 15/15 | 15/15 | 2/2 | sorun yok | **birebir aynı** |
| LAB 5 | 13 (12 kontrol edildi) | 12/12 | 12/12 | 5/5 | sorun yok | **birebir aynı** |
| LAB 6 | 19 (18 kontrol edildi) | 18/18 | 18/18 | 5/5 | sorun yok | **birebir aynı** |
| LAB 7 | 17 (16 kontrol edildi) | 16/16 | 16/16 | 3/3 | sorun yok | **birebir aynı** |

Birleşik PDF: 13 sayfa; sayfa numaraları 1–13 sıralı ve doğru. Sayfa görüntüleri: 13 adet (`araclar/.sayfalar/`, repoya eklenmez).
Kapak: yerleşim sorunu yok.

## "PaketPro" geçen yerler

Yok — föylerin hiçbir yerinde (şablon metni ya da Word cevabı) "PaketPro" geçmiyor.

## LAB 1 — birebir aynı

### Soru–cevap eşleşmesi

| Föy sorusu | Föydeki soru metni | Word soru paragrafı | Word cevap paragrafları | Durum |
|---|---|---|---|---|
| 1 | Bu makinede tehlike nedir? İnsan neyden zarar görür? | P1 | P1 | ✔ doğru soruda |
| 2 | Safety function (emniyet fonksiyonu) hangisidir? | P2 | P2 | ✔ doğru soruda |
| 3 | Safety-related control system nerede? Şemada işaretleyin. | P3 | P3 | ✔ doğru soruda |
| 4 | Normal PLC ile Safety PLC farkı nedir? | P4 | P4 | ✔ doğru soruda |
| 5 | PLr / SIL neden var? Bu fonksiyon için neden önemli? | P5 | P5 | ✔ doğru soruda |
| 6 | Safe state (güvenli durum) nedir? | P6 | P6 | ✔ doğru soruda |
| 7 | Safety function hangi dijital bağımlılıklara sahip? | P7 | P7 | ✔ doğru soruda |
| 8 | Siber müdahale hangi noktadan bu fonksiyonu bozar? | P8 | P8 | ✔ doğru soruda |

### Paragraf paragraf karşılaştırma

| Word P | Word metni | Beklenen yer | Bulunan yer | HTML | PDF | Not |
|---|---|---|---|---|---|---|
| 0 | LABORATUVAR 1: SAFETY ARCHITECTURE (GÜVENLİK MİMARİSİ)… | — | — | — | — | Word belge başlığı; föyde şablonun başlık bandı var |
| 1 | 1. Bu makinede tehlike nedir? İnsan neyden zarar görür… | Soru 1 | Soru 1 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 2 | 2. Safety function (emniyet fonksiyonu) hangisidir? Em… | Soru 2 | Soru 2 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 3 | 3. Safety-related control system nerede? Şemada işaret… | Soru 3 | Soru 3 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 4 | 4. Normal PLC ile Safety PLC farkı nedir? Normal PLC, … | Soru 4 | Soru 4 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 5 | 5. PLr / SIL neden var? Bu fonksiyon için neden önemli… | Soru 5 | Soru 5 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 6 | 6. Safe state (güvenli durum) nedir? Baykal APHS için … | Soru 6 | Soru 6 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 7 | 7. Safety function hangi dijital bağımlılıklara sahip?… | Soru 7 | Soru 7 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 8 | 8. Siber müdahale hangi noktadan bu fonksiyonu bozar? … | Soru 8 | Soru 8 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |

PDF sayfaları (birleşik): —

## LAB 2 — birebir aynı

### Soru–cevap eşleşmesi

| Föy sorusu | Föydeki soru metni | Word soru paragrafı | Word cevap paragrafları | Durum |
|---|---|---|---|---|
| 1 | Hangi varlıklar aynı bölgede? Bölgeleri adlandırıp grupland… | P2 | P2, P3, P4, P5 | ✔ doğru soruda |
| 2 | Açık uzak bakım modülü hangi bölgeye düşüyor — neden? Orada… | P6 | P7, P8 | ✔ doğru soruda |
| 3 | Bölgeler arası geçişler (conduit) nerede? Her geçişte ne ko… | P9 | P10, P11 | ✔ doğru soruda |

### Paragraf paragraf karşılaştırma

| Word P | Word metni | Beklenen yer | Bulunan yer | HTML | PDF | Not |
|---|---|---|---|---|---|---|
| 0 | LABORATUVAR 2: IEC 62443 MINI WORKSHOPProje Konusu: Ba… | — | — | — | — | Word belge başlığı; föyde şablonun başlık bandı var |
| 1 | Görev A — Varlıkları bölgelere ayırın(Varlık listesi: … | kutu | kutu | ✔ | ✔ | parantez ve "Varlık listesi:" etiketi kutu başlığı oldu |
| 2 | 1. Hangi varlıklar aynı bölgede? Bölgeleri adlandırıp … | Soru 1 | Soru 1 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 3 | Bölge 1 (Machine Control / Cell Zone - Hücre Kontrol B… | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 4 | Bölge 2 (Safety Zone - Emniyet Bölgesi): Emniyet PLC's… | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 5 | Bölge 3 (Enterprise / DMZ & Cloud Zone - Kurumsal ve D… | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 6 | 2. Açık uzak bakım modülü hangi bölgeye düşüyor — nede… | Soru 2 | Soru 2 | ✔ | ✔ | soru metni Word ile aynı |
| 7 | Hangi bölgeye düşüyor ve kalabilir mi?: Açık uzak bakı… | Soru 2 | Soru 2 | ✔ | ✔ |  |
| 8 | Neden kalmamalı?: Bu modül doğrudan internete açık old… | Soru 2 | Soru 2 | ✔ | ✔ |  |
| 9 | 3. Bölgeler arası geçişler (conduit) nerede? Her geçiş… | Soru 3 | Soru 3 | ✔ | ✔ | soru metni Word ile aynı |
| 10 | Geçiş 1 (Enterprise / Uzak Bakım → Machine Control Zon… | Soru 3 | Soru 3 | ✔ | ✔ |  |
| 11 | Geçiş 2 (Machine Control Zone → Safety Zone / Emniyet … | Soru 3 | Soru 3 | ✔ | ✔ |  |
| 12 | Görev B — Uzak erişim kararı (6 satır) | şablon başlığı | bolum 2 | ✔ | ✔ | yalnızca büyük/küçük harf farkı (şablon yazımı korundu) |
| 13 | Aracı? | Tablo satır 1, sütun "Karar" | Tablo satır 1, sütun "Karar" | ✔ | ✔ |  |
| 14 | Seçiminiz + Nedeni: Jump Server. Doğrudan dışarıdan ma… | Tablo satır 1, sütun "Seçiminiz + nedeni" | Tablo satır 1, sütun "Seçiminiz + nedeni" | ✔ | ✔ | "Seçiminiz + Nedeni:" etiketi sütun başlığında |
| 15 | Tünel? | Tablo satır 2, sütun "Karar" | Tablo satır 2, sütun "Karar" | ✔ | ✔ |  |
| 16 | Seçiminiz + Nedeni: VPN. Açık internet üzerinden yapıl… | Tablo satır 2, sütun "Seçiminiz + nedeni" | Tablo satır 2, sütun "Seçiminiz + nedeni" | ✔ | ✔ | "Seçiminiz + Nedeni:" etiketi sütun başlığında |
| 17 | Kimlik? | Tablo satır 3, sütun "Karar" | Tablo satır 3, sütun "Karar" | ✔ | ✔ |  |
| 18 | Seçiminiz + Nedeni: MFA. Sabit ve zayıf parolalar yeri… | Tablo satır 3, sütun "Seçiminiz + nedeni" | Tablo satır 3, sütun "Seçiminiz + nedeni" | ✔ | ✔ | "Seçiminiz + Nedeni:" etiketi sütun başlığında |
| 19 | Hesap? | Tablo satır 4, sütun "Karar" | Tablo satır 4, sütun "Karar" | ✔ | ✔ |  |
| 20 | Seçiminiz + Nedeni: Kişisel. Ortak ve varsayılan (admi… | Tablo satır 4, sütun "Seçiminiz + nedeni" | Tablo satır 4, sütun "Seçiminiz + nedeni" | ✔ | ✔ | "Seçiminiz + Nedeni:" etiketi sütun başlığında |
| 21 | Kayıt? | Tablo satır 5, sütun "Karar" | Tablo satır 5, sütun "Karar" | ✔ | ✔ |  |
| 22 | Seçiminiz + Nedeni: Tam oturum kaydı. Uzaktan bakım sü… | Tablo satır 5, sütun "Seçiminiz + nedeni" | Tablo satır 5, sütun "Seçiminiz + nedeni" | ✔ | ✔ | "Seçiminiz + Nedeni:" etiketi sütun başlığında |
| 23 | Zamanlama? | Tablo satır 6, sütun "Karar" | Tablo satır 6, sütun "Karar" | ✔ | ✔ |  |
| 24 | Seçiminiz + Nedeni: Varsayılan kapalı. Portlar 7/24 aç… | Tablo satır 6, sütun "Seçiminiz + nedeni" | Tablo satır 6, sütun "Seçiminiz + nedeni" | ✔ | ✔ | "Seçiminiz + Nedeni:" etiketi sütun başlığında |

PDF sayfaları (birleşik): —

## LAB 3 — birebir aynı

### Soru–cevap eşleşmesi

| Föy sorusu | Föydeki soru metni | Word soru paragrafı | Word cevap paragrafları | Durum |
|---|---|---|---|---|
| 1 | En yüksek öncelikli senaryo hangisi? Bir cümleyle: neden bu? | P25 | P25 | ✔ doğru soruda |
| 2 | S=3 olup skoru düşük kalan senaryonuz var mı? Nasıl görünür… | P26 | P26 | ✔ doğru soruda |

### Risk tablosu değerleri (Word ↔ föy)

| Senaryo | Alan | Word | Föy (HTML) | HTML | PDF |
|---|---|---|---|---|---|
| 1 | L | 2 (Ağ üzerinden erişim riski yüksek) | 2 (Ağ üzerinden erişim riski yüksek) | ✔ | ✔ |
| 1 | S | 3 (Ölümcül / Ağır uzuv kaybı) | 3 (Ölümcül / Ağır uzuv kaybı) | ✔ | ✔ |
| 1 | E | 2 (Vardiya boyunca makine sürekli çalışıyor) | 2 (Vardiya boyunca makine sürekli çalışıyor) | ✔ | ✔ |
| 1 | Skor | 2 × 3 × 2 = 12 (Yüksek / Kritik) | 2 × 3 × 2 = 12 (Yüksek / Kritik) | ✔ | ✔ |
| 1 | Öncelik | 1 (En Yüksek) | 1 (En Yüksek) | ✔ | ✔ |
| 2 | L | 1 (Fiziksel veya yerel ağ erişimi gerektirir) | 1 (Fiziksel veya yerel ağ erişimi gerektirir) | ✔ | ✔ |
| 2 | S | 3 (Fiziksel yaralanma / travmatik darbe) | 3 (Fiziksel yaralanma / travmatik darbe) | ✔ | ✔ |
| 2 | E | 1 (Nadir yapılan USB veri yüklemesi) | 1 (Nadir yapılan USB veri yüklemesi) | ✔ | ✔ |
| 2 | Skor | 1 × 3 × 1 = 3 (Düşük Skor) | 1 × 3 × 1 = 3 (Düşük Skor) | ✔ | ✔ |
| 2 | Öncelik | 2 (S=3 kuralı gereği skor düşük olsa da insana zarar verece… | 2 (S=3 kuralı gereği skor düşük olsa da insana zarar verece… | ✔ | ✔ |
| 3 | L | 2 (Ağ üzerinden şifresiz HMI erişimi) | 2 (Ağ üzerinden şifresiz HMI erişimi) | ✔ | ✔ |
| 3 | S | 2 (Orta düzey fiziksel darbe / ezilme) | 2 (Orta düzey fiziksel darbe / ezilme) | ✔ | ✔ |
| 3 | E | 2 (Günlük üretim boyunca aktif) | 2 (Günlük üretim boyunca aktif) | ✔ | ✔ |
| 3 | Skor | 2 × 2 × 2 = 8 | 2 × 2 × 2 = 8 | ✔ | ✔ |
| 3 | Öncelik | 3 | 3 | ✔ | ✔ |

### Paragraf paragraf karşılaştırma

| Word P | Word metni | Beklenen yer | Bulunan yer | HTML | PDF | Not |
|---|---|---|---|---|---|---|
| 0 | LABORATUVAR 3: THREAT & RISK + RISK MATRIXProje Konusu… | — | — | — | — | Word belge başlığı; föyde şablonun başlık bandı var |
| 1 | Görev — Üç senaryo kurun ve puanlayın(Formül: Skor = L… | formul | formul | ✔ | ✔ |  |
| 2 | Tablo İçeriği (3 Senaryo): | — | — | — | — | Word'deki ara başlık; föyde karşılığı şablon başlığı/tablo |
| 3 | Senaryo (kim → kapı → ne yapar → zincir → fiziksel son… | tablo sütun başlığı | Tablo 1 başlık | ✔ | ✔ |  |
| 4 | Senaryo: Dış Saldırgan → İnternete Açık Uzak Bakım Mod… | Tablo satır 1, sütun "Senaryo (kim ➔ kapı ➔ ne yapar ➔ zincir ➔ fiziksel sonuç)" | Tablo satır 1, sütun "Senaryo (kim ➔ kapı ➔ ne yapar ➔ zincir ➔ fiziksel sonuç)" | ✔ | ✔ | "Senaryo:" etiketi sütun başlığında |
| 5 | L (1-3): 2 (Ağ üzerinden erişim riski yüksek) | Tablo satır 1, sütun "L" | Tablo satır 1, sütun "L" | ✔ | ✔ |  |
| 6 | S (1-3): 3 (Ölümcül / Ağır uzuv kaybı) | Tablo satır 1, sütun "S" | Tablo satır 1, sütun "S" | ✔ | ✔ |  |
| 7 | E (1-3): 2 (Vardiya boyunca makine sürekli çalışıyor) | Tablo satır 1, sütun "E" | Tablo satır 1, sütun "E" | ✔ | ✔ |  |
| 8 | Skor: 2 × 3 × 2 = 12 (Yüksek / Kritik) | Tablo satır 1, sütun "Skor" | Tablo satır 1, sütun "Skor" | ✔ | ✔ |  |
| 9 | Öncelik: 1 (En Yüksek) | Tablo satır 1, sütun "Öncelik" | Tablo satır 1, sütun "Öncelik" | ✔ | ✔ |  |
| 10 | Senaryo (kim → kapı → ne yapar → zincir xf fiziksel so… | — | — | — | — | aynı etiketin tekrarı (yazım hatalı: "xf") |
| 11 | Senaryo: Kötü Niyetli İç Personel → Kilitsiz USB / Zay… | Tablo satır 2, sütun "Senaryo (kim ➔ kapı ➔ ne yapar ➔ zincir ➔ fiziksel sonuç)" | Tablo satır 2, sütun "Senaryo (kim ➔ kapı ➔ ne yapar ➔ zincir ➔ fiziksel sonuç)" | ✔ | ✔ | "Senaryo:" etiketi sütun başlığında |
| 12 | L (1-3): 1 (Fiziksel veya yerel ağ erişimi gerektirir) | Tablo satır 2, sütun "L" | Tablo satır 2, sütun "L" | ✔ | ✔ |  |
| 13 | S (1-3): 3 (Fiziksel yaralanma / travmatik darbe) | Tablo satır 2, sütun "S" | Tablo satır 2, sütun "S" | ✔ | ✔ |  |
| 14 | E (1-3): 1 (Nadir yapılan USB veri yüklemesi) | Tablo satır 2, sütun "E" | Tablo satır 2, sütun "E" | ✔ | ✔ |  |
| 15 | Skor: 1 × 3 × 1 = 3 (Düşük Skor) | Tablo satır 2, sütun "Skor" | Tablo satır 2, sütun "Skor" | ✔ | ✔ |  |
| 16 | Öncelik: 2 (S=3 kuralı gereği skor düşük olsa da insan… | Tablo satır 2, sütun "Öncelik" | Tablo satır 2, sütun "Öncelik" | ✔ | ✔ |  |
| 17 | Senaryo (kim → kapı → ne yapar → zincir → fiziksel son… | tablo sütun başlığı | Tablo 1 başlık | ✔ | ✔ |  |
| 18 | Senaryo: Yetkisiz Kullanıcı → Port 80 HMI (Web Arayüzü… | Tablo satır 3, sütun "Senaryo (kim ➔ kapı ➔ ne yapar ➔ zincir ➔ fiziksel sonuç)" | Tablo satır 3, sütun "Senaryo (kim ➔ kapı ➔ ne yapar ➔ zincir ➔ fiziksel sonuç)" | ✔ | ✔ | "Senaryo:" etiketi sütun başlığında |
| 19 | L (1-3): 2 (Ağ üzerinden şifresiz HMI erişimi) | Tablo satır 3, sütun "L" | Tablo satır 3, sütun "L" | ✔ | ✔ |  |
| 20 | S (1-3): 2 (Orta düzey fiziksel darbe / ezilme) | Tablo satır 3, sütun "S" | Tablo satır 3, sütun "S" | ✔ | ✔ |  |
| 21 | E (1-3): 2 (Günlük üretim boyunca aktif) | Tablo satır 3, sütun "E" | Tablo satır 3, sütun "E" | ✔ | ✔ |  |
| 22 | Skor: 2 × 2 × 2 = 8 | Tablo satır 3, sütun "Skor" | Tablo satır 3, sütun "Skor" | ✔ | ✔ |  |
| 23 | Öncelik: 3 | Tablo satır 3, sütun "Öncelik" | Tablo satır 3, sütun "Öncelik" | ✔ | ✔ |  |
| 24 | Soruların Cevapları: | — | — | — | — | Word'deki ara başlık; föyde karşılığı şablon başlığı/tablo |
| 25 | 1. En yüksek öncelikli senaryo hangisi? Bir cümleyle: … | Soru 1 | Soru 1 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 26 | 2. S=3 olup skoru düşük kalan senaryonuz var mı? Nasıl… | Soru 2 | Soru 2 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |

PDF sayfaları (birleşik): —

## LAB 4 — birebir aynı

### Soru–cevap eşleşmesi

| Föy sorusu | Föydeki soru metni | Word soru paragrafı | Word cevap paragrafları | Durum |
|---|---|---|---|---|
| 1 | Saldırgan tüm önlemlere rağmen içeri girerse: emniyet fonks… | P14 | P14 | ✔ doğru soruda |
| 2 | Işık perdesi zincirinin uzak bakım yolundan etkilenmemesi i… | P15 | P15 | ✔ doğru soruda |

### Paragraf paragraf karşılaştırma

| Word P | Word metni | Beklenen yer | Bulunan yer | HTML | PDF | Not |
|---|---|---|---|---|---|---|
| 0 | LABORATUVAR 4: SECURE REMOTE ACCESSProje Konusu: Bayka… | — | — | — | — | Word belge başlığı; föyde şablonun başlık bandı var |
| 1 | Görev A — mevcut → hedef | şablon başlığı | bolum | ✔ | ✔ |  |
| 2 | MEVCUT (çizin/yazın): | mevcut | mevcut | ✔ | ✔ |  |
| 3 | Makinenin uzak bakım modülü ve CNC kontrol ünitesi bug… | mevcut | mevcut | ✔ | ✔ |  |
| 4 | Üretici servis mühendisleri sisteme şifresiz portlar v… | mevcut | mevcut | ✔ | ✔ |  |
| 5 | Uzak erişim portları 7/24 aktif ve sürekli açık kalmak… | mevcut | mevcut | ✔ | ✔ |  |
| 6 | Makine ağında herhangi bir segmentasyon veya uç nokta … | mevcut | mevcut | ✔ | ✔ |  |
| 7 | HEDEF (beş ilkeyle yeniden tasarlayın): | hedef | hedef | ✔ | ✔ |  |
| 8 | 1. Erişim Kontrolü ve Aracı: Doğrudan dış bağlantı kal… | hedef | hedef | ✔ | ✔ |  |
| 9 | 2. Güvenli Tünel: Dışarıdan gelen erişimler şifreli VP… | hedef | hedef | ✔ | ✔ |  |
| 10 | 3. Kimlik Doğrulama: Basit parolalar yerine Çok Faktör… | hedef | hedef | ✔ | ✔ |  |
| 11 | 4. Hesap Yönetimi: Ortak hesaplar yasaklanmış, her müh… | hedef | hedef | ✔ | ✔ |  |
| 12 | 5. Zamanlama ve Kayıt: Portlar varsayılan olarak kapal… | hedef | hedef | ✔ | ✔ |  |
| 13 | Görev B — functional safety köprüsü | şablon başlığı | bolum 2 | ✔ | ✔ |  |
| 14 | 1. Saldırgan tüm önlemlere rağmen içeri girerse: emniy… | Soru 1 | Soru 1 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 15 | 2. Işık perdesi zincirinin uzak bakım yolundan etkilen… | Soru 2 | Soru 2 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |

PDF sayfaları (birleşik): —

## LAB 5 — birebir aynı

### Soru–cevap eşleşmesi

| Föy sorusu | Föydeki soru metni | Word soru paragrafı | Word cevap paragrafları | Durum |
|---|---|---|---|---|
| 1 | Bu CVE sizi gerçekten etkiliyor mu? (üç şartı kontrol edin) | P2 | P3, P4, P5 | ✔ doğru soruda |
| 2 | Üretimi hemen durdurur musunuz? Neden / neden değil? | P6 | P6 | ✔ doğru soruda |
| 3 | Yamayı doğrudan mı uygularsınız, önce test mi? Nerede test … | P7 | P7 | ✔ doğru soruda |
| 4 | Bu yama bir safety validation etkiliyor mu? Nasıl anlarsını… | P8 | P8 | ✔ doğru soruda |
| 5 | Yama mümkün değilse compensating control (telafi edici önle… | P9 | P9, P10, P11, P12 | ✔ doğru soruda |

### Paragraf paragraf karşılaştırma

| Word P | Word metni | Beklenen yer | Bulunan yer | HTML | PDF | Not |
|---|---|---|---|---|---|---|
| 0 | LABORATUVAR 5: SBOM / CVE / PATCHProje Konusu: Baykal … | — | — | — | — | Word belge başlığı; föyde şablonun başlık bandı var |
| 1 | Görev — Karar Akışı | şablon başlığı | bolum 2 | ✔ | ✔ | yalnızca büyük/küçük harf farkı (şablon yazımı korundu) |
| 2 | 1. Bu CVE sizi gerçekten etkiliyor mu? (üç şartı kontr… | Soru 1 | Soru 1 | ✔ | ✔ | soru metni Word ile aynı |
| 3 | Bileşen Var mı?: Evet, Baykal APHS Abkant makinesinin … | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 4 | Etkileniyor mu?: Evet, yayınlanan zafiyet bildirimi do… | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 5 | Ulaşılabilir mi?: Evet, makinenin uzak bakım modülü ve… | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 6 | 2. Üretimi hemen durdurur musunuz? Neden / neden değil… | Soru 2 | Soru 2 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 7 | 3. Yamayı doğrudan mı uygularsınız, önce test mi? Nere… | Soru 3 | Soru 3 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 8 | 4. Bu yama bir safety validation etkiliyor mu? Nasıl a… | Soru 4 | Soru 4 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 9 | 5. Yama mümkün değilse compensating control (telafi ed… | Soru 5 | Soru 5 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 10 | CNC kontrol ünitesi ile dış ağ/ERP arasındaki bağlantı… | Soru 5 | Soru 5 | ✔ | ✔ |  |
| 11 | Uzak erişim portları kapatılır; yalnızca yerel mühendi… | Soru 5 | Soru 5 | ✔ | ✔ |  |
| 12 | Güvenlik duvarı (Firewall) kuralları sıkılaştırılarak … | Soru 5 | Soru 5 | ✔ | ✔ |  |

PDF sayfaları (birleşik): —

## LAB 6 — birebir aynı

### Soru–cevap eşleşmesi

| Föy sorusu | Föydeki soru metni | Word soru paragrafı | Word cevap paragrafları | Durum |
|---|---|---|---|---|
| 1 | 10:15 — ilk 15 dk: Kimi ararsınız? İlk üç eyleminiz? | P3 | P4, P5, P6, P7 | ✔ doğru soruda |
| 2 | İlk 2 saat: Egzoz güvende mi — nasıl doğrularsınız? Hangi k… | P8 | P9, P10, P11 | ✔ doğru soruda |
| 3 | 24 saat — CRA erken uyarı: Hangi bilgi hazır olmalı? | P12 | P12 | ✔ doğru soruda |
| 4 | 72 saat — CRA bildirim: Kök neden, etki, önlem — kim ne yap… | P13 | P14, P15, P16, P17 | ✔ doğru soruda |
| 5 | 14 gün — son rapor: Hangi loglar/kayıtlar korunmuş olmalı? | P18 | P18 | ✔ doğru soruda |

### Paragraf paragraf karşılaştırma

| Word P | Word metni | Beklenen yer | Bulunan yer | HTML | PDF | Not |
|---|---|---|---|---|---|---|
| 0 | LABORATUVAR 6: CRA INCIDENT SIMULATIONProje Konusu: Ba… | — | — | — | — | Word belge başlığı; föyde şablonun başlık bandı var |
| 1 | Senaryo: Saat 10:15. Baykal Abkant Pres'in servis hesa… | uyari-kutu | uyari-kutu | ✔ | ✔ |  |
| 2 | Görev — Zaman çizgisini doldurun | şablon başlığı | bolum | ✔ | ✔ | yalnızca büyük/küçük harf farkı (şablon yazımı korundu) |
| 3 | 1. 10:15 — ilk 15 dk: Kimi ararsınız? İlk üç eyleminiz? | Soru 1 | Soru 1 | ✔ | ✔ | soru metni Word ile aynı |
| 4 | Arama: Derhal Fabrika Üretim Müdürünü ve IT/Siber Güve… | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 5 | Eylem 1: Operatöre acil talimat vererek makineyi güven… | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 6 | Eylem 2: Makinenin CNC kontrol ünitesi ve uzak bakım m… | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 7 | Eylem 3: Makineyi resetlemem veya kapatmam; adli biliş… | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 8 | 2. İlk 2 saat: Egzoz güvende mi — nasıl doğrularsınız?… | Soru 2 | Soru 2 | ✔ | ✔ | soru metni Word ile aynı |
| 9 | Emniyet Doğrulaması: Yetkili teknisyenle birlikte Safe… | Soru 2 | Soru 2 | ✔ | ✔ |  |
| 10 | Korunan Kanıt: CNC işletim sisteminin, uzak bakım modü… | Soru 2 | Soru 2 | ✔ | ✔ |  |
| 11 | Kapatılan Hesap: Gece giriş yapılan şüpheli "servis he… | Soru 2 | Soru 2 | ✔ | ✔ |  |
| 12 | 3. 24 saat — CRA erken uyarı: Hangi bilgi hazır olmalı… | Soru 3 | Soru 3 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |
| 13 | 4. 72 saat — CRA bildirim: Kök neden, etki, önlem — ki… | Soru 4 | Soru 4 | ✔ | ✔ | soru metni Word ile aynı |
| 14 | Kök Neden: Açık bırakılan uzak bakım portu ve sızdırıl… | Soru 4 | Soru 4 | ✔ | ✔ |  |
| 15 | Etki: Üretim hattında X saat duruş ve potansiyel (gerç… | Soru 4 | Soru 4 | ✔ | ✔ |  |
| 16 | Önlem: Parolaların sıfırlanması, MFA (Çok Faktörlü Doğ… | Soru 4 | Soru 4 | ✔ | ✔ |  |
| 17 | Kim Ne Yapıyor?: IT/Siber Güvenlik birimi bu detaylı t… | Soru 4 | Soru 4 | ✔ | ✔ |  |
| 18 | 5. 14 gün — son rapor: Hangi loglar/kayıtlar korunmuş … | Soru 5 | Soru 5 | ✔ | ✔ | soru metni Word ile aynı; cevap aynı |

PDF sayfaları (birleşik): —

## LAB 7 — birebir aynı

### Soru–cevap eşleşmesi

| Föy sorusu | Föydeki soru metni | Word soru paragrafı | Word cevap paragrafları | Durum |
|---|---|---|---|---|
| 1 | Model yanlış sınıflandırdı: Kusurlu parçaya OK verdi. (YZ, … | P4 | P5 | ✔ doğru soruda |
| 2 | Girdi manipüle edildi: Kamera verisi bozuk/sahte. (Kamera l… | P6 | P7 | ✔ doğru soruda |
| 3 | Confidence düştü: Model "emin değilim" diyor. Eşik ne olmal… | P8 | P9 | ✔ doğru soruda |

### Paragraf paragraf karşılaştırma

| Word P | Word metni | Beklenen yer | Bulunan yer | HTML | PDF | Not |
|---|---|---|---|---|---|---|
| 0 | LABORATUVAR 7: AI SAFETY CHALLENGEProje Konusu: Baykal… | — | — | — | — | Word belge başlığı; föyde şablonun başlık bandı var |
| 1 | Kavram — Prediction ≠ Safety: Yapay zekâ bir karar üre… | baglam | baglam | ✔ | ✔ |  |
| 2 | Senaryo Uyarlaması: Baykal Abkant Pres makinesine bükü… | not-satir + akış şeması | not-satir + akış şeması | ✔ | ✔ | akış kutuları: Kamera | YZ Modeli (El mi/Sac mı?) | OK / STOP | Pres İniş İzni | Üst Çene Hızı |
| 3 | Görev — üç başarısızlıkta güvenli davranış | şablon başlığı | bolum | ✔ | ✔ |  |
| 4 | 1. Model yanlış sınıflandırdı: Kusurlu parçaya OK verd… | Soru 1 | Soru 1 | ✔ | ✔ | soru metni Word ile aynı |
| 5 | Cevap: YZ'nin kararı hiçbir zaman donanımsal emniyetin… | Soru 1 | Soru 1 | ✔ | ✔ |  |
| 6 | 2. Girdi manipüle edildi: Kamera verisi bozuk/sahte. (… | Soru 2 | Soru 2 | ✔ | ✔ | soru metni Word ile aynı |
| 7 | Cevap: Kameradan gelen görüntüde ani kararma, kontrast… | Soru 2 | Soru 2 | ✔ | ✔ |  |
| 8 | 3. Confidence düştü: Model "emin değilim" diyor. Eşik … | Soru 3 | Soru 3 | ✔ | ✔ | soru metni Word ile aynı |
| 9 | Cevap: Ölümcül ezilme riski taşıyan bir abkant preste … | Soru 3 | Soru 3 | ✔ | ✔ |  |
| 10 | Karar Tablosu — AI Fail-Safe Decision | şablon başlığı | bolum 2 | ✔ | ✔ | yalnızca büyük/küçük harf farkı (şablon yazımı korundu) |
| 11 | Başarısızlık: Model yanlış sınıflandırdı | Tablo satır 1, sütun "Başarısızlık" | Tablo satır 1, sütun "Başarısızlık" | ✔ | ✔ | "Başarısızlık:" etiketi sütun başlığında |
| 12 | Tanımladığınız güvenli davranış (hangi kavramla?): YZ … | Tablo satır 1, sütun "Tanımladığınız güvenli davranış (hangi kavramla?)" | Tablo satır 1, sütun "Tanımladığınız güvenli davranış (hangi kavramla?)" | ✔ | ✔ | "Tanımladığınız güvenli davranış…:" etiketi sütun başlığında |
| 13 | Başarısızlık: Girdi manipüle edildi | Tablo satır 2, sütun "Başarısızlık" | Tablo satır 2, sütun "Başarısızlık" | ✔ | ✔ | "Başarısızlık:" etiketi sütun başlığında |
| 14 | Tanımladığınız güvenli davranış (hangi kavramla?): Gör… | Tablo satır 2, sütun "Tanımladığınız güvenli davranış (hangi kavramla?)" | Tablo satır 2, sütun "Tanımladığınız güvenli davranış (hangi kavramla?)" | ✔ | ✔ | "Tanımladığınız güvenli davranış…:" etiketi sütun başlığında |
| 15 | Başarısızlık: Confidence düştü | Tablo satır 3, sütun "Başarısızlık" | Tablo satır 3, sütun "Başarısızlık" | ✔ | ✔ | "Başarısızlık:" etiketi sütun başlığında |
| 16 | Tanımladığınız güvenli davranış (hangi kavramla?): Eşi… | Tablo satır 3, sütun "Tanımladığınız güvenli davranış (hangi kavramla?)" | Tablo satır 3, sütun "Tanımladığınız güvenli davranış (hangi kavramla?)" | ✔ | ✔ | "Tanımladığınız güvenli davranış…:" etiketi sütun başlığında |

PDF sayfaları (birleşik): —

## Görsel inceleme (sayfa görüntüleri tek tek)

Birleşik PDF'in 13 sayfası 2× ölçekte PNG'ye çevrildi (`araclar/.sayfalar/sayfa-01…13.png`) ve tek tek incelendi.

| Sayfa | Föy | Taşma / kesilme | Üst üste binme | Boş cevap alanı | Not |
|---|---|---|---|---|---|
| 1 | Kapak | yok | yok | — | Alt başlık iki satır: "Laboratuvar Föyleri — BAYKAL APHS · Abkant Pres (Sac / Büküm Makinesi)"; açıklama paragrafı Baykal APHS'e uyarlandı, iki satır |
| 2 | LAB 1 (1/2) | yok | yok | yok | Başlık bandındaki uzun makine adı sağdaki dekoratif daireye ve "Çıktı" etiketine değmiyor; Baykal APHS bağlam kutusu üç satır; şema kutuları ("Üst çene + alt kalıp", "Işık bariyeri + çift el", "STO / Emniyet valfi") kutulara sığıyor; Soru 1–5 (Baykal APHS'e uyarlanan Word cevaplarıyla), cevaplardaki "→" okları düzgün |
| 3 | LAB 1 (2/2) | yok | yok | yok | Soru 6–8 (güncel Word cevapları) + Evidence Pack notu; sayfanın kalanı boş |
| 4 | LAB 2 (1/2) | yok | yok | yok | Görev B tablosunun ilk 2 satırı |
| 5 | LAB 2 (2/2) | yok | yok | yok | Tablo başlığı ikinci sayfada tekrar ediyor; kalan 4 satır + Evidence Pack |
| 6 | LAB 3 (1/2) | yok | yok | yok | "Baykal APHS'nin kapıları (ipucu)" kutusu iki satır; risk tablosunun 1. sütun başlığı iki satıra kırılıyor, başlık satırına sığıyor; dar L/S/E sütunlarında metin çok satıra kırılıyor ama kesilmiyor |
| 7 | LAB 3 (2/2) | yok | yok | — | Yalnızca "Altın kural" + Evidence Pack (birlikte tutuldu) |
| 8 | LAB 4 | yok | yok | yok | Tek sayfa; MEVCUT/HEDEF kutuları eşit yükseklikte |
| 9 | LAB 5 (1/2) | yok | yok | yok | Zafiyet kaydında "Baykal APHS Component X (CNC/PLC firmware kütüphanesi)" tek satır; Soru 1 "Bileşen Var mı?" maddesi güncel Word cevabıyla iki satır; Soru 1–4 |
| 10 | LAB 5 (2/2) | yok | yok | yok | Soru 5 bütün olarak + Evidence Pack |
| 11 | LAB 6 (1/2) | yok | yok | yok | Senaryo kutusu Word metniyle |
| 12 | LAB 6 (2/2) | yok | yok | — | Yalnızca "En sık hata" + Evidence Pack (birlikte tutuldu) |
| 13 | LAB 7 | yok | yok | yok | Tek sayfa; akış şeması 5 kutu tek satırda; karar tablosunda "Fail-Safe" satır sonunda tireden kırılıyor (metin tam) |

Sonuç: hiçbir sayfada taşan, kesilen veya üst üste binen metin ya da boş kalan cevap alanı yok. Bazı föylerin ikinci sayfası kısa (3, 5, 7, 10, 12); bu, soru bloklarının ve son not kutularının bölünmemesi kuralından kaynaklanıyor.

---
*Bu bir eğitim çıktısıdır, resmî denetim değildir.*

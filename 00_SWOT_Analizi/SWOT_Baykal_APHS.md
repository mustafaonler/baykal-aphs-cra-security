# SWOT Analizi — Baykal APHS Hidrolik Abkant Pres (Safety 4.0)

Bu doküman, Baykal APHS hidrolik abkant pres (sac büküm makinesi) için **siber güvenlik** ve **fonksiyonel emniyet** bakışıyla hazırlanmış bir SWOT analizidir. Makineye dair her bilgi, bu repodaki 7 laboratuvar föyünden ([foyler/](../foyler/)) alınmıştır; her maddenin sonunda dayandığı föy parantez içinde belirtilir.

**Makine tanımı.** Tehlike kaynağı, tonlarca kuvvetle aşağı inen **hidrolik üst çene (koç)** ile **alt kalıp** arasındaki kapanma bölgesidir; ayrıca büküm sırasında sacın savrulması ve **CNC arka dayama eksenlerinin (X, R, Z)** hareketi çarpma ve sıkışma riski oluşturur (LAB 1). Koruma zinciri **ışık bariyeri + çift el kumandası → Safety PLC → STO / hidrolik emniyet valfi** şeklindedir ve normal kontrol yolundan ayrı bir "safety yolu" olarak tanımlanır (LAB 1). Makinede **internete açık bir uzak bakım modülü** bulunur; Normal PLC ile Safety PLC ise bir **dijital kesişim noktası** üzerinden haberleşir (LAB 1, LAB 4).

> Föy referansları: LAB 1 Safety Architecture · LAB 2 IEC 62443 Mini Workshop · LAB 3 Threat & Risk · LAB 4 Secure Remote Access · LAB 5 SBOM / CVE / Patch · LAB 6 CRA Incident Simulation · LAB 7 AI Safety Challenge

---

## Özet SWOT matrisi

| | **Yararlı** | **Zararlı** |
|---|---|---|
| **İç (makine)** | **S — Güçlü yönler**<br>• Normal kontrolden ayrı emniyet zinciri<br>• Yedekli, kendini teşhis eden Safety PLC<br>• Işık bariyeri + çift el kumandası<br>• Üst çeneyi konumunda tutan safe state<br>• En yüksek seviyede (PLr e) tasarım hedefi | **W — Zayıf yönler**<br>• İnternete doğrudan açık uzak bakım modülü<br>• Paylaşılan "admin/admin" servis hesabı<br>• Şifresiz port 80 HMI web arayüzü<br>• Zayıf Wi-Fi ve kilitsiz USB'ler<br>• Uzaktan ulaşılabilir, kritik (CVSS 9.8) v2.4 firmware zafiyeti<br>• Normal PLC ↔ Safety PLC dijital kesişim noktası |
| **Dış (çevre)** | **O — Fırsatlar**<br>• IEC 62443 zone/conduit segmentasyonu<br>• Jump Server + VPN + MFA ile güvenli uzak erişim<br>• Test tezgâhında yama doğrulama<br>• Telafi edici ağ önlemleri<br>• YZ destekli kamera ile ek koruma katmanı<br>• CRA olay bildirim akışının hazırlanması | **T — Tehditler**<br>• Uzak bakım yolundan sızıp ışık bariyerini devre dışı bırakan saldırgan (S=3)<br>• Kötü niyetli iç personel (USB / Wi-Fi)<br>• Port 80 HMI'dan arka dayama manipülasyonu<br>• Servis hesabının ele geçirilmesi<br>• CRA sürelerinde kanıt ve log kaybı<br>• YZ'nin eli sac sanması / kamera manipülasyonu |

---

## S — Güçlü yönler (makinenin iç özellikleri)

1. **Emniyet zinciri normal kontrolden ayrı.** Işık bariyeri + çift el → Safety PLC → STO / emniyet valfi → Safe State hattı, şemada "SAFETY YOLU - koruma - AYRI" olarak normal üretim kontrolünden ayrılmıştır. (LAB 1)
2. **Safety PLC yedekli ve kendini teşhis ediyor.** Safety PLC yalnızca insan güvenliğinden sorumludur; yedekli (redundant) mimarisi ve iç teşhisi (self-diagnostic) sayesinde arıza anında sistemi güvenli duruma geçirir. (LAB 1)
3. **Işık bariyeri + çift el kumandası.** Operatörün eli üst çene ile kalıp arasındaki tehlikeli bölgedeyken üst çenenin inmesini engeller veya inişi anında durdurur. (LAB 1)
4. **Hidrolik prese uygun safe state.** STO ve hidrolik emniyet valfleri pompa motorunun enerjisini keser; safe state, üst çenenin kendi ağırlığıyla düşmemesi için onu bulunduğu konumda tutmayı ve kendiliğinden yeniden çalışmamayı da kapsar. (LAB 1)
5. **Yüksek güvenilirlik hedefi.** El/parmak ezilme riski çok yüksek olduğu için emniyet fonksiyonu genellikle en yüksek seviyede (PLr e; ISO 13849-1 / IEC 62061) tasarlanır. (LAB 1)
6. **Emniyet ayrı bir bölge olarak tanımlı.** Zone ayrımında Safety PLC, üretim kontrolünden ve dış bağlantılardan ayrı bir "Safety Zone" içinde yer alır. (LAB 2)

## W — Zayıf yönler (makinenin iç açıkları)

1. **Uzak bakım modülü internete doğrudan açık.** Modül ve CNC kontrol ünitesi internete doğrudan açık; erişim portları 7/24 açık ve oturumlar kayıt altına alınmıyor. (LAB 2, LAB 4)
2. **Paylaşılan "admin/admin" hesabı.** Servis mühendisleri şifresiz portlar ve ortak "admin/admin" parolasıyla bağlanıyor; kişiye özel ve izlenebilir hesap yok. (LAB 2, LAB 4)
3. **Şifresiz port 80 HMI ve segmentasyon eksikliği.** HMI web arayüzüne ağ üzerinden şifresiz erişilebiliyor; makine ağında segmentasyon veya uç nokta koruma katmanı bulunmuyor. (LAB 3, LAB 4)
4. **Zayıf Wi-Fi ve kilitsiz USB'ler.** Fiziksel ya da yerel ağ erişimi olan biri, zayıf Wi-Fi ağı veya kilitsiz USB üzerinden makineye zararlı script yükleyebilir; föydeki ipucu kutusunda Wi-Fi parolasının kartonda yazılı olduğu belirtilir. (LAB 2, LAB 3)
5. **Kritik firmware zafiyeti.** CNC/PLC firmware kütüphanesinin v2.4 sürümü kritik bir zafiyetten (CVSS 9.8) etkileniyor ve uzak bakım modülü üzerinden ulaşılabilir durumda. (LAB 5)
6. **Dijital kesişim noktası.** Safety PLC, durum ve hata bilgisini aktarmak için dijital kesişim noktası üzerinden Normal PLC ile haberleşiyor; bu köprü, emniyet fonksiyonuna giden bir siber saldırı yolu oluşturuyor. (LAB 1, LAB 4)

## O — Fırsatlar (dış)

1. **IEC 62443 zone/conduit segmentasyonu.** Varlıklar Hücre Kontrol, Emniyet ve Kurumsal/Dış Bağlantı bölgelerine ayrılabilir; her geçişte (conduit) bütünlük, MFA, zararlı yazılım taraması ve protokol filtrelemesi denetlenebilir. (LAB 2)
2. **Güvenli uzak erişim mimarisi.** Jump Server, VPN, MFA, kişisel hesaplar, tam oturum kaydı ve varsayılan olarak kapalı (Just-In-Time) portlarla uzak bakım güvenli hale getirilebilir. (LAB 2, LAB 4)
3. **Yamaların test ortamında doğrulanması.** Yamalar önce üreticinin simülasyon ortamında veya fabrikadaki test/laboratuvar tezgâhında denenir; ardından fonksiyonel emniyet doğrulaması ve ışık bariyeri tepki süresi ölçümleri yeniden yapılabilir. (LAB 5)
4. **Telafi edici önlemler.** Yama hemen uygulanamazsa ağ izolasyonu, uzak erişim portlarının kapatılması ve sıkılaştırılmış firewall kurallarıyla risk geçici olarak düşürülebilir. (LAB 5)
5. **YZ destekli kamera ile ek katman.** Büküm alanını izleyen kamera, %99.9 güven eşiği, izleme (monitoring) ve "insana sor" moduyla fiziksel ışık bariyerinin üzerine ek bir koruma katmanı olarak eklenebilir. (LAB 7)
6. **CRA olay bildirim akışının hazırlanması.** 24 saatte erken uyarı, 72 saatte olay bildirimi ve 14 günde son rapor adımları önceden planlanırsa, bir olay anında yasal yükümlülükler zamanında karşılanabilir. (LAB 6)

## T — Tehditler (dış)

1. **Uzak bakım yolundan sızan dış saldırgan.** Saldırgan internete açık modül ve admin/admin parolasıyla içeri girip lazer koruma parametrelerini değiştirebilir; ışık bariyeri devre dışı kalırsa operatörün elleri üst çene altında ezilebilir (S=3, öncelik 1). (LAB 1, LAB 3, LAB 4)
2. **Kötü niyetli iç personel.** Kilitsiz USB veya zayıf Wi-Fi üzerinden zararlı script yüklenip büküm basıncı ve hızı maksimuma çıkarılabilir; bu, hidrolik valf blokajı veya gövde patlamasıyla operatöre şiddetli darbeye yol açabilir (S=3, skoru düşük). (LAB 3)
3. **HMI üzerinden arka dayama manipülasyonu.** Yetkisiz bir kullanıcı port 80 HMI'dan arka dayama eksenlerinin (X, R, Z) koordinatlarını bozabilir; sac levhanın geri tepmesi operatöre çarpabilir (skor 8). (LAB 3)
4. **Servis hesabının ele geçirilmesi.** Servis hesabına gece tanınmayan bir konumdan girilirse PLC konfigürasyonu değişmiş olabilir ve ışık perdesi parametreleri doğrulanmadan makine çalışmaya devam edebilir. (LAB 6)
5. **CRA yükümlülüklerinde kanıt kaybı.** Olay sonrası makine resetlenir veya loglar korunmazsa, 24 saat / 72 saat / 14 gün bildirimleri için gereken event loglar, ağ trafiği ve adli imajlar kaybolur. (LAB 6)
6. **YZ başarısızlıkları.** YZ modeli operatörün elini "sac levha" sanıp üst çenenin inmesine onay verebilir; kamera lensi yağlanabilir, üzeri kapatılabilir ya da sensöre lazer tutularak girdi manipüle edilebilir. (LAB 7)

---

## Strateji (SWOT → aksiyon)

| Strateji | Aksiyon | Föy |
|---|---|---|
| **S-O** (güçlü yönle fırsatı kullan) | Ayrı tanımlı Safety Zone'u, Üretim PLC ↔ Safety PLC geçişinde emniyet parametrelerinin manipülasyonunu engelleyen katı protokol filtrelemesiyle resmî bir conduit hâline getir. | LAB 1, LAB 2 |
| **S-O** | YZ kamerasını yalnızca ek katman olarak kullan: YZ "OK" verse bile fiziksel ışık bariyeri eli algıladığında Safety PLC YZ kararını ezsin ve STO devreye girsin; nihai büküm onayı operatörde kalsın. | LAB 1, LAB 7 |
| **W-O** (fırsatla zayıflığı kapat) | Uzak bakım modülünü doğrudan internetten çıkar; erişimi Jump Server + VPN + MFA + kişisel hesap + tam oturum kaydı + Just-In-Time port açma ile sınırla. | LAB 2, LAB 4 |
| **W-O** | v2.4 firmware yamasını önce test tezgâhında doğrula, ardından fonksiyonel emniyet testlerini yeniden çalıştır; yama gecikirse ağ izolasyonu ve firewall kurallarıyla telafi et. | LAB 5 |
| **S-T** (güçlü yönle tehdidi karşıla) | Emniyet zincirinin kurumsal ağdan, uzak bakım modülünden ve normal üretim kontrol mantığından mantıksal/fiziksel olarak tamamen izole edilmesini gereksinim olarak tanımla. | LAB 4 |
| **S-T** | Bir olay şüphesinde makineyi önce safe state'e al; ardından Safety PLC parametrelerini ve ışık bariyerinin muting ayarlarını çevrimdışı bir terminalden okuyarak doğrula. | LAB 1, LAB 6 |
| **W-T** (zayıflığı azalt, tehditten kaçın) | admin/admin ve şüpheli servis hesabını derhal kapat, parolaları sıfırla, MFA kur; S=3 olup skoru düşük kalan senaryoyu risk matrisinde kırmızıya çekerek görünür kıl. | LAB 3, LAB 4, LAB 6 |
| **W-T** | Olay anında makineyi resetleme; CNC, uzak bakım modülü ve PLC loglarını, pcap kayıtlarını ve RAM imajlarını koruyarak CRA'nın 24s / 72s / 14g bildirimlerini besle. | LAB 6 |

---

*Bu doküman bir eğitim çıktısıdır; resmî denetim veya uygunluk değerlendirmesi değildir.*

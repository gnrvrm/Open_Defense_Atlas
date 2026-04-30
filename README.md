# Open Defense Atlas

Statik MVP: Avrupa, Amerika, Asya, Afrika ve Avustralya/Okyanusya kıtalarındaki ülkeler üzerinden açık kaynaklı savunma kabiliyetlerini harita üzerinde, kaynak ve belirsizlik bilgisiyle incelemek için hazırlanmış ilk prototip.

## Canlı demo

[Open Defense Atlas'ı GitHub Pages üzerinde aç](https://gnrvrm.github.io/Open_Defense_Atlas/)

## Çalıştırma

Önerilen kullanım:

```powershell
C:\msys64\ucrt64\bin\python3.exe -B server.py
```

Ardından tarayıcıda `http://127.0.0.1:5173/` adresini açın. Uygulama build adımı gerektirmez; Leaflet, Turf ve ikonlar CDN üzerinden yüklenir.

## GitHub Pages

GitHub Pages yayını statiktir. `index.html`, `styles.css`, `src/` ve `api/research/*.json` dosyaları doğrudan `main` branch kökünden servis edilir.

Canlı yayında Python çalışmadığı için OSINT kuyruğu `api/research/<country_id>.json` statik araştırma çıktılarından beslenir. Yerel geliştirmede `server.py` aynı veriyi `/api/research/<country_id>` üzerinden dinamik döndürmeye devam eder.

Statik araştırma çıktısını release öncesi güncellemek için:

```powershell
C:\msys64\ucrt64\bin\python3.exe -B scripts\export_static_research.py
```

## MVP kapsamı

- Avrupa, Amerika, Asya, Afrika ve Avustralya/Okyanusya kıtalarını kapsayan ülke seçim listesi
- Tüm ülkeler için `src/generatedProfiles.js` üzerinden üretilen generated verified profiles
- Ülke listesi dosyalarından gelen kimlik, merkez, sınır kutusu, kıyı ve kaynak kimliğiyle otomatik profil üretimi
- Askeri güç özeti
- Askeri güç kutularında tip/adet detay paneli
- GlobalFirepower 2026 sayısal metriklerinden üretilen statik personel, kara, hava ve deniz toplamları
- Kaynak, adet/durum, rol ve menzil alanlarıyla genişletilmiş envanter listesi
- Ülke açıldığında otomatik açık kaynak araştırması
- Kaynak adaptörü üzerinden GlobalFirepower, FlightGlobal, SIPRI, UNROCA, World Bank WDI, NATO, EDA, UCDP, UN Peacekeeping ve ACLED aday kaynağıyla bulgu kuyruğu
- Tüm ülkeler için aynı ağırlıklandırma mantığıyla üretilen kaynak sentezi kartı
- Doğru ve anlamlı konum verisi yoksa boş kalan harita nokta katmanı
- Taarruz, hava, kara, savunma, sensör ve deniz katmanları
- Seçilen envanter ürünü için sınır çevresi menzil alanı
- Menzil ve kapsama halkaları
- Kaynak inceleme kuyruğu
- Hassas konum yerine yaklaşık/grid seviyesinde gösterim

## Yeni ülke ekleme yolu

Yeni bir ülke eklerken ana uygulama mantığına dokunmadan aşağıdaki ilgili katmanları güncelleyin:

1. `src/europeProfiles.js`
   - Avrupa kapsamındaki ülkeler için profil girdilerini listeler.
   - Yeni ülkeyi hızlıca aktif etmek için ülke kimliği, ad, merkez, yaklaşık sınır kutusu, kıyı bilgisi ve varsa GlobalFirepower ülke kimliği eklenir; profil `src/generatedProfiles.js` tarafından üretilir.

2. `src/americasProfiles.js`
   - Amerika kıtasındaki ülkeler için profil girdilerini listeler.
   - Ülke kimliği, Türkçe ad, merkez, yaklaşık sınır kutusu, kıyı bilgisi, bölge ve varsa GlobalFirepower ülke kimliği eklenir; profil `src/generatedProfiles.js` tarafından üretilir.

3. `src/asiaProfiles.js`
   - Asya kıtasındaki ülkeler için profil girdilerini listeler.
   - Avrupa güvenlik çevresi içinde zaten bulunan transkıtasal ülkeler tekrar eklenmez; mevcut ülke kaydı seçim listesinde kullanılmaya devam eder.

4. `src/africaProfiles.js`
   - Afrika kıtasındaki ülkeler için profil girdilerini listeler.
   - Afrika ülkeleri için hassas üs veya birlik koordinatı yerine ülke/bölge ölçeğinde genelleştirilmiş gösterim kullanılır.

5. `src/oceaniaProfiles.js`
   - Avustralya/Okyanusya kapsamındaki ülkeler için profil girdilerini listeler.
   - Ada devletlerinde düzenli ordu yoksa güvenlik/sahil güvenlik profili gösterilir.

6. `src/generatedProfiles.js`
   - Tüm kıtalar için ortak generated verified profile üreticisidir.
   - GlobalFirepower/GFP metrikleri, FlightGlobal hava referansı, SIPRI transfer/harcama kaydı, World Bank WDI, UNROCA devlet raporu, NATO/EDA bölgesel harcama verisi ve UCDP/UN Peacekeeping/ACLED bağlam kaynaklarıyla kategori seviyesi askeri güç, envanter, bölgesel harita işaretleri ve kaynak kuyruğu üretir.
   - Ülke ortasına sentetik tesis noktası üretmez; harita noktaları varsa `src/osintSites.js` üzerinden gelir.

7. `src/osintSites.js`
   - Haritada görünecek doğrulanmış ve anlamlı açık kaynak noktalarını tutar.
   - Varsayılan olarak boş bırakılır; yalnızca savunma kapasitesi açısından anlamlı, doğru, güncel ve kaynaklı veri varsa nokta eklenir.
   - Gerçek zamanlı birlik/araç, mühimmat deposu, aktif hazırlık veya hassas askeri koordinat eklenmez.
   - Eksik örnek listeler haritaya çizilmez; her nokta `meaningful: true` ile açıkça işaretlenmedikçe görünmez.

8. `src/gfpMetrics.js` ve `src/profileMetrics.js`
   - GFP sayısal alanlarını generated ülke profillerinde sayı olarak gösterir.
   - Kaynak etiketi doğrudan veri değeri gibi kullanılmamalıdır; `scripts/check_strength_metrics.mjs` bu hatayı yakalamak için çalıştırılır.
   - Metrik tablosunu yenilemek için `node scripts\build_gfp_metrics.mjs` komutunu çalıştırın.

9. `src/countryProfiles.js`
   - Elle derinleştirilmiş demo profilleri artık burada tutulmaz.
   - Yalnızca generated profiller üstüne gerekli manuel kalite düzeltmesi veya doğrulanmış küçük override eklemek için kullanılır.
   - Override eklenirse kaynak, tarih, güven ve hassasiyet filtresi korunmalıdır; platform bağımlı mühimmatlarda `rangeMode: "platform"` sabit coğrafi daire çizmez.

10. `server.py`
   - `/api/research/<country_id>` için üretici, resmi kurum, GlobalFirepower, FlightGlobal, SIPRI, UNROCA, World Bank WDI, NATO, EDA, UCDP, UN Peacekeeping ve ACLED gibi kaynak adaptörlerini ekleyin.
   - Ülkeye özel adaptör yoksa uygulama standart açık kaynak referans kuyruğunu ve kaynak sentezi özetini döndürür.
   - Adaptörler canlı operasyonel veri üretmemeli; yalnızca yayımlanmış kaynak, tarih, menzil/rol ve doğrulama durumunu döndürmelidir.

## Kaynak sentezi

`server.py` her ülke için kaynakları aynı katalogdan üretir ve ilk bulgu kartı olarak `Open Defense Atlas` kaynak sentezini ekler. Sentez; kuvvet toplamı, hava filosu, transfer/tedarik, harcama, resmi raporlama, çatışma bağlamı ve barışı koruma katkısı gibi kapsam alanlarını toplar. Resmi veya metodolojisi açık kaynaklar daha yüksek ağırlık alır; kayıt/API anahtarı isteyen ACLED şimdilik `aday` olarak görünür.

Aktif açık kaynak havuzu:

- GlobalFirepower: kategori seviyesi kuvvet toplamları
- FlightGlobal / Cirium World Air Forces 2026: hava platformu tip/adet ve sipariş bağlamı
- SIPRI Arms Transfers Database: transfer ve tedarik çapraz kontrolü
- SIPRI Military Expenditure Database + World Bank WDI: askeri harcama ve bütçe trendi
- UNROCA: devlet raporlaması ve konvansiyonel silah transferleri
- NATO Defence Expenditures: NATO üyeleri için ortak harcama tanımı
- EDA Defence Data: EDA ülkeleri için savunma harcaması/yatırım göstergeleri
- UCDP Conflict Data: çatışma bağlamı
- UN Peacekeeping contributors: dış görev ve barışı koruma katkısı
- ACLED: API anahtarı eklenince olay bağlamı için aday kaynak

11. `api/research/*.json`
   - GitHub Pages yayını için statik araştırma çıktısıdır.
   - `scripts/export_static_research.py` ile yeniden üretilir; elle düzenlemek yerine kaynak adaptörünü veya ülke profilini güncelleyin.

Bu katmanlar tamamlandığında ülke seçim listesine otomatik dahil olur.

## Ürün sınırı

Bu prototip gerçek zamanlı hedefleme, canlı birlik takibi veya hassas askeri koordinat sunmaz. Demo verileri genelleştirilmiştir. Canlı veri toplama eklendiğinde ham bulgular önce kaynak, tarih, güven ve hassasiyet filtresinden geçmelidir.

Harita nokta katmanı yalnızca doğru, anlamlı ve kaynaklı veri varsa doldurulur. Eksik örnek listeler veya yalnızca kamusal havaalanı/liman referansları savunma kapasitesi hakkında anlamlı bir sonuç üretmediği için çizilmez.

## Önerilen sonraki mimari

- Frontend: React veya Next.js
- Harita: MapLibre GL veya Leaflet + deck.gl
- Backend: FastAPI veya NestJS
- Veritabanı: PostgreSQL + PostGIS
- Veri işleme: Python ingestion pipeline
- Arama: Meilisearch veya OpenSearch
- Kuyruk: Redis veya PostgreSQL job queue

## Veri modeli taslağı

- `countries`
- `asset_categories`
- `platforms`
- `inventories`
- `sites`
- `deployments`
- `range_profiles`
- `sources`
- `observations`
- `review_decisions`

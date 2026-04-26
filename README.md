# Open Defense Atlas

Statik MVP: Avrupa ülkeleri üzerinden açık kaynaklı savunma kabiliyetlerini harita üzerinde, kaynak ve belirsizlik bilgisiyle incelemek için hazırlanmış ilk prototip.

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

- 51 ülkelik Avrupa ve Avrupa güvenlik çevresi seçim listesi
- Türkiye, Polonya ve Yunanistan için elle derinleştirilmiş demo profilleri
- Diğer Avrupa ülkeleri için standartlaştırılmış ülke ölçeği savunma profilleri
- Askeri güç özeti
- Askeri güç kutularında tip/adet detay paneli
- Kaynak, adet/durum, rol ve menzil alanlarıyla genişletilmiş envanter listesi
- Ülke açıldığında otomatik açık kaynak araştırması
- Kaynak adaptörü üzerinden Roketsan/SIPRI/UNROCA bulgu kuyruğu
- Harita üzerinde genelleştirilmiş bölge işaretleri
- Taarruz, hava, kara, savunma, sensör ve deniz katmanları
- Seçilen envanter ürünü için sınır çevresi menzil alanı
- Menzil ve kapsama halkaları
- Kaynak inceleme kuyruğu
- Hassas konum yerine yaklaşık/grid seviyesinde gösterim

## Yeni ülke ekleme yolu

Yeni bir ülke eklerken ana uygulama mantığına dokunmadan aşağıdaki iki yeri güncelleyin:

1. `src/europeProfiles.js`
   - Avrupa kapsamındaki ülkeler için standart profil üretir.
   - Yeni ülkeyi hızlıca aktif etmek için ülke kimliği, ad, merkez, yaklaşık sınır kutusu, kıyı bilgisi ve varsa GlobalFirepower ülke kimliği eklenir.

2. `src/countryProfiles.js`
   - Türkiye, Polonya, Yunanistan gibi elle derinleştirilmiş profiller burada tutulur.
   - Tam ülke profili, özet metrikler, askeri güç detay tabloları, envanter kartları, genelleştirilmiş bölgeler ve yerel kaynak kuyruğu burada yönetilir.
   - Platform bağımlı havadan atılan mühimmatlarda `rangeMode: "platform"` kullanın; bu sabit coğrafi daire çizmez.
   - Kıyı/deniz unsurları için `coastal`, ülke sınırı çevresi ölçekli sistemler için `border`, sadece bölgesel bilgi için `regional` kullanın.

3. `server.py`
   - `/api/research/<country_id>` için üretici, resmi kurum, GlobalFirepower, FlightGlobal, SIPRI ve UNROCA gibi kaynak adaptörlerini ekleyin.
   - Ülkeye özel adaptör yoksa uygulama standart açık kaynak referans kuyruğunu döndürür.
   - Adaptörler canlı operasyonel veri üretmemeli; yalnızca yayımlanmış kaynak, tarih, menzil/rol ve doğrulama durumunu döndürmelidir.

4. `api/research/*.json`
   - GitHub Pages yayını için statik araştırma çıktısıdır.
   - `scripts/export_static_research.py` ile yeniden üretilir; elle düzenlemek yerine kaynak adaptörünü veya ülke profilini güncelleyin.

Bu iki katman tamamlandığında ülke seçim listesine otomatik dahil olur.

## Ürün sınırı

Bu prototip gerçek zamanlı hedefleme, canlı birlik takibi veya hassas askeri koordinat sunmaz. Demo verileri genelleştirilmiştir. Canlı veri toplama eklendiğinde ham bulgular önce kaynak, tarih, güven ve hassasiyet filtresinden geçmelidir.

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

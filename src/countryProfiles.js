(function () {
  const FLIGHTGLOBAL_2025 = "https://www.flightglobal.com/defence/2025-world-air-forces-directory/160846.article";
  const SIPRI = "https://www.sipri.org/databases/armstransfers";
  const UNROCA = "https://www.unroca.org/en/reporting/";

  const profiles = [
    {
      id: "poland",
      name: "Polonya",
      headline: "Polonya savunma görünümü",
      center: [52.0, 19.1],
      zoom: 6,
      sourceScore: 70,
      strength: {
        activePersonnel: "250K",
        reservePersonnel: "350K",
        landSystems: "57K+",
        aircraft: "457",
        navalAssets: "63",
        note:
          "Polonya profili GFP 2026 kategori toplamları, FlightGlobal/Cirium 2025 hava aracı kırılımı ve üretici/resmi tedarik kaynaklarıyla demo seviyesinde yapılandırıldı.",
        details: {
          personnel: {
            title: "Personel Detayı",
            source: "Global Firepower 2026",
            sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland",
            updated: "2026",
            note: "GFP değerleri ülke ölçeğinde tahmini toplamlar olarak ele alınır; birlik konuşlanması veya anlık hazırlık göstermez.",
            rows: [
              { type: "Toplam askeri personel", role: "Tahmini toplam", active: "650,000", activeLabel: "toplam" },
              { type: "Aktif personel", role: "Toplam", active: "250,000", activeLabel: "aktif" },
              { type: "Yedek personel", role: "Toplam", active: "350,000", activeLabel: "yedek" },
              { type: "Paramiliter", role: "Toplam", active: "50,000", activeLabel: "toplam" },
              { type: "Hava kuvvetleri personeli", role: "GFP tahmini", active: "16,500" },
              { type: "Kara kuvvetleri personeli", role: "GFP tahmini", active: "110,000" },
              { type: "Deniz kuvvetleri personeli", role: "GFP tahmini", active: "8,240" }
            ]
          },
          land: {
            title: "Kara Sistemi Detayı",
            source: "Global Firepower 2026",
            sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland",
            updated: "2026",
            note:
              "Bu kırılım kategori seviyesindedir; Abrams, K2, Leopard, Krab, K9 ve Homar gibi alt modeller ayrıca doğrulanmalıdır.",
            rows: [
              { type: "Tank", role: "Ana muharebe / zırhlı unsur", active: "798", activeLabel: "stok", ready: "519*" },
              { type: "Araç", role: "Zırhlı, destek, lojistik ve özel araçlar", active: "57,972", activeLabel: "stok", ready: "37,682*" },
              { type: "Kundağı motorlu topçu", role: "Ateş destek", active: "593", activeLabel: "stok", ready: "385*" },
              { type: "Çekili topçu", role: "Ateş destek", active: "0", activeLabel: "stok" },
              { type: "ÇNRA / roket topçusu", role: "Roket ateş destek", active: "298", activeLabel: "stok", ready: "194*" }
            ]
          },
          aircraft: {
            title: "Hava Aracı Detayı",
            source: "FlightGlobal World Air Forces 2025 / Cirium fleets data",
            sourceUrl: FLIGHTGLOBAL_2025,
            updated: "2025",
            note:
              "Aktif ve sipariş ayrımı kaynakta yayımlandığı şekildedir; modernizasyon teslimatları yıl içinde değişebilir.",
            rows: [
              { type: "F-16C", role: "Muharip uçak", active: 36 },
              { type: "F-16D", role: "Eğitim/muharip eğitim", active: 12 },
              { type: "F-35A", role: "Muharip uçak", ordered: "29*" },
              { type: "FA-50GF/PL", role: "Hafif muharip / eğitim", active: 12, ordered: 36 },
              { type: "MiG-29", role: "Muharip uçak", active: 23 },
              { type: "Su-22", role: "Taarruz / muharip görev", active: 32 },
              { type: "Saab 340", role: "AEW erken ihbar", active: 2 },
              { type: "An-28/M28", role: "Nakliye", active: 23 },
              { type: "C-130E/H", role: "Nakliye", active: 5, ordered: 5 },
              { type: "C295", role: "Nakliye", active: 16 },
              { type: "M-346", role: "Jet eğitim", active: 16 },
              { type: "PZL-130", role: "Temel eğitim", active: 26 },
              { type: "SW-4", role: "Helikopter eğitim", active: 24 },
              { type: "AW101", role: "Deniz helikopteri", active: 4 },
              { type: "M-28B", role: "Deniz nakliye", active: 7 },
              { type: "W-3", role: "Deniz/arama kurtarma helikopteri", active: 7 },
              { type: "AH-64E", role: "Taarruz helikopteri", ordered: 96 },
              { type: "AW149", role: "Kara helikopteri", active: 4, ordered: 26 },
              { type: "Mi-8/17", role: "Kara helikopteri", active: 11 },
              { type: "S-70i", role: "Özel görev helikopteri", active: 4 }
            ]
          },
          naval: {
            title: "Deniz Unsuru Detayı",
            source: "Global Firepower 2026 + FlightGlobal 2025 deniz havacılığı",
            sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland",
            updated: "2026",
            note:
              "GFP deniz platformlarını kategori seviyesinde verir; deniz havacılığı satırları FlightGlobal/Cirium kaynaklıdır.",
            rows: [
              { type: "Toplam deniz platformu", role: "GFP toplam varlık", active: "63", activeLabel: "adet" },
              { type: "Toplam tonaj", role: "GFP hesaplaması", active: "55,530 t", activeLabel: "tonaj" },
              { type: "Fırkateyn", role: "Suüstü muharip", active: "2", activeLabel: "adet" },
              { type: "Korvet", role: "Suüstü muharip / kıyı görevleri", active: "2", activeLabel: "adet" },
              { type: "Denizaltı", role: "Sualtı platformu", active: "1", activeLabel: "adet" },
              { type: "Devriye gemisi", role: "Kıyı/açık deniz devriye", active: "3", activeLabel: "adet" },
              { type: "Mayın harbi", role: "Mayın karşı tedbir", active: "29", activeLabel: "adet" },
              { type: "AW101", role: "Deniz helikopteri", active: 4 },
              { type: "M-28B", role: "Deniz nakliye", active: 7 },
              { type: "W-3", role: "Deniz helikopteri", active: 7 }
            ]
          }
        }
      },
      outline: [
        [54.8, 14.2],
        [54.25, 19.2],
        [54.1, 23.7],
        [52.2, 23.9],
        [49.1, 22.8],
        [49.0, 18.8],
        [50.4, 14.5],
        [54.8, 14.2]
      ],
      assets: [
        {
          id: "pl-atk-1",
          category: "attack",
          name: "HIMARS / Homar-A",
          family: "Çok namlulu roket/füze sistemi",
          role: "Derin hassas ateş destek",
          quantity: "tedarik ve envanter programı",
          rangeKm: 300,
          rangeLabel: "300 km sınıfı",
          rangeMode: "border",
          confidence: 0.68,
          defaultSelected: true,
          status: "kaynaklı",
          sourceTag: "Lockheed Martin / resmi teslimat duyuruları",
          sourceUrl: "https://news.lockheedmartin.com/2023-05-15-Poland-Receives-Delivery-of-First-HIMARS"
        },
        {
          id: "pl-atk-2",
          category: "attack",
          name: "K239 Chunmoo / Homar-K",
          family: "Roket topçusu sistemi",
          role: "Çok kalibreli ateş destek",
          quantity: "tedarik programı",
          rangeLabel: "mühimmat tipine bağlı",
          rangeMode: "regional",
          confidence: 0.56,
          status: "inceleme",
          sourceTag: "Açık kaynak tedarik duyuruları",
          sourceUrl: SIPRI
        },
        {
          id: "pl-atk-3",
          category: "attack",
          name: "AGM-158 JASSM ailesi",
          family: "Havadan atılan stand-off mühimmat",
          role: "Platform bağımlı hassas taarruz",
          quantity: "F-16 entegrasyonlu mühimmat ailesi",
          rangeLabel: "platform bağımlı",
          rangeMode: "platform",
          coverageNote:
            "Havadan atılan mühimmat olduğu için sabit coğrafi menzil halkası çizilmez; harita yalnızca mühimmat ailesini envanter kaydı olarak gösterir.",
          confidence: 0.6,
          status: "inceleme",
          sourceTag: "SIPRI / açık kaynak transfer kayıtları",
          sourceUrl: SIPRI
        },
        {
          id: "pl-def-1",
          category: "defense",
          name: "Wisła / Patriot IBCS",
          family: "Orta/uzun menzilli hava ve füze savunma",
          role: "Katmanlı hava savunma",
          quantity: "batarya programı",
          rangeLabel: "sistem konfigürasyonuna bağlı",
          rangeMode: "border",
          confidence: 0.68,
          status: "kaynaklı",
          sourceTag: "US Army / Northrop Grumman duyuruları",
          sourceUrl: "https://www.army.mil/article/285095/poland_becomes_first_ally_fully_operational_with_ibcs"
        },
        {
          id: "pl-def-2",
          category: "defense",
          name: "Narew / CAMM",
          family: "Kısa/orta menzilli hava savunma",
          role: "Alçak-orta irtifa hava savunma",
          quantity: "program ailesi",
          rangeKm: 25,
          rangeLabel: "25+ km sınıfı",
          rangeMode: "border",
          confidence: 0.62,
          status: "kaynaklı",
          sourceTag: "MBDA Narew programı",
          sourceUrl: "https://www.mbda-systems.com/mbda-and-poland-sign-landmark-narew-project/"
        },
        {
          id: "pl-def-3",
          category: "defense",
          name: "Pilica+ / Piorun SHORAD",
          family: "Kısa menzilli hava savunma",
          role: "Yakın hava savunması",
          quantity: "sistem ailesi",
          rangeMode: "regional",
          confidence: 0.56,
          status: "inceleme",
          sourceTag: "Polonya modernizasyon duyuruları",
          sourceUrl: SIPRI
        },
        {
          id: "pl-air-1",
          category: "air",
          name: "F-16C/D",
          family: "Çok rollü muharip uçak",
          role: "Muharip uçak",
          quantity: "36 F-16C / 12 F-16D",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "pl-air-2",
          category: "air",
          name: "F-35A",
          family: "5. nesil muharip uçak",
          role: "Muharip uçak",
          quantity: "29 sipariş*",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "pl-air-3",
          category: "air",
          name: "FA-50GF/PL",
          family: "Hafif muharip / eğitim uçağı",
          role: "Hafif muharip ve eğitim",
          quantity: "12 aktif / 36 sipariş",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "pl-air-4",
          category: "air",
          name: "MiG-29",
          family: "Muharip uçak",
          role: "Muharip görev",
          quantity: "23 aktif",
          rangeMode: "regional",
          confidence: 0.67,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "pl-air-5",
          category: "air",
          name: "Su-22",
          family: "Taarruz uçağı",
          role: "Taarruz / muharip görev",
          quantity: "32 aktif",
          rangeMode: "regional",
          confidence: 0.65,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "pl-air-6",
          category: "air",
          name: "Saab 340 AEW",
          family: "Havadan erken ihbar",
          role: "AEW erken ihbar",
          quantity: "2 aktif",
          rangeMode: "regional",
          confidence: 0.68,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "pl-air-7",
          category: "air",
          name: "Nakliye uçakları",
          family: "C-130E/H, C295, An-28/M28",
          role: "Taktik nakliye",
          quantity: "44+ aktif / 5 sipariş",
          rangeMode: "regional",
          confidence: 0.66,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "pl-land-1",
          category: "land",
          name: "Tank envanteri",
          family: "Ana muharebe tankları",
          role: "Kara muharebe",
          quantity: "798 stok / 519 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland"
        },
        {
          id: "pl-land-2",
          category: "land",
          name: "Zırhlı/destek araçları",
          family: "Zırhlı, destek, lojistik ve özel araçlar",
          role: "Mekanize ve lojistik kabiliyet",
          quantity: "57,972 stok / 37,682 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland"
        },
        {
          id: "pl-land-3",
          category: "land",
          name: "Kundağı motorlu topçu",
          family: "Krab/K9 sınıfı ateş destek",
          role: "Topçu ateş desteği",
          quantity: "593 stok / 385 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland"
        },
        {
          id: "pl-land-4",
          category: "land",
          name: "ÇNRA / roket topçusu",
          family: "HIMARS, Homar ve diğer roket topçusu",
          role: "Roket ateş destek",
          quantity: "298 stok / 194 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland"
        },
        {
          id: "pl-sns-1",
          category: "sensor",
          name: "IBCS entegre hava savunma ağı",
          family: "Komuta-kontrol ve sensör füzyonu",
          role: "Hava savunma ağı koordinasyonu",
          quantity: "program kaydı",
          rangeMode: "regional",
          confidence: 0.64,
          status: "kaynaklı",
          sourceTag: "US Army IBCS duyurusu",
          sourceUrl: "https://www.army.mil/article/285095/poland_becomes_first_ally_fully_operational_with_ibcs"
        },
        {
          id: "pl-sns-2",
          category: "sensor",
          name: "Hava gözetleme ve AEW ağı",
          family: "Yer radarları ve Saab 340 AEW",
          role: "Erken ihbar ve hava resmi",
          quantity: "2 Saab 340 AEW + yer sensörleri",
          rangeMode: "regional",
          confidence: 0.62,
          status: "kaynaklı",
          sourceTag: "FlightGlobal / açık kaynak radar duyuruları",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "pl-nvl-1",
          category: "naval",
          name: "NSM kıyı savunma sistemi",
          family: "Kıyı konuşlu gemisavar füze",
          role: "Baltık kıyı savunması",
          quantity: "kıyı savunma programı",
          rangeKm: 185,
          rangeLabel: "100+ nm / 185+ km sınıfı",
          rangeMode: "coastal",
          confidence: 0.62,
          status: "kaynaklı",
          sourceTag: "Kongsberg NSM Polonya sözleşmesi",
          sourceUrl: "https://www.kongsberg.com/kda/news/news-archive/2023/kongsberg-signs-naval-strike-missile-coastal-defence-system-contract-with-poland-worth-approximately-nok-16-billion"
        },
        {
          id: "pl-nvl-2",
          category: "naval",
          name: "Fırkateyn ve korvet filosu",
          family: "Suüstü muharip",
          role: "Baltık deniz muharebesi",
          quantity: "2 fırkateyn / 2 korvet",
          rangeMode: "coastal",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland"
        },
        {
          id: "pl-nvl-3",
          category: "naval",
          name: "Denizaltı filosu",
          family: "Sualtı platformu",
          role: "Denizaltı muharebesi",
          quantity: "1 adet",
          rangeMode: "coastal",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland"
        },
        {
          id: "pl-nvl-4",
          category: "naval",
          name: "Mayın harbi ve devriye unsurları",
          family: "Mayın karşı tedbir / devriye",
          role: "Baltık kıyı güvenliği",
          quantity: "29 mayın harbi / 3 devriye",
          rangeMode: "coastal",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland"
        }
      ],
      sites: [
        {
          id: "pl-site-west-air",
          name: "Batı hava faaliyet bölgesi",
          type: "air",
          lat: 52.2,
          lng: 16.8,
          radiusKm: 110,
          precision: "150 km grid",
          status: "Genelleştirilmiş",
          source: "Açık kaynak filo ve üs raporları"
        },
        {
          id: "pl-site-east-defense",
          name: "Doğu hava savunma bölgesi",
          type: "defense",
          lat: 52.1,
          lng: 22.1,
          radiusKm: 135,
          precision: "Bölgesel",
          status: "Yaklaşık",
          source: "Resmi tedarik ve açık raporlar"
        },
        {
          id: "pl-site-central-land",
          name: "Merkez kara hazırlık bölgesi",
          type: "land",
          lat: 51.7,
          lng: 19.3,
          radiusKm: 135,
          precision: "Bölgesel",
          status: "Genelleştirilmiş",
          source: "GFP kategori toplamları ve açık kaynak derlemesi"
        },
        {
          id: "pl-site-baltic-naval",
          name: "Baltık deniz destek bölgesi",
          type: "naval",
          lat: 54.2,
          lng: 18.6,
          radiusKm: 95,
          precision: "100 km grid",
          status: "Genelleştirilmiş",
          source: "Liman ve filo raporları"
        },
        {
          id: "pl-site-sensor",
          name: "Merkez sensör koordinasyon bölgesi",
          type: "sensor",
          lat: 52.2,
          lng: 19.2,
          radiusKm: 150,
          precision: "Bölgesel",
          status: "Genelleştirilmiş",
          source: "IBCS ve hava gözetleme kaynakları"
        }
      ],
      sources: [
        {
          id: "pl-src-gfp",
          title: "2026 Poland Military Strength",
          publisher: "Global Firepower",
          date: "2026-01-01",
          state: "review",
          url: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland",
          summary: "Personel, kara, hava ve deniz kategori toplamları için kullanıldı."
        },
        {
          id: "pl-src-flightglobal",
          title: "World Air Forces 2025 Directory",
          publisher: "FlightGlobal / Cirium",
          date: "2025-01-01",
          state: "review",
          url: FLIGHTGLOBAL_2025,
          summary: "Hava aracı tip/adet kırılımı için kullanıldı."
        },
        {
          id: "pl-src-ibcs",
          title: "Poland becomes first Ally fully operational with IBCS",
          publisher: "US Army",
          date: "2025-05-02",
          state: "verified",
          url: "https://www.army.mil/article/285095/poland_becomes_first_ally_fully_operational_with_ibcs",
          summary: "Polonya entegre hava savunma ağı için kaynak kaydı."
        },
        {
          id: "pl-src-nsm",
          title: "NSM Coastal Defence System contract with Poland",
          publisher: "Kongsberg",
          date: "2023-09-05",
          state: "verified",
          url: "https://www.kongsberg.com/kda/news/news-archive/2023/kongsberg-signs-naval-strike-missile-coastal-defence-system-contract-with-poland-worth-approximately-nok-16-billion",
          summary: "Kıyı savunma/gemisavar kabiliyeti için üretici kaynak kaydı."
        },
        {
          id: "pl-src-sipri",
          title: "SIPRI Arms Transfers Database",
          publisher: "SIPRI",
          date: "2026-04-25",
          state: "review",
          url: SIPRI,
          summary: "Transfer doğrulama ve ülke envanteri çapraz kontrolü için kullanılacak."
        },
        {
          id: "pl-src-unroca",
          title: "UN Register of Conventional Arms",
          publisher: "UNROCA",
          date: "2026-04-25",
          state: "review",
          url: UNROCA,
          summary: "Devlet raporları üzerinden konvansiyonel silah transfer doğrulaması için kullanılır."
        }
      ]
    },
    {
      id: "greece",
      name: "Yunanistan",
      headline: "Yunanistan savunma görünümü",
      center: [39.1, 22.5],
      zoom: 6,
      sourceScore: 68,
      strength: {
        activePersonnel: "142.7K",
        reservePersonnel: "221K",
        landSystems: "56K+",
        aircraft: "560",
        navalAssets: "186",
        note:
          "Yunanistan profili GFP 2026 kategori toplamları, FlightGlobal/Cirium 2025 hava aracı kırılımı ve açık kaynak modernizasyon kayıtlarıyla demo seviyesinde yapılandırıldı.",
        details: {
          personnel: {
            title: "Personel Detayı",
            source: "Global Firepower 2026",
            sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece",
            updated: "2026",
            note: "Bu panel ülke ölçeğinde toplamları gösterir; birlik/ada bazlı konuşlanma bilgisi içermez.",
            rows: [
              { type: "Toplam askeri personel", role: "Tahmini toplam", active: "414,050", activeLabel: "toplam" },
              { type: "Aktif personel", role: "Toplam", active: "142,700", activeLabel: "aktif" },
              { type: "Yedek personel", role: "Toplam", active: "221,350", activeLabel: "yedek" },
              { type: "Paramiliter", role: "Toplam", active: "50,000", activeLabel: "toplam" },
              { type: "Hava kuvvetleri personeli", role: "GFP tahmini", active: "42,600" },
              { type: "Kara kuvvetleri personeli", role: "GFP tahmini", active: "93,500" },
              { type: "Deniz kuvvetleri personeli", role: "GFP tahmini", active: "16,500" }
            ]
          },
          land: {
            title: "Kara Sistemi Detayı",
            source: "Global Firepower 2026",
            sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece",
            updated: "2026",
            note:
              "Bu kırılım kategori seviyesindedir; Leopard, M109, RM-70 ve diğer alt modeller ayrıca doğrulanmalıdır.",
            rows: [
              { type: "Tank", role: "Ana muharebe / zırhlı unsur", active: "1,344", activeLabel: "stok", ready: "914*" },
              { type: "Araç", role: "Zırhlı, destek, lojistik ve özel araçlar", active: "56,416", activeLabel: "stok", ready: "38,363*" },
              { type: "Kundağı motorlu topçu", role: "Ateş destek", active: "589", activeLabel: "stok", ready: "401*" },
              { type: "Çekili topçu", role: "Ateş destek", active: "698", activeLabel: "stok", ready: "475*" },
              { type: "ÇNRA / roket topçusu", role: "Roket ateş destek", active: "152", activeLabel: "stok", ready: "103*" }
            ]
          },
          aircraft: {
            title: "Hava Aracı Detayı",
            source: "FlightGlobal World Air Forces 2025 / Cirium fleets data",
            sourceUrl: FLIGHTGLOBAL_2025,
            updated: "2025",
            note:
              "Aktif/ordered ayrımı kaynakta yayımlandığı şekildedir. Platform bağlı mühimmatlar sabit coğrafi menzil halkası üretmez.",
            rows: [
              { type: "F-16C", role: "Muharip uçak", active: 113 },
              { type: "F-16D", role: "Eğitim/muharip eğitim", active: 39 },
              { type: "Rafale DG/EG", role: "Muharip uçak", active: 19, ordered: 5 },
              { type: "Mirage 2000EG", role: "Muharip uçak", active: 5 },
              { type: "Mirage 2000-5/Mk II", role: "Muharip uçak", active: 24 },
              { type: "F-4E", role: "Taarruz / muharip görev", active: 17 },
              { type: "F-35A", role: "Muharip uçak", ordered: "40*" },
              { type: "ERJ-145", role: "AEW erken ihbar", active: 4 },
              { type: "P-3B", role: "Deniz karakol", active: 1 },
              { type: "C-27J", role: "Nakliye", active: 8 },
              { type: "C-130B/H", role: "Nakliye", active: 5 },
              { type: "King Air 350", role: "Nakliye/özel görev", active: 2 },
              { type: "CL-415", role: "Arama-kurtarma / yangın", active: 1 },
              { type: "M-346", role: "Jet eğitim", active: 3, ordered: 7 },
              { type: "T-6A", role: "Eğitim", active: 22 },
              { type: "AH-64A/D", role: "Taarruz helikopteri", active: 29 },
              { type: "CH-47D/SD", role: "Ağır nakliye helikopteri", active: 25 },
              { type: "NH90", role: "Kara helikopteri", active: 18 },
              { type: "OH-58D", role: "Keşif helikopteri", active: 70 },
              { type: "S-70/MH-60R", role: "Deniz helikopteri", active: 14, ordered: 4 }
            ]
          },
          naval: {
            title: "Deniz Unsuru Detayı",
            source: "Global Firepower 2026 + FlightGlobal 2025 deniz havacılığı",
            sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece",
            updated: "2026",
            note:
              "GFP toplam deniz platformu kategorilerini verir; hava platformları FlightGlobal/Cirium 2025 kaynaklıdır.",
            rows: [
              { type: "Toplam deniz platformu", role: "GFP toplam varlık", active: "186", activeLabel: "adet" },
              { type: "Toplam tonaj", role: "GFP hesaplaması", active: "215,808 t", activeLabel: "tonaj" },
              { type: "Fırkateyn", role: "Suüstü muharip", active: "14", activeLabel: "adet" },
              { type: "Denizaltı", role: "Sualtı platformu", active: "9", activeLabel: "adet" },
              { type: "Devriye gemisi", role: "Kıyı/açık deniz devriye", active: "45", activeLabel: "adet" },
              { type: "Mayın harbi", role: "Mayın karşı tedbir", active: "3", activeLabel: "adet" },
              { type: "P-3B", role: "Deniz karakol", active: 1 },
              { type: "Bell 212", role: "Deniz helikopteri", active: 7 },
              { type: "S-70/MH-60R", role: "Deniz helikopteri", active: 14, ordered: 4 }
            ]
          }
        }
      },
      outline: [
        [41.8, 20.0],
        [41.2, 26.5],
        [39.0, 26.0],
        [36.0, 28.2],
        [34.9, 24.5],
        [36.6, 21.2],
        [39.5, 19.6],
        [41.8, 20.0]
      ],
      assets: [
        {
          id: "gr-atk-1",
          category: "attack",
          name: "SCALP EG",
          family: "Havadan atılan stand-off seyir füzesi",
          role: "Platform bağımlı hassas taarruz",
          quantity: "Rafale / Mirage entegrasyonlu mühimmat ailesi",
          rangeLabel: "platform bağımlı",
          rangeMode: "platform",
          coverageNote:
            "Havadan atılan mühimmat olduğu için sabit coğrafi menzil halkası çizilmez; taşıyıcı platform ve görev profili bu demo kapsamına dahil değildir.",
          confidence: 0.6,
          status: "inceleme",
          sourceTag: "MBDA / açık kaynak modernizasyon kayıtları",
          sourceUrl: "https://newsroom.mbda-systems.com/?p=6237"
        },
        {
          id: "gr-air-1",
          category: "air",
          name: "F-16C/D",
          family: "Çok rollü muharip uçak",
          role: "Muharip uçak",
          quantity: "113 F-16C / 39 F-16D",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "gr-air-2",
          category: "air",
          name: "Rafale DG/EG",
          family: "Çok rollü muharip uçak",
          role: "Muharip uçak",
          quantity: "19 aktif / 5 sipariş",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "gr-air-3",
          category: "air",
          name: "Mirage 2000 ailesi",
          family: "Muharip uçak",
          role: "Muharip görev",
          quantity: "29 aktif",
          rangeMode: "regional",
          confidence: 0.68,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "gr-air-4",
          category: "air",
          name: "F-4E",
          family: "Taarruz / muharip uçak",
          role: "Taarruz / muharip görev",
          quantity: "17 aktif",
          rangeMode: "regional",
          confidence: 0.66,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "gr-air-5",
          category: "air",
          name: "F-35A",
          family: "5. nesil muharip uçak",
          role: "Muharip uçak",
          quantity: "40 sipariş*",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "gr-air-6",
          category: "air",
          name: "ERJ-145 AEW",
          family: "Havadan erken ihbar",
          role: "AEW erken ihbar",
          quantity: "4 aktif",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "gr-air-7",
          category: "air",
          name: "Nakliye ve özel görev uçakları",
          family: "C-27J, C-130B/H, King Air 350",
          role: "Nakliye ve özel görev",
          quantity: "15 aktif",
          rangeMode: "regional",
          confidence: 0.65,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "gr-def-1",
          category: "defense",
          name: "Patriot hava savunma sistemi",
          family: "Orta/uzun menzilli hava savunma",
          role: "Katmanlı hava savunma",
          quantity: "batarya grubu",
          rangeLabel: "konfigürasyona bağlı",
          rangeMode: "border",
          confidence: 0.58,
          status: "inceleme",
          sourceTag: "Açık kaynak savunma envanteri",
          sourceUrl: SIPRI
        },
        {
          id: "gr-def-2",
          category: "defense",
          name: "S-300PMU-1",
          family: "Uzun menzilli hava savunma",
          role: "Bölgesel hava savunma",
          quantity: "sistem kaydı",
          rangeKm: 150,
          rangeLabel: "150 km sınıfı",
          rangeMode: "border",
          confidence: 0.56,
          status: "inceleme",
          sourceTag: "Açık kaynak sistem referansları",
          sourceUrl: SIPRI
        },
        {
          id: "gr-def-3",
          category: "defense",
          name: "Aster 30 / FDI hava savunması",
          family: "Deniz konuşlu hava savunma",
          role: "Alan hava savunması",
          quantity: "modernizasyon / tedarik programı",
          rangeLabel: "sistem konfigürasyonuna bağlı",
          rangeMode: "coastal",
          confidence: 0.6,
          status: "kaynaklı",
          sourceTag: "MBDA Yunanistan sözleşmeleri",
          sourceUrl: "https://newsroom.mbda-systems.com/?p=6237"
        },
        {
          id: "gr-land-1",
          category: "land",
          name: "Tank envanteri",
          family: "Ana muharebe tankları",
          role: "Kara muharebe",
          quantity: "1,344 stok / 914 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece"
        },
        {
          id: "gr-land-2",
          category: "land",
          name: "Zırhlı/destek araçları",
          family: "Zırhlı, destek, lojistik ve özel araçlar",
          role: "Mekanize ve lojistik kabiliyet",
          quantity: "56,416 stok / 38,363 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece"
        },
        {
          id: "gr-land-3",
          category: "land",
          name: "Kundağı motorlu topçu",
          family: "Ateş destek sistemi",
          role: "Topçu ateş desteği",
          quantity: "589 stok / 401 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece"
        },
        {
          id: "gr-land-4",
          category: "land",
          name: "Çekili topçu",
          family: "Ateş destek sistemi",
          role: "Topçu ateş desteği",
          quantity: "698 stok / 475 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece"
        },
        {
          id: "gr-land-5",
          category: "land",
          name: "ÇNRA / roket topçusu",
          family: "Roket ateş destek sistemi",
          role: "Roket topçusu",
          quantity: "152 stok / 103 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece"
        },
        {
          id: "gr-sns-1",
          category: "sensor",
          name: "ERJ-145 AEW ve hava gözetleme ağı",
          family: "Havadan erken ihbar + yer sensörleri",
          role: "Hava resmi ve erken ihbar",
          quantity: "4 ERJ-145 AEW + yer ağı",
          rangeMode: "regional",
          confidence: 0.62,
          status: "kaynaklı",
          sourceTag: "FlightGlobal / açık kaynak sensör derlemesi",
          sourceUrl: FLIGHTGLOBAL_2025
        },
        {
          id: "gr-sns-2",
          category: "sensor",
          name: "Ege sensör ağı",
          family: "Radar ve gözetleme ağı",
          role: "Deniz/hava durum farkındalığı",
          quantity: "ülke ölçeğinde sensör profili",
          rangeMode: "regional",
          confidence: 0.52,
          status: "yaklaşık",
          sourceTag: "Açık kaynak OSINT derlemesi",
          sourceUrl: SIPRI
        },
        {
          id: "gr-nvl-1",
          category: "naval",
          name: "Exocet MM40 Block 3C",
          family: "Gemisavar füze",
          role: "Deniz hedeflerine karşı taarruz",
          quantity: "gemi konuşlu mühimmat ailesi",
          rangeKm: 250,
          rangeLabel: "250 km sınıfı",
          rangeMode: "coastal",
          confidence: 0.62,
          defaultSelected: true,
          status: "kaynaklı",
          sourceTag: "MBDA Yunanistan sözleşmeleri",
          sourceUrl: "https://newsroom.mbda-systems.com/?p=6237"
        },
        {
          id: "gr-nvl-2",
          category: "naval",
          name: "Fırkateyn filosu",
          family: "Suüstü muharip",
          role: "Ege ve Doğu Akdeniz deniz muharebesi",
          quantity: "14 adet",
          rangeMode: "coastal",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece"
        },
        {
          id: "gr-nvl-3",
          category: "naval",
          name: "Denizaltı filosu",
          family: "Sualtı platformu",
          role: "Denizaltı muharebesi",
          quantity: "9 adet",
          rangeMode: "coastal",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece"
        },
        {
          id: "gr-nvl-4",
          category: "naval",
          name: "Devriye ve mayın harbi unsurları",
          family: "Devriye / mayın karşı tedbir",
          role: "Kıyı güvenliği ve mayın harbi",
          quantity: "45 devriye / 3 mayın harbi",
          rangeMode: "coastal",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece"
        }
      ],
      sites: [
        {
          id: "gr-site-mainland-air",
          name: "Anakara hava faaliyet bölgesi",
          type: "air",
          lat: 38.9,
          lng: 22.6,
          radiusKm: 115,
          precision: "150 km grid",
          status: "Genelleştirilmiş",
          source: "Açık kaynak filo ve üs raporları"
        },
        {
          id: "gr-site-aegean-defense",
          name: "Ege hava savunma bölgesi",
          type: "defense",
          lat: 37.5,
          lng: 25.0,
          radiusKm: 140,
          precision: "Bölgesel",
          status: "Yaklaşık",
          source: "Modernizasyon ve açık kaynak savunma raporları"
        },
        {
          id: "gr-site-mainland-land",
          name: "Anakara kara hazırlık bölgesi",
          type: "land",
          lat: 39.2,
          lng: 22.1,
          radiusKm: 120,
          precision: "Bölgesel",
          status: "Genelleştirilmiş",
          source: "GFP kategori toplamları ve açık kaynak derlemesi"
        },
        {
          id: "gr-site-aegean-naval",
          name: "Ege deniz destek bölgesi",
          type: "naval",
          lat: 37.7,
          lng: 24.0,
          radiusKm: 105,
          precision: "100 km grid",
          status: "Genelleştirilmiş",
          source: "Liman ve filo raporları"
        },
        {
          id: "gr-site-sensor",
          name: "Ege sensör koordinasyon bölgesi",
          type: "sensor",
          lat: 39.7,
          lng: 24.0,
          radiusKm: 135,
          precision: "150 km grid",
          status: "Genelleştirilmiş",
          source: "Harita ve açık kaynak raporları"
        }
      ],
      sources: [
        {
          id: "gr-src-gfp",
          title: "2026 Greece Military Strength",
          publisher: "Global Firepower",
          date: "2026-01-01",
          state: "review",
          url: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece",
          summary: "Personel, kara, hava ve deniz kategori toplamları için kullanıldı."
        },
        {
          id: "gr-src-flightglobal",
          title: "World Air Forces 2025 Directory",
          publisher: "FlightGlobal / Cirium",
          date: "2025-01-01",
          state: "review",
          url: FLIGHTGLOBAL_2025,
          summary: "Hava aracı tip/adet kırılımı için kullanıldı."
        },
        {
          id: "gr-src-mbda",
          title: "Greece signs missile contracts with MBDA",
          publisher: "MBDA",
          date: "2022-03-24",
          state: "verified",
          url: "https://newsroom.mbda-systems.com/?p=6237",
          summary: "Rafale/FDI ilişkili füze modernizasyon kayıtları için üretici kaynak."
        },
        {
          id: "gr-src-sipri",
          title: "SIPRI Arms Transfers Database",
          publisher: "SIPRI",
          date: "2026-04-25",
          state: "review",
          url: SIPRI,
          summary: "Transfer doğrulama ve ülke envanteri çapraz kontrolü için kullanılacak."
        },
        {
          id: "gr-src-unroca",
          title: "UN Register of Conventional Arms",
          publisher: "UNROCA",
          date: "2026-04-25",
          state: "review",
          url: UNROCA,
          summary: "Devlet raporları üzerinden konvansiyonel silah transfer doğrulaması için kullanılır."
        }
      ]
    }
  ];

  const existingById = new Map(window.ODA_DATA.countries.map((country) => [country.id, country]));
  profiles.forEach((profile) => {
    const current = existingById.get(profile.id);
    if (current) {
      Object.assign(current, profile);
      return;
    }
    window.ODA_DATA.countries.push(profile);
  });
})();

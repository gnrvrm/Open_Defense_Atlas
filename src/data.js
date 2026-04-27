window.ODA_DATA = {
  layers: [
    {
      id: "attack",
      label: "Taarruz",
      icon: "crosshair",
      color: "#b91c1c",
      hint: "menzil"
    },
    {
      id: "air",
      label: "Hava",
      icon: "plane",
      color: "#2563eb",
      hint: "üs bölgesi"
    },
    {
      id: "land",
      label: "Kara",
      icon: "truck",
      color: "#15803d",
      hint: "hazırlık"
    },
    {
      id: "defense",
      label: "Savunma",
      icon: "shield",
      color: "#0f766e",
      hint: "kapsama"
    },
    {
      id: "sensor",
      label: "Sensör",
      icon: "radio-tower",
      color: "#6d28d9",
      hint: "tespit"
    },
    {
      id: "naval",
      label: "Deniz",
      icon: "waves",
      color: "#0e7490",
      hint: "liman"
    }
  ],
  countries: [
    {
      id: "turkiye",
      name: "Türkiye",
      continent: "europe",
      headline: "Türkiye savunma görünümü",
      center: [39.0, 35.2],
      zoom: 6,
      sourceScore: 72,
      strength: {
        activePersonnel: "481K",
        reservePersonnel: "380K",
        landSystems: "98K+",
        aircraft: "1,083",
        navalAssets: "192",
        note:
          "Özet değerler kaynak kapsamına göre değişebilir; detaylar kaynak, tarih ve doğrulama durumuyla gösterilir.",
        details: {
          aircraft: {
            title: "Hava Aracı Detayı",
            source: "FlightGlobal World Air Forces 2025 / Cirium fleets data",
            sourceUrl: "https://www.flightglobal.com/download?ac=106507",
            updated: "2025",
            note: "Aktif/ordered ayrımı kaynakta yayımlandığı şekilde korunur; kesin operasyonel hazır olma durumu değildir.",
            rows: [
              { type: "F-16C/V", role: "Muharip uçak", active: 153, ordered: "40*" },
              { type: "F-4E", role: "Muharip uçak", active: 48 },
              { type: "F-16C/D", role: "Eğitim/muharip eğitim", active: 85 },
              { type: "737", role: "AEW erken ihbar", active: 4 },
              { type: "Global 6000", role: "Keşif", active: 4 },
              { type: "CN235", role: "MPA", active: 1 },
              { type: "CN235", role: "Keşif", active: 1 },
              { type: "KC-135R", role: "Tanker", active: 7 },
              { type: "A400M", role: "Nakliye", active: 10 },
              { type: "C-130B/E", role: "Nakliye", active: 18 },
              { type: "CN235", role: "Nakliye", active: 40 },
              { type: "H215M/AS532", role: "Helikopter", active: 21 },
              { type: "S/T-70", role: "Helikopter", active: 3, ordered: 28 },
              { type: "T625", role: "Helikopter", active: 4 },
              { type: "UH-1H", role: "Helikopter", active: 56 },
              { type: "Hürjet", role: "Jet eğitim", active: 16 },
              { type: "Hürkuş B", role: "Temel eğitim", active: 1, ordered: "14+40*" },
              { type: "KT-1T", role: "Eğitim", active: 39, ordered: "15*" },
              { type: "MFI-395", role: "Eğitim", active: 16, ordered: 36 },
              { type: "NF-5A/B", role: "Eğitim/gösteri", active: 18 },
              { type: "SF-260", role: "Eğitim", active: 34 },
              { type: "T-38", role: "Jet eğitim", active: 68 }
            ]
          },
          land: {
            title: "Kara Sistemi Detayı",
            source: "Global Firepower 2026",
            sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey",
            updated: "2026",
            note:
              "Bu kırılım kategori seviyesindedir. Model-model tank/ZMA/topçu dağılımı için Warpower/WDMMW benzeri ayrı adaptör eklenecek.",
            rows: [
              { type: "Tank", role: "Ana muharebe / zırhlı unsur", active: "2,284", activeLabel: "stok", ready: "1,599*" },
              { type: "Araç", role: "Zırhlı, destek, lojistik ve özel araçlar", active: "98,193", activeLabel: "stok", ready: "68,735*" },
              { type: "Kundağı motorlu topçu", role: "Ateş destek", active: "1,045", activeLabel: "stok", ready: "732*" },
              { type: "Çekili topçu", role: "Ateş destek", active: "635", activeLabel: "stok", ready: "445*" },
              { type: "ÇNRA / roket topçusu", role: "Roket ateş destek", active: "237", activeLabel: "stok", ready: "166*" }
            ]
          },
          naval: {
            title: "Deniz Unsuru Detayı",
            source: "Global Firepower 2026 + FlightGlobal 2025 deniz havacılığı",
            sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey",
            updated: "2026",
            note:
              "GFP toplam deniz platformu kategorilerini verir; deniz havacılığı satırları FlightGlobal/Cirium 2025 kaynaklıdır.",
            rows: [
              { type: "Toplam deniz platformu", role: "GFP toplam varlık", active: "192", activeLabel: "adet" },
              { type: "Toplam tonaj", role: "GFP hesaplaması", active: "349,739 t", activeLabel: "tonaj" },
              { type: "Helikopter gemisi / LHD", role: "Amfibi ve hava operasyon desteği", active: "1", activeLabel: "adet" },
              { type: "Fırkateyn", role: "Suüstü muharip", active: "17", activeLabel: "adet" },
              { type: "Korvet", role: "Suüstü muharip", active: "9", activeLabel: "adet" },
              { type: "Denizaltı", role: "Sualtı platformu", active: "14", activeLabel: "adet" },
              { type: "Devriye gemisi", role: "Kıyı/açık deniz devriye", active: "40", activeLabel: "adet" },
              { type: "Mayın harbi", role: "Mayın karşı tedbir", active: "11", activeLabel: "adet" },
              { type: "ATR 72", role: "MPA", active: 2 },
              { type: "CN235", role: "MPA", active: 6 },
              { type: "ATR 72", role: "Nakliye", active: 3 },
              { type: "CN235", role: "Nakliye", active: 1 },
              { type: "Bell 212", role: "Helikopter", active: 12 },
              { type: "S-70", role: "Helikopter", active: 23 },
              { type: "T625", role: "Helikopter", ordered: "57*" }
            ]
          },
          personnel: {
            title: "Personel Detayı",
            source: "Global Firepower 2026",
            sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey",
            updated: "2026",
            note: "GFP bazı değerleri tahmini olarak işaretler; bu panel ülke ölçeğinde özet içindir.",
            rows: [
              { type: "Toplam askeri personel", role: "Tahmini toplam", active: "1,011,000", activeLabel: "toplam" },
              { type: "Aktif personel", role: "Toplam", active: "481,000", activeLabel: "aktif" },
              { type: "Yedek personel", role: "Toplam", active: "380,000", activeLabel: "yedek" },
              { type: "Paramiliter", role: "Toplam", active: "150,000", activeLabel: "toplam" },
              { type: "Hava kuvvetleri personeli", role: "GFP tahmini", active: "52,850" },
              { type: "Kara kuvvetleri personeli", role: "GFP tahmini", active: "401,500" },
              { type: "Deniz kuvvetleri personeli", role: "GFP tahmini", active: "100,000" }
            ]
          }
        }
      },
      outline: [
        [42.05, 26.05],
        [41.25, 31.9],
        [41.65, 36.8],
        [41.05, 41.7],
        [39.55, 44.8],
        [37.2, 44.2],
        [36.0, 36.0],
        [36.55, 30.0],
        [38.05, 26.2],
        [42.05, 26.05]
      ],
      assets: [
        {
          id: "tr-atk-1",
          category: "attack",
          name: "TAYFUN füzesi",
          family: "Kısa menzilli balistik füze",
          role: "Stratejik/taktik derin taarruz",
          quantity: "ürün kaydı",
          rangeKm: 280,
          rangeLabel: ">280 km",
          rangeMode: "border",
          confidence: 0.62,
          defaultSelected: true,
          status: "kaynaklı",
          sourceTag: "Roketsan ürün kataloğu",
          sourceUrl: "https://www.roketsan.com.tr/uploads/docs/kataloglar/ENG/2024/1726596010_tayfun.pdf"
        },
        {
          id: "tr-atk-2",
          category: "attack",
          name: "KHAN / BORA füzesi",
          family: "Taktik balistik füze",
          role: "Kara konuşlu hassas taarruz",
          quantity: "ürün kaydı",
          rangeKm: 280,
          rangeLabel: "80-280 km",
          rangeMode: "border",
          confidence: 0.72,
          status: "kaynaklı",
          sourceTag: "Roketsan ürün sayfası",
          sourceUrl: "https://www.roketsan.com.tr/en/products/khan-missile"
        },
        {
          id: "tr-atk-3",
          category: "attack",
          name: "TRG-300 güdümlü füze",
          family: "Çok namlulu roket/füze sistemi",
          role: "Roket topçusu / hassas ateş destek",
          quantity: "ürün kaydı",
          rangeKm: 120,
          rangeLabel: "20-120 km",
          rangeMode: "border",
          confidence: 0.74,
          status: "kaynaklı",
          sourceTag: "Roketsan ürün sayfası",
          sourceUrl: "https://www.roketsan.com.tr/en/products/trg-300-guided-missile"
        },
        {
          id: "tr-atk-4",
          category: "attack",
          name: "SOM-J seyir füzesi",
          family: "Hava-yer seyir füzesi",
          role: "Stand-off hassas taarruz",
          quantity: "ürün kaydı",
          rangeKm: 200,
          rangeLabel: "200 km",
          rangeMode: "platform",
          coverageNote:
            "Havadan atılan bir mühimmat olduğu için sabit bir coğrafi daire çizilmez. 200 km değeri yalnızca mühimmat menzilidir; taşıyıcı platformun konumu ve uçuş menzili bu gösterime dahil değildir.",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "Roketsan ürün kataloğu",
          sourceUrl: "https://www.roketsan.com.tr/uploads/docs/kataloglar/ENG/2024/1726595985_som-j.pdf"
        },
        {
          id: "tr-air-1",
          category: "air",
          name: "F-16C/V",
          family: "Çok rollü hava platformu",
          role: "Muharip uçak",
          quantity: "153 aktif / 40 sipariş",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: "https://www.flightglobal.com/download?ac=106507"
        },
        {
          id: "tr-air-2",
          category: "air",
          name: "F-4E",
          family: "Muharip uçak",
          role: "Taarruz / muharip görev",
          quantity: "48 aktif",
          rangeMode: "regional",
          confidence: 0.68,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: "https://www.flightglobal.com/download?ac=106507"
        },
        {
          id: "tr-air-3",
          category: "air",
          name: "737 AEW",
          family: "Havadan erken ihbar ve kontrol",
          role: "AEW&C",
          quantity: "4 aktif",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: "https://www.flightglobal.com/download?ac=106507"
        },
        {
          id: "tr-air-4",
          category: "air",
          name: "KC-135R",
          family: "Havadan yakıt ikmal uçağı",
          role: "Tanker",
          quantity: "7 aktif",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: "https://www.flightglobal.com/download?ac=106507"
        },
        {
          id: "tr-air-5",
          category: "air",
          name: "A400M",
          family: "Stratejik/taktik nakliye",
          role: "Nakliye",
          quantity: "10 aktif",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: "https://www.flightglobal.com/download?ac=106507"
        },
        {
          id: "tr-air-6",
          category: "air",
          name: "C-130B/E",
          family: "Nakliye uçağı",
          role: "Nakliye",
          quantity: "18 aktif",
          rangeMode: "regional",
          confidence: 0.7,
          status: "kaynaklı",
          sourceTag: "FlightGlobal World Air Forces 2025",
          sourceUrl: "https://www.flightglobal.com/download?ac=106507"
        },
        {
          id: "tr-def-1",
          category: "defense",
          name: "HİSAR hava savunma füzeleri",
          family: "Kısa/orta menzilli hava savunma",
          role: "Katmanlı hava savunma",
          quantity: "ürün ailesi",
          rangeKm: 25,
          rangeLabel: "15+ / 25+ km",
          rangeMode: "border",
          confidence: 0.72,
          status: "kaynaklı",
          sourceTag: "Roketsan ürün sayfası",
          sourceUrl: "https://www.roketsan.com.tr/en/products/hisar-air-defence-missiles"
        },
        {
          id: "tr-def-2",
          category: "defense",
          name: "SİPER hava ve füze savunma sistemi",
          family: "Uzun menzilli hava/füze savunma",
          role: "Stratejik hava savunma",
          quantity: "ürün ailesi",
          rangeKm: 150,
          rangeLabel: "100+ / 150 km",
          rangeMode: "border",
          confidence: 0.72,
          status: "kaynaklı",
          sourceTag: "Roketsan ürün kataloğu",
          sourceUrl: "https://www.roketsan.com.tr/uploads/docs/kataloglar/ENG/2024/1726595985_siper.pdf"
        },
        {
          id: "tr-def-3",
          category: "defense",
          name: "SUNGUR hava savunma sistemi",
          family: "Kısa menzilli hava savunma",
          role: "Alçak irtifa birlik/tesis koruması",
          quantity: "ürün kaydı",
          rangeLabel: "4 km irtifa",
          rangeMode: "regional",
          confidence: 0.66,
          status: "kaynaklı",
          sourceTag: "Roketsan ürün sayfası",
          sourceUrl: "https://www.roketsan.com.tr/en/products/sungur-air-defence-missile-system"
        },
        {
          id: "tr-land-1",
          category: "land",
          name: "Tank envanteri",
          family: "Ana muharebe / zırhlı unsur",
          role: "Kara muharebe",
          quantity: "2,284 stok / 1,599 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey"
        },
        {
          id: "tr-land-2",
          category: "land",
          name: "Zırhlı/destek araçları",
          family: "Zırhlı, destek, lojistik ve özel araçlar",
          role: "Mekanize ve lojistik kabiliyet",
          quantity: "98,193 stok / 68,735 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey"
        },
        {
          id: "tr-land-3",
          category: "land",
          name: "Kundağı motorlu topçu",
          family: "Ateş destek sistemi",
          role: "Topçu ateş desteği",
          quantity: "1,045 stok / 732 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey"
        },
        {
          id: "tr-land-4",
          category: "land",
          name: "ÇNRA / roket topçusu",
          family: "Roket ateş destek sistemi",
          role: "Roket topçusu",
          quantity: "237 stok / 166 hazır*",
          rangeMode: "regional",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey"
        },
        {
          id: "tr-sns-1",
          category: "sensor",
          name: "Erken ihbar radar ağı",
          family: "Sabit ve mobil radar ailesi",
          role: "Uzun menzil erken ihbar ve hava resmi",
          quantity: "sistem ailesi",
          rangeLabel: "uzun menzil",
          rangeMode: "border",
          confidence: 0.6,
          status: "kaynaklı",
          sourceTag: "ASELSAN erken ihbar radar dokümanları",
          sourceUrl: "https://wwwcdn.aselsan.com/api/file/ERALP_ENG.pdf"
        },
        {
          id: "tr-sns-2",
          category: "sensor",
          name: "KALKAN hava savunma radarı",
          family: "3B hava savunma radarı",
          role: "Alçak/orta irtifa arama ve takip",
          quantity: "radar ailesi",
          rangeMode: "regional",
          confidence: 0.58,
          status: "kaynaklı",
          sourceTag: "ASELSAN hava savunma radar dokümanları",
          sourceUrl: "https://wwwcdn.aselsan.com/api/file/IDEF23_ASELSAN_AirDefenseRadars.pdf"
        },
        {
          id: "tr-nvl-1",
          category: "naval",
          name: "ATMACA gemisavar füzesi",
          family: "Deniz hedeflerine karşı seyir füzesi",
          role: "Gemisavar taarruz",
          quantity: "ürün kaydı",
          rangeKm: 250,
          rangeLabel: "250 km",
          rangeMode: "coastal",
          confidence: 0.76,
          status: "kaynaklı",
          sourceTag: "Roketsan ürün sayfası",
          sourceUrl: "https://www.roketsan.com.tr/en/products/atmaca-anti-ship-missile"
        },
        {
          id: "tr-nvl-2",
          category: "naval",
          name: "Fırkateyn filosu",
          family: "Suüstü muharip",
          role: "Çok maksatlı deniz muharebesi",
          quantity: "17 adet",
          rangeMode: "coastal",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey"
        },
        {
          id: "tr-nvl-3",
          category: "naval",
          name: "Korvet filosu",
          family: "Suüstü muharip",
          role: "Kıyı/açık deniz ASW ve devriye",
          quantity: "9 adet",
          rangeMode: "coastal",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey"
        },
        {
          id: "tr-nvl-4",
          category: "naval",
          name: "Denizaltı filosu",
          family: "Sualtı platformu",
          role: "Denizaltı muharebesi",
          quantity: "14 adet",
          rangeMode: "coastal",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey"
        },
        {
          id: "tr-nvl-5",
          category: "naval",
          name: "Devriye ve mayın harbi unsurları",
          family: "Devriye / mayın karşı tedbir",
          role: "Kıyı güvenliği ve mayın harbi",
          quantity: "40 devriye / 11 mayın harbi",
          rangeMode: "coastal",
          confidence: 0.58,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey"
        }
      ],
      sites: [
        {
          id: "tr-site-aegean-air",
          name: "Ege hava faaliyet bölgesi",
          type: "air",
          lat: 38.7,
          lng: 27.1,
          radiusKm: 95,
          precision: "100 km grid",
          status: "Genelleştirilmiş",
          source: "Açık kaynak derlemesi"
        },
        {
          id: "tr-site-central-defense",
          name: "İç Anadolu hava savunma bölgesi",
          type: "defense",
          lat: 39.6,
          lng: 32.8,
          radiusKm: 140,
          precision: "150 km grid",
          status: "Tahmini",
          source: "Resmi açıklama ve ikincil raporlar"
        },
        {
          id: "tr-site-blacksea-sensor",
          name: "Karadeniz sensör kapsama alanı",
          type: "sensor",
          lat: 41.2,
          lng: 32.5,
          radiusKm: 180,
          precision: "Bölgesel",
          status: "Genelleştirilmiş",
          source: "Harita ve rapor okuması"
        },
        {
          id: "tr-site-southeast-land",
          name: "Güneydoğu kara hazırlık alanı",
          type: "land",
          lat: 37.8,
          lng: 38.5,
          radiusKm: 120,
          precision: "Bölgesel",
          status: "Yaklaşık",
          source: "Basın ve açık raporlar"
        },
        {
          id: "tr-site-marmara-naval",
          name: "Marmara deniz destek bölgesi",
          type: "naval",
          lat: 40.8,
          lng: 29.2,
          radiusKm: 90,
          precision: "100 km grid",
          status: "Genelleştirilmiş",
          source: "Liman odaklı açık veriler"
        }
      ],
      sources: [
        {
          id: "tr-src-1",
          title: "Resmi savunma sanayii faaliyet raporu",
          publisher: "Resmi kurum",
          date: "2025-11-18",
          state: "verified",
          summary: "Kabiliyet ailesi doğrulandı, konum bilgisi yayınlanmadı."
        },
        {
          id: "tr-src-2",
          title: "Bölgesel savunma envanteri özeti",
          publisher: "Açık veri raporu",
          date: "2025-08-03",
          state: "review",
          summary: "Platform ailesi ve menzil aralığı için ikincil doğrulama gerekli."
        },
        {
          id: "tr-src-3",
          title: "Uydu görüntüsü yorumu",
          publisher: "OSINT notu",
          date: "2025-04-21",
          state: "pending",
          summary: "Kesin koordinat yerine bölgesel etiket önerildi."
        }
      ]
    },
    {
      id: "poland",
      name: "Polonya",
      continent: "europe",
      headline: "Polonya savunma görünümü",
      center: [52.0, 19.1],
      zoom: 6,
      sourceScore: 68,
      strength: {
        activePersonnel: "200K+",
        reservePersonnel: "aktif",
        landSystems: "1K+",
        aircraft: "300+",
        navalAssets: "40+",
        note: "Demo değerler karşılaştırmalı ülke profili için yer tutucudur."
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
          id: "pl-def-1",
          category: "defense",
          name: "Katmanlı hava savunma",
          family: "Orta/uzun menzil",
          quantity: "batarya grubu",
          rangeKm: 160,
          rangeMode: "border",
          confidence: 0.66
        },
        {
          id: "pl-land-1",
          category: "land",
          name: "Ağır zırhlı birlikler",
          family: "Kara muharebe",
          quantity: "envanter grubu",
          rangeKm: 70,
          rangeMode: "regional",
          confidence: 0.72
        },
        {
          id: "pl-attack-1",
          category: "attack",
          name: "Derin hassas taarruz",
          family: "Topçu roket ailesi",
          quantity: "sistem grubu",
          rangeKm: 300,
          rangeMode: "border",
          confidence: 0.59
        },
        {
          id: "pl-air-1",
          category: "air",
          name: "Taktik hava unsurları",
          family: "Çok rollü uçak",
          quantity: "filo grubu",
          rangeKm: 680,
          rangeMode: "regional",
          confidence: 0.69
        }
      ],
      sites: [
        {
          id: "pl-site-east-defense",
          name: "Doğu hava savunma hattı",
          type: "defense",
          lat: 52.0,
          lng: 22.0,
          radiusKm: 130,
          precision: "Bölgesel",
          status: "Tahmini",
          source: "Resmi tedarik ve açık raporlar"
        },
        {
          id: "pl-site-west-land",
          name: "Batı kara destek bölgesi",
          type: "land",
          lat: 51.6,
          lng: 16.7,
          radiusKm: 120,
          precision: "150 km grid",
          status: "Genelleştirilmiş",
          source: "Açık kaynak derlemesi"
        },
        {
          id: "pl-site-north-air",
          name: "Kuzey hava faaliyet bölgesi",
          type: "air",
          lat: 53.6,
          lng: 18.4,
          radiusKm: 110,
          precision: "100 km grid",
          status: "Yaklaşık",
          source: "Basın ve resmi açıklamalar"
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
          source: "İkincil analiz"
        }
      ],
      sources: [
        {
          id: "pl-src-1",
          title: "Modernizasyon programı duyuruları",
          publisher: "Resmi kurum",
          date: "2025-12-02",
          state: "verified",
          summary: "Platform ailesi ve tedarik durumu için kullanılabilir."
        },
        {
          id: "pl-src-2",
          title: "NATO bölgesel duruş analizi",
          publisher: "Düşünce kuruluşu",
          date: "2025-07-14",
          state: "review",
          summary: "Konumlar bölgesel seviyeye indirildi."
        }
      ]
    },
    {
      id: "greece",
      name: "Yunanistan",
      continent: "europe",
      headline: "Yunanistan savunma görünümü",
      center: [39.1, 22.5],
      zoom: 6,
      sourceScore: 64,
      strength: {
        activePersonnel: "140K+",
        reservePersonnel: "aktif",
        landSystems: "1K+",
        aircraft: "600+",
        navalAssets: "120+",
        note: "Demo değerler kaynaklı veri modeli örneği olarak tutulur."
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
          id: "gr-air-1",
          category: "air",
          name: "Ada ve anakara hava unsurları",
          family: "Çok rollü uçak",
          quantity: "filo grubu",
          rangeKm: 700,
          rangeMode: "regional",
          confidence: 0.65
        },
        {
          id: "gr-naval-1",
          category: "naval",
          name: "Ege deniz kontrol kabiliyeti",
          family: "Fırkateyn ve devriye",
          quantity: "filo grubu",
          rangeKm: 180,
          rangeMode: "coastal",
          confidence: 0.61
        },
        {
          id: "gr-defense-1",
          category: "defense",
          name: "Ada hava savunma kapsaması",
          family: "Orta menzil",
          quantity: "sistem grubu",
          rangeKm: 120,
          rangeMode: "border",
          confidence: 0.54
        },
        {
          id: "gr-sensor-1",
          category: "sensor",
          name: "Ege sensör ağı",
          family: "Radar ve gözetleme",
          quantity: "ülke ölçeğinde sensör profili",
          rangeKm: 320,
          rangeMode: "border",
          confidence: 0.51
        }
      ],
      sites: [
        {
          id: "gr-site-aegean-air",
          name: "Ege hava faaliyet alanı",
          type: "air",
          lat: 38.7,
          lng: 23.5,
          radiusKm: 100,
          precision: "100 km grid",
          status: "Yaklaşık",
          source: "Açık kaynak derlemesi"
        },
        {
          id: "gr-site-island-defense",
          name: "Ada savunma kapsama alanı",
          type: "defense",
          lat: 37.3,
          lng: 25.4,
          radiusKm: 140,
          precision: "Bölgesel",
          status: "Genelleştirilmiş",
          source: "İkincil raporlar"
        },
        {
          id: "gr-site-naval",
          name: "Güney deniz destek bölgesi",
          type: "naval",
          lat: 35.4,
          lng: 24.3,
          radiusKm: 115,
          precision: "Bölgesel",
          status: "Tahmini",
          source: "Liman ve filo raporları"
        },
        {
          id: "gr-site-sensor",
          name: "Kuzey Ege sensör bölgesi",
          type: "sensor",
          lat: 40.0,
          lng: 24.0,
          radiusKm: 130,
          precision: "150 km grid",
          status: "Genelleştirilmiş",
          source: "Harita ve açık raporlar"
        }
      ],
      sources: [
        {
          id: "gr-src-1",
          title: "Kuvvet modernizasyon duyuruları",
          publisher: "Resmi kurum",
          date: "2025-10-06",
          state: "verified",
          summary: "Hava ve deniz kabiliyeti sınıfları doğrulandı."
        },
        {
          id: "gr-src-2",
          title: "Ege güvenlik analizi",
          publisher: "Düşünce kuruluşu",
          date: "2025-06-22",
          state: "review",
          summary: "Ada odaklı bilgiler hassasiyet filtresinden geçirildi."
        }
      ]
    }
  ]
};

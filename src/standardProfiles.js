(function () {
  const GFP = "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=";
  const FLIGHTGLOBAL_2025 = "https://www.flightglobal.com/defence/2025-world-air-forces-directory/160846.article";
  const SIPRI = "https://www.sipri.org/databases/armstransfers";
  const UNROCA = "https://www.unroca.org/en/reporting/";

  function makeOutline(box) {
    const [south, west, north, east] = box;
    return [
      [north, west],
      [north, east],
      [south, east],
      [south, west],
      [north, west]
    ];
  }

  function sourceUrl(country) {
    if (country.gfp) return `${GFP}${country.gfp}`;
    return UNROCA;
  }

  function isLimitedSecurityProfile(country) {
    return ["micro", "no-standing-army", "small"].includes(country.tier);
  }

  function strengthValue(country, normalValue, smallValue = "sınırlı") {
    if (country.tier === "micro") return "sınırlı";
    if (country.tier === "no-standing-army") return "askeri yapı yok";
    if (country.tier === "small") return smallValue;
    return normalValue;
  }

  function makeStrength(country) {
    const src = country.gfp ? "Global Firepower 2026" : "UNROCA / açık kaynak ülke profili";
    const srcUrl = sourceUrl(country);
    const note = isLimitedSecurityProfile(country)
      ? "Bu ülkede ağır askeri envanter yok veya sınırlı; güvenlik, sahil güvenlik, polis ve anlaşmalı savunma düzeni ülke ölçeğinde gösterilir."
      : "Bu profil ülke ölçeğinde açık kaynak referansları bağlar; model-model doğrulama ülke adaptörü derinleştikçe genişletilir.";

    return {
      activePersonnel: strengthValue(country, "GFP 2026"),
      reservePersonnel: strengthValue(country, "GFP 2026", "kaynak"),
      landSystems: strengthValue(country, "GFP 2026", "sınırlı"),
      aircraft: strengthValue(country, "Flight 2025", "sınırlı"),
      navalAssets: country.coast ? strengthValue(country, "GFP 2026", "sahil") : "kara",
      note: `${country.name} profili ${country.region} kapsamında, yayınlanmış açık kaynaklardan ülke ölçeğinde ve hassas konum vermeden gösterilir.`,
      details: {
        personnel: {
          title: "Personel Detayı",
          source: src,
          sourceUrl: srcUrl,
          updated: "2026",
          note,
          rows: [
            { type: "Toplam askeri/güvenlik personeli", role: "Kaynak profili", active: strengthValue(country, "GFP kaydı", "sınırlı"), activeLabel: "özet" },
            { type: "Aktif personel", role: "Kaynak doğrulama alanı", active: strengthValue(country, "GFP 2026", "sınırlı"), activeLabel: "aktif" },
            { type: "Yedek personel", role: "Kaynak doğrulama alanı", active: strengthValue(country, "GFP 2026", "yok/sınırlı"), activeLabel: "yedek" },
            { type: "Paramiliter / iç güvenlik", role: "Ayrı kaynakla doğrulanır", active: "kaynak", activeLabel: "kontrol" },
            { type: "Hava kuvvetleri personeli", role: "Varsa", active: strengthValue(country, "GFP tahmini", "yok") },
            { type: "Kara kuvvetleri personeli", role: "Varsa", active: strengthValue(country, "GFP tahmini", "sınırlı") },
            { type: "Deniz kuvvetleri personeli", role: country.coast ? "Varsa" : "Kıyı yok", active: country.coast ? strengthValue(country, "GFP tahmini", "sınırlı") : "uygulanmaz" }
          ]
        },
        land: {
          title: "Kara Sistemi Detayı",
          source: country.gfp ? "Global Firepower 2026" : "Açık kaynak devlet profili",
          sourceUrl: srcUrl,
          updated: "2026",
          note: "Kategori seviyesi profil; gerçek üs/birlik konumları veya anlık hazırlık bilgisi içermez.",
          rows: [
            { type: "Tank", role: "Ana muharebe / zırhlı unsur", active: strengthValue(country, "GFP stok", "yok/sınırlı"), activeLabel: "stok" },
            { type: "Zırhlı ve destek araçları", role: "Mekanize, lojistik ve özel araçlar", active: strengthValue(country, "GFP stok", "sınırlı"), activeLabel: "stok" },
            { type: "Kundağı motorlu topçu", role: "Ateş destek", active: strengthValue(country, "GFP stok", "yok/sınırlı"), activeLabel: "stok" },
            { type: "Çekili topçu", role: "Ateş destek", active: strengthValue(country, "GFP stok", "yok/sınırlı"), activeLabel: "stok" },
            { type: "ÇNRA / roket topçusu", role: "Roket ateş destek", active: strengthValue(country, "GFP stok", "yok/sınırlı"), activeLabel: "stok" }
          ]
        },
        aircraft: {
          title: "Hava Aracı Detayı",
          source: "FlightGlobal World Air Forces 2025 / Cirium fleets data",
          sourceUrl: FLIGHTGLOBAL_2025,
          updated: "2025",
          note: "Hava aracı tip/adet kırılımı FlightGlobal/Cirium üzerinden doğrulanacak kaynak alanıdır; platform bağımlı silahlar sabit harita dairesi üretmez.",
          rows: [
            { type: "Muharip uçak", role: "Varsa", active: strengthValue(country, "FlightGlobal kaydı", "yok/sınırlı") },
            { type: "Nakliye", role: "Sabit kanat", active: strengthValue(country, "FlightGlobal kaydı", "yok/sınırlı") },
            { type: "Özel görev / AEW", role: "Varsa", active: strengthValue(country, "FlightGlobal kaydı", "yok/sınırlı") },
            { type: "Helikopter", role: "Genel maksat / taarruz", active: strengthValue(country, "FlightGlobal kaydı", "yok/sınırlı") },
            { type: "Eğitim uçakları", role: "Varsa", active: strengthValue(country, "FlightGlobal kaydı", "yok/sınırlı") }
          ]
        },
        naval: {
          title: "Deniz Unsuru Detayı",
          source: country.coast ? "Global Firepower 2026 + açık kaynak deniz profili" : "Kıyı erişimi yok",
          sourceUrl: country.coast ? srcUrl : sourceUrl(country),
          updated: "2026",
          note: country.coast
            ? "Deniz unsurları kıyı/liman ölçeğinde genelleştirilir; gemi konumu veya gerçek zamanlı hareket gösterilmez."
            : "Kıyısı olmayan ülkelerde deniz unsuru uygulanmaz; lojistik ve kara güvenliği ayrı gösterilir.",
          rows: [
            { type: "Toplam deniz platformu", role: country.coast ? "GFP toplam varlık" : "Kıyı yok", active: country.coast ? strengthValue(country, "GFP kaydı", "sahil güvenlik") : "uygulanmaz", activeLabel: "adet" },
            { type: "Fırkateyn / korvet", role: "Suüstü muharip", active: country.coast ? strengthValue(country, "GFP kaydı", "yok/sınırlı") : "uygulanmaz" },
            { type: "Denizaltı", role: "Sualtı platformu", active: country.coast ? strengthValue(country, "GFP kaydı", "yok/sınırlı") : "uygulanmaz" },
            { type: "Devriye / sahil güvenlik", role: "Kıyı güvenliği", active: country.coast ? strengthValue(country, "GFP kaydı", "sahil") : "uygulanmaz" },
            { type: "Mayın harbi", role: "Mayın karşı tedbir", active: country.coast ? strengthValue(country, "GFP kaydı", "yok/sınırlı") : "uygulanmaz" }
          ]
        }
      }
    };
  }

  function makeAssets(country) {
    const src = sourceUrl(country);
    const confidence = country.gfp ? 0.54 : 0.48;

    if (isLimitedSecurityProfile(country)) {
      return [
        {
          id: `${country.id}-security`,
          category: "land",
          name: `${country.name} güvenlik profili`,
          family: "Sınırlı iç güvenlik / koruma yapısı",
          role: "Ülke ölçeğinde güvenlik özeti",
          quantity: "sınırlı / özel düzen",
          rangeMode: "regional",
          confidence,
          defaultSelected: true,
          status: "kaynaklı",
          sourceTag: country.gfp ? "GlobalFirepower / açık kaynak" : "UNROCA / açık kaynak",
          sourceUrl: src
        },
        {
          id: `${country.id}-civil-defense`,
          category: "defense",
          name: "Sivil savunma ve acil durum kapasitesi",
          family: "Askeri olmayan dayanıklılık",
          role: "Kriz ve altyapı koruması",
          quantity: "kaynak profili",
          rangeMode: "regional",
          confidence: 0.46,
          status: "inceleme",
          sourceTag: "Açık kaynak devlet profili",
          sourceUrl: src
        },
        {
          id: `${country.id}-maritime-security`,
          category: country.coast ? "naval" : "sensor",
          name: country.coast ? "Sahil güvenlik ve deniz emniyeti" : "Sınır/altyapı gözetleme kaydı",
          family: "Kamu güvenliği ve altyapı gözetimi",
          role: "Hassas konum vermeyen durum farkındalığı",
          quantity: "kaynak profili",
          rangeMode: country.coast ? "coastal" : "regional",
          confidence: 0.44,
          status: "yaklaşık",
          sourceTag: "Açık kaynak derlemesi",
          sourceUrl: src
        }
      ];
    }

    const assets = [
      {
        id: `${country.id}-land-inventory`,
        category: "land",
        name: "Tank ve zırhlı araç envanteri",
        family: "Kara muharebe sistemleri",
        role: "Kara muharebe ve mekanize kabiliyet",
        quantity: "GFP kategori kaydı",
        rangeMode: "regional",
        confidence,
        defaultSelected: true,
        status: "tahmini",
        sourceTag: country.gfp ? "Global Firepower 2026" : "Açık kaynak ülke profili",
        sourceUrl: src
      },
      {
        id: `${country.id}-air-platforms`,
        category: "air",
        name: "Muharip ve destek hava araçları",
        family: "Sabit kanat ve döner kanat hava platformları",
        role: "Hava savunma, taarruz, nakliye, eğitim ve devriye",
        quantity: "FlightGlobal tip kırılımı",
        rangeMode: "regional",
        confidence: 0.56,
        status: "kaynaklı",
        sourceTag: "FlightGlobal World Air Forces 2025",
        sourceUrl: FLIGHTGLOBAL_2025
      },
      {
        id: `${country.id}-air-defense`,
        category: "defense",
        name: "Hava savunma ve iç güvenlik katmanı",
        family: "Kısa/orta/uzun menzilli hava savunma ve kritik altyapı koruması",
        role: "Ülke ölçeğinde hava savunma özeti",
        quantity: "kaynak profili",
        rangeMode: "border",
        confidence: 0.52,
        status: "inceleme",
        sourceTag: "SIPRI / GFP / resmi kaynak kontrolü",
        sourceUrl: SIPRI
      },
      {
        id: `${country.id}-sensor-network`,
        category: "sensor",
        name: "Radar ve komuta-kontrol ağı",
        family: "Hava/deniz/kara durum farkındalığı",
        role: "Erken ihbar ve sensör füzyonu",
        quantity: "ağ kaydı",
        rangeMode: "regional",
        confidence: 0.5,
        status: "yaklaşık",
        sourceTag: "Açık kaynak OSINT derlemesi",
        sourceUrl: src
      },
      {
        id: `${country.id}-precision-fires`,
        category: "attack",
        name: "Hassas taarruz ve roket/topçu kabiliyeti",
        family: "Platform/konfigürasyon bağımlı sistemler",
        role: "Uzun menzil veya hassas ateş kabiliyeti",
        quantity: "SIPRI/UNROCA çapraz kontrol",
        rangeMode: "platform",
        coverageNote:
          "Ülke ölçeğinde açık kaynak kaydıdır. Platforma bağlı veya mühimmat tipine göre değişen sistemlerde sabit coğrafi menzil dairesi çizilmez.",
        confidence: 0.48,
        status: "inceleme",
        sourceTag: "SIPRI / UNROCA",
        sourceUrl: SIPRI
      }
    ];

    if (country.coast) {
      assets.push(
        {
          id: `${country.id}-naval-platforms`,
          category: "naval",
          name: "Deniz platformları",
          family: "Fırkateyn, korvet, devriye ve destek unsurları",
          role: "Deniz güvenliği ve suüstü kabiliyeti",
          quantity: "GFP kategori kaydı",
          rangeMode: "coastal",
          confidence,
          status: "tahmini",
          sourceTag: country.gfp ? "Global Firepower 2026" : "Açık kaynak deniz profili",
          sourceUrl: src
        },
        {
          id: `${country.id}-coastal-defense`,
          category: "naval",
          name: "Kıyı/deniz savunma kabiliyeti",
          family: "Kıyı gözetleme, devriye ve varsa gemisavar sistemler",
          role: "Kıyı güvenliği ve deniz alanı farkındalığı",
          quantity: "kaynak profili",
          rangeMode: "coastal",
          confidence: 0.5,
          status: "inceleme",
          sourceTag: "SIPRI / UNROCA / GFP",
          sourceUrl: UNROCA
        }
      );
    }

    if (country.major || country.nuclear) {
      assets.push({
        id: `${country.id}-strategic-profile`,
        category: "attack",
        name: country.nuclear ? "Stratejik caydırıcılık kaydı" : "Bölgesel güç projeksiyonu",
        family: country.nuclear ? "Nükleer/stratejik kapasite ülkesi" : "Bölgesel menzil ve dış görev kabiliyeti",
        role: "Stratejik caydırıcılık / güç projeksiyonu",
        quantity: "ülke ölçeği kaynak profili",
        rangeMode: "platform",
        coverageNote:
          "Stratejik ve platform bağımlı kabiliyetler için sabit coğrafi menzil dairesi çizilmez; yalnızca ülke ölçeğinde kaynaklı kapasite kaydı tutulur.",
        confidence: 0.58,
        status: "kaynaklı",
        sourceTag: "Global Firepower / açık kaynak stratejik profil",
        sourceUrl: src
      });
    }

    return assets;
  }

  function makeSites(country) {
    const [lat, lng] = country.center;
    const sites = [
      {
        id: `${country.id}-site-land`,
        name: `${country.name} kara hazırlık bölgesi`,
        type: "land",
        lat,
        lng,
        radiusKm: country.tier ? 70 : 120,
        precision: country.tier ? "ülke ölçeği" : "150 km grid",
        status: "Genelleştirilmiş",
        source: "Açık kaynak ülke profili"
      },
      {
        id: `${country.id}-site-air`,
        name: `${country.name} hava faaliyet bölgesi`,
        type: "air",
        lat: lat + 0.35,
        lng: lng - 0.45,
        radiusKm: country.tier ? 60 : 105,
        precision: "Bölgesel",
        status: "Yaklaşık",
        source: "FlightGlobal ve açık kaynak hava profili"
      },
      {
        id: `${country.id}-site-defense`,
        name: `${country.name} hava savunma bölgesi`,
        type: "defense",
        lat: lat - 0.25,
        lng: lng + 0.55,
        radiusKm: country.tier ? 65 : 125,
        precision: "Bölgesel",
        status: "Genelleştirilmiş",
        source: "SIPRI/UNROCA ve açık kaynak savunma profili"
      },
      {
        id: `${country.id}-site-sensor`,
        name: `${country.name} sensör koordinasyon bölgesi`,
        type: "sensor",
        lat: lat + 0.15,
        lng: lng + 0.25,
        radiusKm: country.tier ? 60 : 135,
        precision: "Bölgesel",
        status: "Genelleştirilmiş",
        source: "Açık kaynak OSINT derlemesi"
      }
    ];

    if (country.coast) {
      sites.push({
        id: `${country.id}-site-naval`,
        name: `${country.name} deniz destek bölgesi`,
        type: "naval",
        lat: lat - 0.45,
        lng: lng - 0.15,
        radiusKm: country.tier ? 55 : 95,
        precision: "100 km grid",
        status: "Genelleştirilmiş",
        source: "Liman/kıyı ve filo kaynakları"
      });
    }

    return sites;
  }

  function makeSources(country) {
    const src = sourceUrl(country);
    const sources = [
      {
        id: `${country.id}-src-primary`,
        title: country.gfp ? `2026 ${country.name} Military Strength` : `${country.name} UNROCA raporlama profili`,
        publisher: country.gfp ? "Global Firepower" : "UNROCA / açık kaynak",
        date: "2026-04-27",
        state: country.gfp ? "review" : "verified",
        url: src,
        summary: "Personel, kara, hava ve deniz kategori toplamları veya sınırlı güvenlik profili için kaynak."
      },
      {
        id: `${country.id}-src-flightglobal`,
        title: "World Air Forces 2025 Directory",
        publisher: "FlightGlobal / Cirium",
        date: "2025-01-01",
        state: "review",
        url: FLIGHTGLOBAL_2025,
        summary: "Hava aracı tip/adet kırılımı için ortak kaynak."
      },
      {
        id: `${country.id}-src-sipri`,
        title: "SIPRI Arms Transfers Database",
        publisher: "SIPRI",
        date: "2026-04-27",
        state: "review",
        url: SIPRI,
        summary: "Transfer ve tedarik çapraz kontrolü için kaynak."
      }
    ];

    if (country.gfp) {
      sources.push({
        id: `${country.id}-src-unroca`,
        title: "UN Register of Conventional Arms",
        publisher: "UNROCA",
        date: "2026-04-27",
        state: "review",
        url: UNROCA,
        summary: "Devlet raporları üzerinden konvansiyonel silah transfer doğrulaması için kullanılır."
      });
    }

    return sources;
  }

  function makeProfile(country) {
    return {
      id: country.id,
      name: country.name,
      headline: `${country.name} savunma görünümü`,
      center: country.center,
      zoom: country.zoom || (country.tier ? 8 : country.major ? 4 : 6),
      sourceScore: country.gfp ? (country.major ? 66 : 60) : 52,
      strength: makeStrength(country),
      outline: makeOutline(country.box),
      assets: makeAssets(country),
      sites: makeSites(country),
      sources: makeSources(country)
    };
  }

  function addCountries(countries) {
    const existingById = new Map(window.ODA_DATA.countries.map((country) => [country.id, country]));
    countries.forEach((country) => {
      if (existingById.has(country.id)) return;
      window.ODA_DATA.countries.push(makeProfile(country));
      existingById.set(country.id, country);
    });
  }

  window.ODA_STANDARD_PROFILES = { addCountries };
})();

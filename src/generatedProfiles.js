(function () {
  const GFP = "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=";
  const FLIGHTGLOBAL_2026 = "https://www.flightglobal.com/defence/2026-world-air-forces-directory/165267.article";
  const SIPRI = "https://www.sipri.org/databases/armstransfers";
  const UNROCA = "https://www.unroca.org/en/reporting/";
  const SIPRI_MILEX = "https://www.sipri.org/databases/milex";
  const WORLD_BANK_MILEX = "https://data.worldbank.org/indicator/MS.MIL.XPND.CD";
  const UCDP = "https://ucdp.uu.se/downloads/";
  const UN_PEACEKEEPING = "https://peacekeeping.un.org/en/troop-and-police-contributors";
  const ACLED = "https://acleddata.com/conflict-data";
  const NATO = "https://www.nato.int/en/what-we-do/introduction-to-nato/defence-expenditures-and-natos-5-commitment";
  const EDA = "https://www.eda.europa.eu/publications-and-data/defence-data";

  const NATO_COUNTRIES = new Set([
    "albania", "belgium", "bulgaria", "canada", "croatia", "czechia", "denmark", "estonia",
    "finland", "france", "germany", "greece", "hungary", "iceland", "italy", "latvia",
    "lithuania", "luxembourg", "montenegro", "netherlands", "north-macedonia", "norway",
    "poland", "portugal", "romania", "slovakia", "slovenia", "spain", "sweden", "turkiye",
    "united-kingdom", "united-states"
  ]);

  const EDA_COUNTRIES = new Set([
    "austria", "belgium", "bulgaria", "croatia", "cyprus", "czechia", "denmark", "estonia",
    "finland", "france", "germany", "greece", "hungary", "ireland", "italy", "latvia",
    "lithuania", "luxembourg", "malta", "netherlands", "poland", "portugal", "romania",
    "slovakia", "slovenia", "spain", "sweden"
  ]);

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
      activePersonnel: strengthValue(country, "sayısal kayıt yok"),
      reservePersonnel: strengthValue(country, "sayısal kayıt yok", "yedek kayıt yok"),
      landSystems: strengthValue(country, "sayısal kayıt yok", "sınırlı"),
      aircraft: strengthValue(country, "sayısal kayıt yok", "sınırlı"),
      navalAssets: country.coast ? strengthValue(country, "sayısal kayıt yok", "sahil") : "kara",
      note: `${country.name} profili ${country.region} kapsamında, yayınlanmış açık kaynaklardan ülke ölçeğinde ve hassas konum vermeden gösterilir.`,
      details: {
        personnel: {
          title: "Personel Detayı",
          source: src,
          sourceUrl: srcUrl,
          updated: "2026",
          note,
          rows: [
            { type: "Toplam askeri/güvenlik personeli", role: "Kaynak profili", active: strengthValue(country, "sayısal kayıt yok", "sınırlı"), activeLabel: "özet" },
            { type: "Aktif personel", role: "Kaynak doğrulama alanı", active: strengthValue(country, "sayısal kayıt yok", "sınırlı"), activeLabel: "aktif" },
            { type: "Yedek personel", role: "Kaynak doğrulama alanı", active: strengthValue(country, "sayısal kayıt yok", "yok/sınırlı"), activeLabel: "yedek" },
            { type: "Paramiliter / iç güvenlik", role: "Ayrı kaynakla doğrulanır", active: "kaynak", activeLabel: "kontrol" },
            { type: "Hava kuvvetleri personeli", role: "Varsa", active: strengthValue(country, "sayısal kayıt yok", "yok") },
            { type: "Kara kuvvetleri personeli", role: "Varsa", active: strengthValue(country, "sayısal kayıt yok", "sınırlı") },
            { type: "Deniz kuvvetleri personeli", role: country.coast ? "Varsa" : "Kıyı yok", active: country.coast ? strengthValue(country, "sayısal kayıt yok", "sınırlı") : "uygulanmaz" }
          ]
        },
        land: {
          title: "Kara Sistemi Detayı",
          source: country.gfp ? "Global Firepower 2026" : "Açık kaynak devlet profili",
          sourceUrl: srcUrl,
          updated: "2026",
          note: "Kategori seviyesi profil; gerçek üs/birlik konumları veya anlık hazırlık bilgisi içermez.",
          rows: [
            { type: "Tank", role: "Ana muharebe / zırhlı unsur", active: strengthValue(country, "sayısal kayıt yok", "yok/sınırlı"), activeLabel: "stok" },
            { type: "Zırhlı ve destek araçları", role: "Mekanize, lojistik ve özel araçlar", active: strengthValue(country, "sayısal kayıt yok", "sınırlı"), activeLabel: "stok" },
            { type: "Kundağı motorlu topçu", role: "Ateş destek", active: strengthValue(country, "sayısal kayıt yok", "yok/sınırlı"), activeLabel: "stok" },
            { type: "Çekili topçu", role: "Ateş destek", active: strengthValue(country, "sayısal kayıt yok", "yok/sınırlı"), activeLabel: "stok" },
            { type: "ÇNRA / roket topçusu", role: "Roket ateş destek", active: strengthValue(country, "sayısal kayıt yok", "yok/sınırlı"), activeLabel: "stok" }
          ]
        },
        aircraft: {
          title: "Hava Aracı Detayı",
          source: "FlightGlobal World Air Forces 2026 / Cirium fleets data",
          sourceUrl: FLIGHTGLOBAL_2026,
          updated: "2026",
          note: "Hava aracı tip/adet kırılımı FlightGlobal/Cirium üzerinden doğrulanacak kaynak alanıdır; platform bağımlı silahlar sabit harita dairesi üretmez.",
          rows: [
            { type: "Muharip uçak", role: "Varsa", active: strengthValue(country, "sayısal kayıt yok", "yok/sınırlı") },
            { type: "Nakliye", role: "Sabit kanat", active: strengthValue(country, "sayısal kayıt yok", "yok/sınırlı") },
            { type: "Özel görev / AEW", role: "Varsa", active: strengthValue(country, "sayısal kayıt yok", "yok/sınırlı") },
            { type: "Helikopter", role: "Genel maksat / taarruz", active: strengthValue(country, "sayısal kayıt yok", "yok/sınırlı") },
            { type: "Eğitim uçakları", role: "Varsa", active: strengthValue(country, "sayısal kayıt yok", "yok/sınırlı") }
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
            { type: "Toplam deniz platformu", role: country.coast ? "GFP toplam varlık" : "Kıyı yok", active: country.coast ? strengthValue(country, "sayısal kayıt yok", "sahil güvenlik") : "uygulanmaz", activeLabel: "adet" },
            { type: "Fırkateyn / korvet", role: "Suüstü muharip", active: country.coast ? strengthValue(country, "sayısal kayıt yok", "yok/sınırlı") : "uygulanmaz" },
            { type: "Denizaltı", role: "Sualtı platformu", active: country.coast ? strengthValue(country, "sayısal kayıt yok", "yok/sınırlı") : "uygulanmaz" },
            { type: "Devriye / sahil güvenlik", role: "Kıyı güvenliği", active: country.coast ? strengthValue(country, "sayısal kayıt yok", "sahil") : "uygulanmaz" },
            { type: "Mayın harbi", role: "Mayın karşı tedbir", active: country.coast ? strengthValue(country, "sayısal kayıt yok", "yok/sınırlı") : "uygulanmaz" }
          ]
        }
      }
    };
  }

  function makeAssets(country) {
    const src = sourceUrl(country);
    const confidence = country.gfp ? 0.54 : 0.48;
    const quantities = window.ODA_PROFILE_METRICS?.assetQuantities?.(country) || {};

    if (isLimitedSecurityProfile(country)) {
      return [
        {
          id: `${country.id}-security`,
          category: "land",
          name: `${country.name} güvenlik profili`,
          family: "Sınırlı iç güvenlik / koruma yapısı",
          role: "Ülke ölçeğinde güvenlik özeti",
          quantity: quantities.limitedSecurity || "sınırlı / özel düzen",
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
          quantity: quantities.civilDefense || "askeri olmayan kriz ve altyapı koruma kapasitesi",
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
          quantity: quantities.maritimeSecurity || "sahil güvenlik / gözetleme kapasitesi",
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
        quantity: quantities.landInventory || "sayısal kırılım yok; kaynak kuyruğunda",
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
        quantity: quantities.airPlatforms || "sayısal kırılım yok; kaynak kuyruğunda",
        rangeMode: "regional",
        confidence: 0.56,
        status: "kaynaklı",
        sourceTag: "FlightGlobal World Air Forces 2026",
        sourceUrl: FLIGHTGLOBAL_2026
      },
      {
        id: `${country.id}-air-defense`,
        category: "defense",
        name: "Hava savunma ve iç güvenlik katmanı",
        family: "Kısa/orta/uzun menzilli hava savunma ve kritik altyapı koruması",
        role: "Ülke ölçeğinde hava savunma özeti",
        quantity: quantities.airDefense || "ülke ölçeğinde hava savunma profili",
        rangeMode: "border",
        confidence: 0.52,
        status: "inceleme",
        sourceTag: "SIPRI / GFP / resmi kaynak doğrulaması",
        sourceUrl: SIPRI
      },
      {
        id: `${country.id}-sensor-network`,
        category: "sensor",
        name: "Radar ve komuta-kontrol ağı",
        family: "Hava/deniz/kara durum farkındalığı",
        role: "Erken ihbar ve sensör füzyonu",
        quantity: quantities.sensorNetwork || "ülke ölçeğinde sensör profili",
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
        quantity: quantities.precisionFires || "platforma bağlı; kaynak kuyruğunda",
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
          quantity: quantities.navalPlatforms || "sahil güvenlik / devriye kapasitesi",
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
          quantity: quantities.coastalDefense || "kıyı gözetleme ve deniz alanı farkındalığı",
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
        quantity: quantities.strategicProfile || "ülke ölçeği stratejik profil",
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
    const sourceSites = window.ODA_OSINT_SITES?.[country.id] || [];
    return sourceSites
      .filter((site) => site.meaningful === true)
      .map((site) => ({
        id: `${country.id}-site-${site.id}`,
        name: site.name,
        type: site.type,
        lat: site.lat,
        lng: site.lng,
        radiusKm: site.radiusKm || 10,
        precision: site.precision || "açık kaynak, yaklaşık",
        status: site.status || "Doğrulanmış anlamlı nokta",
        source: site.source || "Açık kaynak doğrulanmış nokta",
        sourceUrl: site.sourceUrl,
        showArea: Boolean(site.showArea),
        showRange: Boolean(site.showRange)
      }));
  }

  function makeSources(country) {
    const src = sourceUrl(country);
    const sources = [
      {
        id: `${country.id}-src-primary`,
        title: country.gfp ? `2026 ${country.name} Military Strength` : `${country.name} UNROCA raporlama profili`,
        publisher: country.gfp ? "Global Firepower" : "UNROCA / açık kaynak",
        date: "2026-04-30",
        state: country.gfp ? "review" : "verified",
        url: src,
        summary: "Personel, kara, hava ve deniz kategori toplamları veya sınırlı güvenlik profili için kaynak.",
        coverage: ["force-totals", "security-structure"]
      },
      {
        id: `${country.id}-src-flightglobal`,
        title: "World Air Forces 2026 Directory",
        publisher: "FlightGlobal / Cirium",
        date: "2026-01-01",
        state: "review",
        url: FLIGHTGLOBAL_2026,
        summary: "Hava aracı tip/adet kırılımı, sipariş ve modernizasyon takibi için ortak kaynak.",
        coverage: ["air-fleet", "orders"]
      },
      {
        id: `${country.id}-src-sipri`,
        title: "SIPRI Arms Transfers Database",
        publisher: "SIPRI",
        date: "2026-04-30",
        state: "review",
        url: SIPRI,
        summary: "Transfer ve tedarik çapraz kontrolü için kaynak.",
        coverage: ["arms-transfers", "procurement"]
      },
      {
        id: `${country.id}-src-sipri-milex`,
        title: "SIPRI Military Expenditure Database",
        publisher: "SIPRI",
        date: "2026-04-30",
        state: "review",
        url: SIPRI_MILEX,
        summary: "Askeri harcama, GSYH payı ve uzun dönem bütçe trendi için açık kaynak zaman serisi.",
        coverage: ["military-expenditure", "budget-trend"]
      },
      {
        id: `${country.id}-src-world-bank-milex`,
        title: "World Bank WDI Military Expenditure",
        publisher: "World Bank / SIPRI",
        date: "2026-04-30",
        state: "review",
        url: WORLD_BANK_MILEX,
        summary: "SIPRI tabanlı askeri harcama göstergelerini World Development Indicators üzerinden doğrulamak için kullanılır.",
        coverage: ["military-expenditure", "budget-trend"]
      },
      {
        id: `${country.id}-src-ucdp`,
        title: "UCDP Conflict Data",
        publisher: "Uppsala Conflict Data Program",
        date: "2026-04-30",
        state: "review",
        url: UCDP,
        summary: "Ülke risk ve çatışma bağlamını, envanterden ayrı bir bağlam katmanı olarak besler.",
        coverage: ["conflict-context"]
      },
      {
        id: `${country.id}-src-un-peacekeeping`,
        title: "UN Peacekeeping Troop and Police Contributors",
        publisher: "United Nations Peacekeeping",
        date: "2026-04-30",
        state: "review",
        url: UN_PEACEKEEPING,
        summary: "Barışı koruma görevlerine asker ve polis katkısını dış görev/katılım bağlamı olarak izler.",
        coverage: ["peacekeeping"]
      },
      {
        id: `${country.id}-src-acled`,
        title: "ACLED Conflict Data API",
        publisher: "ACLED",
        date: "2026-04-30",
        state: "candidate",
        url: ACLED,
        summary: "API anahtarı eklendiğinde yakın dönem siyasi şiddet ve protesto olaylarını bağlam katmanına eklemek için aday kaynak.",
        coverage: ["conflict-events", "conflict-context"]
      }
    ];

    if (country.gfp) {
      sources.push({
        id: `${country.id}-src-unroca`,
        title: "UN Register of Conventional Arms",
        publisher: "UNROCA",
        date: "2026-04-30",
        state: "review",
        url: UNROCA,
        summary: "Devlet raporları üzerinden konvansiyonel silah transfer doğrulaması için kullanılır.",
        coverage: ["official-reporting", "arms-transfers"]
      });
    }

    if (NATO_COUNTRIES.has(country.id)) {
      sources.push({
        id: `${country.id}-src-nato-defence-expenditure`,
        title: "NATO Defence Expenditures",
        publisher: "NATO",
        date: "2026-04-30",
        state: "review",
        url: NATO,
        summary: "NATO üyeleri için ortak savunma harcaması tanımı ve müttefik raporlamasını çapraz kontrol eder.",
        coverage: ["alliance-spending", "military-expenditure"]
      });
    }

    if (EDA_COUNTRIES.has(country.id)) {
      sources.push({
        id: `${country.id}-src-eda-defence-data`,
        title: "EDA Defence Data",
        publisher: "European Defence Agency",
        date: "2026-04-30",
        state: "review",
        url: EDA,
        summary: "EDA ülkeleri için savunma harcaması, yatırım ve iş birliği göstergelerini tamamlayıcı kaynak olarak kullanır.",
        coverage: ["defence-investment", "military-expenditure"]
      });
    }

    return sources;
  }

  function makeProfile(country) {
    return {
      id: country.id,
      name: country.name,
      continent: country.continent || "other",
      headline: `${country.name} savunma görünümü`,
      center: country.center,
      zoom: country.zoom || (country.tier ? 8 : country.major ? 4 : 6),
      sourceScore: country.gfp ? (country.major ? 66 : 60) : 52,
      strength: window.ODA_PROFILE_METRICS?.makeStrength(country) || makeStrength(country),
      outline: makeOutline(country.box),
      assets: makeAssets(country),
      sites: makeSites(country),
      sources: makeSources(country)
    };
  }

  function addCountries(countries, continent = "other") {
    const existingById = new Map(window.ODA_DATA.countries.map((country) => [country.id, country]));
    countries.forEach((country) => {
      if (existingById.has(country.id)) return;
      const profileSource = { ...country, continent: country.continent || continent };
      window.ODA_DATA.countries.push(makeProfile(profileSource));
      existingById.set(country.id, country);
    });
  }

  window.ODA_GENERATED_PROFILES = { addCountries, makeProfile };
  window.ODA_STANDARD_PROFILES = window.ODA_GENERATED_PROFILES;
})();

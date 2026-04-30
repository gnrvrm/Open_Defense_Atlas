(function () {
  const GFP = "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=";
  const FLIGHTGLOBAL_2026 = "https://www.flightglobal.com/defence/2026-world-air-forces-directory/165267.article";
  const SIPRI = "https://www.sipri.org/databases/armstransfers";
  const UNROCA = "https://www.unroca.org/en/reporting/";

  const americas = [
    { id: "antigua-barbuda", name: "Antigua ve Barbuda", center: [17.1, -61.8], box: [16.9, -62.4, 17.75, -61.6], coast: true, tier: "small", region: "Karayipler" },
    { id: "argentina", name: "Arjantin", gfp: "argentina", center: [-34.0, -64.0], box: [-55.1, -73.6, -21.8, -53.6], coast: true, region: "Güney Amerika" },
    { id: "bahamas", name: "Bahamalar", center: [24.4, -76.4], box: [20.9, -79.0, 27.3, -72.7], coast: true, tier: "small", region: "Karayipler" },
    { id: "barbados", name: "Barbados", center: [13.18, -59.55], box: [13.04, -59.65, 13.35, -59.42], coast: true, tier: "small", region: "Karayipler" },
    { id: "belize", name: "Belize", center: [17.2, -88.7], box: [15.8, -89.3, 18.5, -87.5], coast: true, tier: "small", region: "Orta Amerika" },
    { id: "bolivia", name: "Bolivya", gfp: "bolivia", center: [-16.3, -63.6], box: [-22.9, -69.7, -9.7, -57.5], region: "Güney Amerika" },
    { id: "brazil", name: "Brezilya", gfp: "brazil", center: [-10.8, -52.9], box: [-33.8, -73.9, 5.3, -34.8], coast: true, major: true, region: "Güney Amerika" },
    { id: "canada", name: "Kanada", gfp: "canada", center: [56.0, -106.0], box: [41.7, -141.0, 83.1, -52.6], coast: true, region: "Kuzey Amerika" },
    { id: "chile", name: "Şili", gfp: "chile", center: [-30.0, -71.0], box: [-55.9, -75.7, -17.5, -66.4], coast: true, region: "Güney Amerika" },
    { id: "colombia", name: "Kolombiya", gfp: "colombia", center: [4.6, -74.1], box: [-4.3, -79.0, 13.4, -66.8], coast: true, region: "Güney Amerika" },
    { id: "costa-rica", name: "Kosta Rika", center: [9.9, -84.2], box: [8.0, -85.95, 11.3, -82.5], coast: true, tier: "no-standing-army", region: "Orta Amerika" },
    { id: "cuba", name: "Küba", gfp: "cuba", center: [21.7, -79.5], box: [19.8, -85.0, 23.3, -74.1], coast: true, region: "Karayipler" },
    { id: "dominica", name: "Dominika", center: [15.42, -61.35], box: [15.2, -61.5, 15.7, -61.2], coast: true, tier: "no-standing-army", region: "Karayipler" },
    { id: "dominican-republic", name: "Dominik Cumhuriyeti", gfp: "dominican-republic", center: [18.9, -70.2], box: [17.5, -72.1, 19.95, -68.3], coast: true, region: "Karayipler" },
    { id: "ecuador", name: "Ekvador", gfp: "ecuador", center: [-1.6, -78.2], box: [-5.0, -81.1, 1.7, -75.2], coast: true, region: "Güney Amerika" },
    { id: "el-salvador", name: "El Salvador", gfp: "el-salvador", center: [13.8, -88.9], box: [13.1, -90.2, 14.45, -87.7], coast: true, region: "Orta Amerika" },
    { id: "grenada", name: "Grenada", center: [12.15, -61.65], box: [11.9, -61.9, 12.6, -61.3], coast: true, tier: "no-standing-army", region: "Karayipler" },
    { id: "guatemala", name: "Guatemala", gfp: "guatemala", center: [15.7, -90.4], box: [13.7, -92.3, 17.8, -88.2], coast: true, region: "Orta Amerika" },
    { id: "guyana", name: "Guyana", center: [5.0, -58.9], box: [1.2, -61.4, 8.6, -56.5], coast: true, tier: "small", region: "Güney Amerika" },
    { id: "haiti", name: "Haiti", center: [19.0, -72.6], box: [18.0, -74.6, 20.1, -71.6], coast: true, tier: "small", region: "Karayipler" },
    { id: "honduras", name: "Honduras", gfp: "honduras", center: [14.8, -86.6], box: [12.9, -89.4, 16.6, -83.1], coast: true, region: "Orta Amerika" },
    { id: "jamaica", name: "Jamaika", gfp: "jamaica", center: [18.1, -77.3], box: [17.7, -78.4, 18.6, -76.2], coast: true, tier: "small", region: "Karayipler" },
    { id: "mexico", name: "Meksika", gfp: "mexico", center: [23.6, -102.5], box: [14.5, -118.5, 32.7, -86.7], coast: true, region: "Kuzey Amerika" },
    { id: "nicaragua", name: "Nikaragua", gfp: "nicaragua", center: [12.9, -85.0], box: [10.7, -87.7, 15.1, -82.6], coast: true, region: "Orta Amerika" },
    { id: "panama", name: "Panama", center: [8.5, -80.0], box: [7.2, -83.1, 9.7, -77.1], coast: true, tier: "no-standing-army", region: "Orta Amerika" },
    { id: "paraguay", name: "Paraguay", gfp: "paraguay", center: [-23.4, -58.4], box: [-27.6, -62.7, -19.3, -54.2], region: "Güney Amerika" },
    { id: "peru", name: "Peru", gfp: "peru", center: [-9.2, -75.0], box: [-18.4, -81.4, -0.1, -68.6], coast: true, region: "Güney Amerika" },
    { id: "saint-kitts-nevis", name: "Saint Kitts ve Nevis", center: [17.28, -62.72], box: [17.0, -62.9, 17.45, -62.5], coast: true, tier: "no-standing-army", region: "Karayipler" },
    { id: "saint-lucia", name: "Saint Lucia", center: [13.9, -60.98], box: [13.7, -61.1, 14.15, -60.85], coast: true, tier: "no-standing-army", region: "Karayipler" },
    { id: "saint-vincent-grenadines", name: "Saint Vincent ve Grenadinler", center: [13.15, -61.2], box: [12.5, -61.6, 13.4, -61.0], coast: true, tier: "no-standing-army", region: "Karayipler" },
    { id: "suriname", name: "Surinam", gfp: "suriname", center: [4.0, -56.0], box: [1.8, -58.2, 6.1, -53.9], coast: true, tier: "small", region: "Güney Amerika" },
    { id: "trinidad-tobago", name: "Trinidad ve Tobago", gfp: "trinidad-and-tobago", center: [10.5, -61.25], box: [10.0, -61.95, 11.4, -60.5], coast: true, tier: "small", region: "Karayipler" },
    { id: "united-states", name: "Amerika Birleşik Devletleri", gfp: "united-states-of-america", center: [39.0, -98.0], box: [24.4, -125.0, 49.4, -66.9], coast: true, major: true, nuclear: true, region: "Kuzey Amerika" },
    { id: "uruguay", name: "Uruguay", gfp: "uruguay", center: [-32.8, -56.0], box: [-35.1, -58.5, -30.0, -53.1], coast: true, region: "Güney Amerika" },
    { id: "venezuela", name: "Venezuela", gfp: "venezuela", center: [7.0, -66.0], box: [0.6, -73.4, 12.3, -59.8], coast: true, region: "Güney Amerika" }
  ];

  if (window.ODA_GENERATED_PROFILES) {
    const southAmerica = new Set([
      "argentina",
      "bolivia",
      "brazil",
      "chile",
      "colombia",
      "ecuador",
      "guyana",
      "paraguay",
      "peru",
      "suriname",
      "uruguay",
      "venezuela"
    ]);
    window.ODA_GENERATED_PROFILES.addCountries(
      americas.map((country) => ({
        ...country,
        continent: southAmerica.has(country.id) ? "south-america" : "north-america"
      })),
      "north-america"
    );
    return;
  }

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
    return ["micro", "no-standing-army"].includes(country.tier);
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
      ? "Bu ülkede düzenli ağır askeri envanter yok veya çok sınırlı; güvenlik, sahil güvenlik, polis ve anlaşmalı savunma düzeni ülke ölçeğinde gösterilir."
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
        family: "Kısa/orta menzilli hava savunma ve kritik altyapı koruması",
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
    return [];
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
        summary: "Personel, kara, hava ve deniz kategori toplamları veya sınırlı güvenlik profili için kaynak."
      },
      {
        id: `${country.id}-src-flightglobal`,
        title: "World Air Forces 2026 Directory",
        publisher: "FlightGlobal / Cirium",
        date: "2026-01-01",
        state: "review",
        url: FLIGHTGLOBAL_2026,
        summary: "Hava aracı tip/adet kırılımı için ortak kaynak."
      },
      {
        id: `${country.id}-src-sipri`,
        title: "SIPRI Arms Transfers Database",
        publisher: "SIPRI",
        date: "2026-04-30",
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
        date: "2026-04-30",
        state: "review",
        url: UNROCA,
        summary: "Devlet raporları üzerinden konvansiyonel silah transfer doğrulaması için kullanılır."
      });
    }

    return sources;
  }

  function makeProfile(country) {
    const continent = country.region === "Güney Amerika" ? "south-america" : "north-america";

    return {
      id: country.id,
      name: country.name,
      continent,
      headline: `${country.name} savunma görünümü`,
      center: country.center,
      zoom: country.tier === "small" || country.tier === "no-standing-army" ? 8 : country.major ? 4 : 6,
      sourceScore: country.gfp ? (country.major ? 66 : 60) : 52,
      strength: window.ODA_PROFILE_METRICS?.makeStrength(country) || makeStrength(country),
      outline: makeOutline(country.box),
      assets: makeAssets(country),
      sites: makeSites(country),
      sources: makeSources(country)
    };
  }

  const existingById = new Map(window.ODA_DATA.countries.map((country) => [country.id, country]));
  americas.forEach((country) => {
    if (existingById.has(country.id)) return;
    window.ODA_DATA.countries.push(makeProfile(country));
  });
})();

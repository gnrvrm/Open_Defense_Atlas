(function () {
  const GFP = "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=";
  const FLIGHTGLOBAL_2026 = "https://www.flightglobal.com/defence/2026-world-air-forces-directory/165267.article";
  const SIPRI = "https://www.sipri.org/databases/armstransfers";
  const UNROCA = "https://www.unroca.org/en/reporting/";

  const europe = [
    { id: "albania", name: "Arnavutluk", gfp: "albania", center: [41.15, 20.15], box: [39.6, 19.0, 42.7, 21.2], coast: true, region: "Balkanlar" },
    { id: "andorra", name: "Andorra", center: [42.55, 1.58], box: [42.43, 1.41, 42.66, 1.79], tier: "micro", region: "Batı Avrupa" },
    { id: "armenia", name: "Ermenistan", gfp: "armenia", center: [40.05, 44.95], box: [38.8, 43.4, 41.3, 46.7], region: "Kafkasya" },
    { id: "austria", name: "Avusturya", gfp: "austria", center: [47.6, 14.2], box: [46.35, 9.5, 49.1, 17.2], region: "Orta Avrupa" },
    { id: "azerbaijan", name: "Azerbaycan", gfp: "azerbaijan", center: [40.35, 47.7], box: [38.4, 44.8, 41.9, 50.4], coast: true, region: "Kafkasya" },
    { id: "belarus", name: "Belarus", gfp: "belarus", center: [53.5, 28.0], box: [51.2, 23.1, 56.2, 32.8], region: "Doğu Avrupa" },
    { id: "belgium", name: "Belçika", gfp: "belgium", center: [50.65, 4.65], box: [49.5, 2.5, 51.6, 6.4], coast: true, region: "Batı Avrupa" },
    { id: "bosnia-herzegovina", name: "Bosna-Hersek", gfp: "bosnia-and-herzegovina", center: [44.2, 17.8], box: [42.5, 15.7, 45.4, 19.7], coast: true, region: "Balkanlar" },
    { id: "bulgaria", name: "Bulgaristan", gfp: "bulgaria", center: [42.7, 25.3], box: [41.2, 22.3, 44.3, 28.6], coast: true, region: "Balkanlar" },
    { id: "croatia", name: "Hırvatistan", gfp: "croatia", center: [45.1, 16.4], box: [42.4, 13.4, 46.6, 19.5], coast: true, region: "Balkanlar" },
    { id: "cyprus", name: "Kıbrıs", center: [35.0, 33.0], box: [34.55, 32.25, 35.7, 34.6], coast: true, region: "Doğu Akdeniz" },
    { id: "czechia", name: "Çekya", gfp: "czechia", center: [49.8, 15.5], box: [48.55, 12.1, 51.1, 18.9], region: "Orta Avrupa" },
    { id: "denmark", name: "Danimarka", gfp: "denmark", center: [56.1, 10.0], box: [54.55, 8.0, 57.8, 12.9], coast: true, region: "Kuzey Avrupa" },
    { id: "estonia", name: "Estonya", gfp: "estonia", center: [58.75, 25.0], box: [57.5, 21.8, 59.8, 28.3], coast: true, region: "Baltık" },
    { id: "finland", name: "Finlandiya", gfp: "finland", center: [64.5, 26.2], box: [59.8, 20.5, 70.1, 31.6], coast: true, region: "Kuzey Avrupa" },
    { id: "france", name: "Fransa", gfp: "france", center: [46.5, 2.3], box: [41.2, -5.2, 51.2, 9.7], coast: true, major: true, nuclear: true, region: "Batı Avrupa" },
    { id: "georgia", name: "Gürcistan", gfp: "georgia", center: [42.1, 43.5], box: [41.0, 40.0, 43.6, 46.8], coast: true, region: "Kafkasya" },
    { id: "germany", name: "Almanya", gfp: "germany", center: [51.1, 10.3], box: [47.2, 5.8, 55.1, 15.1], coast: true, major: true, region: "Orta Avrupa" },
    { id: "greece", name: "Yunanistan", gfp: "greece", center: [39.1, 22.5], box: [34.9, 19.6, 41.8, 28.2], coast: true, region: "Guney Avrupa" },
    { id: "hungary", name: "Macaristan", gfp: "hungary", center: [47.1, 19.5], box: [45.7, 16.1, 48.6, 22.9], region: "Orta Avrupa" },
    { id: "iceland", name: "İzlanda", gfp: "iceland", center: [64.9, -18.8], box: [63.2, -24.8, 66.7, -13.5], coast: true, tier: "no-standing-army", region: "Kuzey Atlantik" },
    { id: "ireland", name: "İrlanda", gfp: "ireland", center: [53.2, -8.2], box: [51.4, -10.7, 55.4, -5.9], coast: true, region: "Kuzeybatı Avrupa" },
    { id: "italy", name: "İtalya", gfp: "italy", center: [42.7, 12.6], box: [36.6, 6.6, 47.2, 18.8], coast: true, major: true, region: "Güney Avrupa" },
    { id: "kazakhstan", name: "Kazakistan", gfp: "kazakhstan", center: [48.0, 67.0], box: [40.6, 46.5, 55.5, 87.3], coast: true, region: "Doğu Avrupa / Orta Asya sınırı" },
    { id: "kosovo", name: "Kosova", gfp: "kosovo", center: [42.6, 20.9], box: [41.8, 20.0, 43.3, 21.8], region: "Balkanlar" },
    { id: "latvia", name: "Letonya", gfp: "latvia", center: [56.9, 24.7], box: [55.6, 20.8, 58.1, 28.3], coast: true, region: "Baltık" },
    { id: "liechtenstein", name: "Lihtenştayn", center: [47.16, 9.55], box: [47.05, 9.47, 47.28, 9.64], tier: "micro", region: "Orta Avrupa" },
    { id: "lithuania", name: "Litvanya", gfp: "lithuania", center: [55.3, 23.9], box: [53.9, 20.9, 56.5, 26.9], coast: true, region: "Baltık" },
    { id: "luxembourg", name: "Lüksemburg", gfp: "luxembourg", center: [49.75, 6.1], box: [49.45, 5.7, 50.2, 6.55], tier: "small", region: "Batı Avrupa" },
    { id: "malta", name: "Malta", center: [35.9, 14.4], box: [35.75, 14.15, 36.1, 14.6], coast: true, tier: "small", region: "Akdeniz" },
    { id: "moldova", name: "Moldova", gfp: "moldova", center: [47.2, 28.6], box: [45.4, 26.6, 48.6, 30.2], region: "Doğu Avrupa" },
    { id: "monaco", name: "Monako", center: [43.74, 7.42], box: [43.71, 7.38, 43.76, 7.45], coast: true, tier: "micro", region: "Batı Avrupa" },
    { id: "montenegro", name: "Karadağ", gfp: "montenegro", center: [42.8, 19.2], box: [41.8, 18.4, 43.6, 20.4], coast: true, region: "Balkanlar" },
    { id: "netherlands", name: "Hollanda", gfp: "netherlands", center: [52.2, 5.3], box: [50.7, 3.3, 53.7, 7.2], coast: true, region: "Batı Avrupa" },
    { id: "north-macedonia", name: "Kuzey Makedonya", gfp: "macedonia", center: [41.6, 21.7], box: [40.8, 20.4, 42.4, 23.1], region: "Balkanlar" },
    { id: "norway", name: "Norveç", gfp: "norway", center: [62.2, 9.0], box: [57.9, 4.5, 71.2, 31.2], coast: true, region: "Kuzey Avrupa" },
    { id: "poland", name: "Polonya", gfp: "poland", center: [52.0, 19.1], box: [49.0, 14.2, 54.8, 23.9], coast: true, region: "Orta Avrupa" },
    { id: "portugal", name: "Portekiz", gfp: "portugal", center: [39.6, -8.0], box: [36.9, -9.6, 42.2, -6.2], coast: true, region: "Güneybatı Avrupa" },
    { id: "romania", name: "Romanya", gfp: "romania", center: [45.9, 24.9], box: [43.6, 20.2, 48.3, 29.8], coast: true, region: "Doğu Avrupa" },
    { id: "russia", name: "Rusya", gfp: "russia", center: [56.0, 38.0], box: [41.2, 19.6, 71.2, 66.0], coast: true, major: true, nuclear: true, region: "Doğu Avrupa / transkıtasal" },
    { id: "san-marino", name: "San Marino", center: [43.94, 12.46], box: [43.89, 12.4, 43.99, 12.52], tier: "micro", region: "Güney Avrupa" },
    { id: "serbia", name: "Sırbistan", gfp: "serbia", center: [44.0, 20.8], box: [42.2, 18.8, 46.2, 23.0], region: "Balkanlar" },
    { id: "slovakia", name: "Slovakya", gfp: "slovakia", center: [48.7, 19.5], box: [47.7, 16.8, 49.7, 22.6], region: "Orta Avrupa" },
    { id: "slovenia", name: "Slovenya", gfp: "slovenia", center: [46.1, 14.9], box: [45.4, 13.4, 46.9, 16.7], coast: true, region: "Orta Avrupa" },
    { id: "spain", name: "İspanya", gfp: "spain", center: [40.2, -3.7], box: [36.0, -9.4, 43.8, 3.4], coast: true, major: true, region: "Güneybatı Avrupa" },
    { id: "sweden", name: "İsveç", gfp: "sweden", center: [62.0, 15.0], box: [55.2, 11.0, 69.1, 24.2], coast: true, region: "Kuzey Avrupa" },
    { id: "switzerland", name: "İsviçre", gfp: "switzerland", center: [46.8, 8.2], box: [45.8, 5.9, 47.9, 10.6], region: "Orta Avrupa" },
    { id: "turkiye", name: "T\u00fcrkiye", gfp: "Turkey", center: [39.0, 35.2], box: [36.0, 26.0, 42.1, 44.8], coast: true, region: "Dogu Akdeniz / Avrupa" },
    { id: "ukraine", name: "Ukrayna", gfp: "ukraine", center: [49.0, 31.3], box: [44.3, 22.0, 52.4, 40.2], coast: true, major: true, region: "Doğu Avrupa" },
    { id: "united-kingdom", name: "Birleşik Krallık", gfp: "united-kingdom", center: [54.5, -2.4], box: [49.9, -8.7, 60.9, 1.9], coast: true, major: true, nuclear: true, region: "Kuzeybatı Avrupa" },
    { id: "vatican-city", name: "Vatikan", center: [41.9, 12.45], box: [41.89, 12.44, 41.91, 12.46], tier: "micro", region: "Güney Avrupa" }
  ];

  if (window.ODA_GENERATED_PROFILES) {
    window.ODA_GENERATED_PROFILES.addCountries(europe, "europe");
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

  function isMicro(country) {
    return ["micro", "no-standing-army"].includes(country.tier);
  }

  function strengthValue(country, normalValue, smallValue = "sınırlı") {
    if (country.tier === "micro") return "sınırlı";
    if (country.tier === "no-standing-army") return "yok";
    if (country.tier === "small") return smallValue;
    return normalValue;
  }

  function makeStrength(country) {
    const src = country.gfp ? "Global Firepower 2026" : "UNROCA / açık kaynak ülke profili";
    const srcUrl = sourceUrl(country);
    const noArmyNote = isMicro(country)
      ? "Bu ülkede düzenli ağır askeri envanter yok veya çok sınırlı; güvenlik/sivil savunma ve anlaşmalı savunma düzeni ülke ölçeğinde gösterilir."
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
          updated: country.gfp ? "2026" : "2026",
          note: noArmyNote,
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
    const prefix = country.id.slice(0, 3).replace(/[^a-z]/g, "x");
    const confidence = country.gfp ? 0.54 : 0.48;
    const quantities = window.ODA_PROFILE_METRICS?.assetQuantities?.(country) || {};

    if (isMicro(country)) {
      return [
        {
          id: `${prefix}-sec-1`,
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
          id: `${prefix}-def-1`,
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
          id: `${prefix}-src-1`,
          category: "sensor",
          name: "Sınır/altyapı gözetleme kaydı",
          family: "Kamu güvenliği ve altyapı gözetimi",
          role: "Hassas konum vermeyen durum farkındalığı",
          quantity: quantities.maritimeSecurity || "sınır ve altyapı gözetleme kapasitesi",
          rangeMode: "regional",
          confidence: 0.44,
          status: "yaklaşık",
          sourceTag: "Açık kaynak derlemesi",
          sourceUrl: src
        }
      ];
    }

    const assets = [
      {
        id: `${prefix}-land-1`,
        category: "land",
        name: "Tank ve zırhlı araç envanteri",
        family: "Kara muharebe sistemleri",
        role: "Kara muharebe ve mekanize kabiliyet",
        quantity: quantities.landInventory || "sayısal kırılım yok; kaynak kuyruğunda",
        rangeMode: "regional",
        confidence,
        defaultSelected: true,
        status: "tahmini",
        sourceTag: "Global Firepower 2026",
        sourceUrl: src
      },
      {
        id: `${prefix}-land-2`,
        category: "land",
        name: "Topçu ve roket topçusu",
        family: "Ateş destek sistemleri",
        role: "Kara ateş destek",
        quantity: quantities.precisionFires || "platforma bağlı; kaynak kuyruğunda",
        rangeMode: "regional",
        confidence,
        status: "tahmini",
        sourceTag: "Global Firepower 2026",
        sourceUrl: src
      },
      {
        id: `${prefix}-air-1`,
        category: "air",
        name: "Muharip hava araçları",
        family: "Sabit kanat hava platformları",
        role: "Hava savunma / taarruz / devriye",
        quantity: quantities.airPlatforms || "sayısal kırılım yok; kaynak kuyruğunda",
        rangeMode: "regional",
        confidence: 0.56,
        status: "kaynaklı",
        sourceTag: "FlightGlobal World Air Forces 2026",
        sourceUrl: FLIGHTGLOBAL_2026
      },
      {
        id: `${prefix}-air-2`,
        category: "air",
        name: "Nakliye, helikopter ve özel görev hava araçları",
        family: "Destek hava platformları",
        role: "Nakliye, eğitim, arama-kurtarma ve özel görev",
        quantity: quantities.airPlatforms || "sayısal kırılım yok; kaynak kuyruğunda",
        rangeMode: "regional",
        confidence: 0.56,
        status: "kaynaklı",
        sourceTag: "FlightGlobal World Air Forces 2026",
        sourceUrl: FLIGHTGLOBAL_2026
      },
      {
        id: `${prefix}-def-1`,
        category: "defense",
        name: "Hava savunma katmanı",
        family: "Kısa/orta/uzun menzilli hava savunma",
        role: "Ülke ölçeğinde hava savunma özeti",
        quantity: quantities.airDefense || "ülke ölçeğinde hava savunma profili",
        rangeMode: "border",
        confidence: 0.52,
        status: "inceleme",
        sourceTag: "SIPRI / GFP / resmi kaynak doğrulaması",
        sourceUrl: SIPRI
      },
      {
        id: `${prefix}-sns-1`,
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
        id: `${prefix}-atk-1`,
        category: "attack",
        name: "Hassas taarruz ve roket topçusu",
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
          id: `${prefix}-nvl-1`,
          category: "naval",
          name: "Deniz platformları",
          family: "Fırkateyn, korvet, devriye ve destek unsurları",
          role: "Deniz güvenliği ve suüstü kabiliyeti",
          quantity: quantities.navalPlatforms || "sahil güvenlik / devriye kapasitesi",
          rangeMode: "coastal",
          confidence,
          status: "tahmini",
          sourceTag: "Global Firepower 2026",
          sourceUrl: src
        },
        {
          id: `${prefix}-nvl-2`,
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
        id: `${prefix}-str-1`,
        category: "attack",
        name: country.nuclear ? "Stratejik caydırıcılık kaydı" : "Geniş ölçekli güç projeksiyonu",
        family: country.nuclear ? "Nükleer/stratejik kapasite ülkesi" : "Uzun menzil ve dış görev kabiliyeti",
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
    return {
      id: country.id,
      name: country.name,
      continent: "europe",
      headline: `${country.name} savunma görünümü`,
      center: country.center,
      zoom: country.tier === "micro" ? 10 : country.id === "russia" ? 4 : 6,
      sourceScore: country.gfp ? (country.major ? 66 : 60) : 52,
      strength: window.ODA_PROFILE_METRICS?.makeStrength(country) || makeStrength(country),
      outline: makeOutline(country.box),
      assets: makeAssets(country),
      sites: makeSites(country),
      sources: makeSources(country)
    };
  }

  const existingById = new Map(window.ODA_DATA.countries.map((country) => [country.id, country]));
  europe.forEach((country) => {
    if (existingById.has(country.id)) return;
    window.ODA_DATA.countries.push(makeProfile(country));
  });
})();




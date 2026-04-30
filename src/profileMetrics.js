(function () {
  const GFP = "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=";
  const FLIGHTGLOBAL_2026 = "https://www.flightglobal.com/defence/2026-world-air-forces-directory/165267.article";
  const UNROCA = "https://www.unroca.org/en/reporting/";

  function sourceUrl(country) {
    return country.gfp ? `${GFP}${country.gfp}` : UNROCA;
  }

  function metricsFor(country) {
    if (!country.gfp) return null;
    return window.ODA_GFP_METRICS?.countries?.[country.gfp] || null;
  }

  function limitedLabel(country, smallValue = "sınırlı") {
    if (country.tier === "micro") return "sınırlı";
    if (country.tier === "no-standing-army") return "askeri yapı yok";
    if (country.tier === "small") return smallValue;
    return "sayısal kayıt yok";
  }

  function valueOr(value, fallback) {
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function metricRow(type, role, value, label = "adet") {
    return {
      type,
      role,
      active: valueOr(value, "sayısal kayıt yok"),
      activeLabel: label
    };
  }

  function filled(value) {
    return value !== undefined && value !== null && value !== "";
  }

  function summarize(parts, fallback) {
    const summary = parts.filter(Boolean).join("; ");
    return summary || fallback;
  }

  function inventoryFallback(country, smallValue = "sınırlı güvenlik kapasitesi") {
    if (country.tier === "micro") return "sınırlı güvenlik kapasitesi";
    if (country.tier === "no-standing-army") return "düzenli askeri envanter yok";
    if (country.tier === "small") return smallValue;
    return "sayısal kırılım yok; kaynak kuyruğunda";
  }

  function assetQuantities(country) {
    const metrics = metricsFor(country);
    const land = metrics?.land || {};
    const air = metrics?.air || {};
    const naval = metrics?.naval || {};

    return {
      limitedSecurity: inventoryFallback(country, "sınırlı iç güvenlik / sahil güvenlik kapasitesi"),
      civilDefense: "askeri olmayan kriz ve altyapı koruma kapasitesi",
      maritimeSecurity: country.coast ? "sahil güvenlik / deniz emniyeti kapasitesi" : "sınır ve altyapı gözetleme kapasitesi",
      landInventory: summarize(
        [
          filled(land.tanks) ? `Tank ${land.tanks}` : null,
          filled(land.armoredVehicles) ? `Zırhlı/destek ${land.armoredVehicles}` : null,
          filled(land.rocketProjectors) ? `ÇNRA ${land.rocketProjectors}` : null
        ],
        inventoryFallback(country, "yok/sınırlı kara güvenlik unsuru")
      ),
      airPlatforms: summarize(
        [
          filled(air.total) ? `Toplam ${air.total}` : null,
          filled(air.fighters) ? `Muharip ${air.fighters}` : null,
          filled(air.helicopters) ? `Helikopter ${air.helicopters}` : null
        ],
        inventoryFallback(country, "yok/sınırlı hava unsuru")
      ),
      airDefense: filled(air.total)
        ? `hava savunma profili; hava platformu toplamı ${air.total}`
        : inventoryFallback(country, "kritik altyapı / iç güvenlik koruması"),
      sensorNetwork: "ülke ölçeğinde sensör profili; hassas konum gösterilmez",
      precisionFires: summarize(
        [
          filled(land.rocketProjectors) ? `ÇNRA ${land.rocketProjectors}` : null,
          filled(land.selfPropelledArtillery) ? `K/M topçu ${land.selfPropelledArtillery}` : null,
          filled(land.towedArtillery) ? `çekili topçu ${land.towedArtillery}` : null
        ],
        inventoryFallback(country, "kanıtlı uzun menzil kaydı yok/sınırlı")
      ),
      navalPlatforms: country.coast
        ? summarize(
            [
              filled(naval.total) ? `Toplam platform ${naval.total}` : null,
              filled(naval.frigates) ? `Fırkateyn ${naval.frigates}` : null,
              filled(naval.corvettes) ? `Korvet ${naval.corvettes}` : null,
              filled(naval.patrolVessels) ? `Devriye ${naval.patrolVessels}` : null
            ],
            inventoryFallback(country, "sahil güvenlik / devriye kapasitesi")
          )
        : "uygulanmaz",
      coastalDefense: country.coast ? "kıyı gözetleme ve deniz alanı farkındalığı" : "uygulanmaz",
      strategicProfile: country.nuclear ? "stratejik caydırıcılık profili" : "bölgesel güç projeksiyonu profili"
    };
  }

  function hasMetrics(metrics) {
    return Boolean(metrics?.personnel || metrics?.air || metrics?.land || metrics?.naval);
  }

  function makeStrength(country) {
    const metrics = metricsFor(country);
    const limited = ["micro", "no-standing-army", "small"].includes(country.tier);
    const srcUrl = metrics?.source || sourceUrl(country);
    const src = country.gfp ? "Global Firepower 2026" : "UNROCA / açık kaynak ülke profili";
    const genericNote = hasMetrics(metrics)
      ? "Bu panel GFP 2026 sayısal alanlarını ülke ölçeğinde gösterir; hazır olma, gerçek zamanlı konuşlanma veya hassas birlik konumu değildir."
      : limited
        ? "Bu ülkede ağır askeri envanter yok veya sınırlı; güvenlik, sahil güvenlik, polis ve anlaşmalı savunma düzeni ülke ölçeğinde gösterilir."
        : "Bu ülke için sayısal kırılım henüz yerel metriğe işlenmedi; kaynak bağlantıları doğrulama kuyruğunda tutulur.";

    const personnel = metrics?.personnel || {};
    const land = metrics?.land || {};
    const air = metrics?.air || {};
    const naval = metrics?.naval || {};

    return {
      activePersonnel: valueOr(personnel.active, limitedLabel(country)),
      reservePersonnel: valueOr(personnel.reserve, limitedLabel(country, "kaynak yok")),
      landSystems: valueOr(land.total, limitedLabel(country, "sınırlı")),
      aircraft: valueOr(air.total, limitedLabel(country, "sınırlı")),
      navalAssets: country.coast ? valueOr(naval.total, limitedLabel(country, "sahil güvenlik")) : "kara",
      note: `${country.name} profili ${country.region} kapsamında, yayınlanmış açık kaynaklardan ülke ölçeğinde ve hassas konum vermeden gösterilir.`,
      details: {
        personnel: {
          title: "Personel Detayı",
          source: src,
          sourceUrl: srcUrl,
          updated: metrics?.updated || "2026",
          note: genericNote,
          rows: [
            metricRow("Toplam askeri/güvenlik personeli", "Kaynak profili", valueOr(personnel.total, personnel.active), "özet"),
            metricRow("Aktif personel", "Düzenli aktif kuvvet", personnel.active, "aktif"),
            metricRow("Yedek personel", "Yedek kuvvet", personnel.reserve, "yedek"),
            metricRow("Paramiliter / iç güvenlik", "Ayrı kaynakla doğrulanır", personnel.paramilitary, "kayıt"),
            metricRow("Hava kuvvetleri personeli", "Varsa", personnel.airForce, "personel"),
            metricRow("Kara kuvvetleri personeli", "Varsa", personnel.army, "personel"),
            metricRow("Deniz kuvvetleri personeli", country.coast ? "Varsa" : "Kıyı yok", country.coast ? personnel.navy : "uygulanmaz", "personel")
          ]
        },
        land: {
          title: "Kara Sistemi Detayı",
          source: country.gfp ? "Global Firepower 2026" : "Açık kaynak devlet profili",
          sourceUrl: srcUrl,
          updated: metrics?.updated || "2026",
          note: "Kategori seviyesi profil; gerçek üs/birlik konumları veya anlık hazırlık bilgisi içermez.",
          rows: [
            metricRow("Tank", "Ana muharebe / zırhlı unsur", land.tanks, "stok"),
            metricRow("Zırhlı ve destek araçları", "Mekanize, lojistik ve özel araçlar", land.armoredVehicles, "stok"),
            metricRow("Kundağı motorlu topçu", "Ateş destek", land.selfPropelledArtillery, "stok"),
            metricRow("Çekili topçu", "Ateş destek", land.towedArtillery, "stok"),
            metricRow("ÇNRA / roket topçusu", "Roket ateş destek", land.rocketProjectors, "stok")
          ]
        },
        aircraft: {
          title: "Hava Aracı Detayı",
          source: "Global Firepower 2026 + FlightGlobal World Air Forces 2026",
          sourceUrl: country.gfp ? srcUrl : FLIGHTGLOBAL_2026,
          updated: metrics?.updated || "2025/2026",
          note: "Hava aracı toplamları GFP kategori verisinden gelir; tip/model kırılımı FlightGlobal/Cirium adaptörü derinleştikçe ayrıştırılır.",
          rows: [
            { type: "Toplam hava aracı", role: "GFP toplam stok", active: valueOr(air.total, "sayısal kayıt yok"), activeLabel: "stok", ready: air.ready },
            metricRow("Muharip uçak", "Fighter / interceptor", air.fighters, "stok"),
            metricRow("Taarruz uçağı", "Attack / strike", air.attack, "stok"),
            metricRow("Nakliye", "Sabit kanat", air.transports, "stok"),
            metricRow("Özel görev / AEW", "Varsa", air.specialMission, "stok"),
            metricRow("Helikopter", "Genel maksat / taarruz", air.helicopters, "stok"),
            metricRow("Eğitim uçakları", "Varsa", air.trainers, "stok")
          ]
        },
        naval: {
          title: "Deniz Unsuru Detayı",
          source: country.coast ? "Global Firepower 2026 + açık kaynak deniz profili" : "Kıyı erişimi yok",
          sourceUrl: country.coast ? srcUrl : sourceUrl(country),
          updated: metrics?.updated || "2026",
          note: country.coast
            ? "Deniz unsurları kıyı/liman ölçeğinde genelleştirilir; gemi konumu veya gerçek zamanlı hareket gösterilmez."
            : "Kıyısı olmayan ülkelerde deniz unsuru uygulanmaz; lojistik ve kara güvenliği ayrı gösterilir.",
          rows: [
            metricRow("Toplam deniz platformu", country.coast ? "GFP kategori toplamı" : "Kıyı yok", country.coast ? naval.total : "uygulanmaz", "adet"),
            metricRow("Uçak/helikopter gemisi", "Büyük güverte platformu", [naval.aircraftCarriers, naval.helicopterCarriers].filter(Boolean).join(" / "), "adet"),
            metricRow("Fırkateyn / korvet", "Suüstü muharip", [naval.frigates, naval.corvettes].filter(Boolean).join(" / "), "adet"),
            metricRow("Denizaltı", "Sualtı platformu", naval.submarines, "adet"),
            metricRow("Devriye / sahil güvenlik", "Kıyı güvenliği", naval.patrolVessels, "adet"),
            metricRow("Mayın harbi", "Mayın karşı tedbir", naval.mineWarfare, "adet")
          ]
        }
      }
    };
  }

  window.ODA_PROFILE_METRICS = { makeStrength, metricsFor, assetQuantities };
})();

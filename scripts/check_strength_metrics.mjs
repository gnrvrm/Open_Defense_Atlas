import fs from "node:fs";
import vm from "node:vm";

const files = [
  "src/data.js",
  "src/gfpMetrics.js",
  "src/profileMetrics.js",
  "src/countryProfiles.js",
  "src/europeProfiles.js",
  "src/americasProfiles.js",
  "src/standardProfiles.js",
  "src/asiaProfiles.js",
  "src/africaProfiles.js",
  "src/oceaniaProfiles.js"
];

const sandbox = { window: {} };
vm.createContext(sandbox);
files.forEach((file) => {
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
});

const sourceLabelAsValue = /^(GFP 2026|Flight 2025|GFP kaydı|GFP stok|GFP kategori kaydı|FlightGlobal kaydı|FlightGlobal tip kırılımı|GFP tahmini|kaynak kontrol[üuı]?|kaynak profili|ağ kaydı|envanter kaydı|SIPRI\/UNROCA çapraz kontrol|ülke ölçeği kaynak profili)$/i;
const countries = sandbox.window.ODA_DATA.countries;
const failures = [];

countries.forEach((country) => {
  const strength = country.strength;
  if (!strength) {
    failures.push({ id: country.id, reason: "missing strength" });
    return;
  }

  const summaryValues = [
    strength.activePersonnel,
    strength.landSystems,
    strength.aircraft,
    strength.navalAssets
  ];
  const detailValues = Object.values(strength.details || {}).flatMap((detail) =>
    detail.rows.map((row) => row.active)
  );
  const inventoryValues = (country.assets || []).map((asset) => asset.quantity);

  [...summaryValues, ...detailValues, ...inventoryValues].forEach((value) => {
    if (sourceLabelAsValue.test(String(value))) {
      failures.push({ id: country.id, reason: "source label used as value", value });
    }
  });
});

if (failures.length) {
  console.error(JSON.stringify({ countryCount: countries.length, failures: failures.slice(0, 25) }, null, 2));
  process.exit(1);
}

const samples = ["brazil", "china", "india", "egypt", "australia", "kuwait"].map((id) => {
  const country = countries.find((item) => item.id === id);
  return {
    id,
    activePersonnel: country.strength.activePersonnel,
    landSystems: country.strength.landSystems,
    aircraft: country.strength.aircraft,
    navalAssets: country.strength.navalAssets
  };
});

console.log(JSON.stringify({ countryCount: countries.length, failures: 0, samples }, null, 2));

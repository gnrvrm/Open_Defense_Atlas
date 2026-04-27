import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFiles = [
  "src/europeProfiles.js",
  "src/americasProfiles.js",
  "src/asiaProfiles.js",
  "src/africaProfiles.js",
  "src/oceaniaProfiles.js"
];
const outputFile = path.join(root, "src/gfpMetrics.js");
const gfpUrl = (slug) => `https://www.globalfirepower.com/country-military-strength-detail.php?country_id=${slug}`;

function decodeEntities(value = "") {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#44;", ",")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanNumber(value) {
  return decodeEntities(value || "") || undefined;
}

function parseInteger(value) {
  const digits = String(value || "").replace(/[^0-9]/g, "");
  return digits ? Number(digits) : 0;
}

function formatInteger(value) {
  return value ? new Intl.NumberFormat("en-US").format(value) : undefined;
}

function compact(value) {
  if (Array.isArray(value)) return value.map(compact).filter((item) => item !== undefined);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, compact(item)])
        .filter(([, item]) => item !== undefined && item !== "")
    );
  }
  return value === null ? undefined : value;
}

async function collectGfpSlugs() {
  const slugs = new Set();
  for (const file of sourceFiles) {
    const text = await fs.readFile(path.join(root, file), "utf8");
    for (const match of text.matchAll(/gfp:\s*"([^"]+)"/g)) {
      slugs.add(match[1]);
    }
  }
  return [...slugs].sort((left, right) => left.localeCompare(right));
}

async function fetchHtml(slug) {
  const response = await fetch(gfpUrl(slug), {
    headers: {
      "User-Agent": "OpenDefenseAtlas/0.6.2 (+https://gnrvrm.github.io/Open_Defense_Atlas/)"
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function cardValue(html, label) {
  const pattern = new RegExp(
    `>\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*</span>\\s*<br\\s*/?>\\s*<span[^>]*>\\s*<span[^>]*>\\s*([^<]+)\\s*</span>`,
    "is"
  );
  return cleanNumber(html.match(pattern)?.[1]);
}

function jsNumber(html, name) {
  const match = html.match(new RegExp(`var\\s+${name}\\s*=\\s*([0-9]+)\\s*;`));
  return match ? Number(match[1]) : 0;
}

function metricItem(html, name) {
  return formatInteger(jsNumber(html, name));
}

function plainText(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );
}

function aircraftTotal(text) {
  const match = text.match(/Aircraft Total:\s*Stock:\s*([0-9,]+)\s*Readiness:\s*([0-9,*]+)/i);
  return {
    stock: cleanNumber(match?.[1]),
    ready: cleanNumber(match?.[2])
  };
}

function sumFormatted(values) {
  const total = values.reduce((sum, value) => sum + parseInteger(value), 0);
  return formatInteger(total);
}

function parseMetrics(slug, html) {
  const text = plainText(html);
  const aircraft = aircraftTotal(text);
  const land = {
    tanks: metricItem(html, "tanksJS"),
    armoredVehicles: metricItem(html, "afvJS"),
    selfPropelledArtillery: metricItem(html, "spgJS"),
    towedArtillery: metricItem(html, "artilleryJS"),
    rocketProjectors: metricItem(html, "mlrsJS")
  };
  const naval = {
    aircraftCarriers: metricItem(html, "accarrierJS"),
    helicopterCarriers: metricItem(html, "helocarrierJS"),
    destroyers: metricItem(html, "destroyerJS"),
    frigates: metricItem(html, "frigateJS"),
    corvettes: metricItem(html, "corvetteJS"),
    submarines: metricItem(html, "subJS"),
    patrolVessels: metricItem(html, "patrolJS"),
    mineWarfare: metricItem(html, "mineJS")
  };

  return compact({
    source: gfpUrl(slug),
    updated: "2026",
    personnel: {
      total: cardValue(html, "Tot Mil. Personnel (est.)"),
      active: cardValue(html, "Active Personnel"),
      reserve: cardValue(html, "Reserve Personnel"),
      paramilitary: cardValue(html, "Paramilitary"),
      airForce: cardValue(html, "Air Force Personnel*"),
      army: cardValue(html, "Army Personnel*"),
      navy: cardValue(html, "Navy Personnel*")
    },
    air: {
      total: aircraft.stock,
      ready: aircraft.ready,
      fighters: metricItem(html, "fighterJS"),
      attack: metricItem(html, "attackJS"),
      transports: metricItem(html, "transportJS"),
      trainers: metricItem(html, "trainerJS"),
      specialMission: metricItem(html, "specialJS"),
      tankers: metricItem(html, "tankerJS"),
      helicopters: metricItem(html, "helicopterJS"),
      attackHelicopters: metricItem(html, "attackheloJS")
    },
    land: {
      ...land,
      total: sumFormatted(Object.values(land))
    },
    naval: {
      ...naval,
      total: sumFormatted(Object.values(naval))
    }
  });
}

async function main() {
  const slugs = await collectGfpSlugs();
  const countries = {};
  const errors = {};

  for (const [index, slug] of slugs.entries()) {
    try {
      countries[slug] = parseMetrics(slug, await fetchHtml(slug));
      console.log(`[${String(index + 1).padStart(3, "0")}/${slugs.length}] ${slug}`);
    } catch (error) {
      errors[slug] = error instanceof Error ? error.message : String(error);
      console.log(`[${String(index + 1).padStart(3, "0")}/${slugs.length}] ${slug} ERROR ${errors[slug]}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const payload = {
    build: "gfp-2026-static-metrics",
    generated: "2026-04-27",
    countries,
    errors
  };
  await fs.writeFile(
    outputFile,
    `(function () {\n  window.ODA_GFP_METRICS = ${JSON.stringify(payload, null, 2)};\n})();\n`,
    "utf8"
  );
  console.log(`Wrote ${Object.keys(countries).length} metrics to ${outputFile}`);
  if (Object.keys(errors).length) console.log(`${Object.keys(errors).length} fetch errors recorded in output.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "api" / "research"
sys.path.insert(0, str(ROOT))

from server import research_country


def frontend_countries() -> list[dict[str, str]]:
    script = r"""
const fs = require("fs");
const vm = require("vm");
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const file of [
  "src/data.js",
  "src/gfpMetrics.js",
  "src/profileMetrics.js",
  "src/osintSites.js",
  "src/generatedProfiles.js",
  "src/europeProfiles.js",
  "src/americasProfiles.js",
  "src/asiaProfiles.js",
  "src/africaProfiles.js",
  "src/oceaniaProfiles.js",
  "src/countryProfiles.js"
]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
}
process.stdout.write(JSON.stringify(sandbox.window.ODA_DATA.countries.map((country) => ({
  id: country.id,
  name: country.name
}))));
"""
    output = subprocess.check_output(["node", "-e", script], cwd=ROOT, text=True, encoding="utf-8")
    countries = json.loads(output)
    valid = (
        isinstance(countries, list)
        and all(isinstance(item, dict) for item in countries)
        and all(isinstance(item.get("id"), str) and isinstance(item.get("name"), str) for item in countries)
    )
    if not valid:
        raise RuntimeError("Frontend country list could not be exported.")
    return countries


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    exported = []

    for country in frontend_countries():
        country_id = country["id"]
        payload = research_country(country_id, display_name=country["name"])
        payload["mode"] = "static-research-export"
        target = OUT_DIR / f"{country_id}.json"
        target.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        exported.append(country_id)

    manifest = {
        "build": exported and json.loads((OUT_DIR / f"{exported[0]}.json").read_text(encoding="utf-8"))["build"],
        "count": len(exported),
        "countries": exported,
    }
    (OUT_DIR / "index.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Exported {len(exported)} static research files to {OUT_DIR}")


if __name__ == "__main__":
    main()

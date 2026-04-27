from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "api" / "research"
sys.path.insert(0, str(ROOT))

from server import research_country


def frontend_country_ids() -> list[str]:
    script = r"""
const fs = require("fs");
const vm = require("vm");
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const file of ["src/data.js", "src/countryProfiles.js", "src/europeProfiles.js", "src/americasProfiles.js"]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
}
process.stdout.write(JSON.stringify(sandbox.window.ODA_DATA.countries.map((country) => country.id)));
"""
    output = subprocess.check_output(["node", "-e", script], cwd=ROOT, text=True)
    country_ids = json.loads(output)
    if not isinstance(country_ids, list) or not all(isinstance(item, str) for item in country_ids):
        raise RuntimeError("Frontend country list could not be exported.")
    return country_ids


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    exported = []

    for country_id in frontend_country_ids():
        payload = research_country(country_id)
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

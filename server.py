from __future__ import annotations

import datetime as dt
import html
import json
import mimetypes
import os
import re
import ssl
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.error import URLError
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
USER_AGENT = "OpenDefenseAtlas/0.7 generated-source-synthesis"
SERVER_BUILD = "v0.8.0-ui-source-synthesis-20260501"
FETCH_TIMEOUT_SECONDS = 5
FETCH_READ_LIMIT = 1_000_000


GFP_ID_OVERRIDES = {
    "bosnia-herzegovina": "bosnia-and-herzegovina",
    "north-macedonia": "macedonia",
    "trinidad-tobago": "trinidad-and-tobago",
    "turkiye": "Turkey",
    "united-arab-emirates": "united-arab-emirates",
    "united-states": "united-states-of-america",
    "united-kingdom": "united-kingdom",
}

NO_GFP_COUNTRIES = {
    "antigua-barbuda",
    "andorra",
    "bahamas",
    "barbados",
    "belize",
    "bhutan",
    "cabo-verde",
    "comoros",
    "costa-rica",
    "cyprus",
    "dominica",
    "federated-states-of-micronesia",
    "grenada",
    "guyana",
    "haiti",
    "liechtenstein",
    "maldives",
    "marshall-islands",
    "malta",
    "mauritius",
    "monaco",
    "nauru",
    "panama",
    "palau",
    "palestine",
    "saint-kitts-nevis",
    "saint-lucia",
    "saint-vincent-grenadines",
    "san-marino",
    "sao-tome-principe",
    "seychelles",
    "samoa",
    "timor-leste",
    "tuvalu",
    "vanuatu",
    "vatican-city",
}

NATO_COUNTRIES = {
    "albania",
    "belgium",
    "bulgaria",
    "canada",
    "croatia",
    "czechia",
    "denmark",
    "estonia",
    "finland",
    "france",
    "germany",
    "greece",
    "hungary",
    "iceland",
    "italy",
    "latvia",
    "lithuania",
    "luxembourg",
    "montenegro",
    "netherlands",
    "north-macedonia",
    "norway",
    "poland",
    "portugal",
    "romania",
    "slovakia",
    "slovenia",
    "spain",
    "sweden",
    "turkiye",
    "united-kingdom",
    "united-states",
}

EDA_COUNTRIES = {
    "austria",
    "belgium",
    "bulgaria",
    "croatia",
    "cyprus",
    "czechia",
    "denmark",
    "estonia",
    "finland",
    "france",
    "germany",
    "greece",
    "hungary",
    "ireland",
    "italy",
    "latvia",
    "lithuania",
    "luxembourg",
    "malta",
    "netherlands",
    "poland",
    "portugal",
    "romania",
    "slovakia",
    "slovenia",
    "spain",
    "sweden",
}

COVERAGE_LABELS = {
    "force-totals": "kuvvet toplamları",
    "security-structure": "güvenlik yapısı",
    "air-fleet": "hava filosu",
    "orders": "sipariş ve modernizasyon",
    "arms-transfers": "silah transferleri",
    "procurement": "tedarik",
    "official-reporting": "devlet raporlaması",
    "military-expenditure": "askeri harcama",
    "budget-trend": "bütçe trendi",
    "alliance-spending": "ittifak harcaması",
    "defence-investment": "savunma yatırımı",
    "conflict-context": "çatışma bağlamı",
    "conflict-events": "olay verisi",
    "peacekeeping": "barışı koruma katkısı",
}

STATE_SCORE = {
    "verified": 1.0,
    "review": 0.72,
    "candidate": 0.48,
    "pending": 0.24,
    "loading": 0.18,
    "error": 0.12,
}


def country_title(country_id: str, display_name: str | None = None) -> str:
    if display_name:
        return display_name
    special = {
        "bosnia-herzegovina": "Bosnia and Herzegovina",
        "czechia": "Czechia",
        "north-macedonia": "North Macedonia",
        "turkiye": "Türkiye",
        "united-kingdom": "United Kingdom",
        "vatican-city": "Vatican City",
    }
    return special.get(country_id, country_id.replace("-", " ").title())


def source_config(
    country_id: str,
    key: str,
    title: str,
    publisher: str,
    url: str,
    summary: str,
    coverage: list[str],
    weight: float,
    state: str = "review",
    access: str = "open",
    scope: str = "global",
    limitations: str | None = None,
) -> dict[str, Any]:
    config = {
        "id": f"{country_id}-{key}",
        "title": title,
        "publisher": publisher,
        "category": "reference",
        "url": url,
        "source_type": "static_reference",
        "state": state,
        "summary": summary,
        "coverage": coverage,
        "weight": weight,
        "access": access,
        "scope": scope,
    }
    if limitations:
        config["limitations"] = limitations
    return config


def build_generic_country_configs(country_id: str, display_name: str | None = None) -> list[dict[str, Any]]:
    name = country_title(country_id, display_name)
    gfp_id = GFP_ID_OVERRIDES.get(country_id, country_id)
    has_gfp_profile = country_id not in NO_GFP_COUNTRIES
    primary_url = (
        f"https://www.globalfirepower.com/country-military-strength-detail.php?country_id={gfp_id}"
        if has_gfp_profile
        else "https://www.unroca.org/en/reporting/"
    )
    primary_publisher = "Global Firepower" if has_gfp_profile else "UNROCA / open-source references"
    primary_title = f"2026 {name} Military Strength" if has_gfp_profile else f"{name} reporting and defense reference"

    configs = [
        source_config(
            country_id,
            "primary-defense-profile",
            primary_title,
            primary_publisher,
            primary_url,
            "Ülke ölçeğinde personel, kara, hava ve deniz kategori toplamları veya sınırlı güvenlik profili için standart kaynak.",
            ["force-totals", "security-structure"],
            0.58 if has_gfp_profile else 0.44,
            limitations="Kategori toplamları model, görev durumu veya gerçek zamanlı hazırlık seviyesi vermez.",
        ),
        source_config(
            country_id,
            "flightglobal-waf-2026",
            "World Air Forces 2026 Directory",
            "FlightGlobal / Cirium",
            "https://www.flightglobal.com/defence/2026-world-air-forces-directory/165267.article",
            "Hava aracı tip/adet kırılımı, sipariş ve modernizasyon takibi için ortak kaynak.",
            ["air-fleet", "orders"],
            0.74,
            limitations="Hava platformları mühimmat konfigürasyonu veya operasyonel hazırlık anlamına gelmez.",
        ),
        source_config(
            country_id,
            "sipri-arms-transfers",
            "SIPRI Arms Transfers Database",
            "SIPRI",
            "https://www.sipri.org/databases/armstransfers",
            "Transfer ve tedarik çapraz kontrolü için kaynak.",
            ["arms-transfers", "procurement"],
            0.78,
            limitations="SIPRI transfer hacmi ve teslimat kaydıdır; stok, kullanım durumu veya mühimmat miktarı değildir.",
        ),
        source_config(
            country_id,
            "sipri-milex",
            "SIPRI Military Expenditure Database",
            "SIPRI",
            "https://www.sipri.org/databases/milex",
            "Askeri harcama, GSYH payı ve uzun dönem bütçe trendi için açık kaynak zaman serisi.",
            ["military-expenditure", "budget-trend"],
            0.76,
            limitations="Harcama verisi kapasite çıktısını doğrudan ölçmez; tanımlar ve şeffaflık ülkeye göre değişir.",
        ),
        source_config(
            country_id,
            "world-bank-milex",
            "World Bank WDI Military Expenditure",
            "World Bank / SIPRI",
            "https://data.worldbank.org/indicator/MS.MIL.XPND.CD",
            "SIPRI tabanlı askeri harcama göstergelerini World Development Indicators üzerinden doğrulamak için kullanılır.",
            ["military-expenditure", "budget-trend"],
            0.7,
            limitations="World Bank göstergeleri SIPRI metodolojisine dayanır; envanter veya platform seviyesi vermez.",
        ),
        source_config(
            country_id,
            "ucdp-conflict-data",
            "UCDP Conflict Data",
            "Uppsala Conflict Data Program",
            "https://ucdp.uu.se/downloads/",
            "Ülke risk ve çatışma bağlamını, envanterden ayrı bir bağlam katmanı olarak besler.",
            ["conflict-context"],
            0.66,
            limitations="Çatışma verisi askeri envanter doğrulaması değildir; bağlam ve risk katmanı olarak değerlendirilir.",
        ),
        source_config(
            country_id,
            "un-peacekeeping-contributors",
            "UN Peacekeeping Troop and Police Contributors",
            "United Nations Peacekeeping",
            "https://peacekeeping.un.org/en/troop-and-police-contributors",
            "Barışı koruma görevlerine asker ve polis katkısını dış görev/katılım bağlamı olarak izler.",
            ["peacekeeping"],
            0.62,
            limitations="Barışı koruma katkıları ülkenin toplam kapasitesini veya muharip hazırlığını göstermez.",
        ),
        source_config(
            country_id,
            "acled-conflict-events",
            "ACLED Conflict Data API",
            "ACLED",
            "https://acleddata.com/conflict-data",
            "API anahtarı eklendiğinde yakın dönem siyasi şiddet ve protesto olaylarını bağlam katmanına eklemek için aday kaynak.",
            ["conflict-events", "conflict-context"],
            0.52,
            state="candidate",
            access="registration",
            limitations="ACLED erişimi kayıt/API anahtarı gerektirir; envanter kaynağı olarak değil olay bağlamı olarak kullanılmalıdır.",
        ),
    ]

    if has_gfp_profile:
        configs.append(
            source_config(
                country_id,
                "unroca",
                "UN Register of Conventional Arms",
                "UNROCA",
                "https://www.unroca.org/en/reporting/",
                "Devlet raporları üzerinden konvansiyonel silah transfer doğrulaması için kullanılır.",
                ["official-reporting", "arms-transfers"],
                0.76,
                limitations="UNROCA devlet raporlamasına bağlıdır; eksik raporlama veya boş yıl kapasite yokluğu anlamına gelmez.",
            )
        )

    if country_id in NATO_COUNTRIES:
        configs.append(
            source_config(
                country_id,
                "nato-defence-expenditure",
                "NATO Defence Expenditures",
                "NATO",
                "https://www.nato.int/en/what-we-do/introduction-to-nato/defence-expenditures-and-natos-5-commitment",
                "NATO üyeleri için ortak savunma harcaması tanımı ve müttefik raporlamasını çapraz kontrol eder.",
                ["alliance-spending", "military-expenditure"],
                0.74,
                scope="regional",
                limitations="Sadece NATO müttefiklerine uygulanır ve harcama girdisi kapasite çıktısını doğrudan ölçmez.",
            )
        )

    if country_id in EDA_COUNTRIES:
        configs.append(
            source_config(
                country_id,
                "eda-defence-data",
                "EDA Defence Data",
                "European Defence Agency",
                "https://www.eda.europa.eu/publications-and-data/defence-data",
                "EDA ülkeleri için savunma harcaması, yatırım ve iş birliği göstergelerini tamamlayıcı kaynak olarak kullanır.",
                ["defence-investment", "military-expenditure"],
                0.7,
                scope="regional",
                limitations="EDA verisi Avrupa katılımcı ülkeleriyle sınırlıdır; platform envanteri sağlamaz.",
            )
        )

    return configs


def today() -> str:
    return dt.date.today().isoformat()


def fetch_url(url: str) -> tuple[bytes | None, bool, str | None]:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(request, timeout=FETCH_TIMEOUT_SECONDS, context=ssl.create_default_context()) as response:
            return response.read(FETCH_READ_LIMIT), True, None
    except Exception as first_error:
        if not isinstance(first_error, ssl.SSLError):
            return None, False, str(first_error)
        try:
            with urlopen(request, timeout=FETCH_TIMEOUT_SECONDS, context=ssl._create_unverified_context()) as response:
                return response.read(FETCH_READ_LIMIT), False, str(first_error)
        except Exception as second_error:
            return None, False, str(second_error)


def clean_html(raw: bytes) -> str:
    text = raw.decode("utf-8", "ignore")
    text = re.sub(r"<script.*?</script>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<style.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def max_range_km(label: str) -> int | None:
    numbers = [int(number) for number in re.findall(r"\d+", label)]
    return max(numbers) if numbers else None


def extract_html_finding(config: dict[str, Any], text: str) -> dict[str, Any] | None:
    values: list[str] = []
    for pattern in config.get("patterns", []):
        matches = re.findall(pattern, text, flags=re.I)
        if not matches:
            continue
        for match in matches:
            value = match[0] if isinstance(match, tuple) else match
            value = re.sub(r"\s+", " ", value).strip()
            if value and value not in values:
                values.append(value)
        if values and not config.get("collect_all"):
            break

    if not values:
        return None

    range_label = " / ".join(values)
    return {
        "id": config["id"],
        "title": config["title"],
        "publisher": config["publisher"],
        "category": config["category"],
        "url": config["url"],
        "date": today(),
        "state": config.get("state", "review"),
        "rangeLabel": range_label,
        "rangeKm": max_range_km(range_label),
        "summary": f"{config.get('summary_prefix', 'Kaynakta menzil')} {range_label} olarak bulundu.",
    }


def build_static_finding(config: dict[str, Any], reachable: bool) -> dict[str, Any]:
    state = config.get("state", "review") if reachable else "pending"
    summary = config.get("summary", "Kaynak kaydı incelenmek üzere eklendi.")
    if not reachable:
        summary = f"Kaynağa şu anda erişilemedi; son bilinen kayıt: {summary}"
    finding = {
        "id": config["id"],
        "title": config["title"],
        "publisher": config["publisher"],
        "category": config["category"],
        "url": config["url"],
        "date": today(),
        "state": state,
        "rangeLabel": config.get("range_label"),
        "rangeKm": config.get("range_km"),
        "summary": summary,
    }
    for key in ("coverage", "weight", "access", "scope", "limitations"):
        if key in config:
            finding[key] = config[key]
    return finding


def source_coverage_labels(coverage: list[str]) -> list[str]:
    return [COVERAGE_LABELS.get(item, item.replace("-", " ")) for item in coverage]


def build_source_synthesis(country_id: str, findings: list[dict[str, Any]], warnings: list[str]) -> dict[str, Any]:
    evidence = [finding for finding in findings if finding.get("category") != "synthesis"]
    weighted = 0.0
    total_weight = 0.0
    coverage: set[str] = set()
    limitations: list[str] = []
    open_count = 0
    registration_count = 0
    regional_count = 0

    for finding in evidence:
        weight = float(finding.get("weight") or 0.5)
        total_weight += weight
        weighted += weight * STATE_SCORE.get(str(finding.get("state", "review")), 0.55)
        coverage.update(item for item in finding.get("coverage", []) if isinstance(item, str))
        limitation = finding.get("limitations")
        if limitation and limitation not in limitations:
            limitations.append(str(limitation))
        access = finding.get("access", "open")
        if access == "open":
            open_count += 1
        elif access == "registration":
            registration_count += 1
        if finding.get("scope") == "regional":
            regional_count += 1

    base_score = (weighted / total_weight) if total_weight else 0.0
    coverage_bonus = min(0.08, max(0, len(coverage) - 4) * 0.01)
    warning_penalty = min(0.08, len(warnings) * 0.02)
    confidence_score = max(0.0, min(0.9, base_score + coverage_bonus - warning_penalty))
    confidence = "yüksek" if confidence_score >= 0.74 else "orta" if confidence_score >= 0.56 else "düşük"
    sorted_coverage = sorted(coverage)

    return {
        "sourceCount": len(evidence),
        "openSourceCount": open_count,
        "registrationSourceCount": registration_count,
        "regionalSourceCount": regional_count,
        "coverageAreas": sorted_coverage,
        "coverageLabels": source_coverage_labels(sorted_coverage),
        "confidence": confidence,
        "confidenceScore": round(confidence_score, 2),
        "method": (
            "Kaynaklar kuvvet toplamı, hava filosu, transfer/tedarik, harcama, resmi raporlama "
            "ve çatışma bağlamı olarak ayrılır; resmi veya metodolojisi açık kaynaklar daha yüksek ağırlık alır."
        ),
        "limitations": limitations[:6],
    }


def build_synthesis_finding(
    country_id: str, synthesis: dict[str, Any], display_name: str | None = None
) -> dict[str, Any]:
    labels = synthesis.get("coverageLabels", [])
    visible_labels = ", ".join(labels[:5])
    if len(labels) > 5:
        visible_labels += f" +{len(labels) - 5}"
    confidence_score = synthesis.get("confidenceScore", 0)
    state = "verified" if confidence_score >= 0.74 else "review"
    return {
        "id": f"{country_id}-source-synthesis",
        "title": f"{country_title(country_id, display_name)} kaynak sentezi",
        "publisher": "Open Defense Atlas",
        "category": "synthesis",
        "date": today(),
        "state": state,
        "summary": (
            f"{synthesis['sourceCount']} kaynak/adaptör sentezlendi. Kapsam: {visible_labels}. "
            f"Güven: {synthesis['confidence']} ({confidence_score})."
        ),
        "coverage": synthesis.get("coverageAreas", []),
        "weight": 1.0,
        "access": "derived",
        "scope": "global",
        "limitations": "Bu kart kaynak güvenini özetler; ham envanter veya operasyonel konum verisi değildir.",
    }


def research_country(country_id: str, display_name: str | None = None) -> dict[str, Any]:
    configs = build_generic_country_configs(country_id, display_name)
    if not configs:
        return {
            "countryId": country_id,
            "generatedAt": dt.datetime.utcnow().isoformat(timespec="seconds") + "Z",
            "findings": [],
            "warnings": [f"{country_id} için kaynak adaptörü tanımlı değil."],
        }

    findings: list[dict[str, Any]] = []
    warnings: list[str] = []
    sources: list[dict[str, Any]] = []
    fetch_cache: dict[str, tuple[bytes | None, bool, str | None]] = {}

    for config in configs:
        url = config["url"]
        source_type = config["source_type"]
        should_fetch = source_type == "html" and bool(config.get("patterns"))
        if not should_fetch:
            raw, tls_verified, error = None, True, None
        elif url not in fetch_cache:
            fetch_cache[url] = fetch_url(url)
            raw, tls_verified, error = fetch_cache[url]
        else:
            raw, tls_verified, error = fetch_cache[url]
        reachable = True if not should_fetch else raw is not None
        sources.append(
            {
                "id": config["id"],
                "url": url,
                "reachable": reachable,
                "tlsVerified": tls_verified,
                "error": error,
            }
        )
        if reachable and not tls_verified:
            warnings.append(f"{config['title']} yerel sertifika deposu nedeniyle TLS doğrulamasız çekildi.")

        finding: dict[str, Any] | None = None
        if reachable and source_type == "html" and raw:
            finding = extract_html_finding(config, clean_html(raw))
        elif source_type in {"pdf", "reference", "static_reference"} or not should_fetch:
            finding = build_static_finding(config, reachable)

        if finding:
            findings.append(finding)
        elif reachable:
            findings.append(
                {
                    "id": config["id"],
                    "title": config["title"],
                    "publisher": config["publisher"],
                    "category": config["category"],
                    "url": config["url"],
                    "date": today(),
                    "state": "review",
                    "summary": "Kaynak erişilebilir, fakat bu prototipte otomatik alan çıkarımı yapılamadı.",
                }
            )
        else:
            findings.append(build_static_finding(config, False))

    synthesis = build_source_synthesis(country_id, findings, warnings)
    findings.insert(0, build_synthesis_finding(country_id, synthesis, display_name))

    return {
        "countryId": country_id,
        "generatedAt": dt.datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "build": SERVER_BUILD,
        "mode": "source-adapter-alpha",
        "synthesis": synthesis,
        "findings": findings,
        "sources": sources,
        "warnings": warnings,
    }


class AtlasHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: Any) -> None:
        try:
            super().log_message(format, *args)
        except OSError:
            pass

    def translate_path(self, path: str) -> str:
        parsed = urlparse(path)
        safe_path = parsed.path.lstrip("/") or "index.html"
        requested = (ROOT / safe_path).resolve()
        if requested != ROOT and ROOT not in requested.parents:
            return str(ROOT / "index.html")
        return str(requested)

    def end_headers(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path in {"", "/", "/index.html"} or parsed.path.endswith((".js", ".css", ".html")):
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Atlas-Build", SERVER_BUILD)
        super().end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/research/"):
            country_id = parsed.path.rsplit("/", 1)[-1]
            if country_id.endswith(".json"):
                country_id = country_id[:-5]
            query = parse_qs(parsed.query)
            display_name = query.get("name", [None])[0]
            payload = research_country(country_id, display_name=display_name)
            body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Atlas-Build", SERVER_BUILD)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        return super().do_GET()

def main() -> None:
    mimetypes.add_type("application/javascript", ".js")
    port = int(os.environ.get("ODA_PORT", "5173"))
    server = ThreadingHTTPServer(("127.0.0.1", port), AtlasHandler)
    print(f"Open Defense Atlas running at http://127.0.0.1:{port}/")
    server.serve_forever()


if __name__ == "__main__":
    main()

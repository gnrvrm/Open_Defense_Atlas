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
from urllib.parse import urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
USER_AGENT = "OpenDefenseAtlas/0.1 local-research-prototype"
SERVER_BUILD = "v0.2.3-static-research-20260426"
FETCH_TIMEOUT_SECONDS = 5
FETCH_READ_LIMIT = 1_000_000


SOURCE_CONFIGS: dict[str, list[dict[str, Any]]] = {
    "turkiye": [
        {
            "id": "roketsan-tayfun",
            "title": "TAYFUN füzesi",
            "publisher": "Roketsan ürün kataloğu",
            "category": "attack",
            "url": "https://www.roketsan.com.tr/uploads/docs/kataloglar/ENG/2024/1726596010_tayfun.pdf",
            "source_type": "pdf",
            "range_label": ">280 km",
            "range_km": 280,
            "state": "verified",
            "summary": "Resmi ürün kataloğunda menzil >280 km olarak yayımlanıyor.",
        },
        {
            "id": "roketsan-khan",
            "title": "KHAN / BORA füzesi",
            "publisher": "Roketsan ürün sayfası",
            "category": "attack",
            "url": "https://www.roketsan.com.tr/en/products/khan-missile",
            "source_type": "html",
            "patterns": [r"Range\s+([0-9]+\s*[-–]\s*[0-9]+\s*km)"],
            "state": "verified",
            "summary_prefix": "Resmi ürün sayfasında menzil",
        },
        {
            "id": "roketsan-trg-300",
            "title": "TRG-300 güdümlü füze",
            "publisher": "Roketsan ürün sayfası",
            "category": "attack",
            "url": "https://www.roketsan.com.tr/en/products/trg-300-guided-missile",
            "source_type": "html",
            "patterns": [
                r"ranges\s+(20\s*[-–]\s*120\s*km)",
                r"Range\s+(30\s*[-–]\s*120\s*km)",
            ],
            "state": "verified",
            "summary_prefix": "Resmi ürün sayfasında menzil",
        },
        {
            "id": "roketsan-som-j",
            "title": "SOM-J seyir füzesi",
            "publisher": "Roketsan ürün kataloğu",
            "category": "attack",
            "url": "https://www.roketsan.com.tr/uploads/docs/kataloglar/ENG/2024/1726595985_som-j.pdf",
            "source_type": "pdf",
            "range_label": "200 km",
            "range_km": 200,
            "state": "verified",
            "summary": "Resmi ürün kataloğunda menzil 200 km olarak yayımlanıyor.",
        },
        {
            "id": "roketsan-atmaca",
            "title": "ATMACA gemisavar füzesi",
            "publisher": "Roketsan ürün sayfası",
            "category": "naval",
            "url": "https://www.roketsan.com.tr/en/products/atmaca-anti-ship-missile",
            "source_type": "html",
            "patterns": [r"Range\s+(250\s*km)"],
            "state": "verified",
            "summary_prefix": "Resmi ürün sayfasında menzil",
        },
        {
            "id": "roketsan-hisar",
            "title": "HİSAR hava savunma füzeleri",
            "publisher": "Roketsan ürün sayfası",
            "category": "defense",
            "url": "https://www.roketsan.com.tr/en/products/hisar-air-defence-missiles",
            "source_type": "html",
            "patterns": [r"Interception Range\s+([0-9]+\+\s*km)"],
            "state": "verified",
            "summary_prefix": "Resmi ürün sayfasında önleme menzili",
            "collect_all": True,
        },
        {
            "id": "roketsan-siper",
            "title": "SİPER hava ve füze savunma sistemi",
            "publisher": "Roketsan ürün kataloğu",
            "category": "defense",
            "url": "https://www.roketsan.com.tr/uploads/docs/kataloglar/ENG/2024/1726595985_siper.pdf",
            "source_type": "pdf",
            "range_label": "100+ / 150 km",
            "range_km": 150,
            "state": "verified",
            "summary": "Resmi ürün kataloğunda SİPER Block-1 için 100+ km, Block-2 için 150 km menzil yayımlanıyor.",
        },
        {
            "id": "roketsan-sungur",
            "title": "SUNGUR hava savunma sistemi",
            "publisher": "Roketsan ürün sayfası",
            "category": "defense",
            "url": "https://www.roketsan.com.tr/en/products/sungur-air-defence-missile-system",
            "source_type": "reference",
            "state": "review",
            "summary": "Kısa menzilli hava savunma ürün kaydı; bu prototipte sayısal menzil alanı envantere manuel doğrulama ile işlenir.",
        },
        {
            "id": "sipri-arms-transfers",
            "title": "SIPRI Arms Transfers Database",
            "publisher": "SIPRI",
            "category": "reference",
            "url": "https://www.sipri.org/databases/armstransfers",
            "source_type": "reference",
            "state": "review",
            "summary": "Ülke bazlı transfer kayıtları için kaynak; doğrudan ürün envanteri değil, transfer doğrulaması için kullanılır.",
        },
        {
            "id": "globalfirepower-2026",
            "title": "2026 Turkiye Military Strength",
            "publisher": "Global Firepower",
            "category": "reference",
            "url": "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=Turkey",
            "source_type": "reference",
            "state": "review",
            "summary": "Personel, kara, hava ve deniz kategori toplamları için kaynak; model-model platform doğrulaması değildir.",
        },
        {
            "id": "flightglobal-waf-2025",
            "title": "World Air Forces 2025 Directory",
            "publisher": "FlightGlobal / Cirium",
            "category": "reference",
            "url": "https://www.flightglobal.com/download?ac=106507",
            "source_type": "reference",
            "state": "review",
            "summary": "Hava aracı tip/adet kırılımı için kullanılan kaynak.",
        },
        {
            "id": "unroca",
            "title": "UN Register of Conventional Arms",
            "publisher": "UNROCA",
            "category": "reference",
            "url": "https://www.unroca.org/en/reporting/",
            "source_type": "reference",
            "state": "review",
            "summary": "Devlet raporları üzerinden konvansiyonel silah transfer doğrulaması için kullanılır.",
        },
    ],
    "poland": [
        {
            "id": "pl-himars",
            "title": "HIMARS / Homar-A",
            "publisher": "Lockheed Martin",
            "category": "attack",
            "url": "https://news.lockheedmartin.com/2023-05-15-Poland-Receives-Delivery-of-First-HIMARS",
            "source_type": "pdf",
            "range_label": "300 km sınıfı",
            "range_km": 300,
            "state": "verified",
            "summary": "Polonya HIMARS teslimat ve tedarik kaydı; 300 km sınıfı derin ateş kabiliyeti olarak envantere bağlandı.",
        },
        {
            "id": "pl-narew",
            "title": "Narew / CAMM hava savunması",
            "publisher": "MBDA",
            "category": "defense",
            "url": "https://www.mbda-systems.com/mbda-and-poland-sign-landmark-narew-project/",
            "source_type": "pdf",
            "range_label": "25+ km sınıfı",
            "range_km": 25,
            "state": "verified",
            "summary": "Narew programı Polonya kısa/orta menzilli hava savunma katmanı için üretici kaynak kaydıdır.",
        },
        {
            "id": "pl-ibcs",
            "title": "Wisła / Patriot IBCS",
            "publisher": "US Army",
            "category": "sensor",
            "url": "https://www.army.mil/article/285095/poland_becomes_first_ally_fully_operational_with_ibcs",
            "source_type": "reference",
            "state": "verified",
            "summary": "Polonya'nın IBCS ile entegre hava savunma ağına ilişkin resmi müttefik kaynak kaydı.",
        },
        {
            "id": "pl-nsm",
            "title": "NSM kıyı savunma sistemi",
            "publisher": "Kongsberg",
            "category": "naval",
            "url": "https://www.kongsberg.com/kda/news/news-archive/2023/kongsberg-signs-naval-strike-missile-coastal-defence-system-contract-with-poland-worth-approximately-nok-16-billion",
            "source_type": "pdf",
            "range_label": "100+ nm / 185+ km sınıfı",
            "range_km": 185,
            "state": "verified",
            "summary": "Polonya kıyı savunma sistemi için NSM üretici/sözleşme kaynak kaydı.",
        },
        {
            "id": "pl-globalfirepower-2026",
            "title": "2026 Poland Military Strength",
            "publisher": "Global Firepower",
            "category": "reference",
            "url": "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=poland",
            "source_type": "reference",
            "state": "review",
            "summary": "Personel, kara, hava ve deniz kategori toplamları için kaynak; model-model platform doğrulaması değildir.",
        },
        {
            "id": "pl-flightglobal-waf-2025",
            "title": "World Air Forces 2025 Directory",
            "publisher": "FlightGlobal / Cirium",
            "category": "reference",
            "url": "https://www.flightglobal.com/defence/2025-world-air-forces-directory/160846.article",
            "source_type": "reference",
            "state": "review",
            "summary": "Polonya hava aracı tip/adet kırılımı için kullanılan kaynak.",
        },
        {
            "id": "pl-sipri-arms-transfers",
            "title": "SIPRI Arms Transfers Database",
            "publisher": "SIPRI",
            "category": "reference",
            "url": "https://www.sipri.org/databases/armstransfers",
            "source_type": "reference",
            "state": "review",
            "summary": "Ülke bazlı transfer kayıtları ve tedarik çapraz kontrolü için kullanılır.",
        },
        {
            "id": "pl-unroca",
            "title": "UN Register of Conventional Arms",
            "publisher": "UNROCA",
            "category": "reference",
            "url": "https://www.unroca.org/en/reporting/",
            "source_type": "reference",
            "state": "review",
            "summary": "Devlet raporları üzerinden konvansiyonel silah transfer doğrulaması için kullanılır.",
        },
    ],
    "greece": [
        {
            "id": "gr-mbda-contracts",
            "title": "Greece missile contracts with MBDA",
            "publisher": "MBDA",
            "category": "reference",
            "url": "https://newsroom.mbda-systems.com/?p=6237",
            "source_type": "reference",
            "state": "verified",
            "summary": "Rafale ve FDI modernizasyonuyla ilişkili MBDA füze sözleşmeleri için üretici kaynak kaydı.",
        },
        {
            "id": "gr-scalp-eg",
            "title": "SCALP EG",
            "publisher": "MBDA",
            "category": "attack",
            "url": "https://newsroom.mbda-systems.com/?p=6237",
            "source_type": "reference",
            "state": "review",
            "summary": "Havadan atılan stand-off mühimmat kaydı; platform bağımlı olduğu için sabit harita dairesi oluşturulmaz.",
        },
        {
            "id": "gr-exocet",
            "title": "Exocet MM40 Block 3C",
            "publisher": "MBDA",
            "category": "naval",
            "url": "https://newsroom.mbda-systems.com/?p=6237",
            "source_type": "pdf",
            "range_label": "250 km sınıfı",
            "range_km": 250,
            "state": "verified",
            "summary": "Yunanistan deniz modernizasyon paketinde yer alan Exocet ailesi için üretici kaynak kaydı.",
        },
        {
            "id": "gr-s300",
            "title": "S-300PMU-1",
            "publisher": "Açık kaynak sistem referansları",
            "category": "defense",
            "url": "https://www.sipri.org/databases/armstransfers",
            "source_type": "pdf",
            "range_label": "150 km sınıfı",
            "range_km": 150,
            "state": "review",
            "summary": "Uzun menzilli hava savunma sistemi kaydı; hassas konuşlanma bilgisi gösterilmez.",
        },
        {
            "id": "gr-globalfirepower-2026",
            "title": "2026 Greece Military Strength",
            "publisher": "Global Firepower",
            "category": "reference",
            "url": "https://www.globalfirepower.com/country-military-strength-detail.php?country_id=greece",
            "source_type": "reference",
            "state": "review",
            "summary": "Personel, kara, hava ve deniz kategori toplamları için kaynak; model-model platform doğrulaması değildir.",
        },
        {
            "id": "gr-flightglobal-waf-2025",
            "title": "World Air Forces 2025 Directory",
            "publisher": "FlightGlobal / Cirium",
            "category": "reference",
            "url": "https://www.flightglobal.com/defence/2025-world-air-forces-directory/160846.article",
            "source_type": "reference",
            "state": "review",
            "summary": "Yunanistan hava aracı tip/adet kırılımı için kullanılan kaynak.",
        },
        {
            "id": "gr-sipri-arms-transfers",
            "title": "SIPRI Arms Transfers Database",
            "publisher": "SIPRI",
            "category": "reference",
            "url": "https://www.sipri.org/databases/armstransfers",
            "source_type": "reference",
            "state": "review",
            "summary": "Ülke bazlı transfer kayıtları ve tedarik çapraz kontrolü için kullanılır.",
        },
        {
            "id": "gr-unroca",
            "title": "UN Register of Conventional Arms",
            "publisher": "UNROCA",
            "category": "reference",
            "url": "https://www.unroca.org/en/reporting/",
            "source_type": "reference",
            "state": "review",
            "summary": "Devlet raporları üzerinden konvansiyonel silah transfer doğrulaması için kullanılır.",
        },
    ],
}

GFP_ID_OVERRIDES = {
    "bosnia-herzegovina": "bosnia-and-herzegovina",
    "north-macedonia": "macedonia",
    "united-kingdom": "united-kingdom",
}

NO_GFP_COUNTRIES = {
    "andorra",
    "cyprus",
    "liechtenstein",
    "malta",
    "monaco",
    "san-marino",
    "vatican-city",
}


def country_title(country_id: str) -> str:
    special = {
        "bosnia-herzegovina": "Bosnia and Herzegovina",
        "czechia": "Czechia",
        "north-macedonia": "North Macedonia",
        "united-kingdom": "United Kingdom",
        "vatican-city": "Vatican City",
    }
    return special.get(country_id, country_id.replace("-", " ").title())


def build_generic_country_configs(country_id: str) -> list[dict[str, Any]]:
    name = country_title(country_id)
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
        {
            "id": f"{country_id}-primary-defense-profile",
            "title": primary_title,
            "publisher": primary_publisher,
            "category": "reference",
            "url": primary_url,
            "source_type": "static_reference",
            "state": "review",
            "summary": "Ülke ölçeğinde personel, kara, hava ve deniz kategori toplamları veya sınırlı güvenlik profili için standart kaynak.",
        },
        {
            "id": f"{country_id}-flightglobal-waf-2025",
            "title": "World Air Forces 2025 Directory",
            "publisher": "FlightGlobal / Cirium",
            "category": "reference",
            "url": "https://www.flightglobal.com/defence/2025-world-air-forces-directory/160846.article",
            "source_type": "static_reference",
            "state": "review",
            "summary": "Hava aracı tip/adet kırılımı için ortak kaynak.",
        },
        {
            "id": f"{country_id}-sipri-arms-transfers",
            "title": "SIPRI Arms Transfers Database",
            "publisher": "SIPRI",
            "category": "reference",
            "url": "https://www.sipri.org/databases/armstransfers",
            "source_type": "static_reference",
            "state": "review",
            "summary": "Transfer ve tedarik çapraz kontrolü için kaynak.",
        },
    ]

    if has_gfp_profile:
        configs.append(
            {
            "id": f"{country_id}-unroca",
            "title": "UN Register of Conventional Arms",
            "publisher": "UNROCA",
            "category": "reference",
            "url": "https://www.unroca.org/en/reporting/",
            "source_type": "static_reference",
            "state": "review",
            "summary": "Devlet raporları üzerinden konvansiyonel silah transfer doğrulaması için kullanılır.",
            }
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
    return {
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


def research_country(country_id: str) -> dict[str, Any]:
    configs = SOURCE_CONFIGS.get(country_id) or build_generic_country_configs(country_id)
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

    return {
        "countryId": country_id,
        "generatedAt": dt.datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "build": SERVER_BUILD,
        "mode": "source-adapter-alpha",
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
            payload = research_country(country_id)
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

(function () {
  const layers = window.ODA_DATA.layers;
  const countries = window.ODA_DATA.countries;
  const params = new URLSearchParams(window.location.search);
  const requestedCountryId = params.get("country");
  const initialCountry = countries.find((country) => country.id === requestedCountryId) || countries[0];
  const continentOrder = ["europe", "asia", "africa", "north-america", "south-america", "oceania", "other"];
  const continentLabels = {
    europe: "Avrupa",
    asia: "Asya",
    africa: "Afrika",
    "north-america": "Kuzey Amerika",
    "south-america": "Güney Amerika",
    oceania: "Okyanusya / Avustralya",
    other: "Diğer"
  };

  const state = {
    countryId: initialCountry.id,
    activeLayers: new Set(layers.map((layer) => layer.id)),
    selectedSiteId: null,
    selectedAssetId: params.get("asset"),
    selectedStrengthKey: "personnel",
    research: {
      status: "idle",
      countryId: null,
      data: null,
      error: null
    },
    query: ""
  };

  const els = {
    countrySelect: document.getElementById("countrySelect"),
    layerControls: document.getElementById("layerControls"),
    assetList: document.getElementById("assetList"),
    sourceList: document.getElementById("sourceList"),
    sourceSearch: document.getElementById("sourceSearch"),
    detailPanel: document.getElementById("detailPanel"),
    assetCount: document.getElementById("assetCount"),
    siteCount: document.getElementById("siteCount"),
    sourceScore: document.getElementById("sourceScore"),
    strengthGrid: document.getElementById("strengthGrid"),
    strengthNote: document.getElementById("strengthNote"),
    strengthDetail: document.getElementById("strengthDetail"),
    countryHeadline: document.getElementById("countryHeadline"),
    selectedRange: document.getElementById("selectedRange"),
    mapEmptyNote: document.getElementById("mapEmptyNote"),
    resetView: document.getElementById("resetView"),
    scanButton: document.getElementById("scanButton"),
    legend: document.getElementById("legend"),
    rangeLabel: document.getElementById("rangeLabel"),
    versionBadge: document.getElementById("versionBadge")
  };

  function renderVersionBadge() {
    if (!els.versionBadge) return;

    const meta = window.ODA_META || {};
    const label = [meta.stage || "Demo", meta.version].filter(Boolean).join(" ");
    els.versionBadge.textContent = `${label}${meta.owner ? ` - ${meta.owner}` : ""}`;
  }

  const map = L.map("map", {
    zoomControl: false,
    preferCanvas: false,
    zoomDelta: 0.5,
    zoomSnap: 0.25
  });

  L.control.zoom({ position: "topright" }).addTo(map);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  const overlay = L.layerGroup().addTo(map);
  const markerLayer = L.layerGroup().addTo(map);
  const rangeLayer = L.layerGroup().addTo(map);
  const selectedRangeLayer = L.layerGroup().addTo(map);
  const outlineLayer = L.layerGroup().addTo(map);
  let resizeFrame = null;

  renderVersionBadge();

  function getCountry() {
    return countries.find((country) => country.id === state.countryId) || countries[0];
  }

  function getLayer(id) {
    return layers.find((layer) => layer.id === id);
  }

  function layerColor(id) {
    return getLayer(id)?.color || "#2563eb";
  }

  function formatRange(asset) {
    return asset?.rangeLabel || (asset?.rangeKm ? `${asset.rangeKm} km` : "kaynaklı menzil yok");
  }

  function rangeModeLabel(asset) {
    const labels = {
      border: "sınır çevresi",
      coastal: "kıyı/deniz bölgesi",
      platform: "platform bağımlı",
      regional: "bölgesel"
    };
    return labels[asset?.rangeMode] || "bölgesel";
  }

  function drawRangeFromOrigins(origins, selectedAsset, color) {
    origins.forEach((site) => {
      L.circle([site.lat, site.lng], {
        radius: selectedAsset.rangeKm * 1000,
        color,
        weight: 2,
        opacity: 0.78,
        fillColor: color,
        fillOpacity: 0.08,
        dashArray: "10 8",
        interactive: false
      }).addTo(selectedRangeLayer);

      L.circleMarker([site.lat, site.lng], {
        radius: 6,
        color: "#ffffff",
        weight: 2,
        fillColor: color,
        fillOpacity: 1,
        interactive: false
      }).addTo(selectedRangeLayer);
    });
  }

  function drawCountryCoverage(country, color) {
    L.polygon(country.outline, {
      color,
      weight: 2.4,
      opacity: 0.82,
      fillColor: color,
      fillOpacity: 0.065,
      dashArray: "10 8",
      interactive: false
    }).addTo(selectedRangeLayer);
  }

  function extendBounds(bounds, nextBounds) {
    if (!nextBounds || !nextBounds.isValid()) return bounds;
    if (!bounds) {
      return L.latLngBounds(nextBounds.getSouthWest(), nextBounds.getNorthEast());
    }
    return bounds.extend(nextBounds);
  }

  function getDrawingBounds(fallbackBounds) {
    let bounds = extendBounds(null, fallbackBounds);

    [overlay, rangeLayer, selectedRangeLayer].forEach((group) => {
      group.getLayers().forEach((layer) => {
        if (typeof layer.getBounds !== "function") return;
        bounds = extendBounds(bounds, layer.getBounds());
      });
    });

    return bounds;
  }

  function fitMapToDrawing(outline) {
    const bounds = getDrawingBounds(outline.getBounds());
    if (!bounds || !bounds.isValid()) return;

    map.fitBounds(bounds, {
      paddingTopLeft: [14, 14],
      paddingBottomRight: [14, 26],
      maxZoom: 8,
      animate: false
    });
  }

  function getInventory(country) {
    const researchFindings =
      state.research.countryId === country.id && state.research.data?.findings
        ? state.research.data.findings
        : [];
    const existingNames = new Set(country.assets.map((asset) => asset.name.toLocaleLowerCase("tr")));
    const discoveredAssets = researchFindings
      .filter((finding) => finding.rangeKm && getLayer(finding.category))
      .filter((finding) => !existingNames.has(finding.title.toLocaleLowerCase("tr")))
      .map((finding) => ({
        id: `research-${finding.id}`,
        category: finding.category,
        name: finding.title,
        family: "Kaynaklı araştırma bulgusu",
        quantity: "otomatik bulgu",
        rangeKm: finding.rangeKm,
        rangeLabel: finding.rangeLabel,
        rangeMode: finding.category === "naval" ? "coastal" : finding.category === "air" ? "regional" : "border",
        confidence: finding.state === "verified" ? 0.72 : 0.55,
        sourceTag: finding.publisher,
        sourceUrl: finding.url
      }));

    return country.assets.concat(discoveredAssets);
  }

  function getSelectedAsset(country, inventory = getInventory(country)) {
    const activeAsset = inventory.find((asset) => asset.id === state.selectedAssetId);
    if (activeAsset && state.activeLayers.has(activeAsset.category)) return activeAsset;

    const defaultAsset = inventory.find(
      (asset) => asset.defaultSelected && state.activeLayers.has(asset.category)
    );
    return defaultAsset || inventory.find((asset) => state.activeLayers.has(asset.category)) || null;
  }

  function confidenceLabel(value) {
    if (value >= 0.7) return "yüksek";
    if (value >= 0.55) return "orta";
    return "düşük";
  }

  function sourceStateLabel(stateName) {
    const labels = {
      pending: "bekliyor",
      review: "inceleme",
      verified: "doğrulandı",
      candidate: "aday",
      loading: "aranıyor",
      error: "hata",
      fallback: "yerel liste"
    };
    return labels[stateName] || stateName;
  }

  function sortCountriesByName(left, right) {
    return left.name.localeCompare(right.name, "tr", { sensitivity: "base" });
  }

  function renderCountryOptions() {
    els.countrySelect.innerHTML = "";

    const groups = new Map(continentOrder.map((continent) => [continent, []]));
    countries.forEach((country) => {
      const continent = groups.has(country.continent) ? country.continent : "other";
      groups.get(continent).push(country);
    });

    continentOrder.forEach((continent) => {
      const groupCountries = groups.get(continent).sort(sortCountriesByName);
      if (!groupCountries.length) return;

      const optgroup = document.createElement("optgroup");
      optgroup.label = continentLabels[continent];
      groupCountries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.id;
        option.textContent = country.name;
        optgroup.appendChild(option);
      });
      els.countrySelect.appendChild(optgroup);
    });
  }

  function seedControls() {
    renderCountryOptions();

    layers.forEach((layer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "layer-button active";
      button.dataset.layer = layer.id;
      button.setAttribute("aria-label", `Envanter filtresi: ${layer.label}`);
      button.title = `Envanter filtresi: ${layer.label}`;
      button.style.setProperty("--layer-color", layer.color);
      button.innerHTML = `
        <i data-lucide="${layer.icon}" aria-hidden="true"></i>
        <span>${layer.label}<small>${layer.hint}</small></span>
      `;
      button.addEventListener("click", () => toggleLayer(layer.id));
      els.layerControls.appendChild(button);
    });

    els.legend.innerHTML = layers
      .map(
        (layer) => `
          <div class="legend-item">
            <span class="legend-dot" style="--dot:${layer.color}"></span>
            ${layer.label}
          </div>
        `
      )
      .join("");

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function toggleLayer(layerId) {
    if (state.activeLayers.has(layerId)) {
      state.activeLayers.delete(layerId);
    } else {
      state.activeLayers.add(layerId);
    }

    document.querySelectorAll(".layer-button").forEach((button) => {
      button.classList.toggle("active", state.activeLayers.has(button.dataset.layer));
    });

    render();
  }

  function render() {
    const country = getCountry();
    const inventory = getInventory(country);
    const visibleAssets = inventory.filter((asset) => state.activeLayers.has(asset.category));
    const visibleSites = country.sites.filter((site) => state.activeLayers.has(site.type));
    const selectedAsset = getSelectedAsset(country, inventory);
    state.selectedAssetId = selectedAsset?.id || null;

    els.countrySelect.value = country.id;
    els.assetCount.textContent = visibleAssets.length;
    els.siteCount.textContent = visibleSites.length;
    els.sourceScore.textContent = `${country.sourceScore}%`;
    els.countryHeadline.textContent = country.headline;
    const maxRange = visibleAssets.reduce(
      (largest, asset) => Math.max(largest, Number(asset.rangeKm) || 0),
      0
    );
    els.rangeLabel.textContent = maxRange ? `${maxRange} km üst değer` : "çizilebilir menzil yok";
    els.selectedRange.textContent = selectedAsset
      ? `${selectedAsset.name}: ${formatRange(selectedAsset)}${selectedAsset.rangeKm ? ` ${rangeModeLabel(selectedAsset)}` : ""}${
          selectedAsset.rangeMode === "platform" ? " · sabit coğrafi daire yok" : ""
        }`
      : "";

    renderStrength(country);
    const mapSites = selectedAsset?.rangeMode === "platform" ? [] : visibleSites;
    renderMap(country, mapSites, visibleAssets, selectedAsset);
    renderAssets(visibleAssets, selectedAsset);
    renderSources(country);
    renderDetail(country);

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderStrength(country) {
    const strength = country.strength;
    if (!strength) {
      els.strengthGrid.innerHTML = "";
      els.strengthNote.textContent = "";
      els.strengthDetail.innerHTML = "";
      return;
    }

    const rows = [
      ["personnel", "Aktif personel", strength.activePersonnel],
      ["land", "Kara sistemi", strength.landSystems],
      ["aircraft", "Hava aracı", strength.aircraft],
      ["naval", "Deniz unsuru", strength.navalAssets]
    ];

    els.strengthGrid.innerHTML = rows
      .map(
        ([key, label, value]) => `
          <button class="strength-item ${state.selectedStrengthKey === key ? "selected" : ""}" type="button" data-strength="${key}">
            <strong>${value}</strong>
            <span>${label}</span>
          </button>
        `
      )
      .join("");
    els.strengthNote.textContent = strength.note || "";
    els.strengthGrid.querySelectorAll("[data-strength]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedStrengthKey = button.dataset.strength;
        renderStrength(country);
      });
    });
    renderStrengthDetail(strength);
  }

  function renderStrengthDetail(strength) {
    const detail = strength.details?.[state.selectedStrengthKey];
    if (!detail) {
      els.strengthDetail.innerHTML = "";
      return;
    }

    const rows = detail.rows
      .map(
        (row) => `
          <div class="inventory-detail-row">
            <div>
              <strong>${row.type}</strong>
              <span>${row.role || ""}</span>
            </div>
            <div class="inventory-counts">
              ${
                row.active !== undefined
                  ? `<b>${row.active}</b><small>${row.activeLabel || "aktif"}</small>`
                  : ""
              }
              ${row.ready !== undefined ? `<b>${row.ready}</b><small>hazır</small>` : ""}
              ${row.ordered !== undefined ? `<b>${row.ordered}</b><small>sipariş</small>` : ""}
            </div>
          </div>
        `
      )
      .join("");

    els.strengthDetail.innerHTML = `
      <div class="strength-detail-head">
        <div>
          <strong>${detail.title}</strong>
          <span>${detail.source}${detail.updated ? ` · ${detail.updated}` : ""}</span>
        </div>
        ${
          detail.sourceUrl
            ? `<a href="${detail.sourceUrl}" target="_blank" rel="noreferrer" aria-label="Kaynağı aç">Kaynak</a>`
            : ""
        }
      </div>
      <p>${detail.note || ""}</p>
      <div class="inventory-detail-list">${rows}</div>
    `;
  }

  function renderMap(country, sites, assets, selectedAsset) {
    map.invalidateSize();
    overlay.clearLayers();
    markerLayer.clearLayers();
    rangeLayer.clearLayers();
    selectedRangeLayer.clearLayers();
    outlineLayer.clearLayers();
    if (els.mapEmptyNote) {
      els.mapEmptyNote.hidden = sites.length > 0;
    }

    const outline = L.polygon(country.outline, {
      color: "#1f2937",
      weight: 2,
      opacity: 0.5,
      fillColor: "#2563eb",
      fillOpacity: 0.045,
      interactive: false
    }).addTo(outlineLayer);

    sites.forEach((site) => {
      const color = layerColor(site.type);
      const relatedAssets = assets.filter((asset) => asset.category === site.type && asset.rangeKm);
      const rangeAsset = relatedAssets.reduce((largest, asset) => {
        if (!largest || asset.rangeKm > largest.rangeKm) return asset;
        return largest;
      }, null);

      if (site.showArea) {
        L.circle([site.lat, site.lng], {
          radius: site.radiusKm * 1000,
          color,
          weight: 1.5,
          opacity: 0.72,
          fillColor: color,
          fillOpacity: 0.075,
          interactive: false
        }).addTo(overlay);
      }

      if (site.showRange && rangeAsset && ["attack", "defense", "sensor", "naval"].includes(site.type)) {
        L.circle([site.lat, site.lng], {
          radius: rangeAsset.rangeKm * 1000,
          color,
          weight: 1.3,
          opacity: 0.5,
          fillOpacity: 0,
          dashArray: "7 7",
          interactive: false
        }).addTo(rangeLayer);
      }

      const marker = L.circleMarker([site.lat, site.lng], {
        radius: state.selectedSiteId === site.id ? 11 : 8,
        color: "#ffffff",
        weight: 2,
        fillColor: color,
        fillOpacity: 0.95,
        className: "oda-marker"
      });

      marker.bindPopup(`<strong>${site.name}</strong><br>${site.status} · ${site.precision}`);
      marker.on("click", () => {
        state.selectedSiteId = site.id;
        render();
      });
      marker.addTo(markerLayer);
    });

    renderSelectedRange(country, selectedAsset);
    fitMapToDrawing(outline);
  }

  function scheduleMapRefit() {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = null;
      render();
    });
  }

  function renderSelectedRange(country, selectedAsset) {
    if (!selectedAsset || !selectedAsset.rangeKm) return;

    const color = layerColor(selectedAsset.category);

    if (selectedAsset.rangeMode === "border" && window.turf) {
      const coords = country.outline.map(([lat, lng]) => [lng, lat]);
      const polygon = window.turf.polygon([coords]);
      const buffered = window.turf.buffer(polygon, selectedAsset.rangeKm, { units: "kilometers" });

      L.geoJSON(buffered, {
        style: {
          color,
          weight: 2,
          opacity: 0.8,
          fillColor: color,
          fillOpacity: 0.09,
          dashArray: "10 8"
        },
        interactive: false
      }).addTo(selectedRangeLayer);
      return;
    }

    if (selectedAsset.rangeMode === "platform") {
      return;
    }

    if (selectedAsset.rangeMode === "coastal") {
      const navalSites = country.sites.filter((site) => site.type === "naval");
      const origins = navalSites.filter((site) => site.showRange);
      if (origins.length) {
        drawRangeFromOrigins(origins, selectedAsset, color);
      } else {
        drawCountryCoverage(country, color);
      }
      return;
    }

    drawCountryCoverage(country, color);
  }

  function renderAssets(assets, selectedAsset) {
    if (!assets.length) {
      els.assetList.innerHTML = `<div class="empty-state"><p>Aktif katmanlarda unsur yok.</p></div>`;
      return;
    }

    els.assetList.innerHTML = assets
      .map((asset) => {
        const color = layerColor(asset.category);
        const activeClass = selectedAsset?.id === asset.id ? " selected" : "";
        return `
          <button class="asset-row asset-button${activeClass}" type="button" data-asset="${asset.id}">
            <div class="asset-name">
              <div class="asset-title-line">
                <strong>${asset.name}</strong>
                <span class="asset-status ${asset.status || "kaynaklı"}">${asset.status || "kaynaklı"}</span>
              </div>
              <span>${asset.family} · ${asset.role || "envanter"} · ${asset.quantity || "adet belirsiz"}</span>
              <small>${asset.sourceTag || "Kaynak bekliyor"} · güven ${confidenceLabel(asset.confidence)}</small>
            </div>
            <span class="asset-range" style="color:${color}">${formatRange(asset)}</span>
          </button>
        `;
      })
      .join("");

    els.assetList.querySelectorAll("[data-asset]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedAssetId = button.dataset.asset;
        render();
      });
    });
  }

  function renderSources(country) {
    const queue = getSourceQueue(country);
    const query = state.query.trim().toLocaleLowerCase("tr");
    const filtered = queue.filter((source) => {
      const haystack = `${source.title} ${source.publisher} ${source.summary}`.toLocaleLowerCase("tr");
      return !query || haystack.includes(query);
    });

    if (!filtered.length) {
      els.sourceList.innerHTML = `<div class="empty-state"><p>Eşleşen kaynak yok.</p></div>`;
      return;
    }

    els.sourceList.innerHTML = filtered
      .map(
        (source) => `
          <article class="source-item">
            <div class="source-meta">
              <span class="source-state ${source.state}">${sourceStateLabel(source.state)}</span>
              <span class="source-date">${source.date}</span>
            </div>
            <div>
              ${
                source.url
                  ? `<a class="source-link" href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a>`
                  : `<strong>${source.title}</strong>`
              }
              <p>${source.publisher} · ${source.summary}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function toSourceItem(source) {
    return {
      id: source.id,
      title: source.title || "Kaynak kaydı",
      publisher: source.publisher || "Açık kaynak",
      date: source.date || new Date().toISOString().slice(0, 10),
      state: source.state || "review",
      url: source.url,
      summary: source.summary || "Kaynak özeti bekleniyor."
    };
  }

  function dedupeSources(sources) {
    const seen = new Set();

    return sources.map(toSourceItem).filter((source) => {
      const key = (source.url || `${source.title}|${source.publisher}`).toLocaleLowerCase("tr");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function getSourceQueue(country) {
    const activeResearch = state.research.countryId === country.id ? state.research : null;

    if (activeResearch?.status === "loading") {
      return [
        {
          id: `${country.id}-research-loading`,
          title: `${country.name} açık kaynak araştırması`,
          publisher: "Otomatik araştırma hattı",
          date: new Date().toISOString().slice(0, 10),
          state: "loading",
          summary: "Kaynaklar taranıyor; doğrulanan bulgular birazdan burada görünecek."
        }
      ].concat(country.sources);
    }

    if (activeResearch?.data?.findings?.length) {
      return dedupeSources(activeResearch.data.findings.concat(country.sources));
    }

    if (activeResearch?.status === "error") {
      return dedupeSources(country.sources);
    }

    return dedupeSources(country.sources);
  }

  function researchUrls(country) {
    const countryId = typeof country === "string" ? country : country.id;
    const countryName = typeof country === "string" ? "" : country.name;
    const cacheKey = `v=${encodeURIComponent(window.ODA_META?.version || "dev")}&t=${Date.now()}`;
    const staticUrl = new URL(`api/research/${countryId}.json`, window.location.href);
    staticUrl.search = cacheKey;

    const isLocalHost = ["127.0.0.1", "localhost", "::1"].includes(window.location.hostname);
    if (!isLocalHost) return [staticUrl.toString()];

    const dynamicUrl = new URL(`/api/research/${countryId}`, window.location.href);
    dynamicUrl.searchParams.set("_", Date.now().toString());
    if (countryName) {
      dynamicUrl.searchParams.set("name", countryName);
    }
    return [dynamicUrl.toString(), staticUrl.toString()];
  }

  async function fetchResearch(country) {
    const errors = [];

    for (const url of researchUrls(country)) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API ${response.status}`);
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("API JSON yerine statik sayfa döndürdü");
        }
        return await response.json();
      } catch (error) {
        errors.push(`${url}: ${error.message}`);
      }
    }

    throw new Error(errors.join(" | "));
  }

  async function startResearch(country, options = {}) {
    const force = Boolean(options.force);
    if (!force && state.research.countryId === country.id && state.research.status !== "idle") return;

    state.research = {
      status: "loading",
      countryId: country.id,
      data: null,
      error: null
    };
    renderSources(country);
    els.scanButton.disabled = true;

    try {
      const data = await fetchResearch(country);
      state.research = {
        status: "ready",
        countryId: country.id,
        data: {
          ...data,
          findings: Array.isArray(data.findings) ? data.findings : []
        },
        error: null
      };
    } catch (error) {
      state.research = {
        status: "error",
        countryId: country.id,
        data: null,
        error: "Otomatik kaynak kontrolü yanıt vermedi; kayıtlı açık kaynak kuyruğu gösteriliyor."
      };
    } finally {
      els.scanButton.disabled = false;
      renderSources(country);
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  }

  function renderDetail(country) {
    const site = country.sites.find((item) => item.id === state.selectedSiteId);
    const selectedAsset = getSelectedAsset(country);

    if (!site || !state.activeLayers.has(site.type)) {
      renderAssetDetail(selectedAsset);
      return;
    }

    const layer = getLayer(site.type);
    const relatedAssets = getInventory(country).filter((asset) => asset.category === site.type);
    const assetText = relatedAssets.length
      ? relatedAssets
          .map((asset) => (asset.rangeKm ? `${asset.name} (${asset.rangeKm} km)` : asset.name))
          .join(", ")
      : "Doğrudan unsur bağlı değil";

    els.detailPanel.innerHTML = `
      <div class="detail-title">
        <h3>${site.name}</h3>
        <span class="tag" style="color:${layer.color}">${layer.label}</span>
      </div>
      <p>${site.source}</p>
      <div class="detail-list">
        <div class="detail-row"><span>Durum</span><strong>${site.status}</strong></div>
        <div class="detail-row"><span>Hassasiyet</span><strong>${site.precision}</strong></div>
        <div class="detail-row"><span>Alan</span><strong>${site.showArea ? `${site.radiusKm} km` : "nokta referansı"}</strong></div>
        <div class="detail-row"><span>İlişkili unsur</span><strong>${assetText}</strong></div>
      </div>
      ${site.sourceUrl ? `<a class="detail-source-link" href="${site.sourceUrl}" target="_blank" rel="noreferrer">Kaynağı aç</a>` : ""}
    `;
  }

  function renderAssetDetail(asset) {
    if (!asset) {
      els.detailPanel.innerHTML = `
        <div class="empty-state">
          <i data-lucide="info"></i>
          <p>Envanterden bir kayıt seçin.</p>
        </div>
      `;
      return;
    }

    const layer = getLayer(asset.category);
    els.detailPanel.innerHTML = `
      <div class="detail-title">
        <h3>${asset.name}</h3>
        <span class="tag" style="color:${layer.color}">${layer.label}</span>
      </div>
      <p>${asset.family}</p>
      <div class="detail-list">
        <div class="detail-row"><span>Rol</span><strong>${asset.role || "Envanter kaydı"}</strong></div>
        <div class="detail-row"><span>Adet/durum</span><strong>${asset.quantity || "Belirsiz"}</strong></div>
        <div class="detail-row"><span>Menzil</span><strong>${formatRange(asset)}</strong></div>
        <div class="detail-row"><span>Kapsama</span><strong>${rangeModeLabel(asset)}</strong></div>
        <div class="detail-row"><span>Kaynak</span><strong>${asset.sourceTag || "Kaynak bekliyor"}</strong></div>
        <div class="detail-row"><span>Güven</span><strong>${confidenceLabel(asset.confidence)}</strong></div>
      </div>
      ${asset.coverageNote ? `<p class="detail-note">${asset.coverageNote}</p>` : ""}
      ${
        asset.sourceUrl
          ? `<a class="detail-source-link" href="${asset.sourceUrl}" target="_blank" rel="noreferrer">Kaynağı aç</a>`
          : ""
      }
    `;
  }

  function selectCountry(countryId) {
    state.countryId = countryId;
    state.selectedSiteId = null;
    state.selectedAssetId = null;
    state.research = { status: "idle", countryId: null, data: null, error: null };
    const country = getCountry();
    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set("country", country.id);
    nextParams.delete("asset");
    window.history.replaceState(null, "", `${window.location.pathname}?${nextParams.toString()}`);
    render();
    startResearch(country);
  }

  els.countrySelect.addEventListener("change", (event) => selectCountry(event.target.value));
  els.resetView.addEventListener("click", () => {
    state.selectedSiteId = null;
    render();
  });
  els.scanButton.addEventListener("click", () => {
    startResearch(getCountry(), { force: true });
    els.scanButton.blur();
  });
  els.sourceSearch.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderSources(getCountry());
  });

  seedControls();
  render();
  startResearch(getCountry());
  window.addEventListener("load", scheduleMapRefit);
  window.addEventListener("resize", scheduleMapRefit);
  requestAnimationFrame(scheduleMapRefit);
})();

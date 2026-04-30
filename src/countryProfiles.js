(function () {
  const overrides = [];

  function applyOverrides(profiles = overrides) {
    const existingById = new Map(window.ODA_DATA.countries.map((country) => [country.id, country]));
    profiles.forEach((profile) => {
      const current = existingById.get(profile.id);
      if (!current) {
        window.ODA_DATA.countries.push(profile);
        existingById.set(profile.id, profile);
        return;
      }
      Object.assign(current, profile);
    });
  }

  window.ODA_COUNTRY_PROFILE_OVERRIDES = {
    profiles: overrides,
    apply: applyOverrides
  };

  applyOverrides();
})();

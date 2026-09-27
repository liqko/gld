import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const CITY_KEY = "gld_app_ciudad_v1";
const ANUNCIANTES_API = "https://script.google.com/macros/s/AKfycbzom6il-vhSMAnsNp0ipfTHqf2ha-nOtwVEv7xR9gcc6u01UiL9AVG9O-dZedCUvaGS/exec";
const PLATFORM_URL = "https://guialocal.ar/guia/";
const CITY_BRIDGE_KEY = "gld_ciudad_contexto";

function jsonpApi(params = {}, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const callbackName = `__gld_app_jsonp_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const script = document.createElement("script");
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Tiempo de espera agotado"));
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timer);
      try {
        delete window[callbackName];
      } catch (e) {
        window[callbackName] = undefined;
      }
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data || {});
    };

    const url = new URL(ANUNCIANTES_API);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value) !== "") {
        url.searchParams.set(key, value);
      }
    });
    url.searchParams.set("callback", callbackName);
    url.searchParams.set("_ts", Date.now());

    script.onerror = () => {
      cleanup();
      reject(new Error("No se pudo cargar la lista de ciudades"));
    };

    script.src = url.toString();
    document.head.appendChild(script);
  });
}

function cityLabel(city) {
  return String(
    city?.ciudad_visible ||
    city?.ciudad ||
    city?.nombre ||
    city?.name ||
    city?.ciudad_id ||
    ""
  ).trim();
}

function countryFlag(city) {
  const id = String(city?.pais_id || "").trim().toUpperCase();
  const flags = { ARG: "🇦🇷", BRA: "🇧🇷" };
  return flags[id] || "🌎";
}

function cityDisplayLabel(city) {
  const provinceId = String(city?.provincia_id || "").trim().toUpperCase();
  return `${countryFlag(city)} ${cityLabel(city)}${provinceId ? ` (${provinceId})` : ""}`;
}

function citySearchText(city) {
  return [
    cityLabel(city),
    city?.provincia,
    city?.provincia_id,
    city?.pais,
    city?.pais_id
  ].filter(Boolean).join(" ").toLocaleLowerCase("es");
}

function buildPlatformUrl(city) {
  const url = new URL(PLATFORM_URL);
  const fields = {
    pais_id: city?.pais_id,
    provincia_id: city?.provincia_id,
    ciudad_id: city?.ciudad_id || city?.id,
    pais: city?.pais,
    provincia: city?.provincia,
    ciudad: cityLabel(city)
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim()) {
      url.searchParams.set(key, String(value).trim());
    }
  });

  return url.toString();
}

export default function App() {
  const [cities, setCities] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [showMatches, setShowMatches] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);
  const [cityError, setCityError] = useState("");
  const [resolvingEntry, setResolvingEntry] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CITY_KEY) || "null");
      if (saved && (saved.ciudad_id || saved.id)) {
        window.location.replace(buildPlatformUrl(saved));
        return;
      }
    } catch (e) {}

    setResolvingEntry(false);
    let active = true;
    jsonpApi({ action: "ubicaciones" })
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data?.ciudades) ? data.ciudades : [];
        const normalized = list
          .filter((city) => city && (city.ciudad_id || city.id) && cityLabel(city))
          .sort((a, b) => cityLabel(a).localeCompare(cityLabel(b), "es"));
        setCities(normalized);
        // La ciudad se elige escribiendo. No preseleccionamos ninguna,
        // aunque por ahora haya una sola disponible.
      })
      .catch(() => {
        if (!active) return;
        setCityError("No pudimos cargar las ciudades en este momento.");
      })
      .finally(() => {
        if (active) setLoadingCities(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
      const btn = document.getElementById("installButton");
      if (btn) btn.style.display = "flex";
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  const selectedCity = useMemo(
    () => cities.find((city) => String(city.ciudad_id || city.id) === selectedId) || null,
    [cities, selectedId]
  );

  const matchingCities = useMemo(() => {
    const query = cityQuery.trim().toLocaleLowerCase("es");
    if (!query) return [];
    return cities
      .filter((city) => citySearchText(city).includes(query))
      .slice(0, 8);
  }, [cities, cityQuery]);

  const chooseCity = (city) => {
    setSelectedId(String(city.ciudad_id || city.id));
    setCityQuery(cityDisplayLabel(city));
    setShowMatches(false);
  };

  const handleCityQuery = (event) => {
    setCityQuery(event.target.value);
    setSelectedId("");
    setShowMatches(true);
  };

  const requestedCity = cityQuery.trim();
  const requestCityUrl = requestedCity
    ? `https://www.guialocal.ar/nosotros?ciudad_solicitada=${encodeURIComponent(requestedCity)}`
    : "https://www.guialocal.ar/nosotros";

  const handleEnter = () => {
    if (!selectedCity) return;

    const cityContext = {
      pais_id: String(selectedCity?.pais_id || "").trim(),
      provincia_id: String(selectedCity?.provincia_id || "").trim(),
      ciudad_id: String(selectedCity?.ciudad_id || selectedCity?.id || "").trim(),
      pais: String(selectedCity?.pais || "").trim(),
      provincia: String(selectedCity?.provincia || "").trim(),
      ciudad: cityLabel(selectedCity),
      ts: Date.now()
    };

    try {
      localStorage.setItem(CITY_KEY, JSON.stringify(selectedCity));
      // También usamos la misma clave que consume la Guía web.
      // Si app y web comparten almacenamiento en el navegador, la ciudad queda disponible
      // aunque la página contenedora no retransmita los parámetros.
      localStorage.setItem(CITY_BRIDGE_KEY, JSON.stringify(cityContext));
    } catch (e) {}

    window.location.assign(buildPlatformUrl(selectedCity));
  };

  const handleInstallClick = () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    promptEvent.userChoice.then(() => {
      window.deferredPrompt = null;
      const btn = document.getElementById("installButton");
      if (btn) btn.style.display = "none";
    });
  };

  if (resolvingEntry) {
    return (
      <main
        className="app-shell app-entry-loading"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8,39,66,.22), rgba(8,39,66,.34)), url('/fondo-app.png')"
        }}
      >
        <section className="entry-splash" aria-label="Ingresando a Guía Local">
          <img className="entry-splash-logo" src="/logo.png" alt="Guía Local" />
          <div className="entry-splash-text">Ingresando a Guía Local…</div>
        </section>
      </main>
    );
  }

  const bubbles = [
    "Comercios",
    "Servicios",
    "Turismo",
    "Gastronomía",
    "Eventos",
    "Promociones",
    "Cultura",
    "ONG"
  ];

  return (
    <main
      className="app-shell"
      style={{
        backgroundImage:
          "linear-gradient(rgba(8,39,66,.22), rgba(8,39,66,.34)), url('/fondo-app.png')"
      }}
    >
      <section className="hero-card">
        <img className="main-logo" src="/logo.png" alt="Guía Local" />

        <div className="brand-slogan">
          Todo lo que ofrece la ciudad, en un solo lugar
        </div>

        <div className="access-box">
          <label htmlFor="citySearch">¿Qué ciudad querés consultar?</label>
          <div className="city-search-wrap">
            <input
              id="citySearch"
              className="city-search"
              type="search"
              value={cityQuery}
              onChange={handleCityQuery}
              onFocus={() => setShowMatches(true)}
              placeholder={loadingCities ? "Cargando ciudades..." : "Escribí el nombre de tu ciudad"}
              autoComplete="off"
              disabled={loadingCities || !!cityError}
            />

            {showMatches && cityQuery.trim() && matchingCities.length > 0 && (
              <div className="city-matches" role="listbox" aria-label="Ciudades disponibles">
                {matchingCities.map((city) => {
                  const id = String(city.ciudad_id || city.id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className="city-match"
                      onClick={() => chooseCity(city)}
                    >
                      {cityDisplayLabel(city)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {!loadingCities && !cityError && requestedCity && matchingCities.length === 0 && !selectedCity && (
            <div className="city-not-found">
              <strong>La ciudad que buscás todavía no está disponible en Guía Local.</strong>
              <a className="city-request" href={requestCityUrl}>
                Quiero que Guía Local llegue a mi ciudad
              </a>
            </div>
          )}

          <button
            type="button"
            className="main-cta"
            onClick={handleEnter}
            disabled={!selectedCity}
          >
            <span className="pin">📍</span>
            INGRESAR A GUÍA LOCAL
          </button>

          {cityError && (
            <a className="fallback-link" href="https://guialocal.ar/">
              Ingresar desde la web
            </a>
          )}
        </div>

        <div className="bubble-stage" aria-hidden="true">
          {bubbles.map((label, index) => (
            <span
              key={label}
              className={`service-bubble bubble-${index + 1}`}
              style={{ "--delay": `${index * 0.55}s` }}
            >
              {label}
            </span>
          ))}
        </div>

        <button
          id="installButton"
          className="install-btn"
          onClick={handleInstallClick}
        >
          📲 INSTALAR APP
        </button>

        <div className="producer-box">
          <div className="producer-label">Creado por</div>
          <a href="https://www.guialocal.ar/nosotros" target="_blank" rel="noopener noreferrer">
            <img src="/idea.png" alt="ACP Media · ACP Contenidos" />
          </a>
        </div>

        <div className="copyright-box">
          © Todos los derechos reservados - 2026
        </div>
      </section>
    </main>
  );
}

import React, { useEffect } from "react";
import "./App.css";

const CITY_KEY = "gld_app_ciudad_v1";
const PLATFORM_URL = "https://guialocal.ar/guia/";
const HOME_URL = "https://guialocal.ar/";

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
  useEffect(() => {
    let destination = HOME_URL;

    try {
      const saved = JSON.parse(localStorage.getItem(CITY_KEY) || "null");
      if (saved && (saved.ciudad_id || saved.id)) {
        destination = buildPlatformUrl(saved);
      }
    } catch (e) {}

    window.location.replace(destination);
  }, []);

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

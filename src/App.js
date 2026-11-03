import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const CITY_KEY = "gld_app_ciudad_v1";
const PLATFORM_URL = "https://guialocal.ar/guia/";
const HOME_URL = "https://guialocal.ar/";

function cityLabel(city) {
  return String(city?.ciudad_visible || city?.ciudad || city?.nombre ||
    city?.name || city?.ciudad_id || "").trim();
}

function destinationForExistingUser() {
  try {
    const city = JSON.parse(localStorage.getItem(CITY_KEY) || "null");
    if (city && (city.ciudad_id || city.id)) {
      const url = new URL(PLATFORM_URL);
      const fields = {
        pais_id: city.pais_id,
        provincia_id: city.provincia_id,
        ciudad_id: city.ciudad_id || city.id,
        pais: city.pais,
        provincia: city.provincia,
        ciudad: cityLabel(city)
      };
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).trim()) {
          url.searchParams.set(key, String(value).trim());
        }
      });
      return url.toString();
    }
  } catch (_) {}
  return HOME_URL;
}

export default function App() {
  const promptRef = useRef(null);
  const [installReady, setInstallReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    // Solo la app YA INSTALADA entra automaticamente; el visitante ve la instalacion.
    if (standalone) {
      window.location.replace(destinationForExistingUser());
      return;
    }
    const onPrompt = (event) => {
      event.preventDefault();
      promptRef.current = event;
      setInstallReady(true);
      setMessage("");
    };
    const onInstalled = () => {
      promptRef.current = null;
      setInstallReady(false);
      setInstalled(true);
      setMessage("Guía Local ya está instalada. Buscá el ícono en tu teléfono.");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // No guarda datos ni consulta Firestore/Cloudflare. Solo habilita
    // el aviso nativo de instalacion de Chrome, si el dispositivo lo permite.
    if ("serviceWorker" in navigator && window.isSecureContext) {
      navigator.serviceWorker.register("/install-sw.js", { scope: "/" }).catch(() => {});
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    const event = promptRef.current;
    if (!event) {
      setMessage("Chrome todavía no habilitó la instalación para este dispositivo. Podés ingresar a la Guía normalmente.");
      return;
    }
    promptRef.current = null;
    setInstallReady(false);
    try {
      await event.prompt();
      const result = await event.userChoice;
      if (result?.outcome !== "accepted") setMessage("Instalación cancelada. Podés seguir usando Guía Local.");
    } catch (_) {
      setMessage("No se pudo abrir la instalación en este navegador.");
    }
  }

  return (
    <main className="app-shell" style={{ minHeight: "100dvh", backgroundImage: "linear-gradient(rgba(0,31,84,.35), rgba(0,31,84,.55)), url('/fondo-app.png')" }}>
      <section className="hero-card" aria-label="Instalar Guía Local">
        <img className="main-logo" src="/logo.png" alt="Guía Local" />
        <h1 style={{ color: "#006699", margin: "8px 0" }}>Guía Local</h1>
        <p className="brand-slogan">Todo lo que ofrece la ciudad, en un sólo lugar!</p>
        <p>Instalá Guía Local gratis en tu teléfono.</p>
        {!installed && (
          <button type="button" id="installButton" onClick={install}
            style={{ width: "100%", background: "#ff7f50", color: "white", border: 0,
              borderRadius: 12, padding: 15, fontWeight: 800, fontSize: "1.05rem",
              cursor: "pointer" }}>
            {installReady ? "Instalar aplicación" : "Instalar Guía Local"}
          </button>
        )}
        <a href={HOME_URL} style={{ display: "block", marginTop: 20, fontWeight: 700, color: "#006699" }}>
          Ingresar a Guía Local
        </a>
        <p role="status" aria-live="polite" style={{ minHeight: 28, color: "#37474f", fontSize: ".9rem" }}>
          {message}
        </p>
      </section>
    </main>
  );
}

import React, { useEffect, useState } from "react";
import "./App.css";

// La app instalada mantiene exactamente la entrada anterior: Vercel -> Jimdo.
// La visita desde el navegador conserva esta pantalla para poder instalar.
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

function enterGuide() {
  let destination = HOME_URL;
  try {
    const saved = JSON.parse(localStorage.getItem(CITY_KEY) || "null");
    if (saved && (saved.ciudad_id || saved.id)) {
      destination = buildPlatformUrl(saved);
    }
  } catch (e) {
    // No bloquear la entrada si el almacenamiento no está disponible.
  }
  window.location.replace(destination);
}

function isInstalledWindow() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true;
}

export default function App() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => isInstalledWindow());

  useEffect(() => {
    // CRÍTICO: en la app YA instalada conservar el redireccionamiento directo.
    if (isInstalledWindow()) {
      enterGuide();
      return;
    }
    // En una pestaña normal NO redirigir automáticamente: así puede ofrecerse
    // la instalación antes de pasar a Jimdo.
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };
    const onDisplayChange = () => {
      if (isInstalledWindow()) enterGuide();
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    const media = window.matchMedia("(display-mode: standalone)");
    if (media.addEventListener) media.addEventListener("change", onDisplayChange);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (media.removeEventListener) media.removeEventListener("change", onDisplayChange);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    const prompt = installPrompt;
    setInstallPrompt(null);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      // Cuando se cancela, el navegador podrá emitir otro evento de instalación.
    } catch (error) {
      console.warn("La instalación no está disponible:", error);
    }
  }

  return (
    <main className="app-shell" style={{
      backgroundImage: "linear-gradient(rgba(8,39,66,.22), rgba(8,39,66,.34)), url('/fondo-app.png')"
    }}>
      <section className="hero-card" style={{maxWidth: 520}}>
        <img className="main-logo" src="/logo.png" alt="Guía Local" />
        <div className="brand-slogan">
          Todo lo que ofrece la ciudad, en un sólo lugar!
        </div>

        <h1 style={{fontSize: 22, color: "#123a4b", margin: "12px 0 8px"}}>
          Guía Local en tu teléfono
        </h1>
        <p style={{color: "#345", lineHeight: 1.5, margin: "0 0 20px"}}>
          {installPrompt ? "Instalá Guía Local con un toque o ingresá sin instalar." : "Ingresá a Guía Local. La instalación se ofrecerá cuando esté disponible en este dispositivo."}
        </p>

        {!isInstalled && installPrompt && (
          <button
            id="installButton"
            type="button"
            className="install-btn"
            onClick={handleInstall}
            style={{display: "flex", width: "100%", justifyContent: "center", cursor: "pointer", marginBottom: 12}}
          >
            📲 INSTALAR GUÍA LOCAL
          </button>
        )}

        <a className="main-cta" href={HOME_URL} style={{textDecoration: "none", marginBottom: 10}}>
          📍 ENTRAR A GUÍA LOCAL
        </a>


      </section>
    </main>
  );
}

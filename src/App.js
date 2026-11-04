import React, { useEffect, useState } from "react";
import "./App.css";

// La aplicación es una puerta de entrada pública, no un gestor de sesión.
// La autenticación, las ciudades y las preferencias pertenecen a guialocal.ar.
// Usamos el dominio canónico para compartir las cookies existentes del sitio.
const HOME_URL = "https://www.guialocal.ar/";

function enterGuide() {
  window.location.replace(HOME_URL);
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
    // En la app instalada abrir siempre la web pública, sin exigir login ni ciudad.
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
      await prompt.userChoice;
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

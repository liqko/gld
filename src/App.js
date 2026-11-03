import React, { useEffect, useRef, useState } from "react";
import "./App.css";

// La app muestra la plataforma existente, sin copiar datos ni hacer consultas propias.
const GUIDE_URL = "https://anunciantes-guialocal.web.app/plataforma/inicio.html";

export default function App() {
  const installEvent = useRef(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(
    () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
  );
  const [bannerOpen, setBannerOpen] = useState(true);

  useEffect(() => {
    function ready(event) {
      event.preventDefault();
      installEvent.current = event;
      setCanInstall(true);
    }
    function installedNow() {
      installEvent.current = null;
      setCanInstall(false);
      setInstalled(true);
    }
    window.addEventListener("beforeinstallprompt", ready);
    window.addEventListener("appinstalled", installedNow);
    if (window.isSecureContext && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/install-sw.js", { scope: "/" })
        .catch((error) => console.warn("Guía Local: instalación no disponible", error));
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", ready);
      window.removeEventListener("appinstalled", installedNow);
    };
  }, []);

  async function install() {
    const event = installEvent.current;
    if (!event) return; // Nunca ofrecer un botón sin instalación habilitada.
    installEvent.current = null;
    setCanInstall(false);
    try {
      await event.prompt();
      await event.userChoice;
    } catch (error) {
      console.warn("Guía Local: instalación cancelada o no disponible", error);
    }
  }

  return (
    <main className="guia-app">
      <iframe
        className="guia-app-contenido"
        title="Guía Local"
        src={GUIDE_URL}
        allow="geolocation; autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {!installed && canInstall && bannerOpen && (
        <aside className="guia-app-instalar" aria-label="Instalar Guía Local">
          <img src="/logo-192.png" alt="" className="guia-app-logo" />
          <div className="guia-app-mensaje">
            <strong>Guía Local</strong>
            <span>Instalá gratis la aplicación en tu teléfono.</span>
          </div>
          <button type="button" className="guia-app-boton" onClick={install}>Instalar</button>
          <button type="button" className="guia-app-cerrar" aria-label="Cerrar aviso" onClick={() => setBannerOpen(false)}>×</button>
        </aside>
      )}
    </main>
  );
}

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
  const [showInstructions, setShowInstructions] = useState(false);

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
    if (!event) {
      setShowInstructions(true);
      return;
    }
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
      {!installed && bannerOpen && (
        <aside className="guia-app-instalar" aria-label="Instalar Guía Local">
          <img src="/logo-192.png" alt="" className="guia-app-logo" />
          <div className="guia-app-mensaje">
            <strong>Guía Local</strong>
            <span>Instalá gratis la aplicación en tu dispositivo.</span>
          </div>
          <button type="button" className="guia-app-boton" onClick={install}>Instalar</button>
          <button type="button" className="guia-app-cerrar" aria-label="Cerrar aviso" onClick={() => setBannerOpen(false)}>×</button>
        </aside>
      )}
      {showInstructions && (
        <div className="guia-app-overlay" role="presentation" onClick={() => setShowInstructions(false)}>
          <section className="guia-app-dialogo" role="dialog" aria-modal="true" aria-label="Instalar Guía Local" onClick={event => event.stopPropagation()}>
            <h2>Instalar Guía Local</h2>
            <p>Tu navegador no ofrece la instalación automática desde este botón.</p>
            {/Opera|OPR\//.test(navigator.userAgent) ? (
              <p>En Opera, buscá la opción para instalar la página desde el menú del navegador. Si no aparece, abrí esta misma dirección en Chrome o Edge.</p>
            ) : /iPad|iPhone|iPod/.test(navigator.userAgent) ? (
              <p>Tocá Compartir y elegí «Agregar a inicio».</p>
            ) : /Android/.test(navigator.userAgent) ? (
              <p>Abrí el menú del navegador y elegí «Instalar aplicación» o «Agregar a pantalla principal», si está disponible.</p>
            ) : (
              <p>En Chrome, abrí el menú de los tres puntos → «Transmitir, guardar y compartir» → «Instalar página como aplicación». En Edge, buscá «Aplicaciones» → «Instalar este sitio como aplicación».</p>
            )}
            <button type="button" className="guia-app-boton" onClick={() => setShowInstructions(false)}>Entendido</button>
          </section>
        </div>
      )}
    </main>
  );
}

import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const WEBSITE = "https://www.guialocal.ar/";
const isInstalled = () => window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

export default function App() {
  const deferred = useRef(null);
  const [, setAvailable] = useState(false);
  const [installed, setInstalled] = useState(isInstalled);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    // Vercel solo ofrece instalar; la aplicación abre la WEB REAL de Jimdo.
    if (isInstalled()) {
      window.location.replace(WEBSITE);
      return;
    }
    const onPrompt = event => {
      event.preventDefault();
      deferred.current = event;
      setAvailable(true);
    };
    const onInstalled = () => {
      deferred.current = null;
      setAvailable(false);
      setInstalled(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/install-sw.js").catch(() => {});
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!deferred.current) { setHelp(true); return; }
    const event = deferred.current;
    deferred.current = null;
    setAvailable(false);
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice && choice.outcome === "accepted") {
        setInstalled(true);
      }
    } catch (_) { setHelp(true); }
  }

  return (
    <main className="app-install">
      <img className="app-install-logo" src="/logo.png" alt="Guía Local" />
      <p className="app-install-slogan">Todo lo que ofrece la ciudad, en un sólo lugar!</p>
      <h1>Instalá Guía Local</h1>
      <p>Accedé a la web completa desde el ícono de tu dispositivo.</p>
      {!installed && <button className="app-install-primary" onClick={install}>
        Instalar aplicación
      </button>}
      {installed && <p>La aplicación ya está instalada.</p>}
      <a className="app-install-link" href={WEBSITE}>Entrar a Guía Local</a>
      {help && <section role="status" className="app-install-help">
        { /iPhone|iPad|iPod/.test(navigator.userAgent)
          ? "En Safari, tocá Compartir y después Agregar a inicio."
          : /Android/.test(navigator.userAgent)
          ? "En el menú de tu navegador buscá Instalar aplicación o Agregar a pantalla principal."
          : "En Chrome o Edge, buscá Instalar página como aplicación en el menú del navegador."}
        <button onClick={() => setHelp(false)} aria-label="Cerrar instrucciones">Cerrar</button>
      </section>}
      <small>Se instala el acceso a la web original. No se copian los datos ni se reemplaza Jimdo.</small>
    </main>
  );
}

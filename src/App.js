import React, { useEffect } from "react";
import "./App.css";

export default function App() {
  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
      const btn = document.getElementById("installButton");
      if (btn) btn.style.display = "flex";
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

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

  const bubbles = [
    "Comercios",
    "Servicios",
    "Turismo",
    "Gastronomía",
    "Eventos",
    "Promociones",
    "Oficinas Públicas",
    "Cultura",
    "ONG",
    "Información local"
  ];

  return (
    <main className="app-shell">
      <section className="hero-card">
        <img className="main-logo" src="/logo.png" alt="Guía Local" />

        <div className="brand-slogan">
          Todo lo que ofrece tu ciudad, en un solo lugar
        </div>

        <div className="bubble-stage" aria-label="Servicios disponibles en Guía Local">
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

        <a className="main-cta" href="https://guialocal.ar/">
          <span className="pin">📍</span>
          Elegir ciudad e ingresar
        </a>

        <button
          id="installButton"
          className="install-btn"
          onClick={handleInstallClick}
        >
          📲 INSTALAR APP
        </button>

        <div className="social-row">
          <a href="https://wa.me/5492245459957" target="_blank" rel="noopener noreferrer">
            <img src="/whatsapp.png" alt="WhatsApp" />
          </a>

          <a href="https://www.instagram.com/guialocal.dolores" target="_blank" rel="noopener noreferrer">
            <img src="/instagram.png" alt="Instagram" />
          </a>

          <a href="https://www.facebook.com/profile.php?id=61556181291408" target="_blank" rel="noopener noreferrer">
            <img src="/facebook.png" alt="Facebook" />
          </a>
        </div>

        <a
          className="ecosystem-link"
          href="https://www.liqko.com.ar"
          target="_blank"
          rel="noopener noreferrer"
        >
          ACP Media · ACP Contenidos
        </a>

        <div className="legal-links">
          <a href="/terminos-y-condiciones/">Términos y condiciones</a>
          <a href="/politica-de-privacidad/">Política de privacidad</a>
          <a className="regret-link" href="/boton-de-arrepentimiento/">
            Botón de arrepentimiento
          </a>
        </div>

        <div className="copyright">© Guía Local</div>
      </section>
    </main>
  );
}

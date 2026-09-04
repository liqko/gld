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

        <div className="social-box">
          <a href="https://wa.me/5491150972086" target="_blank" rel="noopener noreferrer">
            <img src="/whatsapp.png" alt="WhatsApp" />
          </a>
          <a href="https://www.instagram.com/guialocal.dolores" target="_blank" rel="noopener noreferrer">
            <img src="/instagram.png" alt="Instagram" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61556181291408" target="_blank" rel="noopener noreferrer">
            <img src="/facebook.png" alt="Facebook" />
          </a>
        </div>

        <div className="producer-box">
          <a href="https://www.guialocal.ar/nosotros" target="_blank" rel="noopener noreferrer">
            <img src="/idea.png" alt="ACP Media · ACP Contenidos" />
          </a>
        </div>

        <div className="legal-box">
          <a
            className="legal-button"
            href="https://www.guialocal.ar/politicas-de-privacidad/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidad y Descargo de Responsabilidad
          </a>
        </div>

        <div className="copyright-box">
          © Todos los derechos reservados - 2026
        </div>
      </section>
    </main>
  );
}

import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
      const btn = document.getElementById("installButton");
      if (btn) btn.style.display = "block";
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

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(rgba(0,31,84,.28), rgba(0,31,84,.42)), url('/fondo-app.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        overflowX: "hidden",
        fontFamily: "'Segoe UI', Roboto, Arial, sans-serif"
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          padding: "32px 16px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: "rgba(255,255,255,.94)",
            borderRadius: 22,
            padding: 24,
            boxShadow: "0 12px 34px rgba(0,0,0,.24)",
            textAlign: "center"
          }}
        >
          <img
            src="/logo.png"
            alt="Guía Local"
            style={{
              width: 155,
              maxWidth: "55%",
              marginBottom: 10
            }}
          />

          <h1
            style={{
              margin: "8px 0 6px",
              color: "#006699",
              fontSize: 30
            }}
          >
            Guía Local
          </h1>

          <p
            style={{
              margin: "0 0 24px",
              color: "#455a64",
              fontSize: 16,
              lineHeight: 1.45
            }}
          >
            Todo lo que ofrece la ciudad, en un solo lugar.
          </p>

          <a
            href="https://guialocal.ar/"
            style={{
              display: "block",
              textDecoration: "none",
              backgroundColor: "#006699",
              color: "white",
              padding: "15px 18px",
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 12
            }}
          >
            📍 ELEGIR CIUDAD E INGRESAR
          </a>

          <button
            id="installButton"
            onClick={handleInstallClick}
            style={{
              display: "none",
              width: "100%",
              border: 0,
              backgroundColor: "#ff7a00",
              color: "white",
              padding: "13px 18px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              marginBottom: 12
            }}
          >
            📲 INSTALAR APP
          </button>

          <div
            style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: "1px solid #d8e1e5"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 18,
                flexWrap: "wrap"
              }}
            >
              <a href="https://wa.me/5492245459957" target="_blank" rel="noopener noreferrer">
                <img src="/whatsapp.png" alt="WhatsApp" style={{ width: 40, height: 40 }} />
              </a>

              <a href="https://www.instagram.com/guialocal.dolores" target="_blank" rel="noopener noreferrer">
                <img src="/instagram.png" alt="Instagram" style={{ width: 40, height: 40 }} />
              </a>

              <a href="https://www.facebook.com/profile.php?id=61556181291408" target="_blank" rel="noopener noreferrer">
                <img src="/facebook.png" alt="Facebook" style={{ width: 40, height: 40 }} />
              </a>
            </div>
          </div>

          <a
            href="https://www.liqko.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 18,
              color: "#006699",
              fontWeight: 700,
              textDecoration: "none"
            }}
          >
            ACP Media · ACP Contenidos
          </a>

          <div
            style={{
              marginTop: 20,
              color: "#607d8b",
              fontSize: 12
            }}
          >
            © Guía Local
          </div>
        </div>
      </div>
    </div>
  );
}

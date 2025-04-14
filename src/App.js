import React, { useEffect } from "react";

const links = [
  { title: "TURISMO", url: "https://www.guialocaldolores.com.ar/turismo", image: "turismo.png" },
  { title: "INDUSTRIAS, COMERCIOS Y SERVICIOS", url: "https://www.guialocaldolores.com.ar/industria-comercios-y-servicios/", image: "com.png" },
  { title: "CULTURA LOCAL", url: "https://www.guialocaldolores.com.ar/cultura/", image: "cultura.png" },
  { title: "ORGANIZACIONES DE LA SOCIEDAD CIVIL", url: "https://www.guialocaldolores.com.ar/osc/", image: "osc.png" },
  { title: "GOBIERNO Y SERVICIOS PÚBLICOS", url: "https://www.guialocaldolores.com.ar/gobierno-y-servicios-p%C3%BAblicos/", image: "gob.png" },
  { title: "EVENTOS", url: "https://www.guialocaldolores.com.ar/eventos/", image: "eventos.png" },
  { title: "PROMOCIONES Y DESCUENTOS", url: "https://www.guialocaldolores.com.ar/promos/", image: "promos.png" }
];

export default function App() {
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
      const btn = document.getElementById("installButton");
      if (btn) btn.style.display = "block";
    });

    const script1 = document.createElement("script");
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-N3FS1B5WG7";
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-N3FS1B5WG7');
    `;
    document.head.appendChild(script2);
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
        backgroundImage: "url('fondo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        overflowX: "hidden"
      }}
    >
      {/* Marca de agua */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.2,
          zIndex: 0,
          pointerEvents: "none"
        }}
      >
        <img src="logo.png" alt="Marca de agua" style={{ width: 700 }} />
      </div>

      {/* Logo superior */}
      <div
        style={{
          margin: "32px auto 0 auto",
          backgroundColor: "#001f54",
          borderRadius: 12,
          padding: 8,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <img
          src="logo.png"
          alt="Logo"
          style={{
            width: 150,
            borderRadius: 8
          }}
        />
      </div>

      {/* Contenido principal */}
      <div style={{ paddingTop: 40, paddingBottom: 100, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Botón de instalación */}
        <button
          id="installButton"
          onClick={handleInstallClick}
          style={{
            display: "none",
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 24px",
            borderRadius: 8,
            marginBottom: 24,
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}
        >
          📲 INSTALÁ LA APP EN TU DISPOSITIVO!
        </button>

        {/* Grilla de enlaces */}
        <div style={{ display: "grid", gap: 24, width: "100%", maxWidth: 400 }}>
          {links.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "black",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }}
            >
              <div style={{ height: 160, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src={item.image} alt={item.title} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
              </div>
              <div
                style={{
                  padding: 16,
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontStyle: "italic",
                  textTransform: "uppercase"
                }}
              >
                {item.title}
              </div>
            </a>
          ))}
        </div>

        {/* Redes sociales dentro de fondo azul */}
        <div
          style={{
            marginTop: 48,
            backgroundColor: "#001f54",
            borderRadius: 16,
            padding: 16,
            display: "flex",
            justifyContent: "center",
            gap: 16,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          <a href="https://wa.me/5492245459957" target="_blank" rel="noopener noreferrer">
            <img src="whatsapp.png" alt="WhatsApp" style={{ width: 40, height: 40 }} />
          </a>
          <a href="https://www.instagram.com/guialocal.dolores" target="_blank" rel="noopener noreferrer">
            <img src="instagram.png" alt="Instagram" style={{ width: 40, height: 40 }} />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61556181291408" target="_blank" rel="noopener noreferrer">
            <img src="facebook.png" alt="Facebook" style={{ width: 40, height: 40 }} />
          </a>
        </div>

        {/* Botón de la productora */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            backgroundColor: "#001f54",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: 400
          }}
        >
          <a href="https://www.liqko.com.ar" target="_blank" rel="noopener noreferrer">
            <img src="idea.png" alt="Productora" style={{ width: 450 }} />
          </a>
        </div>

        {/* Política de privacidad */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            backgroundColor: "rgba(244, 11, 11, 0.98)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: 400
          }}
        >
          <a
            href="https://www.guialocaldolores.com.ar/descarga-la-app/politicas-de-privacidad/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              backgroundColor: "red",
              color: "white",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: "bold"
            }}
          >
            Política de Privacidad y Descargo de Responsabilidad
          </a>
        </div>

        {/* Derechos reservados */}
        <div
          style={{
            marginTop: 32,
            backgroundColor: "#001f54",
            color: "white",
            fontSize: 12,
            textAlign: "center",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: 400
          }}
        >
          © Todos los derechos reservados - 2025
        </div>
      </div>
    </div>
  );
}

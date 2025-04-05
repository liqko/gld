import React, { useEffect } from "react";

const links = [
  { title: "ACP Contenidos", url: "https://www.guialocaldolores.com.ar/acp", image: "logo.png" },
  { title: "Radio Online", url: "https://server.radiostreaming.com.ar/8174/stream", image: "radio.png" },
  { title: "Streaming", url: "https://www.youtube.com/@acpcontenidos", image: "streaming.png" },
  { title: "Blog", url: "https://www.guialocaldolores.com.ar/acp-blog/", image: "blog.png" }
];

export default function App() {
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
      document.getElementById("installButton").style.display = "block";
    });
  }, []);

  const handleInstallClick = () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    promptEvent.userChoice.then(() => {
      window.deferredPrompt = null;
      document.getElementById("installButton").style.display = "none";
    });
  };

  return (
    <div 
      className="flex flex-col items-center p-4 min-h-screen w-full bg-cover bg-center bg-no-repeat text-center" 
      style={{ backgroundImage: "url('fondo.jpg')", backgroundSize: "cover", backgroundAttachment: "fixed" }}
    >
      {/* Espacio adicional arriba para que el logo no quede "pegado" */}
      <div style={{ height: "40px" }} />

      {/* Logo visible en scroll */}
      <img src="logo.png" alt="Logo Empresa" className="w-24 mb-6 rounded-lg shadow-md" />
      
      {/* Botón de instalación */}
      <button 
        id="installButton" 
        onClick={handleInstallClick} 
        className="bg-blue-900 text-white px-4 py-2 rounded-lg mb-6 shadow-md hover:bg-blue-950 hidden"
      >
        📲 INSTALÁ LA APP EN TU DISPOSITIVO!
      </button>

      {/* Sección de enlaces */}
      <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
        {links.map((item, index) => (
          <a 
            key={index} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-gray-800 text-center"
          >
            {/* Imagen con fondo transparente */}
            <div className="w-full h-40 flex items-center justify-center" style={{ backgroundColor: "transparent" }}>
              <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
            </div>

            {/* Texto del botón con azul oscuro personalizado */}
            <div className="p-4 text-lg font-bold italic text-white uppercase" style={{ backgroundColor: "#001f3f" }}>
              {item.title}
            </div>
          </a>
        ))}
      </div>

      {/* Espacio final para scroll */}
      <div style={{ height: "60px" }} />
    </div>
  );
}

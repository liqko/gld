import { useEffect } from "react";
import { links } from "./data";

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
      className="flex flex-col items-center p-4 min-h-screen w-full bg-cover bg-center text-center"
      style={{
        backgroundImage: "url('fondo.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {/* LOGO ocultado */}

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
            <div className="w-full h-40 flex items-center justify-center" style={{ backgroundColor: "#00b200" }}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-lg font-bold italic uppercase" style={{ color: "#000000", backgroundColor: "#00b200" }}>
              {item.title}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}


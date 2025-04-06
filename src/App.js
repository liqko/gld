import React, { useEffect } from "react";

const links = [
  {
    title: "Programación - Enlaces",
    url: "https://www.guialocaldolores.com.ar/acp",
    image: "logo.png"
  },
  {
    title: "Radio Online",
    url: "https://server.radiostreaming.com.ar/8174/stream",
    image: "radio.png"
  },
  {
    title: "Streaming",
    url: "https://www.youtube.com/@acpcontenidos",
    image: "streaming.png"
  },
  {
    title: "Blog",
    url: "https://www.guialocaldolores.com.ar/acp-blog/",
    image: "blog.png"
  }
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
      className="flex flex-col items-center p-4 min-h-screen w-full bg-cover bg-center text-center"
      style={{ backgroundImage: "url('fondo.jpg')", backgroundSize: "cover", backgroundAttachment: "fixed" }}
    >
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
            <div className="w-full h-40 flex items-center justify-center bg-black">
              <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
            </div>
            <div className="p-4 text-lg font-bold italic text-white uppercase bg-blue-900">
              {item.title}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect } from "react";

const links = [
  { title: "TURISMO", url: "https://www.guialocaldolores.com.ar/turismo", image: "turismo.png" },
  { title: "INDUSTRIAS, COMERCIOS Y SERVICIOS", url: "https://www.guialocaldolores.com.ar/industria-comercios-y-servicios/", image:"com.png" },
  { title: "CULTURA LOCAL", url: "https://www.guialocaldolores.com.ar/cultura/", image: "cultura.png" },
  { title: "ORGANIZACIONES DE LA SOCIEDAD CIVIL", url: "https://www.guialocaldolores.com.ar/osc/", image: "osc.png" },
  { title: "GOBIERNO Y SERVICIOS PÚBLICOS", url: "https://www.guialocaldolores.com.ar/gobierno-y-servicios-p%C3%BAblicos/", image: "gob.png" }
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
      className="flex flex-col items-center p-4 min-h-screen w-full bg-cover bg-center bg-no-repeat justify-center text-center" 
      style={{ backgroundImage: "url('fondo.jpg')", backgroundSize: "cover" }}
    >
      {/* Logo de la empresa */}
      <img src="logo.png" alt="Logo Empresa" className="w-24 mb-6 rounded-lg shadow-md" />
      
      {/* Botón de instalación */}
      <button 
        id="installButton" 
        onClick={handleInstallClick} 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6 shadow-md hover:bg-blue-700 hidden"
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
            {/* Imagen con object-contain para que se vea completa */}
            <div className="w-full h-40 flex items-center justify-center bg-black">
              <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
            </div>

            {/* Texto del botón */}
            <div className="p-4 text-lg font-bold italic text-white uppercase bg-red-500">
              {item.title}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;

  const installButton = document.createElement("button");
  installButton.innerText = "Instalar la aplicación";
  installButton.style.position = "fixed";
  installButton.style.bottom = "20px";
  installButton.style.right = "20px";
  installButton.style.padding = "10px";
  installButton.style.background = "#007bff";
  installButton.style.color = "white";
  installButton.style.border = "none";
  installButton.style.borderRadius = "5px";
  installButton.style.cursor = "pointer";

  document.body.appendChild(installButton);

  installButton.addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("Usuario instaló la app");
      }
      deferredPrompt = null;
    });
  });
});


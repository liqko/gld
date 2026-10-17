import React, { useEffect } from "react";
import "./App.css";

// The platform owns authentication and preferred-city recovery.
// Every app launch must use the same public entry as the browser.
const HOME_URL = "https://www.guialocal.ar/";

export default function App() {
  useEffect(() => {
    window.location.replace(HOME_URL);
  }, []);

  return (
    <main className="app-shell app-entry-loading app-entry-simple">
      <section className="entry-splash" aria-label="Ingresando a Guía Local">
        <img className="entry-splash-logo" src="/logo.png" alt="Guía Local" />
      </section>
    </main>
  );
}

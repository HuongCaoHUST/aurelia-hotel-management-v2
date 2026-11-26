import { useEffect } from "react";
import HomePage from "../pages/HomePage.jsx";

const LEGACY_SCRIPTS = [
  "/js/plugins.js",
  "/js/designesia.js",
  "/js/swiper.js",
  "/js/custom-marquee.js",
  "/js/custom-swiper-2.js",
];

let legacyScriptsPromise;
function loadLegacyScripts() {
  if (legacyScriptsPromise) return legacyScriptsPromise;
  legacyScriptsPromise = LEGACY_SCRIPTS.reduce((previous, src) => previous.then(() => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-aurelia-script="${src}"]`);
    if (existing?.dataset.loaded === "true") { resolve(); return; }
    const script = existing || document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.aureliaScript = src;
    script.onload = () => { script.dataset.loaded = "true"; resolve(); };
    script.onerror = () => reject(new Error(`Could not load theme script: ${src}`));
    if (!existing) document.body.appendChild(script);
  })), Promise.resolve()).then(() => {
    // The theme registers a window "load" handler. Dynamic scripts can finish after that event.
    if (document.readyState === "complete") {
      window.dispatchEvent(new Event("load"));
    }
  });
  return legacyScriptsPromise;
}

export default function App() {
  useEffect(() => {
    loadLegacyScripts().catch((error) => console.error(error));
  }, []);

  return <HomePage />;
}

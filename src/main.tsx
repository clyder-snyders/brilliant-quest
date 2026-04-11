import { createRoot } from "react-dom/client";
import { inject } from '@vercel/analytics';
import App from "./App.tsx";
import "./index.css";

// Initialize Vercel Analytics (only in production, lightweight)
inject({ mode: import.meta.env.PROD ? 'production' : 'development' });

// PWA: Unregister service workers in preview/iframe contexts
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();
const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if (isPreviewHost || isInIframe) {
  navigator.serviceWorker?.getRegistrations().then(regs =>
    regs.forEach(r => r.unregister())
  );
}

createRoot(document.getElementById("root")!).render(<App />);

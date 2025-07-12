import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./router";

// Importe le provider ShadowTrace
import { ShadowTraceProvider } from 'shadowtrace';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const config = {
  transports: ['http' as const],
  httpConfig: {
    endpoint: `${VITE_API_URL}/trace`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
    retries: 3,
    batchSize: 10
  },
  autoTrack: true, // Active l'auto-tracking
  autoTrackConfig: {
    clicks: false,
    inputs: false,
    scrolls: false,
    navigation: true,
    errors: true, // ✅ Capture automatique des erreurs JS
    performance: false, // ✅ Capture des métriques de performance
    selectors: {
      ignore: ['[data-shadow-ignore]', '.shadow-ignore'],
      track: []
    }
  },
  bufferSize: 100,
  flushInterval: 5000,
  debug: false, // Pour voir les logs en développement
  level: 'debug' as const,
  onError: (error: Error) => {
    console.error("ShadowTrace internal error:", error);
  },
  apiDuplicateDetection: {
    enabled: true,
    windowMs: 10000,   // 10 secondes
    threshold: 2
  }
  
};



// Define routes in main.tsx and pass them to Router
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ShadowTraceProvider config={config}>
      <Router />
    </ShadowTraceProvider>
  </StrictMode>
);

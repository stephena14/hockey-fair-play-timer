import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/hockey-fair-play-timer/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["pwa-192x192.png", "pwa-512x512.png", "apple-touch-icon.png"],
      manifest: {
        name: "Hockey Fair Play Timer",
        short_name: "Hockey Timer",
        description: "Track hockey shifts and fair play ice time.",
        theme_color: "#020617",
        background_color: "#020617",
        display: "standalone",
        scope: "/hockey-fair-play-timer/",
        start_url: "/hockey-fair-play-timer/",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      }
    })
  ],
});

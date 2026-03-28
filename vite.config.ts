import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

function stripWorkerPreloadHelper(): Plugin {
  return {
    name: "strip-worker-preload-helper",
    apply: "build",
    generateBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (
          chunk.type === "chunk" &&
          fileName.includes("search-worker-entry")
        ) {
          chunk.code = chunk.code.replace(
            /import\s*\{[^}]*\}\s*from\s*"[^"]*preload-helper[^"]*";\s*/g,
            "",
          );
          chunk.code = chunk.code.replace(
            /await e\((\(\)=>import\("[^"]+"\)),\s*[^)]*\)/g,
            "await ($1)()",
          );
        }
      }
    },
  };
}

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
    stripWorkerPreloadHelper(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        id: "cubit",
        name: "Cubit",
        short_name: "Cubit",
        theme_color: "#0076cc",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }) as Plugin[],
  ],
  optimizeDeps: {
    exclude: ["cubing"],
  },
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name.includes("search-worker-entry")) {
            return "assets/search-worker-entry.js";
          }
          return "assets/[name]-[hash].js";
        },
      },
    },
  },
  worker: {
    format: "es",
  },
});

export default config;

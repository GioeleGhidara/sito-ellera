import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('leaflet')) return 'vendor-maps';
          if (id.includes('framer-motion')) return 'vendor-ui';
          if (id.includes('@supabase')) return 'vendor-db';
          if (id.includes('react-social-media-embed')) return 'vendor-embed';
          if (id.includes('react-icons')) return 'vendor-icons';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router')) return 'vendor-react';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));

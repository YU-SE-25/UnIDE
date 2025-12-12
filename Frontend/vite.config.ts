import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  worker: {
    format: "es",
  },
  optimizeDeps: {
    include: ["monaco-editor"],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["unide.kro.kr"],
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/images": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});

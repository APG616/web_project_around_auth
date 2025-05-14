import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://se-register-api.en.tripleten-services.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v1')
      }
  
  },
  resolve: {
    alias: {
      "@images": path.resolve(__dirname, "images"),
    },
  },
});

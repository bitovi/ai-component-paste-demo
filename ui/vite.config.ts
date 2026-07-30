import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  // In production the server serves this build same-origin; in dev, proxy the
  // API call to the local server so the same relative path works.
  server: {
    proxy: {
      "/extract-form-data": "http://localhost:3000",
    },
  },
});

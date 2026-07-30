import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  // In dev the API call is same-origin, so proxy it to the local server. In
  // production VITE_API_URL points at the API server's own domain instead.
  server: {
    proxy: {
      "/extract-form-data": "http://localhost:3000",
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add specific configuration to handle the error overlay issue
  server: {
    hmr: {
      // Increase HMR timeout to prevent potential race conditions
      timeout: 5000,
    },
    watch: {
      // Use polling for more reliable file watching (optional, try if issues persist)
      // usePolling: true,
      // interval: 1000
    },
  },
  build: {
    // Ensure we don't have minification issues
    sourcemap: true,
  },
  // Improve error handling
  optimizeDeps: {
    // Pre-bundle these dependencies to avoid issues
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "lucide-react",
    ],
  },
});

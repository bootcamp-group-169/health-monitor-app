import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: ["langchain"],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material", "@mui/lab"],
          charts: ["recharts"],
          ai: ["@google/generative-ai", "@langchain/google-genai"],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-router")) return "router";
          if (id.includes("react")) return "react-vendor";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("recharts")) return "charts";
          if (
            id.includes("jspdf") ||
            id.includes("html2canvas") ||
            id.includes("jspdf-autotable")
          ) {
            return "pdf-tools";
          }
        },
      },
    },
  },
  define: {
    // Ensure React is available globally for recharts
    "process.env": {},
  },
  optimizeDeps: {
    include: ["react", "react-dom", "recharts"],
  },
});

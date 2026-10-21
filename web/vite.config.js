import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));

// Upstream keeps this app's entry point in src/ rather than the package root.
export default defineConfig({
  root: resolve(packageRoot, "src"),
  plugins: [react()],
  build: { outDir: resolve(packageRoot, "dist"), emptyOutDir: true },
});
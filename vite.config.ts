import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/start/plugin";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    port: 5173,
    host: "localhost",
  },
});

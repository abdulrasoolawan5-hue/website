import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite(),
    viteReact(),
  ],
  server: {
    port: 5173,
    host: "localhost",
  },
});

import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    viteReact(),
  ],
  server: {
    port: 5173,
    host: "localhost",
  },
  ssr: {
    noExternal: ["@tanstack/react-router"],
  },
});

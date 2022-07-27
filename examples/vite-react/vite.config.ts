import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createDeployLogPlugin } from "vite-plugin-deploy-log";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createDeployLogPlugin()],
});

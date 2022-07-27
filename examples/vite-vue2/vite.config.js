import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { createDeployLogPlugin } from "vite-plugin-deploy-log";

export default defineConfig({
  plugins: [createVuePlugin(), createDeployLogPlugin()],
});

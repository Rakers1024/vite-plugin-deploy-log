import Vue from "vue";
import App from "./../App.vue";

new Vue({
  el: "#app",
  render: h => h(App),
}).$mount();

import { showDeployLog } from "vite-plugin-deploy-log";
import.meta.env.MODE == "production" && showDeployLog();

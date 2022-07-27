import Vue from "vue";
import App from "./../App.vue";

new Vue({
  el: "#app",
  render: h => h(App),
}).$mount();

if (import.meta.env.MODE == "production") {
  import("vite-plugin-deploy-log").then(({ showDeployLog }) => {
    showDeployLog();
  });
}

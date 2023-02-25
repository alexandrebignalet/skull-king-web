import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/modules/firebase/firebase.module";
import { watchCurrentUserAuthState } from "@/modules/auth/auth.module";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./app.css";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

watchCurrentUserAuthState()
  .then(() => {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  })
  .catch(() => router.push({ name: "auth" }));

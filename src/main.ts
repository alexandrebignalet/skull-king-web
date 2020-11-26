import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/modules/firebase/firebase.module";
import { watchCurrentUserAuthState } from "@/modules/auth/auth.module";

Vue.config.productionTip = false;

watchCurrentUserAuthState().then(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
});

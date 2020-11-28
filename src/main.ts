import "@/router/component-hooks";
import Vue from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "@/antd.less";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/axios.auth-interceptor";
import "@/modules/firebase/firebase.module";
import { watchCurrentUserAuthState } from "@/modules/auth/auth.module";

Vue.config.productionTip = false;

Vue.use(Antd);

watchCurrentUserAuthState().then(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
});

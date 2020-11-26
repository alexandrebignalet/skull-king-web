import { RouteConfig } from "vue-router";
import Login from "@/modules/auth/Login.vue";
import store from "@/store";
import Register from "@/modules/auth/Register.vue";

const routes: RouteConfig[] = [
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: async (to, from, next) => {
      store.getters["auth/isAuthenticated"] ? next({ path: "/" }) : next();
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    beforeEnter: (to, from, next) => {
      store.getters["auth/isAuthenticated"] ? next({ path: "/" }) : next();
    }
  }
];

export default routes;

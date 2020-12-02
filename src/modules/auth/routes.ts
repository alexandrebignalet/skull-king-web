import { RouteConfig } from "vue-router";
import Auth from "@/modules/auth/Auth.vue";
import store from "@/store";

const routes: RouteConfig[] = [
  {
    path: "/auth",
    name: "auth",
    component: Auth,
    beforeEnter(to, from, next) {
      if (store.getters["auth/isAuthenticated"]) {
        next({ name: "game_rooms" });
      } else {
        next();
      }
    }
  }
];

export default routes;

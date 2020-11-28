import Vue from "vue";
import VueRouter, { RawLocation, Route, RouteConfig } from "vue-router";
import Home from "../modules/site/home/Home.vue";
import gameRoomsRoutes from "@/modules/game_room/routes";
import Component from "vue-class-component";
import store from "@/store";
import Auth from "@/modules/auth/Auth.vue";

Vue.use(VueRouter);

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate"
]);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "/",
        name: "auth",
        component: Auth
      },
      ...gameRoomsRoutes
    ],
    redirect: (to: Route) => {
      if (store.getters["auth/isAuthenticated"])
        return { name: "game_rooms" } as RawLocation;
      else return { name: to.name } as RawLocation;
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

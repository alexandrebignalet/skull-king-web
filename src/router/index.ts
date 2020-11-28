import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../modules/site/home/Home.vue";
import gameRoomsRoutes from "@/modules/game_room/routes";
import Auth from "@/modules/auth/Auth.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Home,
    children: [...gameRoomsRoutes]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

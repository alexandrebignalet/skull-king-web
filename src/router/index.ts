import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../modules/site/home/Home.vue";
import gameRoomsRoutes from "@/modules/game_room/routes";
import skullKingRoutes from "@/modules/skullking/routes";
import authRoutes from "@/modules/auth/routes";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "",
    component: Home,
    children: [...authRoutes, ...gameRoomsRoutes]
  },
  ...skullKingRoutes,
  { path: "*", redirect: () => ({ name: "auth" }) }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

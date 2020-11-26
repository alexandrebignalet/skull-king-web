import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../modules/site/home/Home.vue";
import authRoutes from "@/modules/auth/routes";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  ...authRoutes,
  {
    path: "/",
    name: "Home",
    component: Home
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

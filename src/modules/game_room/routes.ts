import { RouteConfig } from "vue-router";
import store from "@/store";
import GameRooms from "@/modules/game_room/GameRooms.vue";

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "game_rooms",
    component: GameRooms,
    props: () => ({ gameRooms: store.getters["gameRoom/gameRooms"] }),
    beforeEnter: async (to, from, next) => {
      if (!store.getters["auth/isAuthenticated"]) return next();

      await store.dispatch("user/bindUser");
      await store.dispatch("gameRoom/bindGameRooms");
      next();
    }
  }
];

export default routes;

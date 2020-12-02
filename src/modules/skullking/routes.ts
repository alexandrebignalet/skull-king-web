import { RouteConfig } from "vue-router";
import store from "@/store";
import SkullKing from "@/modules/skullking/components/SkullKing.vue";

const routes: RouteConfig[] = [
  {
    path: "/game/:id",
    name: "game",
    component: SkullKing,
    props: to => ({
      game: store.getters["skullKing/game"],
      player: store.getters["player/currentPlayer"],
      currentUser: store.getters["user/currentUser"]
    }),
    beforeEnter: async (to, from, next) => {
      if (!store.getters["auth/isAuthenticated"]) return next({ name: "auth" });

      const userResult = await store.dispatch("user/bindUser");
      const gameResult = await store.dispatch(
        "skullKing/bindGame",
        to.params.id
      );
      const playerResult = await store.dispatch(
        "player/bindPlayer",
        to.params.id
      );

      if (userResult && gameResult && playerResult) next();
      else next({ name: "game_rooms" });
    }
  }
];

export default routes;

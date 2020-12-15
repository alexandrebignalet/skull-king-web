import { RouteConfig } from "vue-router";
import store from "@/store";
import GameRooms from "@/modules/game_room/GameRooms.vue";
import GameRoom from "@/modules/game_room/GameRoom.vue";
import GameRoomModel from "@/modules/game_room/game_room";

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "game_rooms",
    beforeEnter: async (to, from, next) => {
      if (!store.getters["auth/isAuthenticated"]) return next({ name: "auth" });
      const roomId = await store.dispatch("gameRoom/retrieveRedirection");
      if (roomId) return next({ name: "game_room", params: { id: roomId } });

      const room = await store.dispatch("gameRoom/createGameRoom");

      next();
    }
  },
  {
    path: "/:id",
    name: "game_room",
    component: GameRoom,
    props: to => ({
      room: store.getters["gameRoom/gameRoom"](to.params.id),
      currentUser: store.getters["user/currentUser"]
    }),
    beforeEnter: async (to, from, next) => {
      if (!store.getters["auth/isAuthenticated"]) return next({ name: "auth" });

      await store.dispatch("user/bindUser");
      await store.dispatch("gameRoom/bindGameRooms");
      next();
    }
  },
  {
    path: "/:id/join",
    name: "game_room_join",
    beforeEnter: async (to, from, next) => {
      const roomId = to.params.id;

      if (!store.getters["auth/isAuthenticated"]) {
        await store.dispatch("gameRoom/redirectToGameRoom", roomId);
        return next({ name: "auth" });
      }

      await store.dispatch("user/bindUser");
      await store.dispatch("gameRoom/bindGameRooms");

      const userRooms = store.getters["user/currentUser"].rooms.map(
        (r: GameRoomModel) => r.id
      );
      if (!userRooms.includes(roomId)) {
        await store.dispatch("gameRoom/joinGameRoom", roomId);
      }

      next({ name: "game_room", params: { id: roomId } });
    }
  }
];

export default routes;

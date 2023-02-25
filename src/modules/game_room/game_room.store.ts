import { Module } from "vuex";
import { firebaseAction } from "vuexfire";
import db from "@/modules/firebase/firebase.module";
import GameRoom from "@/modules/game_room/game_room";
import { User } from "@/modules/auth/auth.store";
import {
  CreateGameRoomForm,
  variants
} from "@/modules/game_room/GameRooms.vue";

const gameRoomStore: Module<any, any> = {
  namespaced: true,

  state: {
    list: []
  },

  getters: {
    gameRooms: (state: any, getters, rootState, rootGetters) =>
      state.list
        .map((it: any) => GameRoom.of(it))
        .sort(
          (roomA: GameRoom, roomB: GameRoom) =>
            roomB.creationDate - roomA.creationDate
        )
        .sort((roomA: GameRoom, roomB: GameRoom) => {
          const currentUser = rootGetters["user/currentUser"];

          const userInA = roomA.hasUser(currentUser);
          const userInB = roomB.hasUser(currentUser);

          if (userInA && userInB) return 0;
          if (userInA) return -1;
          else return 1;
        })
  },

  actions: {
    async createGameRoom({ rootGetters }, form: CreateGameRoomForm) {
      const user: User = rootGetters["auth/user"];
      return fetch(`${process.env.VUE_APP_SERVER_BASE_URL}/game_rooms`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.idToken}`
        },
        body:
          form.variant === variants.CLASSIC
            ? undefined
            : JSON.stringify({
                // eslint-disable-next-line @typescript-eslint/camelcase
                with_kraken: form.kraken,
                // eslint-disable-next-line @typescript-eslint/camelcase
                with_whale: form.whiteWhale,
                // eslint-disable-next-line @typescript-eslint/camelcase
                with_butins: form.butins
              })
      }).catch(err => console.error(err));
    },

    async joinGameRoom({ rootGetters }, gameRoomId) {
      const user: User = rootGetters["auth/user"];
      return fetch(
        `${process.env.VUE_APP_SERVER_BASE_URL}/game_rooms/${gameRoomId}/users`,
        {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.idToken}`
          }
        }
      ).catch(err => console.error(err));
    },

    async kickFromGameRoom({ rootGetters }, { gameRoomId, userId }) {
      const user: User = rootGetters["auth/user"];
      return fetch(
        `${process.env.VUE_APP_SERVER_BASE_URL}/game_rooms/${gameRoomId}/users/${userId}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${user.idToken}`
          }
        }
      ).catch(err => console.error(err));
    },

    async startGame({ rootGetters }, gameRoomId) {
      const user: User = rootGetters["auth/user"];

      return fetch(
        `${process.env.VUE_APP_SERVER_BASE_URL}/game_rooms/${gameRoomId}/launch`,
        {
          mode: "cors",
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.idToken}`
          }
        }
      ).catch(err => console.error(err));
    },

    bindGameRooms: firebaseAction(({ bindFirebaseRef }) => {
      return bindFirebaseRef("list", db.ref(`game_rooms`));
    })
  }
};

export default gameRoomStore;

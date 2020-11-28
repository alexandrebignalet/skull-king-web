import { Module } from "vuex";
import { firebaseAction } from "vuexfire";
import db from "@/modules/firebase/firebase.module";
import axios from "axios";
import GameRoom from "@/modules/game_room/game_room";

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
    async createGameRoom() {
      return axios
        .post(`${process.env.VUE_APP_SERVER_BASE_URL}/game_rooms`)
        .catch(err => console.error(err));
    },

    async joinGameRoom(_, gameRoomId) {
      return axios
        .post(
          `${process.env.VUE_APP_SERVER_BASE_URL}/game_rooms/${gameRoomId}/users`
        )
        .catch(err => console.error(err));
    },

    async kickFromGameRoom(_, { gameRoomId, userId }) {
      return axios
        .delete(
          `${process.env.VUE_APP_SERVER_BASE_URL}/game_rooms/${gameRoomId}/users/${userId}`
        )
        .catch(err => console.error(err));
    },

    async startGame(_, gameRoomId) {
      return axios
        .post(
          `${process.env.VUE_APP_SERVER_BASE_URL}/game_rooms/${gameRoomId}/launch`
        )
        .catch(err => console.error(err));
    },

    bindGameRooms: firebaseAction(({ bindFirebaseRef, rootGetters }) => {
      const currentUserId = rootGetters["auth/user"].id;
      return bindFirebaseRef("list", db.ref(`game_rooms`));
    })
  }
};

export default gameRoomStore;

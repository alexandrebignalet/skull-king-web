import { Module } from "vuex";
import { firebaseAction } from "vuexfire";
import db from "@/modules/firebase/firebase.module";
import axios from "axios";
import GameRoom from "@/modules/game_room/game_room";

const ROOM_REDIRECTION_KEY = "room_id_redirection";

const gameRoomStore: Module<any, any> = {
  namespaced: true,

  state: {
    list: []
  },

  getters: {
    gameRooms: (state: any) =>
      state.list
        .map((it: any) => GameRoom.of(it))
        .sort(
          (roomA: GameRoom, roomB: GameRoom) =>
            roomB.creationDate - roomA.creationDate
        ),
    gameRoom: (state: any, getters) => (roomId: string) =>
      getters.gameRooms.find((r: GameRoom) => r.id === roomId)
  },

  actions: {
    async retrieveRedirection() {
      const roomId = localStorage.getItem(ROOM_REDIRECTION_KEY);
      localStorage.removeItem(ROOM_REDIRECTION_KEY);
      return roomId;
    },

    async redirectToGameRoom(_, roomId) {
      localStorage.setItem(ROOM_REDIRECTION_KEY, roomId);
    },

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
      return bindFirebaseRef("list", db.ref(`users/${currentUserId}/rooms`));
    })
  }
};

export default gameRoomStore;

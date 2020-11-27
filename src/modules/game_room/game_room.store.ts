import { Module } from "vuex";
import { firebaseAction } from "vuexfire";
import db from "@/modules/firebase/firebase.module";
import axios from "axios";

const gameRoomStore: Module<any, any> = {
  namespaced: true,

  state: {
    list: {}
  },

  getters: {
    gameRooms: (state: any) => state.list
  },

  actions: {
    createGameRoom: () => {
      return axios
        .post("http://localhost:8080/skullking/game_rooms")
        .then(response => console.log(response))
        .catch(err => console.error(err));
    },

    bindGameRooms: firebaseAction(({ bindFirebaseRef, rootGetters }) => {
      const currentUserId = rootGetters["auth/user"].id;
      return bindFirebaseRef("list", db.ref(`users/${currentUserId}/rooms`));
    })
  }
};

export default gameRoomStore;

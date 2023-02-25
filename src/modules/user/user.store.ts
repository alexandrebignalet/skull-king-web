import { Module } from "vuex";
import { firebaseAction } from "vuexfire";
import db from "@/modules/firebase/firebase.module";
import GameUser, { RawUser } from "@/modules/game_room/game_user";

type GameRoomState = {
  user: RawUser | null;
};

const gameRoomStore: Module<GameRoomState, any> = {
  namespaced: true,

  state: {
    user: null
  },

  getters: {
    currentUser: (state: GameRoomState) =>
      state.user == null ? null : GameUser.of(state.user)
  },

  actions: {
    bindUser: firebaseAction(({ bindFirebaseRef, rootGetters }) => {
      const currentUserId = rootGetters["auth/user"].id;
      return bindFirebaseRef("user", db.ref(`users/${currentUserId}`));
    })
  }
};

export default gameRoomStore;

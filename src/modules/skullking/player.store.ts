import { Module } from "vuex";
import { firebaseAction } from "vuexfire";
import db from "@/modules/firebase/firebase.module";
import SkullKing from "@/modules/skullking/model/skullking";
import Player from "@/modules/skullking/model/player";

const PLAYER_REF = "player";

const skullKingStore: Module<any, any> = {
  namespaced: true,

  state: {
    player: null
  },

  getters: {
    currentPlayer: (state: any) =>
      state.player ? Player.of(state.player) : null
  },

  actions: {
    bindPlayer: firebaseAction(
      async ({ bindFirebaseRef, unbindFirebaseRef, rootGetters }, gameId) => {
        const currentUser = rootGetters["user/currentUser"];
        const bindResult = await bindFirebaseRef(
          PLAYER_REF,
          db.ref(`players/${gameId}_${currentUser.id}`)
        );

        if (bindResult.val()) return bindResult;
        return unbindFirebaseRef(PLAYER_REF);
      }
    )
  }
};

export default skullKingStore;

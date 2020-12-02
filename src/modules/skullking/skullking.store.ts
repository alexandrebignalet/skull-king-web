import { Module } from "vuex";
import { firebaseAction } from "vuexfire";
import db from "@/modules/firebase/firebase.module";
import SkullKing from "@/modules/skullking/model/skullking";
import axios from "axios";

const GAME_REF = "game";
const skullKingStore: Module<any, any> = {
  namespaced: true,

  state: {
    game: null
  },

  getters: {
    game: (state: any) => (state.game ? SkullKing.of(state.game) : null)
  },

  actions: {
    async announce({ getters, rootGetters }, count) {
      const gameId = getters.game.id;
      const currentPlayer = rootGetters["player/currentPlayer"];
      return axios
        .post(
          `${process.env.VUE_APP_SERVER_BASE_URL}/games/${gameId}/players/${currentPlayer.id}/announce`,
          { count }
        )
        .catch(err => console.error(err));
    },

    async playCard({ getters }, { playerId, card }) {
      const gameId = getters.game.id;
      return axios
        .post(
          `${process.env.VUE_APP_SERVER_BASE_URL}/games/${gameId}/players/${playerId}/play`,
          { card }
        )
        .catch(err => console.error(err));
    },

    bindGame: firebaseAction(
      async ({ bindFirebaseRef, unbindFirebaseRef }, gameId) => {
        const bindResult = await bindFirebaseRef(
          GAME_REF,
          db.ref(`games/${gameId}`)
        );
        if (bindResult.val()) return bindResult;
        return unbindFirebaseRef(GAME_REF);
      }
    )
  }
};

export default skullKingStore;

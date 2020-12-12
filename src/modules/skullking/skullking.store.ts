import { Module } from "vuex";
import { firebaseAction } from "vuexfire";
import db from "@/modules/firebase/firebase.module";
import SkullKing from "@/modules/skullking/model/skullking";
import axios from "axios";
import { withLoading } from "@/modules/site/site.store";
import SkullKingRepository from "@/modules/skullking/skullking.repository";

const repository = new SkullKingRepository(axios);

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
    announce: withLoading(async ({ getters, rootGetters }: any, count: any) => {
      const gameId = getters.game.id;
      const currentPlayer = rootGetters["player/currentPlayer"];
      return axios.post(
        `${process.env.VUE_APP_SERVER_BASE_URL}/games/${gameId}/players/${currentPlayer.id}/announce`,
        { count }
      );
    }),

    playCard: withLoading(async ({ getters }: any, { playerId, card }: any) =>
      repository.playCard({ gameId: getters.game.id, playerId, card })
    ),

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

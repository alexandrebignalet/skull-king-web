import { Module } from "vuex";
import { firebaseAction } from "vuexfire";
import db from "@/modules/firebase/firebase.module";
import SkullKing from "@/modules/skullking/model/skullking";
import { withLoading } from "@/modules/site/site.store";
import SkullKingRepository from "@/modules/skullking/skullking.repository";
import { User } from "@/modules/auth/auth.store";

const repository = new SkullKingRepository();

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
      const user: User = rootGetters["auth/user"];
      const url = `${process.env.VUE_APP_SERVER_BASE_URL}/games/${gameId}/players/${currentPlayer.id}/announce`;

      return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.idToken}`
        },
        body: JSON.stringify({ count })
      });
    }),

    playCard: withLoading(
      async ({ getters, rootGetters }: any, { playerId, card }: any) => {
        const user: User = rootGetters["auth/user"];
        return repository.playCard(
          user.idToken,
          getters.game.id,
          playerId,
          card
        );
      }
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

import firebase from "firebase";
import { Module } from "vuex";
import router from "../../router";
import GameUser from "@/modules/game_room/game_user";

const CLEAR_USER = "CLEAR_USER";
const UPDATE_USER = "UPDATE_USER";

const authStore: Module<any, any> = {
  namespaced: true,

  state: {
    user: null
  },

  getters: {
    isAuthenticated: (state: any) => state.user !== null,
    user: (state: any) => (state.user ? GameUser.of(state.user) : null)
  },

  mutations: {
    [CLEAR_USER](state: any) {
      state.user = null;
    },
    [UPDATE_USER](state: any, userInfo) {
      state.user = {
        ...state.user,
        ...userInfo
      };
    }
  },

  actions: {
    signInAnonymously: async ({ dispatch }, { pseudo, avatarURL }) => {
      return firebase
        .auth()
        .signInAnonymously()
        .then(async (data: firebase.auth.UserCredential) => {
          await dispatch("updateUserProfile", {
            user: data.user,
            pseudo,
            avatarURL
          });
          return router.push({ name: "game_rooms" });
        })
        .catch(error => {
          throw error;
        });
    },

    async fetchUser(
      { commit },
      { user, idToken }: { user: firebase.User; idToken: string }
    ) {
      if (user) {
        commit(UPDATE_USER, {
          pseudo: user.displayName,
          avatarURL: user.photoURL,
          idToken,
          id: user.uid
        });
      } else {
        commit(UPDATE_USER, null);
      }
    },

    async updateUserProfile({ commit }, { user, pseudo, avatarURL }) {
      return user
        ?.updateProfile({ displayName: pseudo, photoURL: avatarURL })
        .then(() => {
          commit(UPDATE_USER, { pseudo, avatarURL, id: user.uid });
        })
        .catch((err: { message: string }) => {
          throw err;
        });
    }
  }
};

export default authStore;

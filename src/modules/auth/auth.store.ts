import firebase from "firebase";
import { Module } from "vuex";
import UserCredential = firebase.auth.UserCredential;
import router from "../../router";

const UPDATE_USER = "UPDATE_USER";
const SET_AUTH_ERROR = "SET_AUTH_ERROR";

const authStore: Module<any, any> = {
  namespaced: true,

  state: {
    user: null,
    error: null
  },

  getters: {
    error: (state: any) => state.error,
    isAuthenticated: (state: any) => state.user !== null
  },

  mutations: {
    [UPDATE_USER](state: any, userInfo) {
      state.user = {
        ...state.user,
        ...userInfo
      };
    },
    [SET_AUTH_ERROR](state: any, errorMessage) {
      state.error = errorMessage;
    }
  },

  actions: {
    async login({ commit }, { email, password }) {
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(({ user }: UserCredential) => {
          commit(UPDATE_USER, { name: user?.displayName, email: user?.email });
          commit(SET_AUTH_ERROR, null);
          return router.push("/");
        })
        .catch((err: { message: string }) => {
          commit(SET_AUTH_ERROR, err.message);
        });
    },

    async register({ commit, dispatch }, { email, name, password }) {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((data: firebase.auth.UserCredential) => {
          dispatch("updateUserProfile", { user: data.user, email, name });
        })
        .catch(err => {
          commit(SET_AUTH_ERROR, err.message);
        });
    },

    async fetchUser(
      { commit },
      { user, idToken }: { user: firebase.User; idToken: string }
    ) {
      if (user) {
        commit(UPDATE_USER, {
          name: user.displayName,
          email: user.email,
          idToken
        });
      } else {
        commit(UPDATE_USER, null);
      }
    },

    async updateUserProfile({ commit }, { user, email, name }) {
      user
        ?.updateProfile({ displayName: name })
        .then(() => {
          commit(UPDATE_USER, { name, email });
        })
        .catch((err: { message: string }) => {
          commit(SET_AUTH_ERROR, err.message);
        });
    }
  }
};

export default authStore;

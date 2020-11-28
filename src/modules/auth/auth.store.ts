import firebase from "firebase";
import { Module } from "vuex";
import UserCredential = firebase.auth.UserCredential;
import router from "../../router";
import { ErrorType } from "@/modules/auth/error-type.enum";

const CLEAR_USER = "CLEAR_USER";
const UPDATE_USER = "UPDATE_USER";
const SET_AUTH_ERROR = "SET_AUTH_ERROR";

const authStore: Module<any, any> = {
  namespaced: true,

  state: {
    user: null,
    errors: Object.keys(ErrorType).reduce(
      (acc, type) => ({ ...acc, [type]: null }),
      {}
    )
  },

  getters: {
    errorOf: (state: any) => (key: ErrorType) => state.errors[key],
    isAuthenticated: (state: any) => state.user !== null,
    user: (state: any) => state.user
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
    },
    [SET_AUTH_ERROR](state: any, { key, message }) {
      const update = message ? { message, closeAfter: 5000 } : null;
      state.errors = {
        ...state.errors,
        [key]: update
      };
    }
  },

  actions: {
    async login({ commit }, { email, password }) {
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(({ user }: UserCredential) => {
          commit(UPDATE_USER, {
            name: user?.displayName,
            email: user?.email,
            id: user?.uid
          });
          commit(SET_AUTH_ERROR, { key: ErrorType.LOGIN, message: null });
          return router.push({ name: "game_rooms" });
        })
        .catch((err: { message: string }) => {
          commit(SET_AUTH_ERROR, {
            key: ErrorType.LOGIN,
            message: err.message
          });

          throw err;
        });
    },

    async register({ commit, dispatch }, { email, name, password }) {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (data: firebase.auth.UserCredential) => {
          await dispatch("updateUserProfile", { user: data.user, email, name });
          commit(SET_AUTH_ERROR, { key: ErrorType.REGISTER, message: null });
          return router.push({ name: "game_rooms" });
        })
        .catch(err => {
          commit(SET_AUTH_ERROR, {
            key: ErrorType.REGISTER,
            message: err.message
          });
          throw err;
        });
    },

    async logout({ commit }) {
      return firebase
        .auth()
        .signOut()
        .then(() => {
          commit(CLEAR_USER);
          return router.push({ name: "auth" });
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
          idToken,
          id: user.uid
        });
      } else {
        commit(UPDATE_USER, null);
      }
    },

    async updateUserProfile({ commit }, { user, email, name }) {
      return user
        ?.updateProfile({ displayName: name })
        .then(() => {
          commit(UPDATE_USER, { name, email, id: user.uid });
          commit(SET_AUTH_ERROR, {
            key: [ErrorType.UPDATE_USER],
            message: null
          });
        })
        .catch((err: { message: string }) => {
          commit(SET_AUTH_ERROR, {
            key: [ErrorType.UPDATE_USER],
            message: err.message
          });
        });
    }
  }
};

export default authStore;

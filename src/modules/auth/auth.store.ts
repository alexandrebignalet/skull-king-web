import firebase from "firebase";
import { Module } from "vuex";
import router from "../../router";
import { ErrorType, errorTypes } from "@/modules/auth/error-type.enum";
import UserCredential = firebase.auth.UserCredential;

const CLEAR_USER = "CLEAR_USER";
const UPDATE_USER = "UPDATE_USER";
const SET_AUTH_ERROR = "SET_AUTH_ERROR";

export type User = {
  id: string;
  idToken: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  errors: Record<ErrorType, string | null>;
};

const authStore: Module<AuthState, any> = {
  namespaced: true,

  state: {
    user: null,
    errors: Object.values(errorTypes).reduce(
      (acc, type: ErrorType) => ({ ...acc, [type]: null }),
      errorTypes
    )
  },

  getters: {
    errorOf: (state: AuthState) => (key: ErrorType) => state.errors[key],
    isAuthenticated: (state: AuthState) => state.user !== null,
    user: (state: AuthState) => state.user
  },

  mutations: {
    [CLEAR_USER](state: AuthState) {
      state.user = null;
    },
    [UPDATE_USER](state: AuthState, userInfo: User) {
      state.user = {
        ...state.user,
        ...userInfo
      };
    },
    [SET_AUTH_ERROR](
      state: AuthState,
      { key, message }: { key: ErrorType; message: string }
    ) {
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
          commit(SET_AUTH_ERROR, { key: errorTypes.LOGIN, message: null });
          return router.push({ name: "game_rooms" });
        })
        .catch((err: { message: string }) => {
          commit(SET_AUTH_ERROR, {
            key: errorTypes.LOGIN,
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
          commit(SET_AUTH_ERROR, { key: errorTypes.REGISTER, message: null });
          return router.push({ name: "game_rooms" });
        })
        .catch(err => {
          commit(SET_AUTH_ERROR, {
            key: errorTypes.REGISTER,
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
            key: [errorTypes.UPDATE_USER],
            message: null
          });
        })
        .catch((err: { message: string }) => {
          commit(SET_AUTH_ERROR, {
            key: [errorTypes.UPDATE_USER],
            message: err.message
          });
        });
    }
  }
};

export default authStore;

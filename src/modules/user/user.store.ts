import firebase from "firebase";
import { Module } from "vuex";
import UserCredential = firebase.auth.UserCredential;
import router from "../../router";
import { ErrorType } from "@/modules/auth/error-type.enum";
import { firebaseAction, firestoreAction } from "vuexfire";
import db from "@/modules/firebase/firebase.module";

const gameRoomStore: Module<any, any> = {
  namespaced: true,

  state: {
    user: null
  },

  getters: {
    currentUser: (state: any) => state.user
  },

  actions: {
    bindUser: firebaseAction(({ bindFirebaseRef, rootGetters }) => {
      const currentUserId = rootGetters["auth/user"].id;
      return bindFirebaseRef("user", db.ref(`users/${currentUserId}`));
    })
  }
};

export default gameRoomStore;

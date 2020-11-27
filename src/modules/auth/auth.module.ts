import firebase from "firebase";
import store from "@/store";

export function watchCurrentUserAuthState(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(async user => {
      const isAuthenticated = user !== null;

      if (isAuthenticated) {
        user
          ?.getIdToken(true)
          .then(async idToken => {
            await store.dispatch("auth/fetchUser", { user, idToken });
            resolve(isAuthenticated);
          })
          .catch(err => reject(err));
      } else {
        resolve(isAuthenticated);
      }
    });
  });
}

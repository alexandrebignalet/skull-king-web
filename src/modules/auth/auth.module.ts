import firebase from "firebase";
import store from "@/store";

if (process.env.NODE_ENV === "development")
  firebase.auth().useEmulator("http://localhost:9001/");

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

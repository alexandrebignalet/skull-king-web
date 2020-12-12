import { Module } from "vuex";
import store from "../../store";

const SET_LOADING = "SET_LOADING";

const siteStore: Module<any, any> = {
  namespaced: true,

  state: {
    loading: false
  },

  mutations: {
    [SET_LOADING]: (state, value: boolean) => {
      state.loading = value;
    }
  },

  getters: {
    isLoading: state => state.loading
  },

  actions: {
    changeLoading: ({ commit }, state: boolean) => {
      commit(SET_LOADING, state);
    }
  }
};

export default siteStore;

export function withLoading<T>(
  asyncFn: (...args: any) => Promise<T>
): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    await store.dispatch("site/changeLoading", true);
    return asyncFn(...args).finally(() =>
      store.dispatch("site/changeLoading", false)
    );
  };
}

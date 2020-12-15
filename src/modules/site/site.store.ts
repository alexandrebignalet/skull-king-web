import { Module } from "vuex";
import store from "../../store";
import { awaiter } from "@/modules/site/utils";

export function withLoading<T>(
  asyncFn: (...args: any) => Promise<T>
): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    await store.dispatch("site/loader", true);
    return asyncFn(...args).finally(() => {
      return store.dispatch("site/loader", false);
    });
  };
}

const SET_LOADING = "SET_LOADING";
const SET_AWAIT = "SET_AWAIT";

const siteStore: Module<any, any> = {
  namespaced: true,

  state: {
    loading: false,
    await: {}
  },

  mutations: {
    [SET_LOADING]: (state, value: boolean) => {
      state.loading = value;
    },

    [SET_AWAIT]: (state, { name, value }: { name: string; value: boolean }) => {
      state.await = {
        ...state.await,
        [name]: value
      };
    }
  },

  getters: {
    isActionNotAllowed: (state, getters) => state.loading || getters.isAwaiting,
    isLoading: state => state.loading,
    isAwaiting: state =>
      Object.values(state.await).reduce(
        (isAwaiting, value) => isAwaiting || value,
        false
      )
  },

  actions: {
    loader: ({ commit }, state: boolean) => {
      commit(SET_LOADING, state);
    },

    awaiter: async ({ commit, getters }, { name, update, delay }) => {
      commit(SET_AWAIT, { name, value: true });
      await awaiter(update, delay);
      commit(SET_AWAIT, { name, value: false });
    }
  }
};

export default siteStore;

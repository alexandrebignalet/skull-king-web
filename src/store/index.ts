import Vue from "vue";
import Vuex from "vuex";
import auth from "@/modules/auth/auth.store";
import user from "@/modules/user/user.store";
import gameRoom from "@/modules/game_room/game_room.store";
import { vuexfireMutations } from "vuexfire";

Vue.use(Vuex);

export default new Vuex.Store({
  mutations: { ...vuexfireMutations },
  modules: { auth, user, gameRoom }
});

import Vue from "vue";
import Vuex from "vuex";
import auth from "@/modules/auth/auth.store";
import user from "@/modules/user/user.store";
import gameRoom from "@/modules/game_room/game_room.store";
import skullKing from "@/modules/skullking/skullking.store";
import player from "@/modules/skullking/player.store";
import site from "@/modules/site/site.store";

import { vuexfireMutations } from "vuexfire";

Vue.use(Vuex);

export default new Vuex.Store({
  mutations: { ...vuexfireMutations },
  modules: { auth, user, gameRoom, skullKing, player, site }
});

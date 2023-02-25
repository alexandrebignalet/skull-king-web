<template>
  <div class="home">
    <div class="d-flex justify-content-between">
      <img src="@/assets/skullking-title.png" />
      <Logout v-if="isAuthenticated" />
    </div>

    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Logout from "@/modules/auth/Logout.vue";

@Component({ components: { Logout } })
export default class Home extends Vue {
  get isAuthenticated() {
    return this.$store.getters["auth/isAuthenticated"];
  }
}
</script>

<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/skullking.jpeg" />

    <h1>SkullKing</h1>

    <router-view v-if="isAuthenticated" />
    <Auth v-else />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Auth from "@/modules/auth/Auth.vue";

@Component({ components: { Auth } })
export default class Home extends Vue {
  get isAuthenticated() {
    return this.$store.getters["auth/isAuthenticated"];
  }
}
</script>

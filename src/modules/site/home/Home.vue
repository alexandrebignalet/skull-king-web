<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/skullking.jpeg" />
    <br />
    <img src="@/assets/skullking-title.png" />

    <router-view />
    <Logout v-if="isAuthenticated" />
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
<style lang="scss">
.container {
  padding: 0 600px 0 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.heavy-title {
  padding: 30px 0 20px;
}
</style>

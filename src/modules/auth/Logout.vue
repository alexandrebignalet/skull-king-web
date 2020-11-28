<template>
  <div class="spaced">
    <a @click="logout">Se déconnecter</a>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Logout extends Vue {
  logout() {
    this.$store.dispatch("auth/logout");
  }
}
</script>
<style lang="scss">
.spaced {
  padding: 50px 0 50px;
}
</style>

<template>
  <div class="container">
    <div class="sidebar"></div>
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  get isAuthenticated() {
    return this.$store.getters["auth/isAuthenticated"];
  }
}
</script>
<style lang="scss">
.container {
  position: relative;
  .logo {
    z-index: 1;
    margin-left: 20%;
    margin-top: 75px;
    max-width: 336px;
  }

  .sidebar {
    position: absolute;
    left: 0;
    width: 20%;
    height: 100%;
    border-top-left-radius: 45px;
    border-bottom-left-radius: 45px;
    background: linear-gradient(#40487d, #1f2341);
  }
}
.heavy-title {
  padding: 30px 0 20px;
}
</style>

<template>
  <div id="nav">
    <div v-if="isAuthenticated">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div v-if="!isAuthenticated">
      <router-link to="/register">Register</router-link> |
      <router-link to="/login">Login</router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Navbar extends Vue {
  get isAuthenticated(): boolean {
    return this.$store.getters["auth/isAuthenticated"];
  }
}
</script>

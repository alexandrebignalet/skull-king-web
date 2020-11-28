<template>
  <a-row type="flex" justify="center">
    <Logout v-if="isAuthenticated" />
    <div class="auth" v-else>
      <Register />
      <Login />
    </div>
  </a-row>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "@/modules/auth/Login.vue";
import Register from "@/modules/auth/Register.vue";
import Logout from "@/modules/auth/Logout.vue";

@Component({ components: { Login, Register, Logout } })
export default class Auth extends Vue {
  get isAuthenticated() {
    return this.$store.getters["auth/isAuthenticated"];
  }
}
</script>
<style lang="scss">
.auth {
  display: flex;
  justify-content: space-between;
  min-width: 300px;
}
</style>

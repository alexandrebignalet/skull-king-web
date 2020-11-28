<template>
  <a-row type="flex" justify="center">
    <div class="auth">
      <Register />
      <Login />
    </div>
  </a-row>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "@/modules/auth/Login.vue";
import Register from "@/modules/auth/Register.vue";

@Component({ components: { Login, Register } })
export default class Auth extends Vue {}
</script>
<style lang="scss">
.auth {
  display: flex;
  justify-content: space-between;
  min-width: 300px;
}
</style>

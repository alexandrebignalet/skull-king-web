<template>
  <div class="d-flex flex-column justify-content-center">
    <b-button variant="danger" @click="logout">
      <b-icon icon="box-arrow-right" />
    </b-button>
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

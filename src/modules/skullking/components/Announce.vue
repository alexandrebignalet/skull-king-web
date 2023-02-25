<template>
  <div>
    <b-button
      type="default"
      @click="announce(choice)"
      v-for="choice in choices"
      :key="choice"
    >
      {{ choice }}
    </b-button>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Announce extends Vue {
  @Prop() private roundNb?: number;

  get choices() {
    return this.roundNb ? [...Array(this.roundNb + 1).keys()] : [];
  }

  announce(count: number) {
    if (this.isLoading) {
      return this.$bvToast.toast("Attteeends ça charge !", {
        variant: "warning",
        autoHideDelay: 5000,
        appendToast: true,
        noCloseButton: true
      });
    }

    this.$store.dispatch("skullKing/announce", count);
  }

  get isLoading() {
    return this.$store.getters["site/isLoading"];
  }
}
</script>

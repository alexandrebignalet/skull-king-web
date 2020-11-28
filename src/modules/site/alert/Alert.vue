<template>
  <a-alert :type="type" :message="alert.message" v-if="visible" banner />
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Alert extends Vue {
  @Prop() private alert?: { message: string; closeAfter: number };
  @Prop() private type?: string;
  private timeoutReached = false;

  @Watch("alert")
  onPropertyChanged(value: { message: string; closeAfter: number }) {
    setTimeout(() => {
      this.timeoutReached = true;
    }, value.closeAfter);
  }

  get visible() {
    return this.alert && !this.timeoutReached;
  }
}
</script>

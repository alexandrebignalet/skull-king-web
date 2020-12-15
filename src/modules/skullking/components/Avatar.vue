<template>
  <div :class="className"></div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Avatar extends Vue {
  @Prop() type?: string;

  get className(): string {
    return `avatar-wrapper ${this.type}`;
  }
}
</script>
<style lang="scss">
.avatar-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 15px;
}

.davy-jones {
  background: #39c5d6 url("../../../assets/davy_jones.webp");
  border: 1px solid #2e335c;
  background-size: cover;
}

.jack-sparrow {
  background: #ffd94b url("../../../assets/jack-sparrow.webp");
  border: 1px solid #2e335c;
  background-size: cover;
}

.barbossa {
  background: #f2725c url("../../../assets/barbossa.webp");
  border: 1px solid #2e335c;
  background-size: cover;
}

.calypso {
  background: #000000 url("../../../assets/calypso.webp");
  border: 1px solid #2e335c;
  background-size: cover;
}

.mermaid {
  background: url("../../../assets/mermaid.webp");
  border: 1px solid #2e335c;
  background-size: cover;
}

.skull {
  background: url("../../../assets/skull.webp");
  border: 1px solid #2e335c;
  background-size: cover;
}

.gold-coin {
  background: url("../../../assets/gold-coin.webp");
  background-size: cover;
}
</style>

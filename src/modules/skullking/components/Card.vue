<template>
  <div>
    <a-card class="card" :bordered="false">
      <img slot="cover" :alt="`Carte ${card.type}`" :src="card.path" />
    </a-card>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Card from "@/modules/skullking/model/card";

@Component
export default class SkullKing extends Vue {
  @Prop() private card?: Card;
}
</script>
<style lang="scss" media="screen">
.card {
  max-width: 100px;
  height: auto;
}
@media (max-width: 1000px) {
  .card {
    max-width: 75px;
  }
}

@media (max-width: 600px) {
  .card {
    max-width: 60px;
  }
}
</style>

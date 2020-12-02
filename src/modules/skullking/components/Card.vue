<template>
  <div>
    <a-card class="card" :id="id" :bordered="false">
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
  @Prop() private fold?: boolean;

  get id() {
    return this.fold ? "fold" : "hand";
  }
}
</script>
<style lang="scss">
.card {
  max-width: 150px;
}

#hand {
  bottom: -100px;

  &:hover {
    bottom: 0;
  }
}
</style>

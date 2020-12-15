<template>
  <div class="card">
    <img
      slot="cover"
      class="card-image"
      :alt="`Carte ${card.type}`"
      :src="card.path"
    />
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
  height: 65px;
  margin-right: -25px;
  overflow: hidden;

  &-image {
    border-radius: 20px;
    width: 100px;
  }
}

@media (max-width: 700px) {
  .card {
    &-image {
      border-radius: 10px;
      max-height: 100px;
      width: auto;
    }
  }
}

@media (max-width: 600px) {
  .card {
    &-image {
      border-radius: 10px;
      max-height: 100px;
      width: auto;
    }
  }
}
</style>

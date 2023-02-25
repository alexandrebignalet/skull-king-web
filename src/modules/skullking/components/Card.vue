<template>
  <div>
    <div class="card">
      <b-img #cover :alt="`Carte ${card.type} ${card.name}`" :src="path" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Card from "@/modules/skullking/model/card";
import { CardType } from "@/modules/skullking/model/card-type.enum";

@Component
export default class SkullKing extends Vue {
  @Prop() private card?: Card;
  @Prop() private isBlackrock?: boolean;

  get path() {
    return this.isBlackrock ? this.blackrockPath : this.classicPath;
  }

  get blackrockPath() {
    if (!this.card) return "";
    let format;
    if (this.card.type == CardType.COLORED) {
      format = `${this.card.color}_${this.card.value}`;
    } else if (this.card.type == CardType.PIRATE) {
      format = `${CardType.PIRATE}_${this.card.name}`;
    } else if (this.card.type == CardType.SCARY_MARY) {
      format = `tigresse`;
    } else if (this.card.type == CardType.MERMAID) {
      format = `${CardType.MERMAID}_${this.card.name}`;
    } else {
      format = this.card.type;
    }

    return `../../game/cards/blackrock_${format.toLowerCase()}.jpg`;
  }

  get classicPath() {
    if (!this.card) return "";

    let format;
    if (this.card.type == CardType.COLORED) {
      format = `${this.card.color}_${this.card.value}`;
    } else if (this.card.type == CardType.PIRATE) {
      format = `${CardType.PIRATE}_${this.card.name}`;
    } else {
      format = this.card.type;
    }
    return `../../game/cards/${format.toLowerCase()}.png`;
  }
}
</script>
<style media="screen">
.card {
  max-width: 100px;
  height: auto;
}

.not-allowed {
  max-width: 100px;
  background-color: black;
}

@media (max-width: 700px) {
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

<template>
  <div class="score">
    <div>
      <span
        >{{ score.announced }} | {{ score.done }} |
        {{ score.potentialBonus }}</span
      >
    </div>
    <div v-if="roundNb" class="total">
      <strong>{{ score.points(roundNb) }}</strong>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ScoreModel from "@/modules/skullking/model/score";

@Component
export default class Score extends Vue {
  @Prop() private score?: ScoreModel;
  @Prop() private roundNb?: number;

  resolveColor(): string {
    if (!this.score) return "#1890ff";
    if (this.score.announced === this.score.done) return "#1890ff";
    if (this.score.announced > this.score.done) return "#fa8c16";
    else return "#f5222d";
  }
}
</script>
<style media="all"></style>

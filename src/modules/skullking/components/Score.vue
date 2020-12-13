<template>
  <div class="score">
    <a-space>
      <a-badge
        :count="score.announced"
        :number-style="{ 'background-color': '#1890ff' }"
        show-zero
      >
      </a-badge>
      <a-badge
        :count="score.done"
        :number-style="{ 'background-color': resolveColor() }"
        show-zero
      >
      </a-badge>
      <a-badge
        :count="score.potentialBonus"
        :number-style="{ 'background-color': resolveColor() }"
        show-zero
      >
      </a-badge>
    </a-space>
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
<style lang="scss" media="all"></style>

<template>
  <div class="game-info">
    <h3 v-if="game.isAnnouncementPhase">YO OH OH</h3>
    <div v-else-if="game.currentPlayerRoundScore(playerId)" class="fold-info">
      <Score :score="prs.score" :round-nb="prs.roundNb" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Skullking from "@/modules/skullking/model/skullking";
import PlayerRoundScore from "@/modules/skullking/model/player-round-score";
import Score from "@/modules/skullking/components/Score.vue";

@Component({ components: { Score } })
export default class GameInfo extends Vue {
  @Prop() private game?: Skullking;
  @Prop() private playerId?: string;

  get prs(): PlayerRoundScore | undefined {
    return this.playerId
      ? this.game?.currentPlayerRoundScore(this.playerId)
      : void 0;
  }
}
</script>
<style media="all">
.fold-info {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}

@media (max-width: 1000px) {
  .game-info {
    font-size: 10px;
  }
}
</style>

<template>
  <div class="game-info">
    <h3 v-if="game.isAnnouncementPhase">YO OH OH</h3>
    <div v-if="game.currentPlayerRoundScore(playerId)" class="fold-info">
      <div>
        Annonce
        {{ game.currentPlayerRoundScore(playerId).score.announced }}
      </div>
      <div>Fait {{ game.currentPlayerRoundScore(playerId).score.done }}</div>
      <div>
        Bonus
        {{ game.currentPlayerRoundScore(playerId).score.potentialBonus }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Skullking from "@/modules/skullking/model/skullking";

@Component
export default class GameInfo extends Vue {
  @Prop() private game?: Skullking;
  @Prop() private playerId?: string;
}
</script>
<style lang="scss" media="all">
.fold-info {
  display: flex;
  flex-direction: column;
  justify-items: flex-end;
  align-items: flex-start;
}

@media (max-width: 1000px) {
  .game-info {
    font-size: 10px;
  }
}
</style>

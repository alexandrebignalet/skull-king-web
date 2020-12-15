<template>
  <div class="skullking">
    <div class="skullking-top">
      <div class="skullking-top-left-one"></div>
      <div class="skullking-top-left-two">
        <div v-if="playerOrderAfterCurrent.length === 2">
          <GamePlayer
            :game="actualGame"
            :user="firstPlayerAfterCurrent"
            :current-player-id="actualGame.currentPlayerId"
          />
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <GamePlayer
            :game="actualGame"
            :user="secondPlayerAfterCurrent"
            :current-player-id="actualGame.currentPlayerId"
          />
        </div>
      </div>
      <div class="skullking-top-middle">
        <div v-if="playerOrderAfterCurrent.length === 1">
          <GamePlayer
            :game="actualGame"
            :user="firstPlayerAfterCurrent"
            :current-player-id="actualGame.currentPlayerId"
          />
        </div>
        <div v-if="playerOrderAfterCurrent.length === 3">
          <GamePlayer
            :game="actualGame"
            :user="secondPlayerAfterCurrent"
            :current-player-id="actualGame.currentPlayerId"
          />
        </div>
      </div>
      <div class="skullking-top-right-one">
        <div v-if="playerOrderAfterCurrent.length === 2">
          <GamePlayer
            :game="actualGame"
            :user="secondPlayerAfterCurrent"
            :current-player-id="actualGame.currentPlayerId"
          />
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <GamePlayer
            :game="actualGame"
            :user="thirdPlayerAfterCurrent"
            :current-player-id="actualGame.currentPlayerId"
          />
        </div>
      </div>
      <div class="skullking-top-right-two"></div>
    </div>

    <div class="skullking-middle">
      <div class="skullking-middle-left-slot">
        <div v-if="playerOrderAfterCurrent.length === 3">
          <GamePlayer
            :game="actualGame"
            :user="firstPlayerAfterCurrent"
            :current-player-id="actualGame.currentPlayerId"
          />
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <GamePlayer
            :game="actualGame"
            :user="firstPlayerAfterCurrent"
            :current-player-id="actualGame.currentPlayerId"
          />
        </div>
      </div>
      <div class="skullking-middle-fold-slot">
        <Announce
          :roundNb="actualGame.roundNb"
          v-if="
            actualGame.isAnnouncementPhase &&
              !actualGame.currentPlayerRoundScore(player.id)
          "
        />
        <CardComp
          :card="card"
          v-for="(card, index) in foldCards"
          :key="index"
        />
      </div>
      <div class="skullking-middle-right-slot">
        <div v-if="playerOrderAfterCurrent.length === 3">
          <GamePlayer
            :game="actualGame"
            :user="thirdPlayerAfterCurrent"
            :current-player-id="actualGame.currentPlayerId"
          />
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <GamePlayer
            :game="actualGame"
            :user="forthPlayerAfterCurrent"
            :current-player-id="actualGame.currentPlayerId"
          />
        </div>
      </div>
    </div>

    <div class="skullking-bottom">
      <div class="skullking-bottom-current-player">
        <div class="skullking-bottom-current-player-info">
          <div class="skullking-bottom-current-player-base">
            <GamePlayer
              :game="actualGame"
              :user="currentUser"
              :current-player-id="actualGame.currentPlayerId"
            />
          </div>
        </div>
        <div class="skullking-bottom-current-player-hand">
          <CardComp
            class="skullking-bottom-current-player-hand-card"
            :card="card"
            v-for="(card, index) in actualPlayer.cards"
            :key="index"
            @click.native="playCard(card)"
          />
        </div>
        <div class="skullking-bottom-current-player-end">
          <a-button type="default" @click="toggleScore" shape="round"
            >Scores</a-button
          >
        </div>
      </div>
    </div>
    <ScorePanel
      :score-table="game.scoreTable"
      :visible="showScoreDrawer"
      :player-names="playerNames"
      :closable="!game.isEnded"
      @close="toggleScore"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Player from "@/modules/skullking/model/player";
import CardComp from "@/modules/skullking/components/Card.vue";
import Announce from "@/modules/skullking/components/Announce.vue";
import ScorePanel from "@/modules/skullking/components/ScorePanel.vue";
import Skullking from "@/modules/skullking/model/skullking";
import Card from "@/modules/skullking/model/card";
import GameUser from "@/modules/game_room/game_user";
import GameRoom from "@/modules/game_room/game_room";
import { CardType } from "@/modules/skullking/model/card-type.enum";
import { ScaryMaryUsage } from "@/modules/skullking/model/scary-mary-usage.enum";
import GamePlayer from "@/modules/skullking/components/GamePlayer.vue";
import { capitalize } from "lodash-es";

@Component({
  components: { GamePlayer, CardComp, Announce, ScorePanel },
  filters: { capitalize }
})
export default class SkullKing extends Vue {
  @Prop() private game?: Skullking;
  @Prop() private player?: Player;
  @Prop() private currentUser?: GameUser;

  private playerOrderAfterCurrent = this.resolvePlayersOrderAfterCurrent();
  private cardIdBeingPlayed: string | null = null;
  private actualGame?: Skullking = this.game;
  private actualPlayer?: Player = this.player;
  private playerNames: { [key: string]: string } | undefined = this
    .currentGameRoom?.userNamesPerId;
  private showScore = false;

  get showScoreDrawer(): boolean {
    return this.showScore || (this.game ? this.game.isEnded : false);
  }

  toggleScore() {
    this.showScore = !this.showScore;
  }

  get foldCards() {
    return this.actualGame?.fold?.map(p => p.card);
  }

  @Watch("game", { deep: true })
  onFoldUpdate(gameUpdate: Skullking, actualGame: Skullking) {
    const update = () => {
      this.actualGame = gameUpdate;
    };

    if (gameUpdate.isFoldEnded(actualGame)) setTimeout(() => update(), 1000);
    else if (gameUpdate.isNextRound(actualGame))
      setTimeout(() => update(), 2500);
    else update();
  }

  @Watch("player")
  onPlayerUpdate(playerUpdate: Player, actualPlayer: Player) {
    const update = () => {
      this.actualPlayer = playerUpdate;
    };

    if (playerUpdate.cards.length > 0 && actualPlayer.cards.length === 0) {
      setTimeout(() => update(), 1000);
    } else update();
  }

  playCard(card: Card) {
    if (this.isLoading) {
      return this.$message.warn("Attteeends ça charge !");
    }

    if (card.type !== CardType.SCARY_MARY) return this.dispatchPlayCard(card);

    this.$confirm({
      content: "Pirate ou Escape ?",
      okText: "Pirate",
      onOk: () => this.dispatchPlayCard(card, ScaryMaryUsage.PIRATE),
      cancelText: "Escape",
      onCancel: () => this.dispatchPlayCard(card, ScaryMaryUsage.ESCAPE)
    });
  }

  private dispatchPlayCard(card: Card, usage?: ScaryMaryUsage): Promise<void> {
    this.cardIdBeingPlayed = card.id;
    return this.$store
      .dispatch("skullKing/playCard", {
        playerId: this.player?.id,
        card: usage ? { ...card, usage } : card
      })
      .catch((errorMessage: string) => {
        this.$message.error(errorMessage);
      })
      .finally(() => {
        this.cardIdBeingPlayed = null;
      });
  }

  get isLoading() {
    return this.$store.getters["site/isLoading"];
  }

  get firstPlayerAfterCurrent(): GameUser | undefined {
    return this.getPlayerAfterCurrent(0);
  }

  get secondPlayerAfterCurrent(): GameUser | undefined {
    return this.getPlayerAfterCurrent(1);
  }

  get thirdPlayerAfterCurrent(): GameUser | undefined {
    return this.getPlayerAfterCurrent(2);
  }

  get forthPlayerAfterCurrent(): GameUser | undefined {
    return this.getPlayerAfterCurrent(3);
  }

  private resolvePlayersOrderAfterCurrent(): string[] {
    const players = this.game?.players;
    const currentUserId = this.currentUser?.id;

    if (!currentUserId || !players) return players || [];
    return players
      ?.slice(players.indexOf(currentUserId) + 1, players.length)
      .concat(players.slice(0, players.indexOf(currentUserId)));
  }

  private getPlayerAfterCurrent(index: number): GameUser | undefined {
    const userId: string | undefined = this.playerOrderAfterCurrent[index];
    return this.currentGameRoom?.users.find(u => u.id == userId);
  }

  private get currentGameRoom(): GameRoom | undefined {
    return this.currentUser?.rooms.find(room => room.gameId == this.game?.id);
  }
}
</script>
<style lang="scss">
.skullking {
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;

  &-top {
    flex-grow: 1;
    width: 100%;
    display: flex;

    &-left-one {
      flex-grow: 1;
    }
    &-left-two {
      flex-grow: 1;
    }
    &-middle {
      flex-grow: 2;
      background-color: white;
    }
    &-right-one {
      flex-grow: 1;
    }
    &-right-two {
      flex-grow: 1;
      padding-top: 20px;
    }
  }

  &-middle {
    flex-grow: 2;
    width: 100%;
    display: flex;

    &-left-slot {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-fold-slot {
      flex-grow: 6;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-right-slot {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &-bottom {
    width: 100%;
    &-current-player {
      display: flex;

      &-info {
        flex-grow: 1;
        display: flex;
        flex-direction: column-reverse;

        &-base {
        }
      }
      &-hand {
        display: flex;
        justify-content: center;
        flex-grow: 6;

        &-card {
          cursor: pointer;
        }
      }
      &-end {
        flex-grow: 1;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        padding-bottom: 30px;
      }
    }
  }
}
</style>

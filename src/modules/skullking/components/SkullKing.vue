<template>
  <div class="skullking container">
    <div class="round content-wrapper">
      <div class="round-nb">{{ game.roundNb }}</div>
    </div>

    <button class="score-btn content-wrapper" @click="toggleScore">
      <img src="@/assets/icn_map_32.png" alt="score" v-if="!showScorePage" />
      <img src="@/assets/icn_sword_32.png" alt="score" v-else />
    </button>

    <div class="main-container" v-if="showScorePage">
      <div class="title">Score</div>
      <div class="list-container">
        <div
          class="list-item-container"
          v-for="player in gamePlayers"
          :key="player.id"
        >
          <Avatar :type="avatarFor(player.id)" class="avatar" />
          <div class="middle-content">{{ player.pseudo }}</div>
          <div class="right-content">
            {{ actualGame.totalScoreFor(player.id) }}
            <img
              src="@/assets/icn_crown_32.png"
              alt="leader"
              v-if="isLeader(player)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="skullking-middle-fold-slot" v-if="!showScorePage">
      <GameTable
        :game-id="actualGame.id"
        :players="actualGame.players"
        :score-per-player="actualGame.currentRoundScorePerPlayer"
        :current-user="currentUser"
        :current-player-id="actualGame.currentPlayerId"
        :fold="actualGame.fold"
        :winner-player-id="foldWinnerPlayerId"
      />

      <Announce
        :roundNb="actualGame.roundNb"
        v-if="
          actualGame.isAnnouncementPhase &&
            !actualGame.currentPlayerRoundScore(player.id)
        "
      />
    </div>

    <div class="current-player-score" v-if="!showScorePage">
      <PlayerAnnounce
        :current-score="actualGame.currentRoundScorePerPlayer[currentUser.id]"
      />
    </div>

    <transition name="bounce">
      <div
        class="turn-indicator"
        v-if="!showScorePage"
        :class="{
          'turn-indicator-active': game.currentPlayerId === currentUser.id
        }"
      >
        <div>
          <img
            src="@/assets/icn_sword_32.png"
            alt="sword"
            class="img img-sword"
          />
          À toi de jouer
        </div>
      </div>
    </transition>

    <div class="skullking-bottom" v-if="!showScore">
      <div class="skullking-bottom-current-player">
        <div class="skullking-bottom-current-player-hand">
          <CardComp
            class="skullking-bottom-current-player-hand-card"
            :card="card"
            v-for="(card, index) in actualPlayer.cards"
            :key="index"
            @click.native="playCard(card)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Player from "@/modules/skullking/model/player";
import CardComp from "@/modules/skullking/components/Card.vue";
import GameTable from "@/modules/skullking/components/GameTable.vue";
import Announce from "@/modules/skullking/components/Announce.vue";
import Skullking from "@/modules/skullking/model/skullking";
import Card from "@/modules/skullking/model/card";
import GameUser from "@/modules/game_room/game_user";
import { CardType } from "@/modules/skullking/model/card-type.enum";
import { ScaryMaryUsage } from "@/modules/skullking/model/scary-mary-usage.enum";
import GamePlayer from "@/modules/skullking/components/GamePlayer.vue";
import { capitalize } from "lodash-es";
import GameRoom from "@/modules/game_room/game_room";
import PlayerAnnounce from "@/modules/skullking/components/PlayerAnnounce.vue";
import Avatar from "@/modules/skullking/components/Avatar.vue";

@Component({
  components: {
    PlayerAnnounce,
    GamePlayer,
    CardComp,
    Announce,
    GameTable,
    Avatar
  },
  filters: { capitalize }
})
export default class SkullKing extends Vue {
  @Prop() private game?: Skullking;
  @Prop() private player?: Player;
  @Prop() private currentUser?: GameUser;

  private foldWinnerPlayerId?: string | null = null;
  private cardIdBeingPlayed: string | null = null;
  private actualGame?: Skullking = this.game;
  private actualPlayer?: Player = this.player;
  private showScore = false;

  get showScorePage(): boolean {
    return this.showScore || (this.game ? this.game.isEnded : false);
  }

  toggleScore() {
    this.showScore = !this.showScore;
  }

  avatarFor(playerId: string) {
    return this.$store.getters["skullKing/avatarFor"](playerId);
  }

  isLeader(player: GameUser) {
    return this.$store.getters["skullKing/isLeader"](player.id);
  }

  get gamePlayers(): (GameUser | undefined)[] {
    if (!this.actualGame) return [];

    return this.actualGame.players.map((playerId: string) =>
      this.currentGameRoom?.users.find(u => u.id == playerId)
    );
  }

  private get currentGameRoom(): GameRoom | undefined {
    return this.currentUser?.rooms.find(room => room.gameId == this.game?.id);
  }

  @Watch("game", { deep: true })
  onFoldUpdate(gameUpdate: Skullking, actualGame: Skullking) {
    const update = () => {
      this.actualGame = gameUpdate;
      this.foldWinnerPlayerId = null;
    };

    if (gameUpdate.isFoldEnded(actualGame)) {
      this.$store.dispatch("site/awaiter", {
        name: "pick-up-animation",
        update: () => (this.foldWinnerPlayerId = gameUpdate.currentPlayerId),
        delay: 500
      });
      this.$store.dispatch("site/awaiter", {
        name: "reset-fold",
        update,
        delay: 2500
      });
    } else if (gameUpdate.isNextRound(actualGame))
      this.$store.dispatch("site/awaiter", {
        name: "next-round",
        update,
        delay: 4000
      });
    else update();
  }

  @Watch("player")
  async onPlayerUpdate(playerUpdate: Player, actualPlayer: Player) {
    const update = () => {
      this.actualPlayer = playerUpdate;
    };

    if (playerUpdate.cards.length > 0 && actualPlayer.cards.length === 0) {
      this.$store.dispatch("site/awaiter", {
        name: "player-update",
        update,
        delay: 2500
      });
    } else update();
  }

  playCard(card: Card) {
    if (this.isActionNotAllowed) {
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
    console.log("play");
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

  get isActionNotAllowed() {
    return this.$store.getters["site/isActionNotAllowed"];
  }
}
</script>
<style lang="scss">
.skullking {
  .content-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: bold;
    font-size: 24px;
    color: #d9dbec;

    background-color: #464e87;
    box-shadow: 3px 3px 5px #0000006e;
  }

  .round {
    position: absolute;
    top: 20px;
    left: 20px;

    width: 50px;
    height: 50px;

    border-radius: 30px 10px 10px 10px;
  }

  .score-btn {
    position: absolute;
    top: 20px;
    right: 20px;

    width: 50px;
    height: 50px;

    border-radius: 10px 30px 10px 10px;
    border-color: transparent;
    background-color: #46a5f7;

    &:active {
      box-shadow: 3px 3px 15px #3989b7 inset;
    }

    &:focus {
      outline: 0;
    }
  }

  .current-player-score {
    left: 20px;
    position: absolute;
    bottom: 24%;

    .announce {
      .bg {
        height: 25px;
        width: 70px;
        top: 4px;
      }
      .pscore {
        width: 95px;
        font-size: 12px;
        top: 7px;
      }
      .coin {
        width: 32px;
        height: 32px;
      }
    }
  }

  .turn-indicator {
    visibility: hidden;
    position: absolute;
    width: 190px;
    height: 40px;
    bottom: 25%;
    left: 50%;
    border-radius: 9999px;
    background-color: #2e345d;
    border: 1px solid #424a81;
    box-shadow: 0 10px 20px black;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;

    &-active {
      visibility: visible;
    }

    div {
      font-size: 18px;
      color: #d9dbec;
      font-weight: bold;

      .img {
        max-width: 24px;

        &-sword {
          animation: move-sword 2s ease infinite 1s;
        }

        @keyframes move-sword {
          0%,
          100% {
            transform: rotateZ(35deg);
          }

          50% {
            transform: rotateZ(-35deg);
          }
        }
      }
    }
  }

  &-middle {
    flex-basis: 80%;
    width: 100%;
    display: flex;

    &-fold-slot {
      flex-basis: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &-bottom {
    width: 100%;
    &-current-player {
      display: flex;
      overflow-x: scroll;
      overflow-y: unset;

      &-hand {
        position: relative;
        display: flex;
        justify-content: center;
        min-width: min-content;
        margin: auto;
        padding-right: 25px;

        &-card {
          cursor: pointer;
          animation: stretchAndRelease 0.5s ease;
        }
      }
    }
  }
}

@keyframes stretchAndRelease {
  0% {
    width: 20%;
  }

  50% {
    width: 60%;
  }

  100% {
    width: 100%;
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>

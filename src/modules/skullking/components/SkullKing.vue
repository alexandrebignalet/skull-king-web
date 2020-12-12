<template>
  <div class="skullking">
    <div class="skullking-top">
      <div class="skullking-top-left-one"></div>
      <div class="skullking-top-left-two">
        <div v-if="playerOrderAfterCurrent.length === 2">
          <GamePlayer
            :user="firstPlayerAfterCurrent"
            :current-player-id="game.currentPlayerId"
          />
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <GamePlayer
            :user="secondPlayerAfterCurrent"
            :current-player-id="game.currentPlayerId"
          />
        </div>
      </div>
      <div class="skullking-top-middle">
        <div v-if="playerOrderAfterCurrent.length === 1">
          <GamePlayer
            :user="firstPlayerAfterCurrent"
            :current-player-id="game.currentPlayerId"
          />
        </div>
        <div v-if="playerOrderAfterCurrent.length === 3">
          <GamePlayer
            :user="secondPlayerAfterCurrent"
            :current-player-id="game.currentPlayerId"
          />
        </div>
      </div>
      <div class="skullking-top-right-one">
        <div v-if="playerOrderAfterCurrent.length === 2">
          <GamePlayer
            :user="secondPlayerAfterCurrent"
            :current-player-id="game.currentPlayerId"
          />
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <GamePlayer
            :user="thirdPlayerAfterCurrent"
            :current-player-id="game.currentPlayerId"
          />
        </div>
      </div>
      <div class="skullking-top-right-two"></div>
    </div>

    <div class="skullking-middle">
      <div class="skullking-middle-left-slot">
        <div v-if="playerOrderAfterCurrent.length === 3">
          <GamePlayer
            :user="firstPlayerAfterCurrent"
            :current-player-id="game.currentPlayerId"
          />
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <GamePlayer
            :user="firstPlayerAfterCurrent"
            :current-player-id="game.currentPlayerId"
          />
        </div>
      </div>
      <div class="skullking-middle-fold-slot">
        <Announce
          :roundNb="game.roundNb"
          v-if="
            game.isAnnouncementPhase && !game.currentPlayerRoundScore(player.id)
          "
        />
        <CardComp
          :card="card"
          v-for="(card, index) in game.foldCards"
          :key="index"
        />
      </div>
      <div class="skullking-middle-right-slot">
        <div v-if="playerOrderAfterCurrent.length === 3">
          <GamePlayer
            :user="thirdPlayerAfterCurrent"
            :current-player-id="game.currentPlayerId"
          />
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <GamePlayer
            :user="forthPlayerAfterCurrent"
            :current-player-id="game.currentPlayerId"
          />
        </div>
      </div>
    </div>

    <div class="skullking-bottom">
      <div class="skullking-bottom-current-player">
        <div class="skullking-bottom-current-player-info">
          <div class="skullking-bottom-current-player-base">
            <GamePlayer
              :user="currentUser"
              :current-player-id="game.currentPlayerId"
            />
          </div>
        </div>
        <div class="skullking-bottom-current-player-hand">
          <CardComp
            class="skullking-bottom-current-player-hand-card"
            :card="card"
            v-for="(card, index) in player.cards"
            :key="index"
            @click.native="playCard(card)"
          />
        </div>
        <div class="skullking-bottom-current-player-end">
          <GameInfo :game="game" :player-id="player.id"></GameInfo>
        </div>
      </div>
    </div>
    <!--    <a-modal v-model="game.isEnded" :footer="null" @cancel="goToGameRooms">-->
    <!--      <table>-->
    <!--        <thead>-->
    <!--         <th v-for="(_, playerId) in game.mapScore" :key="playerId"> {{ playerId }}</th>-->
    <!--        </thead>-->
    <!--        <tbody>-->
    <!--          <tr v-for="(prs, index) in game.mapScore" :key="index">{{ prs.score.announced }} | {{ prs.score.done }}</tr>-->
    <!--        </tbody>-->
    <!--        <tfoot>-->
    <!--&lt;!&ndash;          <tr v-for="score in game.scoreBoard" :key="score.playerId">{{ score.total() }}</tr>&ndash;&gt;-->
    <!--        </tfoot>-->
    <!--      </table>-->
    <!--    </a-modal>-->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Player from "@/modules/skullking/model/player";
import CardComp from "@/modules/skullking/components/Card.vue";
import GameInfo from "@/modules/skullking/components/GameInfo.vue";
import Announce from "@/modules/skullking/components/Announce.vue";
import Skullking from "@/modules/skullking/model/skullking";
import Card from "@/modules/skullking/model/card";
import GameUser from "@/modules/game_room/game_user";
import GameRoom from "@/modules/game_room/game_room";
import { CardType } from "@/modules/skullking/model/card-type.enum";
import { ScaryMaryUsage } from "@/modules/skullking/model/scary-mary-usage.enum";
import GamePlayer from "@/modules/skullking/components/GamePlayer.vue";
import { capitalize } from "lodash-es";

@Component({
  components: { GamePlayer, CardComp, Announce, GameInfo },
  filters: { capitalize }
})
export default class SkullKing extends Vue {
  @Prop() private game?: Skullking;
  @Prop() private player?: Player;
  @Prop() private currentUser?: GameUser;
  private playerOrderAfterCurrent = this.resolvePlayersOrderAfterCurrent();
  private cardIdBeingPlayed: string | null = null;

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

  goToGameRooms() {
    this.$router.push({ name: "game_rooms" });
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
        flex-grow: 4;

        &-card {
          cursor: pointer;
        }
      }
      &-end {
        flex-grow: 1;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
      }
    }
  }
}
</style>

<template>
  <div class="skullking">
    <div class="skullking-top">
      <div class="skullking-top-left-one"></div>
      <div class="skullking-top-left-two">
        <div v-if="playerOrderAfterCurrent.length === 2">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <h3>{{ firstPlayerAfterCurrent.name | capitalize }}</h3>
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <h3>{{ secondPlayerAfterCurrent.name | capitalize }}</h3>
        </div>
      </div>
      <div class="skullking-top-middle">
        <div v-if="playerOrderAfterCurrent.length === 1">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <h3>{{ firstPlayerAfterCurrent.name | capitalize }}</h3>
        </div>
        <div v-if="playerOrderAfterCurrent.length === 3">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <h3>{{ secondPlayerAfterCurrent.name | capitalize }}</h3>
        </div>
      </div>
      <div class="skullking-top-right-one">
        <div v-if="playerOrderAfterCurrent.length === 2">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <h3>{{ secondPlayerAfterCurrent.name | capitalize }}</h3>
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <h3>{{ thirdPlayerAfterCurrent.name | capitalize }}</h3>
        </div>
      </div>
      <div class="skullking-top-right-two"></div>
    </div>

    <div class="skullking-middle">
      <div class="skullking-middle-left-slot">
        <div v-if="playerOrderAfterCurrent.length === 3">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <h3>{{ firstPlayerAfterCurrent.name | capitalize }}</h3>
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <h3>{{ firstPlayerAfterCurrent.name | capitalize }}</h3>
        </div>
      </div>
      <div class="skullking-middle-fold-slot">
        <Announce :roundNb="game.roundNb" />
        <CardComp
          :card="card"
          :fold="true"
          v-for="(card, index) in game.foldCards"
          :key="index"
        />
      </div>
      <div class="skullking-middle-right-slot">
        <div v-if="playerOrderAfterCurrent.length === 3">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <h3>{{ thirdPlayerAfterCurrent.name | capitalize }}</h3>
        </div>
        <div v-if="playerOrderAfterCurrent.length === 4">
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
          <h3>{{ forthPlayerAfterCurrent.name | capitalize }}</h3>
        </div>
      </div>
    </div>

    <div class="skullking-bottom">
      <div class="skullking-bottom-current-player">
        <div class="skullking-bottom-current-player-info">
          <div class="skullking-bottom-current-player-base">
            <a-avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
            <h3>{{ currentUser.name | capitalize }}</h3>
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
        <div class="skullking-bottom-current-player-end"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Player from "@/modules/skullking/model/player";
import CardComp from "@/modules/skullking/components/Card.vue";
import Announce from "@/modules/skullking/components/Announce.vue";
import Skullking from "@/modules/skullking/model/skullking";
import Card from "@/modules/skullking/model/card";
import GameUser from "@/modules/game_room/game_user";
import GameRoom from "@/modules/game_room/game_room";
import { CardType } from "@/modules/skullking/model/card-type.enum";
import { ScaryMaryUsage } from "@/modules/skullking/model/scary-mary-usage.enum";

@Component({
  components: { CardComp, Announce },
  filters: {
    capitalize: function(value: string) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
})
export default class SkullKing extends Vue {
  @Prop() private game?: Skullking;
  @Prop() private player?: Player;
  @Prop() private currentUser?: GameUser;
  private playerOrderAfterCurrent = this.resolvePlayersOrderAfterCurrent();

  playCard(card: Card) {
    const playCard = (usage?: ScaryMaryUsage) =>
      this.$store.dispatch("skullKing/playCard", {
        playerId: this.player?.id,
        card: usage ? { ...card, usage } : card
      });

    if (card.type !== CardType.SCARY_MARY) return playCard();

    this.$confirm({
      content: "Pirate ou Escape ?",
      okText: "Pirate",
      onOk: () => playCard(ScaryMaryUsage.PIRATE),
      cancelText: "Escape",
      onCancel: () => playCard(ScaryMaryUsage.ESCAPE)
    });
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
      background-color: blue;
    }
    &-left-two {
      flex-grow: 1;
      background-color: blue;
    }
    &-middle {
      flex-grow: 2;
      background-color: white;
    }
    &-right-one {
      flex-grow: 1;
      background-color: red;
    }
    &-right-two {
      flex-grow: 1;
      background-color: red;
    }
  }

  &-middle {
    flex-grow: 2;
    width: 100%;
    display: flex;

    &-left-slot {
      background-color: red;
      flex-grow: 1;
    }
    &-fold-slot {
      flex-grow: 6;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-right-slot {
      background-color: orange;
      flex-grow: 1;
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
      }
    }
  }
}
</style>

<template>
  <div class="inner">
    <div
      v-for="play in fold"
      :key="play.playerId"
      class="card-wrapper"
      :class="
        `slot-${players.length}-${playerIndexOf(play.playerId)} ${
          winner ? `winner-${winner}` : ''
        } ${winner ? 'pick-up' : ''}`
      "
    >
      <img
        slot="cover"
        :alt="`Carte ${play.card.type}`"
        :src="play.card.path"
        :class="
          `${
            winner ? pickUpLocationOf(play.playerId) : locationOf(play.playerId)
          }`
        "
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import GameUser from "@/modules/game_room/game_user";
import Play from "@/modules/skullking/model/play";

@Component
export default class Fold extends Vue {
  @Prop() private fold?: Play[];
  @Prop() private players?: GameUser[];
  @Prop() private currentUserId?: string;
  @Prop() private winnerPlayerId?: string;

  get winner(): string | null {
    return this.winnerPlayerId ? this.locationOf(this.winnerPlayerId) : null;
  }

  locationOf(playerId: string): string {
    if (!this.players) return "";

    const locations: { [key: number]: any } = {
      1: {
        0: "north"
      },
      2: {
        0: "north",
        1: "east"
      },
      3: {
        0: "west",
        1: "north",
        2: "east"
      },
      4: {
        0: "west",
        1: "north",
        2: "east-top",
        3: "east-bot"
      },
      5: {
        0: "west-bot",
        1: "west-top",
        2: "north",
        3: "east-top",
        4: "east-bot"
      }
    };

    const playerIndex = this.playerIndexOf(playerId);
    return playerIndex < 0
      ? "south"
      : locations[this.players.length][playerIndex];
  }

  pickUpLocationOf(playerId: string) {
    return `pick-up-${this.locationOf(playerId)}`;
  }

  playerIndexOf(playerId: string): number {
    if (!this.players) return -1;
    return this.players.map(p => p.id).indexOf(playerId);
  }
}
</script>
<style lang="scss">
.inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background-image: url("../../../assets/tiles-pattern.png"),
    linear-gradient(#454d86, #333967);

  border: 1px solid #292d52;
  box-shadow: 2px 2px 0 #0000002e;

  .card-wrapper {
    position: absolute;
    width: 53.2px;

    .north {
      position: absolute;
      right: 5px;
      top: 75px;

      animation: playNorth 500ms, rotate 500ms;
    }

    @keyframes playNorth {
      0% {
        top: -100px;
      }
      100% {
        top: 75px;
      }
    }

    .west-top {
      right: -85px;
      top: -35px;
      position: absolute;

      animation: playWestTop 500ms, rotate 500ms;
    }

    @keyframes playWestTop {
      0% {
        right: 85px;
        top: -35px;
      }
      100% {
        right: -85px;
        top: -35px;
      }
    }

    .west-bot {
      right: -85px;
      top: -55px;
      position: absolute;

      animation: playWestBot 500ms, rotate 500ms;
    }

    @keyframes playWestBot {
      0% {
        right: 85px;
        top: -55px;
      }
      100% {
        right: -85px;
        top: -55px;
      }
    }

    .west {
      right: -85px;
      top: 10px;
      position: absolute;

      animation: playWest 500ms, rotate 500ms;
    }

    @keyframes playWest {
      0% {
        right: 85px;
        top: 10px;
      }
      100% {
        right: -85px;
        top: 10px;
      }
    }

    .east-top {
      left: -85px;
      top: -35px;
      position: absolute;

      animation: playEastTop 500ms, rotate 500ms;
    }

    @keyframes playEastTop {
      0% {
        left: 85px;
        top: -35px;
      }
      100% {
        left: -85px;
        top: -35px;
      }
    }

    .east-bot {
      left: -85px;
      top: -55px;
      position: absolute;

      animation: playEastBot 500ms, rotate 500ms;
    }

    @keyframes playEastBot {
      0% {
        left: 85px;
        top: -55px;
      }
      100% {
        left: -85px;
        top: -55px;
      }
    }

    .east {
      left: -85px;
      top: 10px;
      position: absolute;

      animation: playEast 500ms, rotate 500ms;
    }

    @keyframes playEast {
      0% {
        left: 85px;
        top: 10px;
      }
      100% {
        left: -85px;
        top: 10px;
      }
    }

    .south {
      position: absolute;
      bottom: -90px;

      animation: playSouth 500ms, rotate 500ms;
    }

    @keyframes playSouth {
      0% {
        bottom: -300px;
      }
      100% {
        bottom: -95px;
      }
    }

    img {
      width: 53.2px;
      border-radius: 10px;
      box-shadow: 2px 2px 5px #0000008c;
    }
  }

  .winner-north {
    animation: pickUpFoldNorth 1s ease 1s;
  }

  .winner-east-top {
    animation: pickUpFoldEastTop 1s ease 1s;
  }

  .winner-east-bot {
    animation: pickUpFoldEastBot 1s ease 1s;
  }

  .winner-east {
    animation: pickUpFoldEast 1s ease 1s;
  }

  .winner-west-bot {
    animation: pickUpFoldWestBot 1s ease 1s;
  }

  .winner-west-top {
    animation: pickUpFoldWestTop 1s ease 1s;
  }

  .winner-west {
    animation: pickUpFoldWest 1s ease 1s;
  }

  .winner-south {
    animation: pickUpFoldSouth 1s ease 1s;
  }

  .pick-up {
    margin-left: -26px !important;
    left: 50% !important;
    top: 50% !important;
    margin-top: -39px !important;

    &-north {
      animation: joinNorth 1s ease reverse;
    }

    &-south {
      animation: joinSouth 1s ease reverse;
    }

    &-west-top {
      animation: joinWestTop 1s ease reverse;
    }

    &-west-bot {
      animation: joinWestBot 1s ease reverse;
    }

    &-west {
      animation: joinWest 1s ease reverse;
    }

    &-east-top {
      animation: joinEastTop 1s ease reverse;
    }

    &-east-bot {
      animation: joinEastBot 1s ease reverse;
    }

    &-east {
      animation: joinEast 1s ease reverse;
    }
  }

  .slot-1--1 {
    bottom: 105px;
    left: 60px;
  }

  .slot-2--1 {
    bottom: 105px;
    left: 60px;
  }

  .slot-3--1 {
    bottom: 105px;
    left: 60px;
  }

  .slot-4--1 {
    bottom: 105px;
    left: 60px;
  }

  .slot-5--1 {
    bottom: 105px;
    left: 60px;
  }

  @keyframes pickUpFoldNorth {
    0% {
      transform: translateY(0px) translateX(0px);
    }
    100% {
      transform: translateY(-300px);
    }
  }

  @keyframes pickUpFoldEastTop {
    0% {
      transform: translateY(0px) translateX(0px);
    }
    100% {
      transform: translateY(-75px) translateX(150px);
    }
  }

  @keyframes pickUpFoldEastBot {
    0% {
      transform: translateY(0px) translateX(0px);
    }
    100% {
      transform: translateY(75px) translateX(150px);
    }
  }

  @keyframes pickUpFoldEast {
    0% {
      transform: translateY(0px) translateX(0px);
    }
    100% {
      transform: translateX(150px);
    }
  }

  @keyframes pickUpFoldWestBot {
    0% {
      transform: translateY(0px) translateX(0px);
    }
    100% {
      transform: translateY(75px) translateX(-150px);
    }
  }

  @keyframes pickUpFoldWestTop {
    0% {
      transform: translateY(0px) translateX(0px);
    }
    100% {
      transform: translateY(-75px) translateX(-150px);
    }
  }

  @keyframes pickUpFoldWest {
    0% {
      transform: translateY(0px) translateX(0px);
    }
    100% {
      transform: translateX(-150px);
    }
  }

  @keyframes pickUpFoldSouth {
    0% {
      transform: translateY(0px) translateX(0px);
    }
    100% {
      transform: translateY(300px);
    }
  }

  @keyframes joinEastTop {
    100% {
      transform: translateY(-70%) translateX(71%);
    }
  }

  @keyframes joinEast {
    100% {
      transform: translateX(70%);
    }
  }

  @keyframes joinEastBot {
    100% {
      transform: translateY(45%) translateX(71%);
    }
  }

  @keyframes joinSouth {
    100% {
      transform: translateY(123%) translateX(-5%);
    }
  }

  @keyframes joinNorth {
    100% {
      transform: translateY(-100%) translateX(-8%);
    }
  }

  @keyframes joinWestTop {
    100% {
      transform: translateY(-65%) translateX(-73%);
    }
  }

  @keyframes joinWestBot {
    100% {
      transform: translateY(45%) translateX(-73%);
    }
  }

  @keyframes joinWest {
    100% {
      transform: translateX(-70%);
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(45deg);
    }
    13% {
      transform: rotate(90deg);
    }

    25% {
      transform: rotate(135deg);
    }

    38% {
      transform: rotate(180deg);
    }

    50% {
      transform: rotate(225deg);
    }

    63% {
      transform: rotate(270deg);
    }

    75% {
      transform: rotate(315deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>

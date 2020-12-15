<template>
  <div class="game-table">
    <Fold
      :fold="fold"
      :players="playersOrdered"
      :current-user-id="currentUser.id"
      :winner-player-id="winnerPlayerId"
    />

    <GamePlayer
      :class="`slot-${playersOrdered.length}-${index}`"
      v-for="(player, index) in playersOrdered"
      :key="index"
      :player="player"
      :cardinality="cardinalities[playersOrdered.length][index]"
      :current-score="scorePerPlayer[player.id]"
      :is-current="player.id === currentPlayerId"
    ></GamePlayer>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Avatar from "@/modules/skullking/components/Avatar.vue";
import GameUser from "@/modules/game_room/game_user";
import GameRoom from "@/modules/game_room/game_room";
import { capitalize } from "lodash-es";
import GamePlayer from "@/modules/skullking/components/GamePlayer.vue";
import Fold from "@/modules/skullking/components/Fold.vue";
import Play from "@/modules/skullking/model/play";

@Component({
  components: { Fold, GamePlayer, Avatar },
  filters: { capitalize }
})
export default class GameTable extends Vue {
  @Prop() private gameId?: string;
  @Prop() private players?: string[];
  @Prop() private scorePerPlayer?: {
    [key: string]: { announced: number; done: number };
  };
  @Prop() private currentUser?: GameUser;
  @Prop() private currentPlayerId?: string;
  @Prop() private fold?: Play[];
  @Prop() private winnerPlayerId?: string;

  private cardinalities = {
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
      2: "east",
      3: "east"
    },
    5: {
      0: "west",
      1: "west",
      2: "north",
      3: "east",
      4: "east"
    }
  };

  private get playersOrdered(): (GameUser | undefined)[] {
    const players = this.players;
    const currentUserId = this.currentUser?.id;

    if (!currentUserId || !players) return [];
    return players
      ?.slice(players.indexOf(currentUserId) + 1, players.length)
      .concat(players.slice(0, players.indexOf(currentUserId)))
      .map(playerId => this.currentGameRoom?.users.find(u => u.id == playerId));
  }

  private get currentGameRoom(): GameRoom | undefined {
    return this.currentUser?.rooms.find(room => room.gameId == this.gameId);
  }
}
</script>
<style lang="scss">
.game-table {
  position: relative;
  width: 260px;
  height: 85%;
  border-radius: 9999px;
  background: #2f345d;
  max-width: 600px;
  max-height: 475px;
  padding: 15px;
  box-shadow: 11px 35px 50px #00000036;
  border: 4px solid #343966;

  // slots when 1 opponents
  .slot-1-0 {
    top: -30px;
    left: 50%;
    margin-left: -20px;
  }

  // slots when 2 opponents
  .slot-2-0 {
    top: -30px;
    left: 50%;
    margin-left: -20px;
  }

  .slot-2-1 {
    right: -30px;
    top: 50%;
    margin-top: -40px;
  }

  // slots when 3 opponents
  .slot-3-0 {
    left: -30px;
    top: 50%;
    margin-top: -40px;
  }

  .slot-3-1 {
    top: -30px;
    left: 50%;
    margin-left: -20px;
  }

  .slot-3-2 {
    right: -30px;
    top: 50%;
    margin-top: -40px;
  }

  // slots when 4 opponents
  .slot-4-0 {
    left: -30px;
    top: 50%;
    margin-top: -20px;
  }

  .slot-4-1 {
    top: -50px;
    left: 50%;
    margin-left: -20px;
  }

  .slot-4-2 {
    right: -30px;
    top: 30%;
    margin-top: -20px;
  }

  .slot-4-3 {
    margin-bottom: -20px;
    bottom: 30%;
    right: -35px;
  }

  // slots when 5 opponents
  .slot-5-0 {
    bottom: 33%;
    left: -30px;
  }

  .slot-5-1 {
    left: -30px;
    bottom: 60%;
  }

  .slot-5-2 {
    top: -30px;
    left: 50%;
    margin-left: -20px;
  }

  .slot-5-3 {
    bottom: 60%;
    right: -30px;
  }

  .slot-5-4 {
    bottom: 33%;
    right: -30px;
  }
}
</style>

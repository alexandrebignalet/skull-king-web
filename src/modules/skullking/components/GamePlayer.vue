<template>
  <div class="game-player" :class="{ current: isCurrent }">
    <Avatar :type="avatar" class="avatar" />
    <div class="username">{{ player.pseudo | capitalize }}</div>
    <PlayerAnnounce :current-score="currentScore" :class="cardinality" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { capitalize } from "lodash-es";
import GameInfo from "@/modules/skullking/components/GameInfo.vue";
import Avatar from "@/modules/skullking/components/Avatar.vue";
import GameUser from "@/modules/game_room/game_user";
import PlayerAnnounce from "@/modules/skullking/components/PlayerAnnounce.vue";

@Component({
  components: { PlayerAnnounce, GameInfo, Avatar },
  filters: { capitalize }
})
export default class GamePlayer extends Vue {
  @Prop() player?: GameUser;
  @Prop() cardinality?: string;
  @Prop() currentScore?: { announced: number; done: number };
  @Prop() isCurrent?: boolean;

  get avatar() {
    if (!this.player) return "";
    return this.$store.getters["skullKing/avatarFor"](this.player.id);
  }

  get isEast() {
    return this.cardinality === "east";
  }

  get scoreRight() {
    return this.cardinality === "west";
  }

  get scoreLeft() {
    return this.cardinality === "north";
  }
}
</script>
<style lang="scss">
.current {
  border-radius: 15px;
  border: 2px solid #2792aa;
}

.game-player {
  position: absolute;

  .avatar {
    box-shadow: 0 5px 10px #00000045;
  }

  .west {
    left: 27px;

    .bg {
      left: 10px;
    }

    .pscore {
      text-align: right;
    }
  }

  .north {
    .bg {
      left: -30px;
    }

    .pscore {
      text-align: left;
      left: -25px;
    }
  }

  .east {
    right: 27px;

    .bg {
      right: 5px;
    }

    .pscore {
      text-align: left;
      left: -5px;
    }

    .coin {
      right: 0;
    }
  }
}
</style>

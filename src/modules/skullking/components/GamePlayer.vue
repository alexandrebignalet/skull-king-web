<template>
  <div class="game-player">
    <div class="avatar-wrapper" :class="{ active: userId === currentPlayerId }">
      <b-avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
      />
    </div>
    <h3 v-if="userName">{{ userName.toUpperCase() }}</h3>
    <GameInfo :game="game" :player-id="userId" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameInfo from "@/modules/skullking/components/GameInfo.vue";
import Skullking from "@/modules/skullking/model/skullking";

@Component({
  components: { GameInfo }
})
export default class GamePlayer extends Vue {
  @Prop() game?: Skullking;
  @Prop() user?: { id: string; name: string };
  @Prop() currentPlayerId?: string;

  get userId(): string | undefined {
    return this.user?.id;
  }

  get userName(): string | undefined {
    return this.user?.name;
  }
}
</script>
<style media="all">
.avatar-wrapper {
  border-radius: 50%;
  display: inline-block;
  border: 1px solid transparent;
  height: 40px;
  width: 40px;
}

.active {
  border: 1px solid red;
}

@media (max-width: 1000px) {
  .game-player {
    font-size: 12px;
  }
}
</style>
<style media="screen"></style>
<style media="handheld"></style>

<template>
  <div class="game-player">
    <div
      class="avatar-wrapper"
      :class="{ active: user.id === currentPlayerId }"
    >
      <a-avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
      />
    </div>
    <h3>{{ user.name | capitalize }}</h3>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { capitalize } from "lodash-es";

@Component({
  filters: { capitalize }
})
export default class GamePlayer extends Vue {
  @Prop() user?: { id: string; name: string };
  @Prop() currentPlayerId?: string;
}
</script>
<style lang="scss" media="all">
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
<style lang="scss" media="screen"></style>
<style lang="scss" media="handheld"></style>

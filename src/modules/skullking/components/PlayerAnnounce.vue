<template>
  <div class="announce" v-if="currentScore">
    <div class="bg"></div>
    <div class="coin"></div>
    <div class="pscore">
      {{ currentScore.done }} | {{ currentScore.announced }}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Score from "../model/score";

@Component
export default class extends Vue {
  @Prop() currentScore?: Score;
}
</script>
<style lang="scss">
.username {
  font-size: 12px;
  max-width: 35px;
  text-align: center;
  color: #d9dbec;
  font-weight: 700;
  text-overflow: ellipsis;
  overflow: hidden;
  position: absolute;
}

.announce {
  position: relative;
  top: 25px;

  .bg {
    position: absolute;
    background: #2f345c;
    border-radius: 50px;
    height: 15px;
    width: 45px;
    top: 4px;
  }

  .coin {
    position: absolute;
    background: url("../../../assets/coin.png");
    width: 22px;
    height: 22px;
    background-size: contain;
  }

  .pscore {
    position: absolute;
    width: 50px;
    font-size: 8px;
    font-weight: 700;
    color: #6b73a8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    top: 5px;
    padding: 0 4px 0 2px;
  }
}
</style>

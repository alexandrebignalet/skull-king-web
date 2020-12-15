<template>
  <div class="announce-choices">
    <button
      @click="announce(choice)"
      v-for="choice in choices"
      :key="choice"
      class="announce-choice"
    >
      {{ choice }}
    </button>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Announce extends Vue {
  @Prop() private roundNb?: number;

  get choices() {
    return this.roundNb ? [...Array(this.roundNb + 1).keys()] : [];
  }

  announce(count: number) {
    if (this.isActionNotAllowed) {
      return this.$message.warn("Attteeends ça charge !");
    }

    this.$store.dispatch("skullKing/announce", count);
  }

  get isActionNotAllowed() {
    return this.$store.getters["site/isActionNotAllowed"];
  }
}
</script>
<style lang="scss">
.announce-choices {
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  position: absolute;
  flex-basis: 100%;
  justify-content: space-evenly;
  padding: 30px;
  bottom: 0;
  right: 0;
}

.announce-choice {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(to bottom, #6a59ff 0%, #8175ec 100%);
  font-weight: 700;
  line-height: 32px;
  font-size: 25px;
  color: white;
  border: 2px solid #433c96;
  cursor: pointer;
  font-family: "Source Sans Pro", monospace;

  &:focus {
    outline: 0;
  }

  &:hover {
    background: #6a59ff;
  }

  &:active {
    background: #8175ec;
  }
}
</style>

<template>
  <div>
    <h4>Game rooms</h4>
    <button @click="createGameRoom">Create</button>
    <ul>
      <li v-for="room in gameRooms" :key="room.id">{{ room }}</li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameRoom from "@/modules/game_room/game_room";

@Component
export default class GameRooms extends Vue {
  @Prop() private gameRooms?: GameRoom[];

  createGameRoom() {
    this.$store.dispatch("gameRoom/createGameRoom");
  }
}
</script>

<style></style>

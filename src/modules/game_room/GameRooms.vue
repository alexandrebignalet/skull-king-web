<template>
  <div class="main-container">
    <img src="@/assets/skullking-title.png" alt="logo" class="logo" />

    <div class="title">Lobby</div>
    <div class="list-container">
      <div
        class="list-item-container"
        @click="goToGameRoom(room.id)"
        v-for="room in gameRooms"
        :key="room.id"
      >
        <Avatar type="mermaid" class="avatar" />
        <div class="middle-content">
          <div class="room-state">
            <div v-if="room.gameId">Partie en cours</div>
            <div v-else>En cours de création</div>
          </div>
          <div class="sub-title">Créé le {{ room.createdAt }}</div>
        </div>
        <div class="right-content">
          {{ room.users.length }}
          <img
            src="@/assets/icn_crown_32.png"
            alt="leader"
            v-if="room.isFull"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameRoom from "@/modules/game_room/game_room";
import GameUser from "@/modules/game_room/game_user";
import Avatar from "@/modules/skullking/components/Avatar.vue";
import { capitalize } from "lodash-es";

@Component({ components: { Avatar }, filters: { capitalize } })
export default class GameRooms extends Vue {
  @Prop() private gameRooms?: GameRoom[];
  @Prop() private currentUser?: GameUser;
  private isLoading = false;

  canStartGame(room: GameRoom) {
    return (
      !!this.currentUser &&
      room.isGameLaunchable &&
      room.isCreator(this.currentUser) &&
      !room.gameId
    );
  }

  createGameRoom() {
    this.isLoading = true;
    this.$store.dispatch("gameRoom/createGameRoom").finally(() => {
      this.isLoading = false;
    });
  }

  joinGameRoom(gameRoomId: string) {
    this.isLoading = true;
    this.$store.dispatch("gameRoom/joinGameRoom", gameRoomId).finally(() => {
      this.isLoading = false;
    });
  }

  leaveGameRoom(gameRoomId: string) {
    this.isLoading = true;
    this.$store
      .dispatch("gameRoom/kickFromGameRoom", {
        gameRoomId,
        userId: this.currentUser?.id
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  startGame(gameRoomId: string) {
    this.isLoading = true;
    this.$store.dispatch("gameRoom/startGame", gameRoomId).finally(() => {
      this.isLoading = false;
    });
  }

  goToGame(gameId: string) {
    return this.$router.push({ name: "game", params: { id: gameId } });
  }

  goToGameRoom(roomId: string) {
    return this.$router.push({ name: "game_room", params: { id: roomId } });
  }
}
</script>
<style lang="scss">
.main-container {
  margin-top: 0;
  .list-container {
    .list-item-container {
      cursor: pointer;

      &:hover {
        box-shadow: unset;
      }

      .middle-content {
        text-transform: none;
        .room-state {
        }

        .sub-title {
          font-size: 12px;
          font-weight: normal;
          color: #d9dbec;
        }
      }
    }
  }
}
.game-rooms-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: left;
}
.game-room-item {
  margin-bottom: 15px;
}
.ant-card-head-title {
  text-align: left;
}
.ant-card-body {
  padding: 24px 24px 0 24px;
}
</style>

<template>
  <div class="game-room">
    <div class="main-container">
      <div class="title">
        <div class="text">Joueurs</div>

        <a-icon type="user-add" @click="toggleLinkSharing"></a-icon>
      </div>

      <transition
        name="slide"
        enter-active-class="slide-enter-active"
        leave-active-class="slide-leave-active"
      >
        <div class="link-sharing" v-if="showSharing">
          <button class="share-btn" @click="copy()">
            <a-icon type="copy" class="copy-link" />
          </button>
          <button class="share-btn" @click="share('whatsapp')">
            <img src="@/assets/share_whatsapp.png" alt="share whatsapp" />
          </button>
        </div>
      </transition>

      <div class="list-container">
        <div
          class="list-item-container"
          v-for="user in room.users"
          :key="user.id"
        >
          <Avatar type="davy-jones" class="avatar" />
          <div class="middle-content">
            {{ user.pseudo }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameRoomModel from "@/modules/game_room/game_room";
import GameUser from "@/modules/game_room/game_user";
import Avatar from "@/modules/skullking/components/Avatar.vue";
import { capitalize } from "lodash-es";
import { buildGameRoomLink, shareJoinGameRoomLink } from "@/modules/site/utils";

@Component({ components: { Avatar }, filters: { capitalize } })
export default class GameRoom extends Vue {
  @Prop() private room?: GameRoomModel;
  @Prop() private currentUser?: GameUser;
  private isLoading = false;
  private showSharing = false;

  toggleLinkSharing() {
    this.showSharing = !this.showSharing;
  }

  share(provider: string) {
    shareJoinGameRoomLink(this.room?.id, provider);
  }

  copy() {
    navigator.clipboard
      .writeText(buildGameRoomLink(this.room?.id))
      .then(() => this.$message.info("Lien copié"));
  }

  canStartGame(room: GameRoomModel) {
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
    return this.$router.push({ name: "game-room", params: { id: roomId } });
  }
}
</script>
<style lang="scss">
.slide-enter-active {
  animation: slide 0.5s ease;

  .link-sharing {
    z-index: -1;
    .share-btn {
      z-index: -1;
    }
  }
}
.slide-leave-active {
  animation: slide 0.5s ease reverse;

  .link-sharing {
    z-index: -1;
    .share-btn {
      z-index: -1;
    }
  }
}
@keyframes slide {
  0% {
    height: 0;
  }
  100% {
    height: 45px;
  }
}

.game-room {
  z-index: 1;
  height: 100%;

  .main-container {
    .title {
      display: flex;
      align-items: center;

      .text {
        flex-grow: 1;
        font-size: 32px;
      }

      .anticon {
        font-size: 20px;
        color: #5c6393;
        margin-top: 5px;
      }
    }

    .link-sharing {
      margin: 0 20px 20px 20px;
      color: white;

      .share-btn {
        margin-right: 20px;
        background-color: transparent;
        border: none;
        box-shadow: 0 5px 5px black;
        width: 40px;
        height: 40px;
        padding: unset;
        border-radius: 10px;

        .copy-link {
          margin-top: -6px;
          border: 1px solid #6a59ff;
          background: linear-gradient(#363d6b, #383e6e);
          color: #e7e9f6;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        &:focus {
          outline: 0;
        }

        img {
          max-width: 40px;
          border-radius: 10px;
        }

        &:active {
          box-shadow: unset;
        }
      }
    }

    .list-container {
      .list-item-container {
        .middle-content {
          text-transform: capitalize;
        }
      }
    }
  }
}
</style>

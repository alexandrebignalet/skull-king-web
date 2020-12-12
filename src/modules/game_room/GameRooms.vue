<template>
  <div>
    <a-card title="Mes salons">
      <a-button
        type="default"
        @click="createGameRoom"
        slot="extra"
        :loading="isLoading"
      >
        <a-icon type="plus" />
        Nouveau salon
      </a-button>
      <a-list item-layout="horizontal" :data-source="gameRooms">
        <a-list-item slot="renderItem" slot-scope="room" class="game-room-item">
          <a-list-item-meta>
            <a-badge
              slot="avatar"
              :count="room.users.length"
              :number-style="resolveBadgeColor(room)"
              show-zero
            >
              <a-avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </a-badge>

            <div slot="title">
              Salon créé le <b>{{ room.createdAt }}</b> par
              <b>{{ room.userCreator.name }}</b>
            </div>
          </a-list-item-meta>
          <div>
            <a-space>
              <a-badge
                v-for="user in room.users"
                :key="user.id"
                :number-style="pickColorForUser(user.id)"
                :count="user.name"
              />
            </a-space>
          </div>

          <a-badge
            v-if="room.gameId"
            @click="goToGame(room.gameId)"
            count="Partie en cours"
            :number-style="{ backgroundColor: '#722ed1', cursor: 'pointer' }"
          />
          <a-button
            type="primary"
            v-if="canStartGame(room)"
            @click="startGame(room.id)"
          >
            <a-icon type="rocket" />
            Lancer
          </a-button>

          <a-button
            type="default"
            slot="actions"
            @click="joinGameRoom(room.id)"
            v-if="!room.hasUser(currentUser) && !room.isFull && !room.gameId"
          >
            <a-icon type="login" />
            Rejoindre
          </a-button>

          <div slot="actions" v-if="room.isFull">Salon plein</div>

          <a
            v-if="room.hasUser(currentUser) && !room.gameId"
            @click="leaveGameRoom(room.id)"
            slot="actions"
          >
            <a-icon type="logout" />
            Quitter
          </a>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameRoom from "@/modules/game_room/game_room";
import GameUser from "@/modules/game_room/game_user";

@Component
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

  pickColorForUser(userId: string) {
    if (userId == this.currentUser?.id) return { backgroundColor: "#1890ff" };
    return {
      backgroundColor: "#fff",
      color: "#999",
      boxShadow: "0 0 0 1px #d9d9d9 inset"
    };
  }

  resolveBadgeColor({ users }: GameRoom): { backgroundColor: string } {
    let color;
    if (users.length < 4) color = "#52c41a";
    else if (users.length < 5) color = "#fa8c16";
    else color = "#f5222d";
    return { backgroundColor: color };
  }
}
</script>
<style lang="scss">
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

<template>
  <b-container class="d-flex flex-column gap-3">
    <h2>Salons de {{ currentUser.name }}</h2>
    <b-button v-b-modal="'create-game-room'" :disabled="isLoading">
      <b-icon icon="plus" />
      Nouveau salon
    </b-button>

    <b-list-group v-if="gameRooms">
      <b-list-group-item
        class="game-room-item"
        v-for="room in gameRooms"
        :key="room.id"
      >
        <div>
          <b-badge pill variant="primary">Primary</b-badge>

          <b-badge pill variant="primary">{{ room.users.length }}</b-badge>
        </div>

        <div>
          Salon créé le <b>{{ room.createdAt }}</b> par
          <b>{{ room.userCreator.name }}</b>
        </div>
        <div>
          <u>joueurs</u>:
          <strong v-for="user in room.users" :key="user.id">
            {{ user.name }} |</strong
          >
        </div>
        <div class="d-flex  gap-3 justify-content-end">
          <b-button
            v-if="room.gameId"
            @click="goToGame(room.gameId)"
            variant="primary"
            >Entrer
          </b-button>

          <b-button
            variant="success"
            v-if="canStartGame(room)"
            @click="startGame(room.id)"
            >Lancer
          </b-button>

          <b-button
            variant="info"
            @click="joinGameRoom(room.id)"
            v-if="!room.hasUser(currentUser) && !room.isFull && !room.gameId"
            >Rejoindre
          </b-button>

          <div slot="actions" v-if="room.isFull">Salon plein</div>
        </div>
      </b-list-group-item>
    </b-list-group>
    <b-modal id="create-game-room" title="Configuration de partie">
      <div>
        <b-form-group label="version" v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            id="radio-group-2"
            v-model="form.variant"
            :aria-describedby="ariaDescribedby"
            name="version"
          >
            <b-form-radio
              v-for="variant in variants"
              :value="variant"
              :key="variant"
            >
              <strong> {{ variant }}</strong>
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-form-group v-if="form.variant === variants.BLACKROCK">
          <b-form-checkbox
            id="checkbox-kraken"
            v-model="form.kraken"
            name="kraken"
          >
            Kraken
          </b-form-checkbox>
          <b-form-checkbox
            id="checkbox-whiteWhale"
            v-model="form.whiteWhale"
            name="whiteWhale"
          >
            Baleine blanche
          </b-form-checkbox>
          <b-form-checkbox
            id="checkbox-butins"
            v-model="form.butins"
            name="butins"
          >
            Butins
          </b-form-checkbox>
        </b-form-group>
      </div>

      <template #modal-footer="{ ok, cancel }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button
          size="sm"
          variant="success"
          @click="createGameRoom"
          :disabled="isLoading"
        >
          Démarrer
        </b-button>
        <b-button size="sm" variant="danger" @click="cancel()">
          Annuler
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GameRoom from "@/modules/game_room/game_room";
import GameUser from "@/modules/game_room/game_user";
import { ValuesOf } from "@/utils";

export const variants = {
  CLASSIC: "CLASSIC",
  BLACKROCK: "BLACKROCK"
} as const;
export type Variant = ValuesOf<typeof variants>;

export type CreateGameRoomForm = {
  variant: Variant;
  kraken: boolean;
  whiteWhale: boolean;
  butins: boolean;
};

@Component
export default class GameRooms extends Vue {
  @Prop() private gameRooms?: GameRoom[];
  @Prop() private currentUser?: GameUser;
  private isLoading = false;

  private variants = variants;

  private form: CreateGameRoomForm = {
    variant: variants.CLASSIC,
    kraken: false,
    whiteWhale: false,
    butins: false
  };

  canStartGame(room: GameRoom) {
    return (
      !!this.currentUser &&
      room.isGameLaunchable &&
      room.isCreator(this.currentUser) &&
      !room.gameId
    );
  }

  createGameRoom() {
    this.$bvModal.show("create-game-room");
    this.isLoading = true;
    this.$store.dispatch("gameRoom/createGameRoom", this.form).finally(() => {
      this.isLoading = false;
      this.$bvModal.hide("create-game-room");
    });
  }

  joinGameRoom(gameRoomId: string) {
    this.isLoading = true;
    this.$store.dispatch("gameRoom/joinGameRoom", gameRoomId).finally(() => {
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

  resolveBadgeColor({ users }: GameRoom): string {
    let color;
    if (users.length < 4) color = "success";
    else if (users.length < 5) color = "warning";
    else color = "danger";
    return color;
  }
}
</script>

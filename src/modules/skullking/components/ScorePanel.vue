<template>
  <div class="score-panel">
    <a-drawer
      title="Tableau des scores"
      :visible="visible"
      :closable="closable"
      @close="onClose"
    >
      <div>
        <table>
          <thead class="ant-table-thead">
            <th
              class="ant-table-header-column"
              v-for="playerId in scoreTable.columns"
              :key="playerId"
            >
              <div class="ant-table-column-title">
                {{ userNameFrom(playerId) | capitalize }}
              </div>
            </th>
          </thead>
          <tbody class="ant-table-tbody">
            <tr
              class="ant-table-row ant-table-row-level-0"
              v-for="(scores, roundNb) in scoreTable.rows"
              :key="roundNb"
            >
              <th>{{ roundNb }}</th>
              <td v-for="(score, index) in scores" :key="index">
                <Score :score="score" />
              </td>
            </tr>
            <tr class="ant-table-row ant-table-row-level-0">
              <th
                v-for="(total, index) in scoreTable.totals"
                :key="index"
                class="total"
              >
                <h2>{{ total }}</h2>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="return-game-rooms">
        <a-button type="primary" @click="goToGameRooms"
          >Repartir aux salons</a-button
        >
      </div>
    </a-drawer>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ScoreModel from "../model/score";
import Score from "@/modules/skullking/components/Score.vue";
import { capitalize } from "lodash-es";

@Component({ components: { Score }, filters: { capitalize } })
export default class ScorePanel extends Vue {
  @Prop() scoreTable?: {
    columns: string[];
    rows: { [key: number]: ScoreModel[] };
    totals: any[];
  };
  @Prop() playerNames: { [key: string]: string } | undefined;
  @Prop() visible?: boolean;
  @Prop() closable?: boolean;

  private goToGameRooms() {
    this.$router.push({ name: "game_rooms" });
  }

  private userNameFrom(userId: string): string {
    return this.playerNames ? this.playerNames[userId] : "";
  }

  onClose() {
    this.$emit("close");
  }
}
</script>
<style lang="scss" media="all">
.ant-table-column-title {
  text-align: center !important;
}
.total {
  text-align: center;
}
.return-game-rooms {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.ant-drawer-content-wrapper {
  width: 80% !important;
}
.ant-drawer-header {
  text-align: center;
}
.ant-drawer-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

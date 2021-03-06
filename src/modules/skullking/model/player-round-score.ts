import Score from "@/modules/skullking/model/score";

export default class PlayerRoundScore {
  public playerId: string;
  public roundNb: number;
  public score: Score;

  static of(playerRoundScore: any): PlayerRoundScore {
    return new PlayerRoundScore(
      playerRoundScore.player_id,
      playerRoundScore.round_nb,
      playerRoundScore.score
        ? Score.of(playerRoundScore.score)
        : new Score(0, 0, 0)
    );
  }

  constructor(playerId: string, roundNb: number, score: Score) {
    this.playerId = playerId;
    this.roundNb = roundNb;
    this.score = score;
  }

  get points(): number {
    return this.score.points(this.roundNb);
  }
}

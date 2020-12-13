import Play from "@/modules/skullking/model/play";
import Card from "@/modules/skullking/model/card";

export default class Score {
  public readonly announced: number;
  public readonly done: number;
  public readonly potentialBonus: number;

  static of(score: any): Score {
    return new Score(score.announced, score.done, score.potential_bonus);
  }

  constructor(announced: number, done: number, potentialBonus: number) {
    this.announced = announced;
    this.done = done;
    this.potentialBonus = potentialBonus;
  }

  points(roundNb: number): number {
    if (this.done === this.announced) {
      return this.announced === 0
        ? roundNb * 10
        : this.announced * 20 + this.potentialBonus;
    } else {
      return this.announced === 0
        ? -(roundNb * 10)
        : -(Math.abs(this.done - this.announced) * 10);
    }
  }
}

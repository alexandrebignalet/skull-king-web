import Card from "@/modules/skullking/model/card";

export default class Play {
  public playerId: string;
  public card: Card;

  static of(play: any): Play {
    return new Play(play.player_id, play.card);
  }

  constructor(playerId: string, card: Card) {
    this.playerId = playerId;
    this.card = card;
  }
}

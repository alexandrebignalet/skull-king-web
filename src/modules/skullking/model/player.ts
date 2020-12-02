import Card from "@/modules/skullking/model/card";

export default class Player {
  public id: string;
  public isCurrent: boolean;
  public cards: Card[];

  static of(player: any) {
    const cards = player.cards ? player.cards : [];
    return new Player(
      player.id,
      player.is_current,
      cards.map((c: any) => Card.of(c))
    );
  }

  constructor(id: string, isCurrent: boolean, cards: Card[]) {
    this.id = id;
    this.isCurrent = isCurrent;
    this.cards = cards;
  }
}

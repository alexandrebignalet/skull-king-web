import { CardType } from "@/modules/skullking/model/card-type.enum";
import { CardColor } from "@/modules/skullking/model/card-color.enum";
import { ScaryMaryUsage } from "@/modules/skullking/model/scary-mary-usage.enum";

export default class Card {
  public readonly id: string;
  public readonly type: CardType;
  public readonly color?: CardColor;
  public readonly value?: number;
  public readonly usage?: ScaryMaryUsage;
  public readonly name?: string;

  static of(card: any): Card {
    return new Card(
      card.id,
      card.type,
      card.color,
      card.value,
      card.usage,
      card.name
    );
  }

  constructor(
    id: string,
    type: CardType,
    color?: CardColor,
    value?: number,
    usage?: ScaryMaryUsage,
    name?: string
  ) {
    this.id = id;
    this.type = type;
    this.color = color;
    this.value = value;
    this.usage = usage;
    this.name = name;
  }
}

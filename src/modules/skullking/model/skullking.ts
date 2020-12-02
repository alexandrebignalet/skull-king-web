import Play from "@/modules/skullking/model/play";
import Card from "@/modules/skullking/model/card";
import PlayerRoundScore from "@/modules/skullking/model/player-round-score";

export default class Skullking {
  public readonly id: string;
  public readonly firstPlayerId: string;
  public readonly fold?: Play[];
  public readonly isEnded: boolean;
  public readonly roundNb: number;
  public readonly players: string[];
  public readonly scoreBoard: PlayerRoundScore[];

  static of(game: any): Skullking {
    const fold = game.fold ? game.fold : [];
    const scoreBoard = game.scoreBoard ? game.scoreBoard : [];
    return new Skullking(
      game.id,
      game.first_player_id,
      fold.map((p: any) => Play.of(p)),
      game.is_ended,
      game.round_nb,
      game.players,
      scoreBoard
    );
  }

  constructor(
    id: string,
    firstPlayerId: string,
    fold: Play[],
    isEnded: boolean,
    roundNb: number,
    players: string[],
    scoreBoard: PlayerRoundScore[]
  ) {
    this.id = id;
    this.firstPlayerId = firstPlayerId;
    this.fold = fold;
    this.isEnded = isEnded;
    this.roundNb = roundNb;
    this.players = players;
    this.scoreBoard = scoreBoard;
  }

  get foldCards() {
    return this.fold?.map((p: Play) => Card.of(p.card));
  }
}

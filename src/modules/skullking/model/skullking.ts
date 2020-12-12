import Play from "@/modules/skullking/model/play";
import Card from "@/modules/skullking/model/card";
import PlayerRoundScore from "@/modules/skullking/model/player-round-score";
import { debounce } from "lodash-es";

enum SkullkingPhase {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  CARDS = "CARDS"
}

export default class Skullking {
  public readonly id: string;
  public readonly currentPlayerId: string;
  public readonly fold?: Play[];
  public readonly phase: SkullkingPhase;
  public readonly isEnded: boolean;
  public readonly roundNb: number;
  public readonly players: string[];
  public readonly scoreBoard: PlayerRoundScore[];

  static of(game: any): Skullking {
    const fold = game.fold ? game.fold : [];
    const scoreBoard = game.score_board ? game.score_board : [];
    const phase =
      game.phase == SkullkingPhase.ANNOUNCEMENT
        ? SkullkingPhase.ANNOUNCEMENT
        : SkullkingPhase.CARDS;
    return new Skullking(
      game.id,
      game.current_player_id,
      fold.map((p: any) => Play.of(p)),
      phase,
      game.is_ended,
      game.round_nb,
      game.players,
      scoreBoard.map((prs: any) => PlayerRoundScore.of(prs))
    );
  }

  constructor(
    id: string,
    currentPlayerId: string,
    fold: Play[],
    phase: SkullkingPhase,
    isEnded: boolean,
    roundNb: number,
    players: string[],
    scoreBoard: PlayerRoundScore[]
  ) {
    this.id = id;
    this.currentPlayerId = currentPlayerId;
    this.fold = fold;
    this.phase = phase;
    this.isEnded = isEnded;
    this.roundNb = roundNb;
    this.players = players;
    this.scoreBoard = scoreBoard;
  }

  get isAnnouncementPhase() {
    return this.phase == SkullkingPhase.ANNOUNCEMENT;
  }

  get isCardsPhase() {
    return this.phase == SkullkingPhase.CARDS;
  }

  get foldCards() {
    return this.fold?.map(p => p.card);
  }

  currentPlayerRoundScore(playerId: string): PlayerRoundScore | undefined {
    return this.scoreBoard.find(
      prs => prs.playerId === playerId && prs.roundNb === this.roundNb
    );
  }

  get mapScore() {
    return this.scoreBoard.reduce(
      (acc: { [key: string]: { [key: number]: {} } }, curr) => ({
        ...acc,
        [curr.playerId]: {
          ...acc[curr.playerId],
          [curr.roundNb]: curr.score
        }
      }),
      {}
    );
  }
}

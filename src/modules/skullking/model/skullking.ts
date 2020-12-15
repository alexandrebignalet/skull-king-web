import Play from "@/modules/skullking/model/play";
import PlayerRoundScore from "@/modules/skullking/model/player-round-score";
import Score from "@/modules/skullking/model/score";

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
    const fold = game.fold ? Object.values(game.fold) : [];
    const scoreBoard = game.score_board ? Object.values(game.score_board) : [];
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

  public isNextRound(other: Skullking): boolean {
    return (
      this.phase === SkullkingPhase.ANNOUNCEMENT &&
      other.phase === SkullkingPhase.CARDS
    );
  }

  public isFoldEnded(other: Skullking): boolean {
    return (
      this.fold?.length === 0 && other.fold?.length === other?.players.length
    );
  }

  currentPlayerRoundScore(playerId: string): PlayerRoundScore | undefined {
    return this.scoreBoard.find(
      prs => prs.playerId === playerId && prs.roundNb === this.roundNb
    );
  }

  totalScoreFor(playerId: string): number {
    return this.scoreBoard
      .filter(prs => prs.playerId === playerId)
      .reduce((acc, curr) => acc + curr.points, 0);
  }

  get currentRoundScorePerPlayer(): { [key: string]: Score } {
    return this.scoreBoard
      .filter(prs => prs.roundNb === this.roundNb)
      .reduce(
        (acc: { [key: string]: Score }, curr: PlayerRoundScore) => ({
          ...acc,
          [curr.playerId]: curr.score
        }),
        {}
      );
  }

  get leaders(): string[] {
    const playerPerPoints = this.players
      .map((playerId: string) => ({
        playerId,
        total: this.totalScoreFor(playerId)
      }))
      .reduce(
        (acc: any, curr: any) => ({
          ...acc,
          [curr?.total]: acc[curr?.total]
            ? acc[curr?.total].concat(curr.playerId)
            : [curr.playerId]
        }),
        {}
      );

    const maxPoints = Object.keys(playerPerPoints).reduce(
      (acc, curr) => (+curr > acc ? +curr : acc),
      0
    );
    return playerPerPoints[maxPoints];
  }
}

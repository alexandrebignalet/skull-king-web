export default class GameRoom {
  private id: string;
  private creator: string;
  private users: string[];
  private gameId?: string;

  constructor(id: string, creator: string, users: string[], gameId?: string) {
    this.id = id;
    this.creator = creator;
    this.users = users;
    this.gameId = gameId;
  }
}

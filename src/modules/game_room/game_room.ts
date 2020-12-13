import GameUser from "@/modules/game_room/game_user";

export default class GameRoom {
  public id: string;
  public creator: string;
  public users: GameUser[];
  public gameId?: string;
  public creationDate: number;

  static of(rawGameRoom: any): GameRoom {
    const gameUsers = rawGameRoom.users.map(
      (it: { id: string; name: string }) => GameUser.of(it)
    );
    return new GameRoom(
      rawGameRoom.id,
      rawGameRoom.creator,
      gameUsers,
      rawGameRoom.creation_date,
      rawGameRoom.game_id
    );
  }

  constructor(
    id: string,
    creator: string,
    users: GameUser[],
    creationDate: number,
    gameId?: string
  ) {
    this.id = id;
    this.creator = creator;
    this.users = users;
    this.gameId = gameId;
    this.creationDate = creationDate;
  }

  get retrieveCreator() {
    return this.users.find(user => user.id === this.creator)?.name;
  }

  get createdAt() {
    return new Date(this.creationDate).toLocaleString();
  }

  get isFull(): boolean {
    return this.users.length === 6;
  }

  get isGameLaunchable(): boolean {
    return this.users.length >= 2;
  }

  hasUser(currentUser?: GameUser): boolean {
    return (
      currentUser != null &&
      this.users.map(userInRoom => userInRoom.id).indexOf(currentUser.id) !== -1
    );
  }

  isCreator(user: GameUser): boolean {
    return this.creator === user.id;
  }

  get userCreator() {
    return this.users.find(u => u.id === this.creator);
  }

  get userNamesPerId() {
    return this.users.reduce((acc: { [key: string]: string }, user) => {
      return {
        ...acc,
        [user.id]: user.name
      };
    }, {});
  }
}

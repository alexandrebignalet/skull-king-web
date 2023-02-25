import GameUser, { RawUser } from "@/modules/game_room/game_user";

export type RawRoom = {
  id: string;
  creation_date: number;
  creator: string;
  game_id: string;
  users: RawUser[];
  configuration?: any;
};

export default class GameRoom {
  public id: string;
  public creator: string;
  public users: GameUser[];
  public gameId?: string;
  public creationDate: number;
  public isBlackrock: boolean;

  static of(rawGameRoom: RawRoom): GameRoom {
    const gameUsers = rawGameRoom.users.map((it: RawUser) => GameUser.of(it));
    return new GameRoom(
      rawGameRoom.id,
      rawGameRoom.creator,
      gameUsers,
      rawGameRoom.creation_date,
      !!rawGameRoom.configuration,
      rawGameRoom.game_id
    );
  }

  constructor(
    id: string,
    creator: string,
    users: GameUser[],
    creationDate: number,
    isBlackrock: boolean,
    gameId?: string
  ) {
    this.id = id;
    this.creator = creator;
    this.users = users;
    this.gameId = gameId;
    this.creationDate = creationDate;
    this.isBlackrock = isBlackrock;
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

import GameRoom from "@/modules/game_room/game_room";

export default class GameUser {
  public id: string;
  public pseudo: string;
  public avatarURL: string;
  public rooms: GameRoom[];

  static of(rawUser: any): GameUser {
    const rawRooms = Object.values(rawUser.rooms || {});
    return new GameUser(
      rawUser.id,
      rawUser.name,
      rawUser.photoURL,
      rawRooms.map((raw: any) => GameRoom.of(raw))
    );
  }

  constructor(
    id: string,
    pseudo: string,
    avatarURL: string,
    rooms: GameRoom[]
  ) {
    this.id = id;
    this.pseudo = pseudo;
    this.avatarURL = avatarURL;
    this.rooms = rooms;
  }
}

import GameRoom from "@/modules/game_room/game_room";

export default class GameUser {
  public id: string;
  public name: string;
  public rooms: GameRoom[];

  static of(rawUser: any): GameUser {
    const rawRooms = Object.values(rawUser.rooms || {});
    return new GameUser(
      rawUser.id,
      rawUser.name,
      rawRooms.map((raw: any) => GameRoom.of(raw))
    );
  }

  constructor(id: string, name: string, rooms: GameRoom[]) {
    this.id = id;
    this.name = name;
    this.rooms = rooms;
  }
}

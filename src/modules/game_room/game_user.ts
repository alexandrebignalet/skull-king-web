import GameRoom, { RawRoom } from "@/modules/game_room/game_room";

export type RawUser = {
  id: string;
  name: string;
  rooms: RawRoom[];
};

export default class GameUser {
  public id: string;
  public name: string;
  public rooms: GameRoom[];

  static of(rawUser: RawUser): GameUser {
    const rawRooms = Object.values(rawUser.rooms || {});
    return new GameUser(
      rawUser.id,
      rawUser.name,
      rawRooms.map((raw: RawRoom) => GameRoom.of(raw))
    );
  }

  constructor(id: string, name: string, rooms: GameRoom[]) {
    this.id = id;
    this.name = name;
    this.rooms = rooms;
  }
}

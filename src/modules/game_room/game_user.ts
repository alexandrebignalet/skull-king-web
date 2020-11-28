export default class GameUser {
  public id: string;
  public name: string;

  static of({ id, name }: { id: string; name: string }) {
    return new GameUser(id, name);
  }

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

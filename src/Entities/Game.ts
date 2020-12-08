import UniqueIdentifier from "../Utilities/UniqueIdentifier";

class Game {
  private array;
  private index;
  constructor(array: any[], index: 0) {
    this.array = array;
    this.index = index;
  }
  public addPlayer(name: string, id: UniqueIdentifier) {
    this.array.push({ name, id, getPlayableCardIds: () => ["qc"] });
  }
  public getPlayerById(id: UniqueIdentifier) {
    return this.array.find((player) => player.id.getId() === id.getId());
  }
}

export default Game;

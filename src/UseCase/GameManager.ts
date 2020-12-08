import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import Game from '../Entities/Game'
import Player from '../Entities/Player'
import CPUPlayer from '../Entities/CPUPlayer'

class GameManager {
  private static playersCurrentGame: Game

  public static getPlayersCurrentGame(): Game {
    if (!this.playersCurrentGame) {
      this.playersCurrentGame = new Game([], 0)
      this.playersCurrentGame.addPlayer(
        new CPUPlayer('Jesse', new UniqueIdentifier(), this.playersCurrentGame)
      )
      this.playersCurrentGame.addPlayer(
        new CPUPlayer('John', new UniqueIdentifier(), this.playersCurrentGame)
      )
      this.playersCurrentGame.addPlayer(
        new Player('Me', new UniqueIdentifier('4d2f43c3-224d-46ba-bb76-0e383d9ceb5c'))
      )
      this.playersCurrentGame.addPlayer(
        new CPUPlayer('Jake', new UniqueIdentifier(), this.playersCurrentGame)
      )
    }
    return this.playersCurrentGame
  }
}

export default GameManager

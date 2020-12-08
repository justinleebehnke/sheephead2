import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import Game from '../Entities/Game'

class GameManager {
  private static playersCurrentGame: Game

  public static getPlayersCurrentGame(): Game {
    if (!this.playersCurrentGame) {
      this.playersCurrentGame = new Game([], 0)
      this.playersCurrentGame.addPlayer('Jesse', new UniqueIdentifier())
      this.playersCurrentGame.addPlayer('John', new UniqueIdentifier())
      this.playersCurrentGame.addPlayer('Jake', new UniqueIdentifier())
      this.playersCurrentGame.addPlayer(
        'Me',
        new UniqueIdentifier('4d2f43c3-224d-46ba-bb76-0e383d9ceb5c')
      )
    }
    return this.playersCurrentGame
  }
}

export default GameManager

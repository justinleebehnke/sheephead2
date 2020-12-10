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
        new CPUPlayer(
          'Jesse',
          new UniqueIdentifier('4d2f43c3-224d-46ba-bb76-0e383d9ceb5c'),
          this.playersCurrentGame
        )
      )
      this.playersCurrentGame.addPlayer(
        new CPUPlayer(
          'John',
          new UniqueIdentifier('32b62508-4e72-4028-8794-fd075b0393b5'),
          this.playersCurrentGame
        )
      )
      this.playersCurrentGame.addPlayer(
        new Player('Me', new UniqueIdentifier('79dbc191-2b0e-4dc3-83d7-7696c4abcb61'))
      )
      this.playersCurrentGame.addPlayer(
        new CPUPlayer(
          'Jake',
          new UniqueIdentifier('81756fd4-3f61-4833-b012-43fbc407b688'),
          this.playersCurrentGame
        )
      )
    }
    return this.playersCurrentGame
  }
}

export default GameManager

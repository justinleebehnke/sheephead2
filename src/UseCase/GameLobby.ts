import PlayerDTO from './PlayerDTO'
import PreGame from './PreGame'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class GameLobby {
  private static instance: GameLobby
  private games: PreGame[]
  public static getGameLobby(): GameLobby {
    if (!this.instance) {
      this.instance = new GameLobby()
    }
    return this.instance
  }

  private constructor() {
    this.games = []
  }

  public addNewGame(host: PlayerDTO): void {
    this.games.push(new PreGame(host))
  }

  public getAllGames(): PreGame[] {
    return this.games
  }

  public removePlayerFromGame(id: UniqueIdentifier): void {
    const game = this.games.find((game: PreGame) => game.getPlayerById(id))
    if (game) {
      if (game.getHost().getId().equals(id)) {
        this.games = this.games.filter((game) => !game.getHost().getId().equals(id))
      } else {
        game.removePlayerById(id)
      }
    }
  }
}

export default GameLobby

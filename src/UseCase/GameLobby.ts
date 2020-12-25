import PlayerDTO from './PlayerDTO'
import GameManager from './GameManager'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class GameLobby {
  private static instance: GameLobby
  private games: GameManager[]
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
    this.games.push(new GameManager(host))
  }

  public getAllGames(): GameManager[] {
    return this.games
  }

  public removePlayerFromGame(id: UniqueIdentifier): void {
    const game = this.games.find((game: GameManager) => game.getPlayerById(id))
    if (game) {
      if (game.getHost().getId().equals(id)) {
        this.games = this.games.filter((game) => !game.getHost().getId().equals(id))
      }
      game.removePlayerById(id)
    }
  }
}

export default GameLobby

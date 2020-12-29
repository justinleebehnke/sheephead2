import PlayerDTO from './PlayerDTO'
import GameManager from './GameManager'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import IGameLobbyDataProvider from './IGameLobbyDataProvider'
import IGameData from './IGameData'

class GameLobby implements IGameLobbyDataProvider {
  private games: GameManager[]

  constructor() {
    this.games = []
  }

  public getJoinableGames(): IGameData[] {
    return this.getAllGames()
      .filter(
        (gameManager: GameManager) =>
          !gameManager.gameIsStarted() && gameManager.getPlayers().length < 4
      )
      .map((gameManager) => {
        return { players: gameManager.getPlayers() }
      })
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

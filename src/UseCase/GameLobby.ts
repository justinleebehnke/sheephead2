import PlayerDTO from './PlayerDTO'
import GameManager from './GameManager'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import IGameLobbyDataProvider from './IGameLobbyDataProvider'
import IGameData from './IGameData'
import ISubscriber from '../Entities/ISubscriber'

class GameLobby implements IGameLobbyDataProvider {
  private games: GameManager[]
  private gameIndex: number
  private subscribers: ISubscriber[]

  constructor() {
    this.games = []
    this.gameIndex = 1
    this.subscribers = []
  }

  public getGameByHostId(hostId: UniqueIdentifier): GameManager | undefined {
    return this.games.find((game) => game.getHost().getId().equals(hostId))
  }

  public addSubscriber(newSubscriber: ISubscriber): void {
    this.subscribers.push(newSubscriber)
  }

  public removeSubscriber(subToRemove: ISubscriber): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== subToRemove)
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((sub) => sub.update())
  }

  public getJoinableGames(): IGameData[] {
    return this.getAllGames()
      .filter(
        (gameManager: GameManager) =>
          !gameManager.gameIsStarted() && gameManager.getPlayers().length < 4
      )
      .map((gameManager) => {
        return { gameNumber: gameManager.getGameId(), players: gameManager.getPlayers() }
      })
  }

  public addNewGame(host: PlayerDTO): void {
    this.games.push(new GameManager(host, this.gameIndex++))
    this.notifySubscribers()
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
    this.notifySubscribers()
  }

  public addPlayerToGame(player: PlayerDTO, hostId: UniqueIdentifier): void {
    const game = this.games.find((game: GameManager) => game.getPlayerById(hostId))
    if (game) {
      game.addPlayer(player)
      this.notifySubscribers()
    }
  }
}

export default GameLobby

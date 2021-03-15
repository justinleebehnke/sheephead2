import GameConfigurationDTO from './GameConfigurationDTO'
import GameData from './GameData'
import IGameManager from './IGameManager'
import IGameManagerSubscriber from '../../Views/AppPresenter/IGameManagerSubscriber'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

class GameManager implements IGameManager {
  private readonly hostIdToGameData: Map<string, GameData>
  private readonly subscribers: IGameManagerSubscriber[]

  constructor() {
    this.hostIdToGameData = new Map()
    this.subscribers = []
  }

  public getAllGames(): GameData[] {
    return Array.from(this.hostIdToGameData.values())
  }

  public getGameByPlayerId(playerId: UniqueIdentifier): GameData | undefined {
    return this.getAllGames().find((game) =>
      game.players.some((player) => player.id.equals(playerId))
    )
  }

  public subscribe(subscriber: IGameManagerSubscriber): void {
    this.subscribers.push(subscriber)
  }

  private updateSubscribers(): void {
    this.subscribers.forEach((sub) => sub.gameUpdated())
  }

  public addPlayerToGame(hostId: UniqueIdentifier, playerInfo: PlayerDTO): void {
    if (this.playerIsInAGame(playerInfo.id)) {
      throw Error('A player cannot be in two games')
    }
    const game = this.hostIdToGameData.get(hostId.getId())
    if (!game) {
      throw Error('Cannot add player to nonexistent game')
    }
    game.players.push(playerInfo)
    this.updateSubscribers()
  }

  public createGame(hostInfo: PlayerDTO): void {
    if (this.hostIdToGameData.has(hostInfo.id.getId())) {
      throw Error('Same person cannot host two games at once')
    }

    if (this.playerIsInAGame(hostInfo.id)) {
      throw Error(
        'A player cannot be in two games, player cannot create a new game without leaving the first'
      )
    }

    this.hostIdToGameData.set(hostInfo.id.getId(), {
      config: {
        shuffleSeed: Date.now(),
        firstDealerIndex: 0,
      },
      hostId: hostInfo.id,
      isStarted: false,
      players: [hostInfo],
    })
    this.updateSubscribers()
  }

  private playerIsInAGame(playerId: UniqueIdentifier): boolean {
    return !!this.getGameByPlayerId(playerId)
  }

  public removePlayerFromGame(playerId: UniqueIdentifier, hostId: UniqueIdentifier): void {
    const gameData = this.hostIdToGameData.get(hostId.getId())
    if (!gameData) {
      throw Error('Cannot remove player from game because hostId did not produce a game')
    }
    if (!gameData.players.some((player: PlayerDTO) => player.id.equals(playerId))) {
      throw Error("Cannot remove player from game because that player is not in the host's game")
    }
    if (playerId.equals(gameData.hostId)) {
      this.hostIdToGameData.delete(hostId.getId())
    } else {
      gameData.players = gameData.players.filter((player: PlayerDTO) => !player.id.equals(playerId))
    }
    this.updateSubscribers()
  }

  public setGameConfig(hostId: UniqueIdentifier, gameConfig: GameConfigurationDTO): void {
    const game = this.hostIdToGameData.get(hostId.getId())
    if (game) {
      game.config = gameConfig
    } else {
      throw Error('Cannot set config of non-existent game')
    }
    this.updateSubscribers()
  }

  public startGame(hostId: UniqueIdentifier): void {
    const game = this.hostIdToGameData.get(hostId.getId())
    if (game) {
      if (game.isStarted) {
        throw Error('The requested game is already started')
      }
      game.isStarted = true
    } else {
      throw Error('Cannot start non-existent game')
    }
    this.updateSubscribers()
  }

  public unStartGame(hostId: UniqueIdentifier): void {
    const game = this.hostIdToGameData.get(hostId.getId())
    if (game) {
      if (!game.isStarted) {
        throw Error('The requested game is already not started')
      }
      game.isStarted = false
    } else {
      throw Error('Cannot un start non-existent game')
    }
    this.updateSubscribers()
  }

  public getGameByHostId(hostId: UniqueIdentifier): GameData | undefined {
    return this.hostIdToGameData.get(hostId.getId())
  }
}

export default GameManager

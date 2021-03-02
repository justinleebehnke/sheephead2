import GameConfigurationDTO from './GameConfigurationDTO'
import IGameManager from './IGameManager'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

interface GameData {
  config: GameConfigurationDTO
  hostId: UniqueIdentifier
  isStarted: boolean
  players: PlayerDTO[] // host is the player at index 0
}

class GameManager implements IGameManager {
  private readonly hostIdToGameData: Map<string, GameData>

  constructor() {
    this.hostIdToGameData = new Map()
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
  }

  private playerIsInAGame(playerId: UniqueIdentifier): boolean {
    let playerIsFoundInGame = false
    this.hostIdToGameData.forEach((game: GameData) => {
      if (game.players.some((player: PlayerDTO) => player.id.equals(playerId))) {
        playerIsFoundInGame = true
      }
    })
    return playerIsFoundInGame
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
  }

  public setGameConfig(hostId: UniqueIdentifier, gameConfig: GameConfigurationDTO): void {
    const game = this.hostIdToGameData.get(hostId.getId())
    if (game) {
      game.config = gameConfig
    } else {
      throw Error('Cannot set config of non-existent game')
    }
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
  }

  public unStartGame(hostId: UniqueIdentifier): void {
    throw new Error('Method not implemented.')
  }

  public getGameDataByHostId(hostId: UniqueIdentifier): GameData | undefined {
    return this.hostIdToGameData.get(hostId.getId())
  }
}

export default GameManager

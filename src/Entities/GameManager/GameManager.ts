import GameConfigurationDTO from './GameConfigurationDTO'
import IGameManager from './IGameManager'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

interface GameData {
  config: GameConfigurationDTO
  hostId: UniqueIdentifier
  players: PlayerDTO[] // host is the player at index 0
}

class GameManager implements IGameManager {
  private hostIdToGameData: Map<string, GameData>

  constructor() {
    this.hostIdToGameData = new Map()
  }

  public addPlayerToGame(hostId: UniqueIdentifier, playerInfo: PlayerDTO): void {
    this.hostIdToGameData.get(hostId.getId())?.players.push(playerInfo)
  }

  public createGame(hostInfo: PlayerDTO): void {
    if (this.hostIdToGameData.has(hostInfo.id.getId())) {
      throw Error('Same person cannot host two games at once')
    }
    this.hostIdToGameData.set(hostInfo.id.getId(), {
      hostId: hostInfo.id,
      players: [hostInfo],
      config: {
        shuffleSeed: Date.now(),
        firstDealerIndex: 0,
      },
    })
  }

  public removePlayerFromGame(playerId: UniqueIdentifier, hostId: UniqueIdentifier): void {
    const gameData = this.hostIdToGameData.get(hostId.getId())
    if (!gameData) {
      throw Error('Cannot remove player from game because hostId did not produce a game')
    }
    if (!gameData.players.some((player: PlayerDTO) => player.id.equals(playerId))) {
      throw Error("Cannot remove player from game because that player is not in the host's game")
    }
    gameData.players = gameData.players.filter((player: PlayerDTO) => !player.id.equals(playerId))
  }

  public setGameConfig(hostId: UniqueIdentifier, gameConfig: GameConfigurationDTO): void {
    throw new Error('Method not implemented.')
  }

  public startGame(hostId: UniqueIdentifier): void {
    throw new Error('Method not implemented.')
  }

  public unStartGame(hostId: UniqueIdentifier): void {
    throw new Error('Method not implemented.')
  }

  public getGameDataByHostId(hostId: UniqueIdentifier): GameData | undefined {
    return this.hostIdToGameData.get(hostId.getId())
  }
}

export default GameManager

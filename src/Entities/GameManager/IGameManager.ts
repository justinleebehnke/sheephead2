import GameConfigurationDTO from './GameConfigurationDTO'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

interface IGameManager {
  addPlayerToGame(hostId: UniqueIdentifier, playerInfo: PlayerDTO): void
  createGame(hostInfo: PlayerDTO): void
  removePlayerFromGame(playerId: UniqueIdentifier, hostId: UniqueIdentifier): void
  setGameConfig(hostId: UniqueIdentifier, gameConfig: GameConfigurationDTO): void
  startGame(hostId: UniqueIdentifier): void
  unStartGame(hostId: UniqueIdentifier): void
}

export default IGameManager

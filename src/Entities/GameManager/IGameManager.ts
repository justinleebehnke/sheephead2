import GameConfigurationDTO from './GameConfigurationDTO'
import GameData from './GameData'
import IGameManagerSubscriber from '../../Views/AppPresenter/IGameManagerSubscriber'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

interface IGameManager {
  getGameByPlayerId(playerId: UniqueIdentifier): GameData | undefined
  subscribe(subscriber: IGameManagerSubscriber): void
  addPlayerToGame(hostId: UniqueIdentifier, playerInfo: PlayerDTO): void
  createGame(hostInfo: PlayerDTO): void
  removePlayerFromGame(playerId: UniqueIdentifier, hostId: UniqueIdentifier): void
  setGameConfig(hostId: UniqueIdentifier, gameConfig: GameConfigurationDTO): void
  startGame(hostId: UniqueIdentifier): void
  unStartGame(hostId: UniqueIdentifier): void
}

export default IGameManager

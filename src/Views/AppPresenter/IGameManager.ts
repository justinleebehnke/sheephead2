import GameData from '../../Entities/GameManager/GameData'
import IGameManagerSubscriber from './IGameManagerSubscriber'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

interface IGameManager {
  getGameByPlayerId(playerId: UniqueIdentifier): GameData | undefined
  subscribe(subscriber: IGameManagerSubscriber): void
}

export default IGameManager

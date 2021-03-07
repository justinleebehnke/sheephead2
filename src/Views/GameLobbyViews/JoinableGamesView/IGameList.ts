import GameData from '../../../Entities/GameManager/GameData'
import IGameListSubscriber from './IGameListSubscriber'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

interface IGameList {
  subscribe(subscriber: IGameListSubscriber): void
  getAllGames(): GameData[]
  getGameByHostId(hostId: UniqueIdentifier): GameData
}

export default IGameList

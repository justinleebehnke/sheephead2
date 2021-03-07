import GameData from '../../../Entities/GameManager/GameData'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'
import IGameListSubscriber from './IGameListSubscriber'

interface IGameList {
  subscribe(subscriber: IGameListSubscriber): void
  getAllGames(): GameData[]
  getGameByHostId(hostId: UniqueIdentifier): GameData
}

export default IGameList

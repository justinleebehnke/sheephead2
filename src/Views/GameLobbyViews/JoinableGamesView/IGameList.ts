import GameData from '../../../Entities/GameManager/GameData'
import IGameListSubscriber from './IGameListSubscriber'

interface IGameList {
  subscribe(subscriber: IGameListSubscriber): void
  getAllGames(): GameData[]
}

export default IGameList

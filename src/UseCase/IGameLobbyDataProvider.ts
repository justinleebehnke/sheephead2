import IGameData from './IGameData'
import IObservable from '../Entities/IObservable'

interface IGameLobbyDataProvider extends IObservable {
  getJoinableGames(): IGameData[]
}

export default IGameLobbyDataProvider

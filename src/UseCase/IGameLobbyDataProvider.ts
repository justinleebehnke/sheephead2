import IGameData from './IGameData'
import IObservable from '../Entities/IObservable'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import GameManager from './GameManager'

interface IGameLobbyDataProvider extends IObservable {
  getJoinableGames(): IGameData[]
  getGameByHostId(hostId: UniqueIdentifier): GameManager | undefined
}

export default IGameLobbyDataProvider

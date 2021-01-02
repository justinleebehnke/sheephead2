import IGameData from './IGameData'
import IObservable from '../Entities/IObservable'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import GameManager from './GameManager'

interface IGameLobbyDataProvider extends IObservable {
  getGameByPlayerId(playerId: UniqueIdentifier): GameManager | undefined
  getJoinableGames(): IGameData[]
  getGameByHostId(hostId: UniqueIdentifier): GameManager | undefined
}

export default IGameLobbyDataProvider

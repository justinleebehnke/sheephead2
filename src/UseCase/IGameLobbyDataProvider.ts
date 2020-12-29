import IGameData from './IGameData'

interface IGameLobbyDataProvider {
  getJoinableGames(): IGameData[]
}

export default IGameLobbyDataProvider

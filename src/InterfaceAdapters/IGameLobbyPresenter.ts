import IGameData from '../UseCase/IGameData'

interface IGameLobbyPresenter {
  getJoinableGames(): IGameData[]
}

export default IGameLobbyPresenter

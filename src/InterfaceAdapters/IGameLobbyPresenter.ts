import ISubscriber from '../Entities/ISubscriber'
import IGameData from '../UseCase/IGameData'

interface IGameLobbyPresenter {
  getJoinableGames(): IGameData[]
  setView(view: ISubscriber): void
  unSetView(): void
}

export default IGameLobbyPresenter

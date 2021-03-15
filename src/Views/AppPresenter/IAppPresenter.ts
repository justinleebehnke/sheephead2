import IGameBoardPresenter from '../GamePlayViews/IGameBoardPresenter'
import ISubscriber from '../../Entities/ISubscriber'

interface IAppPresenter {
  setView(view: ISubscriber): void
  isShowingLobby: boolean
  isShowingPreGameAsHost: boolean
  isShowingPreGameAsNonHost: boolean
  isShowingGame: boolean
  getGamePresenter(): IGameBoardPresenter
}

export default IAppPresenter

import ISubscriber from '../../Entities/ISubscriber'

interface IAppPresenter {
  setView(view: ISubscriber): void
  isShowingLobby: boolean
  isShowingPreGameAsHost: boolean
  isShowingPreGameAsNonHost: boolean
  isShowingGame: boolean
}

export default IAppPresenter

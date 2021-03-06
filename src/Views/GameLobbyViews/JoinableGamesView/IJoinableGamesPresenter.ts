import JoinableGameData from './JoinableGameData'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'
import ISubscriber from '../../../Entities/ISubscriber'

interface IJoinableGamesPresenter {
  getJoinableGameData(): JoinableGameData[]
  joinGame(hostId: UniqueIdentifier): void
  setView(view: ISubscriber): void
}

export default IJoinableGamesPresenter

import ISubscriber from '../../../Entities/ISubscriber'
import JoinableGameData from './JoinableGameData'

interface IJoinableGamesPresenter {
  isLoading: boolean
  getJoinableGameData(): JoinableGameData[]
  joinGame(hostId: string): void
  setView(view: ISubscriber): void
}

export default IJoinableGamesPresenter

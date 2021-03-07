import ISubscriber from '../../../Entities/ISubscriber'
import PlayerData from '../../GamePlayViews/EndOfRoundReport/PlayerData'

interface IPreGamePresenter {
  getFirstDealerIndex(): number
  getPlayers(): PlayerData[]
  isHosting: boolean
  setFirstDealerIndex(index: number): void
  removePlayer(playerId: string): void
  leaveGame(): void
  setView(view: ISubscriber): void
  startGame(): void
}

export default IPreGamePresenter

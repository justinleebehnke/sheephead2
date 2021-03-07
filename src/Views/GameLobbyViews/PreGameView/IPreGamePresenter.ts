import ISubscriber from '../../../Entities/ISubscriber'
import PlayerData from '../../GamePlayViews/EndOfRoundReport/PlayerData'

interface IPreGamePresenter {
  getFirstDealerIndex(): number
  getPlayers(): PlayerData[]
  isHosting: boolean // if you are hosting then there is all kinds of stuff you can do, otherwise you can just see what's going on
  setFirstDealerIndex(index: number): void // -1 means random
  removePlayerFromGame(playerId: string): void
  leaveGame(): void
  setView(view: ISubscriber): void
  startGame(): void // for now you can only start the game if there are four players
}

export default IPreGamePresenter

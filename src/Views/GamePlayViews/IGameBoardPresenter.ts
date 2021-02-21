import EndOfRoundPresenter from './EndOfRoundReport/EndOfRoundPresenter'
import GameBoardViewData from './GameBoardViewData'
import HandPresenter from './HandPresenter'
import ISubscriber from '../../Entities/ISubscriber'
import PassOrPickPresenter from './PassOrPickPresenter'

interface IGameBoardPresenter extends PassOrPickPresenter, HandPresenter, EndOfRoundPresenter {
  getGameBoardViewData(): GameBoardViewData
  setView(view: ISubscriber): void
  unsetView(): void
}

export default IGameBoardPresenter

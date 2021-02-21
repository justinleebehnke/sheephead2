import EndOfRoundData from '../../Entities/Round/EndOfRoundReportData'
import EndOfRoundPresenter from './EndOfRoundReport/EndOfRoundPresenter'
import GameBoardViewData from './GameBoardViewData'
import HandPresenter from './HandPresenter'
import ISubscriber from '../../Entities/ISubscriber'
import PassOrPickPresenter from './PassOrPickPresenter'
import PlayerData from './EndOfRoundReport/PlayerData'

interface IGameBoardPresenter extends PassOrPickPresenter, HandPresenter, EndOfRoundPresenter {
  getEndOfRoundReport(): EndOfRoundData | undefined
  getGameBoardViewData(): GameBoardViewData
  getPickerIndex(): number | undefined
  getPlayersData(): PlayerData[]
  isShowingPassOrPickForm(): boolean
  setView(view: ISubscriber): void
  unsetView(): void
}

export default IGameBoardPresenter

import EndOfRoundData from '../Entities/Round/EndOfRoundReportData'
import IObservable from '../Entities/IObservable'
import PlayerData from '../Views/GamePlayViews/EndOfRoundReport/PlayerData'
import PlayerLayoutData from './GamePresenter/PlayerLayoutData'

interface IGameBoardModel extends IObservable {
  getDataForLocalPlayer(): PlayerLayoutData
  getDataForPlayerAcross(): PlayerLayoutData
  getDataForPlayerToLeft(): PlayerLayoutData
  getDataForPlayerToRight(): PlayerLayoutData
  isPicking(): boolean
  isShowingPassOrPickForm(): boolean
  getHand(): string[]
  getPlayableCardIds(): string[]
  getPlayersData(): PlayerData[]
  getPickerIndex(): number | undefined
  getEndOfRoundReport(): EndOfRoundData | undefined
}

export default IGameBoardModel

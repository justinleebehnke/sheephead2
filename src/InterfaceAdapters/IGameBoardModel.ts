import EndOfRoundData from '../Entities/Round/EndOfRoundReportData'
import IObservable from '../Entities/IObservable'
import PlayerDataWithWinnings from '../Views/GamePlayViews/EndOfRoundReport/PlayerDataWithWinnings'
import PlayerLayoutData from './GamePresenter/PlayerLayoutData'

interface IGameBoardModel extends IObservable {
  getDataForLocalPlayer(): PlayerLayoutData
  getDataForPlayerAcross(): PlayerLayoutData
  getDataForPlayerToLeft(): PlayerLayoutData
  getDataForPlayerToRight(): PlayerLayoutData
  isHandOfDoubles(): boolean
  isPicking(): boolean
  isShowingPassOrPickForm(): boolean
  getHand(): string[]
  getPlayableCardIds(): string[]
  getPlayersData(): PlayerDataWithWinnings[]
  getPickerIndex(): number | undefined
  getEndOfRoundReport(): EndOfRoundData | undefined
  getPlayersNotReady(): string[]
  getNumHandsCompleted(): number
  getBuryCards(): string[]
}

export default IGameBoardModel

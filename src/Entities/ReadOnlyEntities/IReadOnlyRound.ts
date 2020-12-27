import EndOfRoundData from '../Round/EndOfRoundReportData'
import IReadOnlyTrick from './IReadOnlyTrick'
import Player from '../Player'

interface IReadOnlyRound {
  getCurrentTrick(): IReadOnlyTrick
  getCurrentTurnPlayer(): Player | undefined
  getEndOfRoundReport(): EndOfRoundData
  getIndexOfDealer(): number
  getIndexOfPicker(): number
  getIndexOfCurrentTurn(): number
  isOver(): boolean
  isFindingPickerState(): boolean
  isPickerHasNotBuriedState(): boolean
}

export default IReadOnlyRound

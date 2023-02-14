import EndOfRoundData from '../../Entities/Round/EndOfRoundReportData'
import IReadOnlyTrick from './IReadOnlyTrick'
import Player from '../../Entities/Player'
import CardPlayedByData from '../../Entities/DataStructures/CardPlayedByData'

interface IReadOnlyRound {
  getCurrentTrick(): IReadOnlyTrick
  getPreviousTrickCardData(): CardPlayedByData[]
  getCurrentTurnPlayer(): Player | undefined
  getEndOfRoundReport(): EndOfRoundData
  getIndexOfDealer(): number
  getIndexOfPicker(): number
  getIndexOfCurrentTurn(): number
  isOver(): boolean
  isFindingPickerState(): boolean
  isPickerHasNotBuriedState(): boolean
  pickerIsGoingAlone: boolean
}

export default IReadOnlyRound

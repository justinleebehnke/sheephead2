import IReadOnlyTrick from './IReadOnlyTrick'
import Player from '../Player'

interface IReadOnlyRound {
  getCurrentTrick(): IReadOnlyTrick
  getIndexOfDealer(): number
  getIndexOfPicker(): number
  getIndexOfCurrentTurn(): number
  isOver(): boolean
  isFindingPickerState(): boolean
  isPickerHasNotBuriedState(): boolean
  getCurrentTurnPlayer(): Player | undefined
}

export default IReadOnlyRound

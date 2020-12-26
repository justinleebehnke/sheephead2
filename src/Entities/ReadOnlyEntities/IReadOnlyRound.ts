import IReadOnlyTrick from './IReadOnlyTrick'

interface IReadOnlyRound {
  getCurrentTrick(): IReadOnlyTrick
  getIndexOfDealer(): number
  getIndexOfPicker(): number
  getIndexOfCurrentTurn(): number
}

export default IReadOnlyRound

import Card from '../Card'
import EndOfRoundData from './EndOfRoundReportData'

interface IRoundState {
  pass(): void
  pick(): void
  bury(cardA: Card, cardB: Card): void
  play(card: Card): void
  getEndOfRoundReport(): EndOfRoundData
}

export default IRoundState

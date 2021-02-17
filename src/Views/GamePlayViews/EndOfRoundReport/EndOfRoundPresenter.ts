import EndOfRoundData from '../../../Entities/Round/EndOfRoundReportData'
import PlayerData from './PlayerData'

interface EndOfRoundPresenter {
  players: PlayerData[]
  endOfRoundReport: EndOfRoundData
  pickerIndex: number
  playAgain(): void
}

export default EndOfRoundPresenter

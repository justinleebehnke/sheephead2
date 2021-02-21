import EndOfRoundData from '../../../Entities/Round/EndOfRoundReportData'
import PlayerData from './PlayerData'

interface EndOfRoundViewData {
  players: PlayerData[]
  endOfRoundReport: EndOfRoundData
  pickerIndex: number
}

export default EndOfRoundViewData

import EndOfRoundData from '../../../Entities/Round/EndOfRoundReportData'
import PlayerData from './PlayerData'

interface EndOfRoundViewData {
  endOfRoundReport: EndOfRoundData | undefined
  pickerIndex: number | undefined
  players: PlayerData[]
}

export default EndOfRoundViewData

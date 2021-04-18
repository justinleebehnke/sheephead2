import EndOfRoundData from '../../../Entities/Round/EndOfRoundReportData'
import PlayerDataWithWinnings from './PlayerDataWithWinnings'

interface EndOfRoundViewData {
  endOfRoundReport: EndOfRoundData | undefined
  pickerIndex: number | undefined
  pickerWentAlone: boolean
  players: PlayerDataWithWinnings[]
}

export default EndOfRoundViewData

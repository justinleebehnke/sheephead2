import EndOfRoundData from './EndOfRoundReportData'
import IActionableRound from '../../GameEntityInterfaces/IActionableRound'

interface IRoundState extends IActionableRound {
  getEndOfRoundReport(): EndOfRoundData
}

export default IRoundState

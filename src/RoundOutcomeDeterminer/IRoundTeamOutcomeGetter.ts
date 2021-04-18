import EndOfRoundViewData from '../Views/GamePlayViews/EndOfRoundReport/EndOfRoundViewData'
import IRoundTeamOutcome from './IRoundTeamOutcome'

interface IRoundTeamOutcomeGetter {
  getRoundTeamOutcome(endOfRoundViewData: EndOfRoundViewData): IRoundTeamOutcome
}

export default IRoundTeamOutcomeGetter

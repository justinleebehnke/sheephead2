import EndOfRoundViewData from '../Views/GamePlayViews/EndOfRoundReport/EndOfRoundViewData'
import IRoundTeamOutcome from './IRoundTeamOutcome'
import IRoundTeamOutcomeGetter from './IRoundTeamOutcomeGetter'
import RoundTeamOutcome from './RoundTeamOutcome'

class RoundTeamOutcomeGetter implements IRoundTeamOutcomeGetter {
  getRoundTeamOutcome(endOfRoundViewData: EndOfRoundViewData): IRoundTeamOutcome {
    return new RoundTeamOutcome(endOfRoundViewData)
  }
}

export default RoundTeamOutcomeGetter

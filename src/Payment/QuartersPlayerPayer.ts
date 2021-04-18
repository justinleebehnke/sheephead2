import IPayablePlayer from './IPayablePlayer'
import IPlayerPayer from './IPlayerPayer'
import IRoundTeamOutcomeGetter from '../RoundOutcomeDeterminer/IRoundTeamOutcomeGetter'
import EndOfRoundViewData from '../Views/GamePlayViews/EndOfRoundReport/EndOfRoundViewData'

class QuartersPlayerPayer implements IPlayerPayer {
  constructor(private readonly scoreOutcomeGetter: IRoundTeamOutcomeGetter) {}

  givePlayersTheirPay(players: IPayablePlayer[], endOfRoundViewData: EndOfRoundViewData): void {
    players[0].giveCentsForRound(25)
    players[1].giveCentsForRound(25)
    players[2].giveCentsForRound(-25)
    players[3].giveCentsForRound(-25)
  }
}

export default QuartersPlayerPayer

import IPayablePlayer from './IPayablePlayer'
import IPlayerPayer from './IPlayerPayer'
import EndOfRoundViewData from '../Views/GamePlayViews/EndOfRoundReport/EndOfRoundViewData'

class QuartersPlayerPayer implements IPlayerPayer {
  givePlayersTheirPay(players: IPayablePlayer[], endOfRoundViewData: EndOfRoundViewData): void {
    return
  }
}

export default QuartersPlayerPayer

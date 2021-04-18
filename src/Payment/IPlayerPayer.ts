import EndOfRoundViewData from '../Views/GamePlayViews/EndOfRoundReport/EndOfRoundViewData'
import IPayablePlayer from './IPayablePlayer'

interface IPlayerPayer {
  givePlayersTheirPay(players: IPayablePlayer[], endOfRoundViewData: EndOfRoundViewData): void
}

export default IPlayerPayer

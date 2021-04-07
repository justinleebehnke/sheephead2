import IActionableRound from './IActionableRound'
import IPlayer from './IPlayer'

interface IRound extends IActionableRound {
  getCurrentTurnPlayer(): IPlayer | undefined
}

export default IRound

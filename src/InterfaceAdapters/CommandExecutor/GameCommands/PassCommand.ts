import AbstractCommand from './AbstractCommand'
import IGame from '../../../GameEntityInterfaces/IGame'

class PassCommand extends AbstractCommand {
  constructor(game: IGame) {
    super('pass', game)
  }

  execute(): void {
    const round = this.game.getCurrentRound()
    if (!round) {
      throw Error(this.getNoRoundErrorMessage())
    }
    round.pass()
  }
}

export default PassCommand

import AbstractCommand from './AbstractCommand'
import IGame from '../../../GameEntityInterfaces/IGame'

class PickCommand extends AbstractCommand {
  constructor(game: IGame) {
    super('pick', game)
  }

  execute(): void {
    const round = this.game.getCurrentRound()
    if (!round) {
      throw Error(this.getNoRoundErrorMessage())
    }
    round.pick()
  }
}

export default PickCommand

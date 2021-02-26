import ICommand from './ICommand'
import IGame from '../Interfaces/IGame'

class PassCommand implements ICommand {
  private readonly game: IGame

  constructor(game: IGame) {
    this.game = game
  }

  execute(): void {
    const round = this.game.getCurrentRound()
    if (!round) {
      throw Error('Cannot pass because there is no current round')
    }
    round.pass()
  }
}

export default PassCommand

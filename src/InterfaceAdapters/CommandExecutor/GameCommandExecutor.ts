import ICommandExecutor from './ICommandExecutor'
import ICommandObject from '../ICommandObject'
import IGame from './Interfaces/IGame'
import PlayCommand from '../CommandTypes/PlayCommand'

class GameCommandExecutor implements ICommandExecutor {
  private readonly game: IGame

  constructor(game: IGame) {
    this.game = game
  }

  public execute(command: ICommandObject): void {
    if (this.isPlayCommand(command)) {
      this.play(command)
    } else {
      throw Error(`Game command is not recognized: ${JSON.stringify(command)}`)
    }
  }

  private isPlayCommand(command: ICommandObject): command is PlayCommand {
    return command.name === 'play'
  }

  private play(command: PlayCommand): void {
    const round = this.game.getCurrentRound()
    if (!round) {
      throw Error('Cannot play because there is no current round')
    }
    const player = round.getCurrentTurnPlayer()
    if (!player) {
      throw Error("Cannot play because it is not anyone's turn")
    }
    round.play(player.removeCardFromHand(command.params.card))
  }
}

export default GameCommandExecutor

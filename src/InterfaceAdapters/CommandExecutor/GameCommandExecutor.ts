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
    if (command.name === 'pass') {
      this.pass()
    } else if (this.isPlayCommand(command)) {
      this.play(command)
    } else {
      throw Error(`Game command is not recognized: ${JSON.stringify(command)}`)
    }
  }

  private pass(): void {
    const round = this.game.getCurrentRound()
    if (!round) {
      throw Error(this.getNoRoundErrorMessage('pass'))
    }
    round.pass()
  }

  private isPlayCommand(command: ICommandObject): command is PlayCommand {
    return command.name === 'play'
  }

  private getNoRoundErrorMessage(commandName: string): string {
    return `Cannot ${commandName} because there is no current round`
  }

  private play(command: PlayCommand): void {
    const round = this.game.getCurrentRound()
    if (!round) {
      throw Error(this.getNoRoundErrorMessage(command.name))
    }
    const player = round.getCurrentTurnPlayer()
    if (!player) {
      throw Error("Cannot play because it is not anyone's turn")
    }
    round.play(player.removeCardFromHand(command.params.card))
  }
}

export default GameCommandExecutor

import GameCommandFactory from './GameCommands/GameCommandFactory'
import ICommandExecutor from './ICommandExecutor'
import ICommandObject from '../ICommandObject'
import IGame from './Interfaces/IGame'

class GameCommandExecutor implements ICommandExecutor {
  private readonly game: IGame
  private readonly gameCommandFactory: GameCommandFactory

  constructor(game: IGame, gameCommandFactory: GameCommandFactory) {
    this.game = game
    this.gameCommandFactory = gameCommandFactory
  }

  public execute(command: ICommandObject): void {
    if (command.name === 'pass') {
      this.pass()
    } else {
      this.gameCommandFactory.getCommand(command).execute()
    }
  }

  private pass(): void {
    const round = this.game.getCurrentRound()
    if (!round) {
      throw Error(this.getNoRoundErrorMessage('pass'))
    }
    round.pass()
  }

  private getNoRoundErrorMessage(commandName: string): string {
    return `Cannot ${commandName} because there is no current round`
  }
}

export default GameCommandExecutor

import IGame from '../Interfaces/IGame'
import ICommand from './ICommand'

abstract class AbstractCommand implements ICommand {
  private readonly commandName: string
  protected readonly game: IGame

  constructor(commandName: string, game: IGame) {
    this.commandName = commandName
    this.game = game
  }

  public abstract execute(): void

  protected getNoRoundErrorMessage(): string {
    return `Cannot ${this.commandName} because there is no current round`
  }
}

export default AbstractCommand

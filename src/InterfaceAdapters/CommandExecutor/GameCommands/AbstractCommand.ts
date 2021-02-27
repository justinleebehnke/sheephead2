import ICommand from './ICommand'
import IGame from '../Interfaces/IGame'

abstract class AbstractCommand implements ICommand {
  constructor(private readonly commandName: string, protected readonly game: IGame) {}

  public abstract execute(): void

  protected getNoRoundErrorMessage(): string {
    return `Cannot ${this.commandName} because there is no current round`
  }

  protected getNoCurrentTurnErrorMessage(): string {
    return `Cannot ${this.commandName} because there is no current turn player`
  }
}

export default AbstractCommand

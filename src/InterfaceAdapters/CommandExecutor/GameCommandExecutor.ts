import CommandDTO from './GameCommandDTOs/CommandDTO'
import ICommandExecutor from './ICommandExecutor'
import ICommandFactory from './GameCommands/ICommandFactory'

class GameCommandExecutor implements ICommandExecutor {
  constructor(private readonly gameCommandFactory: ICommandFactory) {}

  public execute(command: CommandDTO): void {
    this.gameCommandFactory.getCommand(command).execute()
  }
}

export default GameCommandExecutor

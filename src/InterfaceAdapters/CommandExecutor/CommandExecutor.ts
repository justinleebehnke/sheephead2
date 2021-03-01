import CommandDTO from './CommandDTO'
import ICommandExecutor from './ICommandExecutor'
import ICommandFactory from './ICommandFactory'

class CommandExecutor implements ICommandExecutor {
  constructor(private readonly commandFactory: ICommandFactory) {}

  public execute(command: CommandDTO): void {
    this.commandFactory.getCommand(command).execute()
  }
}

export default CommandExecutor

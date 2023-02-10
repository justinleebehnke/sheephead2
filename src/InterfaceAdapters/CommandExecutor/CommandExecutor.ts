import CommandDTO from './CommandDTO'
import ICommandExecutor from './ICommandExecutor'
import ICommandFactory from './ICommandFactory'

class CommandExecutor implements ICommandExecutor {
  constructor(private readonly commandFactory: ICommandFactory) {}

  public execute(command: CommandDTO): void {
    try {
      this.commandFactory.getCommand(command).execute()
    } catch (error) {
      console.log(`Error: "${error}" thrown while executing command.`)
    }
  }
}

export default CommandExecutor

import CommandDTO from './CommandExecutor/CommandDTO'
import CommandExecutor from './CommandExecutor/CommandExecutor'
import ICommandInterface from './ICommandInterface'

class LocalGameCommandInterface implements ICommandInterface {
  constructor(private readonly gameCommandExecutor: CommandExecutor) {}

  public async giveCommand(command: CommandDTO): Promise<void> {
    this.gameCommandExecutor.execute(command)
  }
}

export default LocalGameCommandInterface

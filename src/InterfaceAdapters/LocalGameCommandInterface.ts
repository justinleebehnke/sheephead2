import CommandDTO from './CommandExecutor/GameCommandDTOs/CommandDTO'
import GameCommandExecutor from './CommandExecutor/GameCommandExecutor'
import ICommandInterface from './ICommandInterface'

class LocalGameCommandInterface implements ICommandInterface {
  constructor(private readonly gameCommandExecutor: GameCommandExecutor) {}

  public async giveCommand(command: CommandDTO): Promise<void> {
    this.gameCommandExecutor.execute(command)
  }
}

export default LocalGameCommandInterface

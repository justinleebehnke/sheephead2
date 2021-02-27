import CommandDTO from './GameCommandDTOs/CommandDTO'
import ICommandExecutor from './ICommandExecutor'
import IGameCommandFactory from './GameCommands/IGameCommandFactory'

class GameCommandExecutor implements ICommandExecutor {
  constructor(private readonly gameCommandFactory: IGameCommandFactory) {}

  public execute(command: CommandDTO): void {
    this.gameCommandFactory.getCommand(command).execute()
  }
}

export default GameCommandExecutor

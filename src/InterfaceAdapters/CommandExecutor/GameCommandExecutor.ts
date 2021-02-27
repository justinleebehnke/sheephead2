import CommandDTO from './GameCommandDTOs/CommandDTO'
import ICommandExecutor from './ICommandExecutor'
import IGameCommandFactory from './GameCommands/IGameCommandFactory'

class GameCommandExecutor implements ICommandExecutor {
  private readonly gameCommandFactory: IGameCommandFactory

  constructor(gameCommandFactory: IGameCommandFactory) {
    this.gameCommandFactory = gameCommandFactory
  }

  public execute(command: CommandDTO): void {
    this.gameCommandFactory.getCommand(command).execute()
  }
}

export default GameCommandExecutor

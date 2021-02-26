import IGameCommandFactory from './GameCommands/IGameCommandFactory'
import ICommandExecutor from './ICommandExecutor'
import ICommandObject from '../ICommandObject'

class GameCommandExecutor implements ICommandExecutor {
  private readonly gameCommandFactory: IGameCommandFactory

  constructor(gameCommandFactory: IGameCommandFactory) {
    this.gameCommandFactory = gameCommandFactory
  }

  public execute(command: ICommandObject): void {
    this.gameCommandFactory.getCommand(command).execute()
  }
}

export default GameCommandExecutor

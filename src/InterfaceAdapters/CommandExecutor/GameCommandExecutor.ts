import GameCommandFactory from './GameCommands/GameCommandFactory'
import ICommandExecutor from './ICommandExecutor'
import ICommandObject from '../ICommandObject'
import IGame from './Interfaces/IGame'

class GameCommandExecutor implements ICommandExecutor {
  private readonly game: IGame
  private readonly gameCommandFactory: GameCommandFactory

  constructor(game: IGame, gameCommandFactory: GameCommandFactory) {
    this.game = game
    this.gameCommandFactory = gameCommandFactory
  }

  public execute(command: ICommandObject): void {
    this.gameCommandFactory.getCommand(command).execute()
  }
}

export default GameCommandExecutor

import Game from '../Entities/Game'
import GameCommandExecutor from './CommandExecutor/GameCommandExecutor'
import GameCommandFactory from './CommandExecutor/GameCommands/GameCommandFactory'
import ICommandInterface from './ICommandInterface'
import ICommandObject from './ICommandObject'

class LocalGameCommandInterface implements ICommandInterface {
  private game: Game
  private readonly gameCommandExecutor: GameCommandExecutor
  constructor(game: Game) {
    this.game = game
    this.gameCommandExecutor = new GameCommandExecutor(new GameCommandFactory(this.game))
  }

  public async giveCommand(command: ICommandObject): Promise<void> {
    if (command.name === 'playAgain') {
      this.game.playAnotherRound()
    } else {
      this.gameCommandExecutor.execute(command)
    }
  }
}

export default LocalGameCommandInterface

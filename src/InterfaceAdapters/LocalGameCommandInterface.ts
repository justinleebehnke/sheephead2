import ICommandInterface from './ICommandInterface'
import ICommandObject from './ICommandObject'
import Game from '../Entities/Game'

class LocalGameCommandInterface implements ICommandInterface {
  private game: Game
  constructor(game: Game) {
    this.game = game
  }

  public async giveCommand(command: ICommandObject): Promise<void> {
    if (command.name === 'pass') {
      this.game.getCurrentRound()?.pass()
    } else {
      throw new Error('Method not implemented.')
    }
    return new Promise(() => {}) // this is required to implement the interface
  }
}

export default LocalGameCommandInterface

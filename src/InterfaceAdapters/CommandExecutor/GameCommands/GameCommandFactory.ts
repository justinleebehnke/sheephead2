import ICommandObject from '../../ICommandObject'
import IGame from '../Interfaces/IGame'
import ICommand from './ICommand'
import PlayCommand from './PlayCommand'
import PlayCommandObject from '../../CommandTypes/PlayCommand'

class GameCommandFactory {
  private readonly game: IGame

  constructor(game: IGame) {
    this.game = game
  }

  public getCommand(commandDTO: ICommandObject): ICommand {
    if (this.isPlayCommand(commandDTO)) {
      return new PlayCommand(this.game, commandDTO.params.card)
    }
    throw Error(`Game command is not recognized: ${JSON.stringify(commandDTO)}`)
  }

  private isPlayCommand(command: ICommandObject): command is PlayCommandObject {
    return command.name === 'play'
  }
}

export default GameCommandFactory
import BuryCommand from './BuryCommand'
import BuryCommandDTO from '../../CommandTypes/BuryCommandDTO'
import ICommand from './ICommand'
import ICommandObject from '../../ICommandObject'
import IGame from '../Interfaces/IGame'
import IGameCommandFactory from './IGameCommandFactory'
import PassCommand from './PassCommand'
import PlayCommand from './PlayCommand'
import PlayCommandObject from '../../CommandTypes/PlayCommandDTO'

class GameCommandFactory implements IGameCommandFactory {
  private readonly game: IGame

  constructor(game: IGame) {
    this.game = game
  }

  public getCommand(commandDTO: ICommandObject): ICommand {
    if (commandDTO.name === 'pass') {
      return new PassCommand(this.game)
    }
    if (this.isPlayCommand(commandDTO)) {
      return new PlayCommand(this.game, commandDTO.params.card)
    }
    if (this.isBuryCommandDTO(commandDTO)) {
      return new BuryCommand(this.game, commandDTO.params.cards)
    }
    throw Error(`Game command is not recognized: ${JSON.stringify(commandDTO)}`)
  }

  private isPlayCommand(command: ICommandObject): command is PlayCommandObject {
    return command.name === 'play'
  }

  private isBuryCommandDTO(command: ICommandObject): command is BuryCommandDTO {
    return command.name === 'bury'
  }
}

export default GameCommandFactory

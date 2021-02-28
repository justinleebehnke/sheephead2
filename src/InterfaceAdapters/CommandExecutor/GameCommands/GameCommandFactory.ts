import BuryCommand from './BuryCommand'
import BuryCommandDTO from './GameCommandDTOs/BuryCommandDTO'
import ICommand from '../ICommand'
import CommandDTO from '../CommandDTO'
import IGame from './Interfaces/IGame'
import ICommandFactory from '../ICommandFactory'
import PassCommand from './PassCommand'
import PlayAgainCommand from './PlayAgainCommand'
import PlayCommand from './PlayCommand'
import PlayCommandDTO from './GameCommandDTOs/PlayCommandDTO'

class GameCommandFactory implements ICommandFactory {
  private readonly game: IGame

  constructor(game: IGame) {
    this.game = game
  }

  public getCommand(commandDTO: CommandDTO): ICommand {
    if (commandDTO.name === 'pass') {
      return new PassCommand(this.game)
    }
    if (commandDTO.name === 'playAgain') {
      return new PlayAgainCommand(this.game)
    }
    if (this.isPlayCommand(commandDTO)) {
      return new PlayCommand(this.game, commandDTO.params.card)
    }
    if (this.isBuryCommandDTO(commandDTO)) {
      return new BuryCommand(this.game, commandDTO.params.cards)
    }
    throw Error(`Game command is not recognized: ${JSON.stringify(commandDTO)}`)
  }

  private isPlayCommand(command: CommandDTO): command is PlayCommandDTO {
    return command.name === 'play'
  }

  private isBuryCommandDTO(command: CommandDTO): command is BuryCommandDTO {
    return command.name === 'bury'
  }
}

export default GameCommandFactory

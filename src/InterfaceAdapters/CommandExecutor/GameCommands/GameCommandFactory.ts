import BuryCommand from './BuryCommand'
import BuryCommandDTO from './GameCommandDTOs/BuryCommandDTO'
import CommandDTO from '../CommandDTO'
import ICommand from '../ICommand'
import ICommandFactory from '../ICommandFactory'
import IGame from '../../../GameEntityInterfaces/IGame'
import PassCommand from './PassCommand'
import PickCommand from './PickCommand'
import PlayAgainCommand from './PlayAgainCommand'
import PlayCommand from './PlayCommand'
import PlayCommandDTO from './GameCommandDTOs/PlayCommandDTO'
import ReadyToPlayAgainCommandDTO from './GameCommandDTOs/ReadyToPlayAgainCommandDTO'

class GameCommandFactory implements ICommandFactory {
  private readonly game: IGame

  constructor(game: IGame) {
    this.game = game
  }

  public getCommand(commandDTO: CommandDTO): ICommand {
    if (commandDTO.name === 'pass') {
      return new PassCommand(this.game)
    }
    if (commandDTO.name === 'pick') {
      return new PickCommand(this.game)
    }
    if (this.isReadyToPlayAgainCommand(commandDTO)) {
      return new PlayAgainCommand(this.game, commandDTO.params.playerId)
    }
    if (this.isPlayCommand(commandDTO)) {
      return new PlayCommand(this.game, commandDTO.params.card)
    }
    if (this.isBuryCommandDTO(commandDTO)) {
      return new BuryCommand(this.game, commandDTO.params.cards, commandDTO.params.isGoingAlone)
    }
    throw Error(`Game command is not recognized: ${JSON.stringify(commandDTO)}`)
  }

  private isReadyToPlayAgainCommand(command: CommandDTO): command is ReadyToPlayAgainCommandDTO {
    return command.name === 'playAgain'
  }

  private isPlayCommand(command: CommandDTO): command is PlayCommandDTO {
    return command.name === 'play'
  }

  private isBuryCommandDTO(command: CommandDTO): command is BuryCommandDTO {
    return command.name === 'bury'
  }
}

export default GameCommandFactory

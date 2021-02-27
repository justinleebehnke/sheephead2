import BuryCommandDTO from './CommandTypes/BuryCommandDTO'
import ICommandInterface from './ICommandInterface'
import ICommandObject from './ICommandObject'
import Game from '../Entities/Game'
import PlayCommandDTO from './CommandTypes/PlayCommandDTO'

function isPlayCommand(command: ICommandObject): command is PlayCommandDTO {
  return command.name === 'play'
}

function isBuryCommand(command: ICommandObject): command is BuryCommandDTO {
  return command.name === 'bury'
}

class LocalGameCommandInterface implements ICommandInterface {
  private game: Game
  constructor(game: Game) {
    this.game = game
  }

  public async giveCommand(command: ICommandObject): Promise<void> {
    const currentTurnPlayer = this.game.getCurrentRound()?.getCurrentTurnPlayer()

    if (command.name === 'pass') {
      this.game.getCurrentRound()?.pass()
    } else if (command.name === 'playAgain') {
      this.game.playAnotherRound()
    } else if (isBuryCommand(command)) {
      if (currentTurnPlayer) {
        const [cardA, cardB] = command.params.cards
        this.game
          .getCurrentRound()
          ?.bury(
            currentTurnPlayer.removeCardFromHand(cardA),
            currentTurnPlayer.removeCardFromHand(cardB)
          )
      }
    } else if (isPlayCommand(command)) {
      if (currentTurnPlayer) {
        this.game.getCurrentRound()?.play(currentTurnPlayer.removeCardFromHand(command.params.card))
      }
    } else {
      throw new Error('Method not implemented.')
    }
  }
}

export default LocalGameCommandInterface

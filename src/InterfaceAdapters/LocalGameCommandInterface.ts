import BuryCommand from './CommandTypes/BuryCommand'
import ICommandInterface from './ICommandInterface'
import ICommandObject from './ICommandObject'
import Game from '../Entities/Game'
import PlayCommand from './CommandTypes/PlayCommand'

function isPlayCommand(command: ICommandObject): command is PlayCommand {
  return command.name === 'play'
}

function isBuryCommand(command: ICommandObject): command is BuryCommand {
  return command.name === 'bury'
}

class LocalGameCommandInterface implements ICommandInterface {
  private game: Game
  constructor(game: Game) {
    this.game = game
  }

  public async giveCommand(command: ICommandObject): Promise<void> {
    const currentTurnPlayer = this.game.getCurrentRound()?.getCurrentTurnPlayer()
    if (currentTurnPlayer) {
      if (command.name === 'pass') {
        this.game.getCurrentRound()?.pass()
      } else if (command.name === 'playAgain') {
        this.game.playAnotherRound()
      } else if (isBuryCommand(command)) {
        const [cardA, cardB] = command.params.cards
        this.game
          .getCurrentRound()
          ?.bury(
            currentTurnPlayer.removeCardFromHand(cardA),
            currentTurnPlayer.removeCardFromHand(cardB)
          )
      } else if (isPlayCommand(command)) {
        this.game.getCurrentRound()?.play(currentTurnPlayer.removeCardFromHand(command.params.card))
      } else {
        throw new Error('Method not implemented.')
      }
    }
    return new Promise(() => {}) // this is required to implement the interface
  }
}

export default LocalGameCommandInterface

import ICommandInterface from './ICommandInterface'
import ICommandObject from './ICommandObject'
import Game from '../Entities/Game'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
const localPlayerId = '79dbc191-2b0e-4dc3-83d7-7696c4abcb61'

interface BuryCommand extends ICommandObject {
  name: 'bury'
  params: {
    cards: string[]
  }
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
    if (command.name === 'pass') {
      this.game.getCurrentRound()?.pass()
    } else if (command.name === 'playAgain') {
      this.game.playAnotherRound()
    } else if (isBuryCommand(command)) {
      const localPlayer = this.game.getPlayerById(new UniqueIdentifier(localPlayerId))
      const [cardA, cardB] = command.params.cards
      this.game
        .getCurrentRound()
        ?.bury(localPlayer.removeCardFromHand(cardA), localPlayer.removeCardFromHand(cardB))
    } else {
      throw new Error('Method not implemented.')
    }
    return new Promise(() => {}) // this is required to implement the interface
  }
}

export default LocalGameCommandInterface

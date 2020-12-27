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

interface PlayCommand extends ICommandObject {
  name: 'play'
  params: {
    card: string
  }
}

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
    const localPlayer = this.game.getPlayerById(new UniqueIdentifier(localPlayerId))
    if (command.name === 'pass') {
      this.game.getCurrentRound()?.pass()
    } else if (command.name === 'playAgain') {
      this.game.playAnotherRound()
    } else if (isBuryCommand(command)) {
      const [cardA, cardB] = command.params.cards
      this.game
        .getCurrentRound()
        ?.bury(localPlayer.removeCardFromHand(cardA), localPlayer.removeCardFromHand(cardB))
    } else if (isPlayCommand(command)) {
      this.game.getCurrentRound()?.play(localPlayer.removeCardFromHand(command.params.card))
    } else {
      throw new Error('Method not implemented.')
    }
    return new Promise(() => {}) // this is required to implement the interface
  }
}

export default LocalGameCommandInterface

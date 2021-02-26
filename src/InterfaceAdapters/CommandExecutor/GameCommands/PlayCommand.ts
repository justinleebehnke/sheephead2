import ICommand from './ICommand'
import IGame from '../Interfaces/IGame'

class PlayCommand implements ICommand {
  private readonly game: IGame
  private readonly cardId: string

  constructor(game: IGame, cardId: string) {
    this.game = game
    this.cardId = cardId
  }

  public execute(): void {
    const round = this.game.getCurrentRound()
    if (!round) {
      throw Error('Cannot play because there is no current round')
    }
    const player = round.getCurrentTurnPlayer()
    if (!player) {
      throw Error("Cannot play because it is not anyone's turn")
    }
    round.play(player.removeCardFromHand(this.cardId))
  }
}

export default PlayCommand

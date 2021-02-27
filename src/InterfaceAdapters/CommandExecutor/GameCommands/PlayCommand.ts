import AbstractCommand from './AbstractCommand'
import IGame from '../Interfaces/IGame'

class PlayCommand extends AbstractCommand {
  private readonly cardId: string

  constructor(game: IGame, cardId: string) {
    super('play', game)
    this.cardId = cardId
  }

  public execute(): void {
    const round = this.game.getCurrentRound()
    if (!round) {
      throw Error(this.getNoRoundErrorMessage())
    }
    const player = round.getCurrentTurnPlayer()
    if (!player) {
      throw Error(this.getNoCurrentTurnErrorMessage())
    }
    round.play(player.removeCardFromHand(this.cardId))
  }
}

export default PlayCommand

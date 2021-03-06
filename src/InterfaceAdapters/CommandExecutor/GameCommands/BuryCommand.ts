import AbstractCommand from './AbstractCommand'
import IGame from '../../../GameEntityInterfaces/IGame'

class BuryCommand extends AbstractCommand {
  private readonly cardIds: string[]

  constructor(game: IGame, cardIds: string[], private readonly isGoingAlone: boolean) {
    super('bury', game)
    if (cardIds.length !== 2) {
      throw Error('The bury must contain two card ids to bury')
    }
    this.cardIds = cardIds
  }

  public execute(): void {
    const round = this.game.getCurrentRound()
    if (!round) {
      throw Error(this.getNoRoundErrorMessage())
    }
    const currentTurnPlayer = round.getCurrentTurnPlayer()
    if (!currentTurnPlayer) {
      throw Error(this.getNoCurrentTurnErrorMessage())
    }
    round.bury(
      currentTurnPlayer.removeCardFromHand(this.cardIds[0]),
      currentTurnPlayer.removeCardFromHand(this.cardIds[1]),
      this.isGoingAlone
    )
  }
}

export default BuryCommand

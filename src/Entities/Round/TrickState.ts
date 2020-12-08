import Card from '../Card'
import EndOfRoundState from './EndOfRoundState'
import EndOfRoundData from './EndOfRoundReportData'
import IRoundState from './IRoundState'
import Round from './Round'
import Trick from '../Trick'

class TrickState implements IRoundState {
  private round: Round

  constructor(round: Round) {
    this.round = round
  }

  public pass(): void {
    throw new Error('Cannot pass in TrickState')
  }

  public pick(): void {
    throw new Error('Cannot pick in TrickState')
  }

  public bury(cardA: Card, cardB: Card): void {
    throw new Error(`Cannot bury "${cardA.getCardId()}" & "${cardB.getCardId()}" in TrickState`)
  }

  public play(card: Card): void {
    this.round.getCurrentTrick().addCardToTrick(card, this.round.getCurrentTurnPlayer())
    if (this.isCompleteTrick()) {
      this.round.getCurrentTrick().giveToHighestRankingCardPlayer()
      if (this.thereAreMoreTricksLeftToPlay()) {
        this.round.setIndexOfCurrentTurn(
          this.round.getIndexOfNextPlayer(
            this.round.getIndexOfNextPlayer(this.round.getIndexOfCurrentTurn())
          )
        )
        this.round.setCurrentTrick(new Trick(this.round.getCurrentTrick().getTrickOrder() + 1))
        this.round.setContext(new TrickState(this.round))
      } else {
        this.round.setContext(new EndOfRoundState(this.round))
      }
    } else {
      this.round.setIndexOfCurrentTurn(
        this.round.getIndexOfNextPlayer(this.round.getIndexOfCurrentTurn())
      )
    }
  }

  private isCompleteTrick(): boolean {
    return this.round.getCurrentTrick().getNumCardsPlayed() === this.round.getNumPlayers()
  }

  private thereAreMoreTricksLeftToPlay(): boolean {
    return this.round.getCurrentTurnPlayer().hasCardsInHand()
  }

  public getEndOfRoundReport(): EndOfRoundData {
    throw new Error('Round not over in TrickState')
  }
}

export default TrickState

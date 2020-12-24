import Card from '../Card'
import EndOfRoundState from './EndOfRoundState'
import EndOfRoundData from './EndOfRoundReportData'
import IRoundState from './IRoundState'
import Round from './Round'
import Trick from '../Trick'

export const PAUSE_DURATION_AFTER_TRICK = 1750
const NUM_TRICKS_IN_GAME = 6

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

  public async play(card: Card): Promise<void> {
    const currentTurnPlayer = this.round.getCurrentTurnPlayer()
    if (currentTurnPlayer) {
      this.round.getCurrentTrick().addCardToTrick(card, currentTurnPlayer)
      if (this.isCompleteTrick()) {
        await this.pause()
        this.round.getCurrentTrick().giveToHighestRankingCardPlayer()

        if (this.thereAreMoreTricksLeftToPlay()) {
          this.round.setIndexOfCurrentTurn(
            this.round.getIndexOfPlayerById(this.round.getCurrentTrick().getWinnerOfTrick().getId())
          )
          this.round.setCurrentTrick(new Trick(this.round.getCurrentTrick().getTrickOrder() + 1))
          this.round.setContext(new TrickState(this.round))
        } else {
          this.round.setIndexOfCurrentTurn(-1)
          this.round.markAsOver()
          this.round.setContext(new EndOfRoundState(this.round))
        }
      } else {
        this.round.setIndexOfCurrentTurn(
          this.round.getIndexOfNextPlayer(this.round.getIndexOfCurrentTurn())
        )
      }
      this.round.notifySubscribers()
    } else {
      throw Error('Cannot pick when it is no one is the current turn player')
    }
  }

  private async pause(): Promise<void> {
    const indexOfCurrentTurn = this.round.getIndexOfCurrentTurn()
    this.round.setIndexOfCurrentTurn(-1)
    await new Promise((r) => setTimeout(r, PAUSE_DURATION_AFTER_TRICK))
    this.round.setIndexOfCurrentTurn(indexOfCurrentTurn)
  }

  private isCompleteTrick(): boolean {
    return this.round.getCurrentTrick().getNumCardsPlayed() === this.round.getNumPlayers()
  }

  private thereAreMoreTricksLeftToPlay(): boolean {
    return this.round.getCurrentTrick().getTrickOrder() < NUM_TRICKS_IN_GAME
  }

  public getEndOfRoundReport(): EndOfRoundData {
    throw new Error('Round not over in TrickState')
  }
}

export default TrickState

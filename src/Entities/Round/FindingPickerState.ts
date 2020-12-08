import Card from '../Card'
import EndOfRoundData from './EndOfRoundReportData'
import IRoundState from './IRoundState'
import PickerHasNotBuriedState from './PickerHasNotBuriedState'
import Round from './Round'

class FindingPickerState implements IRoundState {
  private round: Round

  constructor(round: Round) {
    this.round = round
  }

  public pass(): void {
    if (this.round.getIndexOfDealer() === this.round.getIndexOfCurrentTurn()) {
      this.round.reDeal()
    } else {
      this.round.nextTurn()
    }
  }

  public pick(): void {
    const [blindCardA, blindCardB] = this.round.getBlind()
    this.round.getCurrentTurnPlayer().giveCard(blindCardA)
    this.round.getCurrentTurnPlayer().giveCard(blindCardB)
    this.round.setBlind([])
    this.round.setPickerIndex(this.round.getIndexOfCurrentTurn())
    this.round.setContext(new PickerHasNotBuriedState(this.round))
  }

  public bury(cardA: Card, cardB: Card): void {
    throw new Error(
      `Cannot bury "${cardA.getCardId()}" & "${cardB.getCardId()}" in FindingPickerState.`
    )
  }

  public play(card: Card): void {
    throw new Error(`Cannot play "${card.getCardId()}" in FindingPickerState`)
  }

  public getEndOfRoundReport(): EndOfRoundData {
    throw new Error('Round not over in FindingPickerState')
  }
}

export default FindingPickerState

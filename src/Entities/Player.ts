import Card from './Card'
import Hand from './Hand'
import IPayablePlayer from '../Payment/IPayablePlayer'
import Trick from './Trick'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class Player implements IPayablePlayer {
  private name: string
  private hand: Hand
  private tricksWon: Trick[]
  private uniqueIdentifier: UniqueIdentifier
  private centsWonExcludingCurrentHand: number
  private centsWonInCurrentHand: number

  constructor(name: string, id: UniqueIdentifier) {
    this.name = name
    this.hand = new Hand()
    this.tricksWon = []
    this.uniqueIdentifier = id
    this.centsWonExcludingCurrentHand = 0
    this.centsWonInCurrentHand = 0
  }

  public transferRoundWinningsToTotalWinnings(): void {
    this.centsWonExcludingCurrentHand += this.centsWonInCurrentHand
    this.centsWonInCurrentHand = 0
  }

  get totalCentsWon(): number {
    return this.centsWonExcludingCurrentHand + this.centsWonInCurrentHand
  }

  get currentHandCentsWon(): number {
    return this.centsWonInCurrentHand
  }

  public giveCentsForRound(cents: number) {
    this.centsWonInCurrentHand = cents
  }

  public getName(): string {
    return this.name
  }

  public getId(): string {
    return this.uniqueIdentifier.getId()
  }

  public giveCard(card: Card): void {
    this.hand.addCard(card)
  }

  public getCardsInHand(): string[] {
    return this.hand.getAllCardIds()
  }

  public removeCardFromHand(cardId: string): Card {
    return this.hand.removeCardFromHand(cardId)
  }

  public giveTrick(trick: Trick) {
    this.tricksWon.push(trick)
  }

  public getTricksWon(): Trick[] {
    return this.tricksWon
  }

  public getPlayableCardIds(leadCard?: Card): string[] {
    return this.hand.getPlayableCardIds(leadCard)
  }

  public hasCardsInHand(): boolean {
    return this.hand.getPlayableCardIds().length > 0
  }

  public clearCards(): void {
    this.tricksWon = []
    this.hand = new Hand()
  }
}

export default Player

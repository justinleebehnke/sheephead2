import Card from './Card'
import Hand from './Hand'
import Trick from './Trick'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class Player {
  private name: string
  private hand: Hand
  private tricksWon: Trick[]
  private uniqueIdentifier: UniqueIdentifier

  constructor(name: string, id: UniqueIdentifier) {
    this.name = name
    this.hand = new Hand()
    this.tricksWon = []
    this.uniqueIdentifier = id
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

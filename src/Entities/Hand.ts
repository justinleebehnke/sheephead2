import Card from './Card'
import Suit from './Suit'

class Hand {
  private hand: Card[]

  constructor() {
    this.hand = []
  }

  public addCard(card: Card): void {
    this.hand.push(card)
    this.hand.sort(this.sortBySuitThenRankAscending)
  }

  private sortBySuitThenRankAscending(cardA: Card, cardB: Card): number {
    if (Hand.cardsAreOfSameSuit(cardA, cardB)) {
      return cardA.getRank() - cardB.getRank()
    }
    return Hand.sortBySuit(cardA, cardB)
  }

  private static sortBySuit(cardA: Card, cardB: Card): number {
    if (cardA.isTrump()) {
      return -1
    }
    if (cardB.isTrump()) {
      return 1
    }
    return Hand.getNumberForSuit(cardB.getSuit()) - Hand.getNumberForSuit(cardA.getSuit())
  }

  private static getNumberForSuit(suit: Suit): number {
    switch (suit) {
      case Suit.CLUB:
        return 3
      case Suit.SPADE:
        return 2
      case Suit.HEART:
        return 1
      default:
        throw Error('this should not have happened, all diamond are trump')
    }
  }

  private static cardsAreOfSameSuit(cardA: Card, cardB: Card): boolean {
    if (cardA.isTrump() && cardB.isTrump()) {
      return true
    }
    if (cardA.isTrump() || cardB.isTrump()) {
      return false
    }
    return cardA.getSuit() === cardB.getSuit()
  }

  public removeCardFromHand(cardId: string): Card {
    if (this.hand.some((card) => card.getCardId() === cardId)) {
      const result = this.hand.find((card) => card.getCardId() === cardId)
      this.hand = this.hand.filter((card) => card.getCardId() !== cardId)
      // @ts-ignore
      return result
    }
    throw Error(`Card id: ${cardId} not in hand`)
  }

  public getPlayableCardIds(leadCard?: Card): string[] {
    if (leadCard === undefined) {
      return this.getAllCardIds()
    }
    if (this.mustPlayTrump(leadCard)) {
      return this.getTrumpIds()
    }
    if (this.mustPlayMatchingSuit(leadCard)) {
      return this.getNonTrumpMatchingSuitIds(leadCard)
    }
    return this.getAllCardIds()
  }

  private mustPlayTrump(leadCard: Card): boolean {
    return leadCard.isTrump() && this.hand.some((card) => card.isTrump())
  }

  private getTrumpIds(): string[] {
    return this.hand.filter((card) => card.isTrump()).map((card) => card.getCardId())
  }

  private mustPlayMatchingSuit(leadCard: Card): boolean {
    return (
      !leadCard.isTrump() &&
      this.hand.some((card) => !card.isTrump() && card.getSuit() === leadCard.getSuit())
    )
  }

  private getNonTrumpMatchingSuitIds(leadCard: Card): string[] {
    return this.hand
      .filter((card) => !card.isTrump() && card.getSuit() === leadCard.getSuit())
      .map((card) => card.getCardId())
  }

  public getAllCardIds(): string[] {
    return this.hand.map((card) => card.getCardId())
  }
}

export default Hand

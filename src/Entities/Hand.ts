import Card from './Card'

class Hand {
  private hand: Card[]

  constructor() {
    this.hand = []
  }

  public addCard(card: Card): void {
    this.hand.push(card)
    this.hand.sort(this.sortByRankAscending)
  }

  private sortByRankAscending(cardA: Card, cardB: Card): number {
    return cardA.getRank() - cardB.getRank()
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

  private getAllCardIds(): string[] {
    return this.hand.map((card) => card.getCardId())
  }
}

export default Hand

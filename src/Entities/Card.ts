import ICardRanker from './ICardRanker'
import Suit from './Suit'

class Card {
  private cardId: string
  private suit: Suit
  private rank: number
  private pointValue: number
  private _isTrump: boolean

  constructor(cardId: string, cardRanker: ICardRanker) {
    if (cardRanker.isValidCard(cardId)) {
      this.cardId = cardId
      this.suit = cardRanker.getSuit(cardId)
      this.rank = cardRanker.getRank(cardId)
      this.pointValue = cardRanker.getPointValue(cardId)
      this._isTrump = cardRanker.isTrump(cardId)
    } else {
      throw Error(`Invalid Card Id: ${cardId}`)
    }
  }

  public getCardId(): string {
    return this.cardId
  }

  public getRank(): number {
    return this.rank
  }

  public getSuit(): Suit {
    return this.suit
  }

  public isTrump(): boolean {
    return this._isTrump
  }

  public getPointValue(): number {
    return this.pointValue
  }
}

export default Card

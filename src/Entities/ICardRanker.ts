import Suit from './Suit'

interface ICardRanker {
  isTrump(cardId: string): boolean
  isValidCard(cardId: string): boolean
  getAllCardIds(): string[]
  getPointValue(cardId: string): number
  getRank(cardId: string): number
  getSuit(cardId: string): Suit
}

export default ICardRanker

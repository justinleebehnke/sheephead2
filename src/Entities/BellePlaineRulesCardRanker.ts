import ICardRanker from './ICardRanker'
import Suit from './Suit'

interface CardConfig {
  isTrump: boolean
  pointValue: number
  rank: number
  suit: Suit
}

const cardIdToCardConfig: Map<string, CardConfig> = new Map()
cardIdToCardConfig.set('qd', {
  rank: 5,
  pointValue: 3,
  suit: Suit.DIAMOND,
  isTrump: true,
})
cardIdToCardConfig.set('jd', {
  rank: 9,
  pointValue: 2,
  suit: Suit.DIAMOND,
  isTrump: true,
})
cardIdToCardConfig.set('7d', {
  rank: 2,
  pointValue: 0,
  suit: Suit.DIAMOND,
  isTrump: true,
})
cardIdToCardConfig.set('ad', {
  rank: 10,
  pointValue: 11,
  suit: Suit.DIAMOND,
  isTrump: true,
})
cardIdToCardConfig.set('td', {
  rank: 11,
  pointValue: 10,
  suit: Suit.DIAMOND,
  isTrump: true,
})
cardIdToCardConfig.set('kd', {
  rank: 12,
  pointValue: 4,
  suit: Suit.DIAMOND,
  isTrump: true,
})
cardIdToCardConfig.set('9d', {
  rank: 13,
  pointValue: 0,
  suit: Suit.DIAMOND,
  isTrump: true,
})
cardIdToCardConfig.set('8d', {
  rank: 14,
  pointValue: 0,
  suit: Suit.DIAMOND,
  isTrump: true,
})

cardIdToCardConfig.set('qc', {
  rank: 1,
  pointValue: 3,
  suit: Suit.CLUB,
  isTrump: true,
})
cardIdToCardConfig.set('jc', {
  rank: 6,
  pointValue: 2,
  suit: Suit.CLUB,
  isTrump: true,
})
cardIdToCardConfig.set('ac', {
  rank: 15,
  pointValue: 11,
  suit: Suit.CLUB,
  isTrump: false,
})
cardIdToCardConfig.set('tc', {
  rank: 18,
  pointValue: 10,
  suit: Suit.CLUB,
  isTrump: false,
})
cardIdToCardConfig.set('kc', {
  rank: 21,
  pointValue: 4,
  suit: Suit.CLUB,
  isTrump: false,
})
cardIdToCardConfig.set('9c', {
  rank: 24,
  pointValue: 0,
  suit: Suit.CLUB,
  isTrump: false,
})

cardIdToCardConfig.set('qs', {
  rank: 3,
  pointValue: 3,
  suit: Suit.SPADE,
  isTrump: true,
})
cardIdToCardConfig.set('js', {
  rank: 7,
  pointValue: 2,
  suit: Suit.SPADE,
  isTrump: true,
})
cardIdToCardConfig.set('ts', {
  rank: 19,
  pointValue: 10,
  suit: Suit.SPADE,
  isTrump: false,
})
cardIdToCardConfig.set('ks', {
  rank: 22,
  pointValue: 4,
  suit: Suit.SPADE,
  isTrump: false,
})
cardIdToCardConfig.set('9s', {
  rank: 25,
  pointValue: 0,
  suit: Suit.SPADE,
  isTrump: false,
})
cardIdToCardConfig.set('as', {
  rank: 16,
  pointValue: 11,
  suit: Suit.SPADE,
  isTrump: false,
})

cardIdToCardConfig.set('qh', {
  rank: 4,
  pointValue: 3,
  suit: Suit.HEART,
  isTrump: true,
})
cardIdToCardConfig.set('kh', {
  rank: 23,
  pointValue: 4,
  suit: Suit.HEART,
  isTrump: false,
})
cardIdToCardConfig.set('ah', {
  rank: 17,
  pointValue: 11,
  suit: Suit.HEART,
  isTrump: false,
})
cardIdToCardConfig.set('jh', {
  rank: 8,
  pointValue: 2,
  suit: Suit.HEART,
  isTrump: true,
})
cardIdToCardConfig.set('th', {
  rank: 20,
  pointValue: 10,
  suit: Suit.HEART,
  isTrump: false,
})
cardIdToCardConfig.set('9h', {
  rank: 26,
  pointValue: 0,
  suit: Suit.HEART,
  isTrump: false,
})

class BellePlaineRulesCardRanker implements ICardRanker {
  public isTrump(cardId: string): boolean {
    // @ts-ignore
    return cardIdToCardConfig.get(cardId).isTrump
  }

  public isValidCard(cardId: string): boolean {
    return cardIdToCardConfig.has(cardId)
  }

  public getAllCardIds(): string[] {
    return Array.from(cardIdToCardConfig.keys())
  }

  public getPointValue(cardId: string): number {
    // @ts-ignore
    return cardIdToCardConfig.get(cardId).pointValue
  }

  public getRank(cardId: string): number {
    // @ts-ignore
    return cardIdToCardConfig.get(cardId).rank
  }

  public getSuit(cardId: string): Suit {
    // @ts-ignore
    return cardIdToCardConfig.get(cardId).suit
  }
}

export default BellePlaineRulesCardRanker

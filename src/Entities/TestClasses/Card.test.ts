import BellePlaineRulesCardRanker from '../../Entities/BellePlaineRulesCardRanker'
import Card from '../Card'
import Suit from '../Suit'

describe('Card', () => {
  it('Should have all the correct properties when constructed', () => {
    expect(new Card('qc', new BellePlaineRulesCardRanker()).getSuit()).toBe(Suit.CLUB)
    expect(new Card('qc', new BellePlaineRulesCardRanker()).getRank()).toBe(1)
    expect(new Card('qc', new BellePlaineRulesCardRanker()).isTrump()).toBe(true)
    expect(new Card('qc', new BellePlaineRulesCardRanker()).getCardId()).toBe('qc')
    expect(new Card('qc', new BellePlaineRulesCardRanker()).getPointValue()).toBe(3)
  })

  it('Should throw an error if the id is not valid', () => {
    expect(() => new Card('q7', new BellePlaineRulesCardRanker())).toThrow('Invalid Card Id: q7')
  })
})

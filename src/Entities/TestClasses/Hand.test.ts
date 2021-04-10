import ICardRanker from '../../Entities/ICardRanker'
import BellePlaineRulesCardRanker from '../BellePlaineRulesCardRanker'
import Card from '../Card'
import Hand from '../Hand'

describe('Hand', () => {
  let hand: Hand
  let cardRanker: ICardRanker
  let cardIdsInHand: string[]
  describe('remove card from hand', () => {
    beforeEach(() => {
      hand = new Hand()
      cardRanker = new BellePlaineRulesCardRanker()
      cardIdsInHand = ['qc', '9c']
      cardIdsInHand.forEach((cardId) => hand.addCard(new Card(cardId, cardRanker)))
    })
    it('Should throw an error if the card requested is not in the hand', () => {
      expect(() => hand.removeCardFromHand('ac')).toThrow('Card id: ac not in hand')
    })
    it('Should give the card back when asked and it should remove the card from the hand', () => {
      expect(hand.getPlayableCardIds()).toEqual(cardIdsInHand)
      expect(hand.removeCardFromHand('9c').getCardId()).toBe('9c')
      expect(hand.getPlayableCardIds()).toEqual(['qc'])
      expect(hand.removeCardFromHand('qc').getCardId()).toBe('qc')
      expect(hand.getPlayableCardIds()).toEqual([])
    })
  })

  describe('Get Playable Cards From Hand', () => {
    beforeEach(() => {
      hand = new Hand()
      cardRanker = new BellePlaineRulesCardRanker()
    })
    it('Should return all cards if the lead card is not specified', () => {
      cardIdsInHand = ['qc', '9c']
      cardIdsInHand.forEach((cardId) => hand.addCard(new Card(cardId, cardRanker)))
      expect(hand.getPlayableCardIds()).toEqual(cardIdsInHand)
    })
    it('Should return only the trump cards if there the lead is a trump card and there are trump cards in the hand', () => {
      cardIdsInHand = ['qc', '9c']
      cardIdsInHand.forEach((cardId) => hand.addCard(new Card(cardId, cardRanker)))
      const leadCard = new Card('js', cardRanker)
      expect(hand.getPlayableCardIds(leadCard)).toEqual(['qc'])
    })
    it('Should return only the non trump cards of the same suit if any exist in the hand and the lead is a non trump', () => {
      cardIdsInHand = ['qc', '9c']
      cardIdsInHand.forEach((cardId) => hand.addCard(new Card(cardId, cardRanker)))
      const nonTrumpLead = new Card('ac', cardRanker)
      expect(hand.getPlayableCardIds(nonTrumpLead)).toEqual(['9c'])
    })
    it('Should return all cards in the hand if there there is no matching suit in the hand to follow', () => {
      cardIdsInHand = ['qc', '9c']
      cardIdsInHand.forEach((cardId) => hand.addCard(new Card(cardId, cardRanker)))
      const nonTrumpLead = new Card('as', cardRanker)
      expect(hand.getPlayableCardIds(nonTrumpLead)).toEqual(cardIdsInHand)
    })
    it('Should return all cards in the hand if there there is no lead card passed in', () => {
      cardIdsInHand = ['qc', '9c']
      cardIdsInHand.forEach((cardId) => hand.addCard(new Card(cardId, cardRanker)))
      const leadCard = new Card('9s', cardRanker)
      expect(hand.getPlayableCardIds(leadCard)).toEqual(cardIdsInHand)
    })
    it('Should return all cards in the hand lead is trump and there are no trump cards', () => {
      cardIdsInHand = ['ac', '9s']
      cardIdsInHand.forEach((cardId) => hand.addCard(new Card(cardId, cardRanker)))
      const trumpLead = new Card('qc', cardRanker)
      expect(hand.getPlayableCardIds(trumpLead)).toEqual(cardIdsInHand)
    })
  })

  describe('Sorting Properly', () => {
    beforeEach(() => {
      hand = new Hand()
      cardRanker = new BellePlaineRulesCardRanker()
    })
    it('Should first sort by suit then by rank', () => {
      hand.addCard(new Card('qc', cardRanker))
      expect(hand.getPlayableCardIds()).toEqual(['qc'])
      hand.addCard(new Card('ah', cardRanker))
      hand.addCard(new Card('jd', cardRanker))
      hand.addCard(new Card('th', cardRanker))
      hand.addCard(new Card('ac', cardRanker))
      hand.addCard(new Card('tc', cardRanker))
      expect(hand.getPlayableCardIds()).toEqual(['qc', 'jd', 'ac', 'tc', 'ah', 'th'])

      hand.addCard(new Card('td', cardRanker))
      hand.addCard(new Card('ts', cardRanker))
      expect(hand.getPlayableCardIds()).toEqual(['qc', 'jd', 'td', 'ac', 'tc', 'ts', 'ah', 'th'])

      hand.addCard(new Card('ad', cardRanker))
      hand.addCard(new Card('as', cardRanker))
      expect(hand.getPlayableCardIds()).toEqual([
        'qc',
        'jd',
        'ad',
        'td',
        'ac',
        'tc',
        'as',
        'ts',
        'ah',
        'th',
      ])

      hand.addCard(new Card('9h', cardRanker))
      hand.addCard(new Card('9s', cardRanker))
      hand.addCard(new Card('9c', cardRanker))
      hand.addCard(new Card('9d', cardRanker))
      expect(hand.getPlayableCardIds()).toEqual([
        'qc',
        'jd',
        'ad',
        'td',
        '9d',
        'ac',
        'tc',
        '9c',
        'as',
        'ts',
        '9s',
        'ah',
        'th',
        '9h',
      ])
    })
  })
})

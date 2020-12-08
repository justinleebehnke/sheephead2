import ICardRanker from 'Entities/ICardRanker'
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
})

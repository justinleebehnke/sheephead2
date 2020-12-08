import Deck from '../Deck'

describe('Deck', () => {
  describe('getNextCard', () => {
    it('Should throw an error if the deck is empty', () => {
      // @ts-ignore
      const deck = new Deck(null)
      expect(deck.hasNextCard()).toBeFalsy()
      expect(() => deck.getNextCard()).toThrow('Cannot get next card on empty deck')
    })
  })
})

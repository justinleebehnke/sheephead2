import Card from '../Card'
import BellePlaineRulesCardRanker from '../BellePlaineRulesCardRanker'
import Player from '../Player'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import Trick from '../Trick'

describe('Player', () => {
  describe('clearCards', () => {
    it('Should empty their hand and their tricks', () => {
      const ranker = new BellePlaineRulesCardRanker()
      const player = new Player('Jason', new UniqueIdentifier())
      player.giveCard(new Card('qc', ranker))
      player.giveTrick(new Trick(1))
      expect(player.getTricksWon().length).toBe(1)
      expect(player.getPlayableCardIds().length).toBe(1)
      player.clearCards()
      expect(player.getTricksWon().length).toBe(0)
      expect(player.getPlayableCardIds().length).toBe(0)
    })
  })
})

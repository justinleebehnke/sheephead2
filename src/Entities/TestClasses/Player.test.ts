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

  describe('Give winnings', () => {
    it('Should include the players current hand winnings in the total', () => {
      const player = new Player('Jason', new UniqueIdentifier())
      player.giveCentsForRound(25)
      expect(player.totalCentsWon).toEqual(25)
      player.giveCentsForRound(25)
      expect(player.totalCentsWon).toEqual(25)
    })

    it('Should have the option to transfer the winnings from the players current hand', () => {
      const player = new Player('Jason', new UniqueIdentifier())
      player.giveCentsForRound(25)
      expect(player.totalCentsWon).toEqual(25)
      expect(player.currentHandCentsWon).toEqual(25)
      player.transferRoundWinningsToTotalWinnings()
      expect(player.totalCentsWon).toEqual(25)
      expect(player.currentHandCentsWon).toEqual(0)
      player.giveCentsForRound(25)
      expect(player.totalCentsWon).toEqual(50)
      expect(player.currentHandCentsWon).toEqual(25)
    })
  })
})

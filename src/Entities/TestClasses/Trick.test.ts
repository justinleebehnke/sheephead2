import BellePlaineRulesCardRanker from '../BellePlaineRulesCardRanker'
import Card from '../Card'
import ICardRanker from '../ICardRanker'
import Player from '../Player'
import Trick from '../Trick'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

describe('Giving Trick to Winner', () => {
  let player1: Player
  let player2: Player
  let player3: Player
  let player4: Player
  let cardRanker: ICardRanker
  beforeEach(() => {
    player1 = new Player('player 1', new UniqueIdentifier())
    player2 = new Player('player 2', new UniqueIdentifier())
    player3 = new Player('player 3', new UniqueIdentifier())
    player4 = new Player('player 4', new UniqueIdentifier())
    cardRanker = new BellePlaineRulesCardRanker()
  })
  it('Should give the trick to the highest ranking card when all cards are trump', () => {
    let trick = new Trick(1)
    expect(trick.getLeadCard()).toBeUndefined()
    trick.addCardToTrick(new Card('qc', cardRanker), player1)
    trick.addCardToTrick(new Card('7d', cardRanker), player2)
    trick.addCardToTrick(new Card('qs', cardRanker), player3)
    trick.addCardToTrick(new Card('qh', cardRanker), player4)
    trick.giveToHighestRankingCardPlayer()
    expect(player1.getTricksWon()).toEqual([trick])
  })

  it('Should give the trick to the highest ranking card when all cards are the same suit', () => {
    let trick = new Trick(1)
    trick.addCardToTrick(new Card('9c', cardRanker), player1)
    trick.addCardToTrick(new Card('tc', cardRanker), player2)
    trick.addCardToTrick(new Card('ac', cardRanker), player3)
    trick.addCardToTrick(new Card('kc', cardRanker), player4)
    trick.giveToHighestRankingCardPlayer()
    expect(player3.getTricksWon()).toEqual([trick])
  })

  it('Should give the trick to the trump card even if some players are following suit', () => {
    let trick = new Trick(1)
    trick.addCardToTrick(new Card('9c', cardRanker), player1)
    trick.addCardToTrick(new Card('td', cardRanker), player2)
    trick.addCardToTrick(new Card('ac', cardRanker), player3)
    trick.addCardToTrick(new Card('kd', cardRanker), player4)
    trick.giveToHighestRankingCardPlayer()
    expect(player2.getTricksWon()).toEqual([trick])
  })

  it('Should give the trick to the lead card if non of the players can following suit', () => {
    let trick = new Trick(1)
    trick.addCardToTrick(new Card('9h', cardRanker), player1)
    trick.addCardToTrick(new Card('tc', cardRanker), player2)
    trick.addCardToTrick(new Card('ac', cardRanker), player3)
    trick.addCardToTrick(new Card('as', cardRanker), player4)
    trick.giveToHighestRankingCardPlayer()
    expect(player1.getTricksWon()).toEqual([trick])
  })
})

export {}

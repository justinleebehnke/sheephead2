import Card from '../Card'
import BellePlaineRulesCardRanker from '../BellePlaineRulesCardRanker'
import ICardRanker from '../../Entities/ICardRanker'
import IShuffleSeedManager from '../Round/IShuffleSeedManager'
import Player from '../Player'
import Round from '../Round/Round'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

describe('Round', () => {
  let cardRanker: ICardRanker
  let player1Id: string
  let player1: Player
  let player2Id: string
  let player2: Player
  let player3Id: string
  let player3: Player
  let player4Id: string
  let player4: Player
  let round: Round
  let shuffleSeedManager: IShuffleSeedManager

  beforeEach(() => {
    shuffleSeedManager = {
      getShuffleSeed: jest.fn().mockReturnValueOnce(123456789).mockReturnValueOnce(123456790),
      changeShuffleSeed: jest.fn(),
    }

    cardRanker = new BellePlaineRulesCardRanker()
    player1Id = '4d2f43c3-224d-46ba-bb76-0e383d9ceb5c'
    player1 = new Player('Jesse', new UniqueIdentifier(player1Id))

    player2Id = '32b62508-4e72-4028-8794-fd075b0393b5'
    player2 = new Player('John', new UniqueIdentifier(player2Id))

    player3Id = '79dbc191-2b0e-4dc3-83d7-7696c4abcb61'
    player3 = new Player('Jake', new UniqueIdentifier(player3Id))

    player4Id = '81756fd4-3f61-4833-b012-43fbc407b688'
    player4 = new Player('Carly', new UniqueIdentifier(player4Id))

    round = new Round(
      [player1, player2, player3, player4],
      0,
      shuffleSeedManager,
      new BellePlaineRulesCardRanker()
    )
  })
  it('Should be able to play a round all the way through', async () => {
    expect(player1.getPlayableCardIds()).toEqual(['7d', 'qh', '9d', '8d', 'kc', '9s'])
    expect(player2.getPlayableCardIds()).toEqual(['qd', 'td', 'kd', 'ah', 'tc', '9c'])
    expect(player3.getPlayableCardIds()).toEqual(['qs', 'jc', 'js', 'jd', 'ad', '9h'])
    expect(player4.getPlayableCardIds()).toEqual(['qc', 'ac', 'as', 'ts', 'th', 'kh'])

    expect(round.getBlind().length).toBe(2)
    expect(round.getBury().length).toBe(0)

    expect(round.getCurrentTurnPlayer()).toBe(player2)
    expect(() => round.play(new Card('qc', cardRanker))).toThrow(
      'Cannot play "qc" in FindingPickerState'
    )
    round.pass()
    expect(round.getCurrentTurnPlayer()).toBe(player3)

    expect(round.getPickerIndex()).toBe(-1)
    round.pick()
    expect(round.getPickerIndex()).toBe(2)

    expect(round.getBlind().length).toBe(0)
    expect(player3.getPlayableCardIds()).toEqual(['qs', 'jc', 'js', 'jh', 'jd', 'ad', 'ks', '9h'])
    expect(() => round.play(new Card('qc', cardRanker))).toThrow(
      'Cannot play "qc" in PickerHasNotBuriedState'
    )
    expect(round.getCurrentTurnPlayer()).toBe(player3)

    round.bury(player3.removeCardFromHand('ad'), player3.removeCardFromHand('ks'))
    expect(player3.getPlayableCardIds()).toEqual(['qs', 'jc', 'js', 'jh', 'jd', '9h'])

    expect(round.getBlind().length).toBe(0)
    expect(round.getBury().some((card) => card.getCardId() === 'ad')).toBeTruthy()
    expect(round.getBury().some((card) => card.getCardId() === 'ks')).toBeTruthy()
    expect(round.getBury().length).toBe(2)

    expect(() => round.pass()).toThrow('Cannot pass in TrickState')

    expect(round.getCurrentTurnPlayer()).toBe(player2)
    expect(round.getCurrentTurnPlayer().getPlayableCardIds().length).toBe(6)

    const round1LeadCard = player2.removeCardFromHand('qd')
    expect(player2.getPlayableCardIds()).toEqual(['td', 'kd', 'ah', 'tc', '9c'])
    round.play(round1LeadCard)
    // @ts-ignore
    expect(round.getCurrentTrick().getNumCardsPlayed()).toBe(1)
    expect(round.getCurrentTurnPlayer()).toBe(player3)
    expect(player3.getPlayableCardIds(round1LeadCard)).toEqual(['qs', 'jc', 'js', 'jh', 'jd'])
    round.play(player3.removeCardFromHand('jd'))
    // @ts-ignore
    expect(round.getCurrentTrick().getNumCardsPlayed()).toBe(2)
    expect(round.getCurrentTurnPlayer()).toBe(player4)
    expect(player4.getPlayableCardIds(round1LeadCard)).toEqual(['qc'])
    round.play(player4.removeCardFromHand('qc'))
    // @ts-ignore
    expect(round.getCurrentTrick().getNumCardsPlayed()).toBe(3)
    expect(round.getCurrentTurnPlayer()).toBe(player1)
    expect(player1.getPlayableCardIds(round1LeadCard)).toEqual(['7d', 'qh', '9d', '8d'])
    round.play(player1.removeCardFromHand('8d'))

    expect(player1.getTricksWon().length).toBe(0)
    expect(player2.getTricksWon().length).toBe(0)
    expect(player3.getTricksWon().length).toBe(0)
    expect(player4.getTricksWon().length).toBe(1)
    // @ts-ignore
    expect(round.getCurrentTrick().getNumCardsPlayed()).toBe(0)

    expect(round.getCurrentTurnPlayer()).toBe(player4)
    expect(player4.getPlayableCardIds()).toEqual(['ac', 'as', 'ts', 'th', 'kh'])
    const round2LeadCard = player4.removeCardFromHand('kh')
    round.play(round2LeadCard)

    expect(round.getCurrentTurnPlayer()).toBe(player1)
    expect(player1.getPlayableCardIds(round2LeadCard)).toEqual(['7d', 'qh', '9d', 'kc', '9s'])

    round.play(player1.removeCardFromHand('7d'))
    expect(round.getCurrentTurnPlayer()).toBe(player2)
    expect(player2.getPlayableCardIds(round2LeadCard)).toEqual(['ah'])
    round.play(player2.removeCardFromHand('td'))

    expect(round.getCurrentTurnPlayer()).toBe(player3)
    expect(player3.getPlayableCardIds()).toEqual(['qs', 'jc', 'js', 'jh', '9h'])
    round.play(player3.removeCardFromHand('qs'))

    expect(player1.getTricksWon().length).toBe(1)
    expect(player2.getTricksWon().length).toBe(0)
    expect(player3.getTricksWon().length).toBe(0)
    expect(player4.getTricksWon().length).toBe(1)

    expect(player1.getPlayableCardIds()).toEqual(['qh', '9d', 'kc', '9s'])
    expect(player2.getPlayableCardIds()).toEqual(['kd', 'ah', 'tc', '9c'])
    expect(player3.getPlayableCardIds()).toEqual(['jc', 'js', 'jh', '9h'])
    expect(player4.getPlayableCardIds()).toEqual(['ac', 'as', 'ts', 'th'])

    expect(round.getCurrentTurnPlayer()).toBe(player1)
    expect(player1.getPlayableCardIds()).toEqual(['qh', '9d', 'kc', '9s'])
    const round3LeadCard = player1.removeCardFromHand('kc')
    round.play(round3LeadCard)
    expect(round.getCurrentTurnPlayer()).toBe(player2)
    expect(player2.getPlayableCardIds(round3LeadCard)).toEqual(['tc', '9c'])
    round.play(player2.removeCardFromHand('9c'))
    expect(round.getCurrentTurnPlayer()).toBe(player3)
    expect(player3.getPlayableCardIds(round3LeadCard)).toEqual(['jc', 'js', 'jh', '9h'])
    round.play(player3.removeCardFromHand('9h'))

    expect(round.getCurrentTurnPlayer()).toBe(player4)
    round.play(player4.removeCardFromHand('ac'))

    expect(player1.getTricksWon().length).toBe(1)
    expect(player2.getTricksWon().length).toBe(0)
    expect(player3.getTricksWon().length).toBe(0)
    expect(player4.getTricksWon().length).toBe(2)

    expect(player1.getPlayableCardIds()).toEqual(['qh', '9d', '9s'])
    expect(player2.getPlayableCardIds()).toEqual(['kd', 'ah', 'tc'])
    expect(player3.getPlayableCardIds()).toEqual(['jc', 'js', 'jh'])
    expect(player4.getPlayableCardIds()).toEqual(['as', 'ts', 'th'])

    expect(player4.getPlayableCardIds()).toEqual(['as', 'ts', 'th'])
    const round4LeadCard = player4.removeCardFromHand('as')
    round.play(round4LeadCard)
    expect(round.getCurrentTurnPlayer()).toBe(player1)
    round.play(player1.removeCardFromHand('9s'))
    expect(round.getCurrentTurnPlayer()).toBe(player2)
    expect(player2.getPlayableCardIds(round4LeadCard)).toEqual(['kd', 'ah', 'tc'])
    round.play(player2.removeCardFromHand('kd'))
    expect(round.getCurrentTurnPlayer()).toBe(player3)
    expect(player3.getPlayableCardIds(round4LeadCard)).toEqual(['jc', 'js', 'jh'])
    round.play(player3.removeCardFromHand('jc'))

    expect(player1.getTricksWon().length).toBe(1)
    expect(player2.getTricksWon().length).toBe(0)
    expect(player3.getTricksWon().length).toBe(1)
    expect(player4.getTricksWon().length).toBe(2)

    expect(player1.getPlayableCardIds()).toEqual(['qh', '9d'])
    expect(player2.getPlayableCardIds()).toEqual(['ah', 'tc'])
    expect(player3.getPlayableCardIds()).toEqual(['js', 'jh'])
    expect(player4.getPlayableCardIds()).toEqual(['ts', 'th'])

    expect(round.getCurrentTurnPlayer()).toBe(player3)
    expect(player3.getPlayableCardIds()).toEqual(['js', 'jh'])
    const round5LeadCard = player3.removeCardFromHand('jh')
    round.play(round5LeadCard)

    expect(round.getCurrentTurnPlayer()).toBe(player4)
    expect(player4.getPlayableCardIds(round5LeadCard)).toEqual(['ts', 'th'])
    round.play(player4.removeCardFromHand('th'))
    expect(round.getCurrentTurnPlayer()).toBe(player1)
    expect(player1.getPlayableCardIds(round5LeadCard)).toEqual(['qh', '9d'])
    round.play(player1.removeCardFromHand('9d'))

    expect(round.getCurrentTurnPlayer()).toBe(player2)
    round.play(player2.removeCardFromHand('ah'))

    expect(player1.getTricksWon().length).toBe(1)
    expect(player2.getTricksWon().length).toBe(0)
    expect(player3.getTricksWon().length).toBe(2)
    expect(player4.getTricksWon().length).toBe(2)

    expect(player1.getPlayableCardIds()).toEqual(['qh'])
    expect(player2.getPlayableCardIds()).toEqual(['tc'])
    expect(player3.getPlayableCardIds()).toEqual(['js'])
    expect(player4.getPlayableCardIds()).toEqual(['ts'])

    expect(round.getCurrentTurnPlayer()).toBe(player3)
    const round6LeadCard = player3.removeCardFromHand('js')
    round.play(round6LeadCard)
    expect(round.getCurrentTurnPlayer()).toBe(player4)
    round.play(player4.removeCardFromHand('ts'))
    expect(round.getCurrentTurnPlayer()).toBe(player1)
    round.play(player1.removeCardFromHand('qh'))
    expect(round.getCurrentTurnPlayer()).toBe(player2)
    round.play(player2.removeCardFromHand('tc'))

    expect(() => round.pick()).toThrow('Cannot pick in EndOfRoundState')

    const player1CardData = [
      {
        cardId: '8d',
        pointValue: 0,
        playedByPlayerId: player1Id,
      },
      {
        cardId: '7d',
        pointValue: 0,
        playedByPlayerId: player1Id,
      },
      {
        cardId: 'kc',
        pointValue: 4,
        playedByPlayerId: player1Id,
      },
      {
        cardId: '9s',
        pointValue: 0,
        playedByPlayerId: player1Id,
      },
      {
        cardId: '9d',
        pointValue: 0,
        playedByPlayerId: player1Id,
      },
      {
        cardId: 'qh',
        pointValue: 3,
        playedByPlayerId: player1Id,
      },
    ]

    const player2CardData = [
      {
        cardId: 'qd',
        pointValue: 3,
        playedByPlayerId: player2Id,
      },
      {
        cardId: 'td',
        pointValue: 10,
        playedByPlayerId: player2Id,
      },
      {
        cardId: '9c',
        pointValue: 0,
        playedByPlayerId: player2Id,
      },
      {
        cardId: 'kd',
        pointValue: 4,
        playedByPlayerId: player2Id,
      },
      {
        cardId: 'ah',
        pointValue: 11,
        playedByPlayerId: player2Id,
      },
      {
        cardId: 'tc',
        pointValue: 10,
        playedByPlayerId: player2Id,
      },
    ]

    const player3CardData = [
      {
        cardId: 'jd',
        pointValue: 2,
        playedByPlayerId: player3Id,
      },
      {
        cardId: 'qs',
        pointValue: 3,
        playedByPlayerId: player3Id,
      },
      {
        cardId: '9h',
        pointValue: 0,
        playedByPlayerId: player3Id,
      },
      {
        cardId: 'jc',
        pointValue: 2,
        playedByPlayerId: player3Id,
      },
      {
        cardId: 'jh',
        pointValue: 2,
        playedByPlayerId: player3Id,
      },
      {
        cardId: 'js',
        pointValue: 2,
        playedByPlayerId: player3Id,
      },
    ]

    const player4CardData = [
      {
        cardId: 'qc',
        pointValue: 3,
        playedByPlayerId: player4Id,
      },
      {
        cardId: 'kh',
        pointValue: 4,
        playedByPlayerId: player4Id,
      },
      {
        cardId: 'ac',
        pointValue: 11,
        playedByPlayerId: player4Id,
      },
      {
        cardId: 'as',
        pointValue: 11,
        playedByPlayerId: player4Id,
      },
      {
        cardId: 'th',
        pointValue: 10,
        playedByPlayerId: player4Id,
      },
      {
        cardId: 'ts',
        pointValue: 10,
        playedByPlayerId: player4Id,
      },
    ]

    const actualEndOfRoundReport = round.getEndOfRoundReport()
    expect(actualEndOfRoundReport.bury).toEqual({
      cards: [
        { cardId: 'ad', pointValue: 11 },
        { cardId: 'ks', pointValue: 4 },
      ],
    })
    expect(actualEndOfRoundReport.tricks[0].cards[0]).toEqual(player2CardData[0])
    expect(actualEndOfRoundReport.tricks[0].cards[1]).toEqual(player3CardData[0])
    expect(actualEndOfRoundReport.tricks[0].cards[2]).toEqual(player4CardData[0])
    expect(actualEndOfRoundReport.tricks[0].cards[3]).toEqual(player1CardData[0])

    expect(actualEndOfRoundReport.tricks[1].cards[0]).toEqual(player4CardData[1])
    expect(actualEndOfRoundReport.tricks[1].cards[1]).toEqual(player1CardData[1])
    expect(actualEndOfRoundReport.tricks[1].cards[2]).toEqual(player2CardData[1])
    expect(actualEndOfRoundReport.tricks[1].cards[3]).toEqual(player3CardData[1])

    expect(actualEndOfRoundReport.tricks[2].cards[0]).toEqual(player1CardData[2])
    expect(actualEndOfRoundReport.tricks[2].cards[1]).toEqual(player2CardData[2])
    expect(actualEndOfRoundReport.tricks[2].cards[2]).toEqual(player3CardData[2])
    expect(actualEndOfRoundReport.tricks[2].cards[3]).toEqual(player4CardData[2])

    expect(actualEndOfRoundReport.tricks[3].cards[0]).toEqual(player4CardData[3])
    expect(actualEndOfRoundReport.tricks[3].cards[1]).toEqual(player1CardData[3])
    expect(actualEndOfRoundReport.tricks[3].cards[2]).toEqual(player2CardData[3])
    expect(actualEndOfRoundReport.tricks[3].cards[3]).toEqual(player3CardData[3])

    expect(actualEndOfRoundReport.tricks[4].cards[0]).toEqual(player3CardData[4])
    expect(actualEndOfRoundReport.tricks[4].cards[1]).toEqual(player4CardData[4])
    expect(actualEndOfRoundReport.tricks[4].cards[2]).toEqual(player1CardData[4])
    expect(actualEndOfRoundReport.tricks[4].cards[3]).toEqual(player2CardData[4])

    expect(actualEndOfRoundReport.tricks[5].cards[0]).toEqual(player3CardData[5])
    expect(actualEndOfRoundReport.tricks[5].cards[1]).toEqual(player4CardData[5])
    expect(actualEndOfRoundReport.tricks[5].cards[2]).toEqual(player1CardData[5])
    expect(actualEndOfRoundReport.tricks[5].cards[3]).toEqual(player2CardData[5])
  })

  it('Should tell the shuffle seed manager to changeShuffleSeed and re deal if no one picks', () => {
    expect(player1.getPlayableCardIds()).toEqual(['7d', 'qh', '9d', '8d', 'kc', '9s'])
    expect(player2.getPlayableCardIds()).toEqual(['qd', 'td', 'kd', 'ah', 'tc', '9c'])
    expect(player3.getPlayableCardIds()).toEqual(['qs', 'jc', 'js', 'jd', 'ad', '9h'])
    expect(player4.getPlayableCardIds()).toEqual(['qc', 'ac', 'as', 'ts', 'th', 'kh'])
    round.pass()
    round.pass()
    round.pass()
    round.pass()
    expect(player1.getPlayableCardIds()).toEqual(['qc', 'qd', 'js', 'ah', 'kc', '9s'])
    expect(player2.getPlayableCardIds()).toEqual(['7d', 'qh', 'jd', 'td', 'ts', '9h'])
    expect(player3.getPlayableCardIds()).toEqual(['qs', 'kd', '8d', 'ac', 'ks', 'kh'])
    expect(player4.getPlayableCardIds()).toEqual(['jc', 'jh', 'ad', 'tc', 'th', '9c'])
    expect(shuffleSeedManager.changeShuffleSeed).toHaveBeenCalledTimes(1)
  })
})

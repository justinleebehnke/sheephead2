import BellePlaineRulesCardRanker from '../../../Entities/BellePlaineRulesCardRanker'
import Card from '../../../Entities/Card'
import CardPlayedByData from '../../../Entities/DataStructures/CardPlayedByData'
import GameBoardModel from '../GameBoardModel'
import IReadOnlyGameModel from '../../../Entities/ReadOnlyEntities/IReadOnlyGameModel'
import IReadOnlyRound from '../../../Entities/ReadOnlyEntities/IReadOnlyRound'
import IReadOnlyTrick from '../../../Entities/ReadOnlyEntities/IReadOnlyTrick'
import ISubscriber from '../../../Entities/ISubscriber'
import Player from '../../../Entities/Player'
import PlayerLayoutData from '../PlayerLayoutData'
import TrickData from '../../../Entities/DataStructures/TrickData'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

const cardRanker = new BellePlaineRulesCardRanker()

describe('Game Board Model', () => {
  let localPlayerId: UniqueIdentifier
  let mockSubscriber: ISubscriber
  let mockReadOnlyGameModel: IReadOnlyGameModel
  let model: GameBoardModel
  let round: IReadOnlyRound
  let trick: IReadOnlyTrick
  let trickData: TrickData
  let cardPlayedByDataP3: CardPlayedByData
  let cardPlayedByDataP4: CardPlayedByData
  let cardPlayedByDataLocal: CardPlayedByData

  let player2Id: UniqueIdentifier
  let player3Id: UniqueIdentifier
  let player4Id: UniqueIdentifier

  let localPlayer: Player
  let mockPlayer2: Player
  let mockPlayer3: Player
  let mockPlayer4: Player

  beforeEach(() => {
    localPlayerId = new UniqueIdentifier()
    mockSubscriber = { update: jest.fn() }

    player2Id = new UniqueIdentifier()
    player3Id = new UniqueIdentifier()
    player4Id = new UniqueIdentifier()

    localPlayer = new Player('Justin', localPlayerId)
    localPlayer.giveCard(new Card('qc', cardRanker))
    localPlayer.giveCard(new Card('as', cardRanker))
    localPlayer.giveCard(new Card('7d', cardRanker))
    localPlayer.giveCard(new Card('qh', cardRanker))
    localPlayer.giveCard(new Card('jc', cardRanker))
    localPlayer.giveCard(new Card('qd', cardRanker))

    mockPlayer2 = new Player('Carly', player2Id)
    mockPlayer3 = new Player('Jake', player3Id)
    mockPlayer4 = new Player('John', player4Id)

    cardPlayedByDataP3 = {
      playedByPlayerId: player3Id.getId(),
      cardId: 'ac',
      pointValue: 1,
    }

    cardPlayedByDataP4 = {
      playedByPlayerId: player4Id.getId(),
      cardId: 'jd',
      pointValue: 1,
    }

    cardPlayedByDataLocal = {
      playedByPlayerId: localPlayer.getId(),
      cardId: 'as',
      pointValue: 1,
    }

    trickData = {
      cards: [cardPlayedByDataP3, cardPlayedByDataP4, cardPlayedByDataLocal],
      winningCardIndex: 0,
    }

    trick = {
      getTrickData: jest.fn().mockReturnValue(trickData),
      getLeadCard: jest.fn().mockReturnValue(new Card('js', cardRanker)),
    }

    round = {
      getIndexOfCurrentTurn: jest.fn().mockReturnValue(1),
      getIndexOfDealer: jest.fn().mockReturnValue(2),
      getIndexOfPicker: jest.fn().mockReturnValue(2),
      getCurrentTrick: jest.fn().mockReturnValue(trick),
      isFindingPickerState: jest.fn(),
      isOver: jest.fn(),
      getCurrentTurnPlayer: jest.fn().mockReturnValue(mockPlayer2),
      isPickerHasNotBuriedState: jest.fn(),
      getEndOfRoundReport: jest.fn().mockReturnValue(null),
    }

    mockReadOnlyGameModel = {
      getPlayerById: jest.fn().mockImplementation((id: UniqueIdentifier) => {
        return localPlayerId.equals(id)
          ? localPlayer
          : player2Id.equals(id)
          ? mockPlayer2
          : player3Id.equals(id)
          ? mockPlayer3
          : mockPlayer4
      }),
      pick: jest.fn(),
      addSubscriber: jest.fn(),
      removeSubscriber: jest.fn(),
      updateSubscribers: jest.fn().mockImplementation(() => model.update()),
      getIndexOfPlayerById: jest.fn().mockImplementation((id: UniqueIdentifier) => {
        if (id.equals(localPlayerId)) {
          return 0
        }
        if (id.equals(player2Id)) {
          return 1
        }
        if (id.equals(player3Id)) {
          return 2
        }
        if (id.equals(player4Id)) {
          return 3
        }
      }),
      getNextIndex: jest.fn().mockImplementation((index: number) => {
        if (index === 3) {
          return 0
        } else {
          return index + 1
        }
      }),
      getPlayerByIndex: jest.fn().mockImplementation((index: number) => {
        if (index === 0) {
          return localPlayer
        }
        if (index === 1) {
          return mockPlayer2
        }
        if (index === 2) {
          return mockPlayer3
        }
        if (index === 3) {
          return mockPlayer4
        }
      }),
      getCurrentRound: jest.fn().mockReturnValue(round),
    }

    model = new GameBoardModel(localPlayerId, mockReadOnlyGameModel)
    model.addSubscriber(mockSubscriber)
  })

  it('Should update the subscriber whenever something interesting happens', () => {
    model.pick()
    expect(mockReadOnlyGameModel.pick).toHaveBeenCalled()
    expect(mockSubscriber.update).toHaveBeenCalled()
  })

  it("Should have the ability to get the local player's hand", () => {
    const cardsInHand: string[] = model.getHand()
    expect(cardsInHand).toEqual(['qc', '7d', 'qh', 'qd', 'jc', 'as'])
  })

  it('Should update the subscriber whenever the model updates the presenter', () => {
    expect(mockReadOnlyGameModel.addSubscriber).toHaveBeenCalledTimes(1)
    mockReadOnlyGameModel.updateSubscribers()
    mockReadOnlyGameModel.updateSubscribers()
    mockReadOnlyGameModel.updateSubscribers()
    expect(mockSubscriber.update).toHaveBeenCalledTimes(3)
  })

  it('Should figure out what to display for the player across from the local player', () => {
    const expectedAcross: PlayerLayoutData = {
      name: mockPlayer3.getName(),
      isTurn: false,
      isDealer: true,
      isPicker: true,
      cardPlayed: 'ac',
    }
    expect(model.getDataForPlayerAcross()).toEqual(expectedAcross)

    const expectedToLeft: PlayerLayoutData = {
      name: mockPlayer2.getName(),
      isTurn: true,
      isDealer: false,
      isPicker: false,
      cardPlayed: 'turn',
    }
    expect(model.getDataForPlayerToLeft()).toEqual(expectedToLeft)

    const expectedToRight: PlayerLayoutData = {
      name: mockPlayer4.getName(),
      isTurn: false,
      isDealer: false,
      isPicker: false,
      cardPlayed: 'jd',
    }
    expect(model.getDataForPlayerToRight()).toEqual(expectedToRight)
    const expectedLocal: PlayerLayoutData = {
      name: localPlayer.getName(),
      isTurn: false,
      isDealer: false,
      isPicker: false,
      cardPlayed: 'as',
    }
    expect(model.getDataForLocalPlayer()).toEqual(expectedLocal)
  })

  it('Should not update the view if the view has been cleared', () => {
    expect(mockReadOnlyGameModel.addSubscriber).toHaveBeenCalledTimes(1)
    mockReadOnlyGameModel.updateSubscribers()
    mockReadOnlyGameModel.updateSubscribers()
    model.removeSubscriber()
    mockReadOnlyGameModel.updateSubscribers()
    expect(mockSubscriber.update).toHaveBeenCalledTimes(2)
  })

  it('Should return the correct playable cards from a hand based on a lead card', () => {
    expect(model.getPlayableCardIds().length).toBe(5)
  })

  it('Should give the correct person for the picker index', () => {
    expect(model.getPickerIndex()).toBe(2)
  })

  it('Should return the players in order', () => {
    expect(model.getPlayers()).toEqual([localPlayer, mockPlayer2, mockPlayer3, mockPlayer4])
  })

  it('Should return the current rounds end of round report', () => {
    expect(model.getEndOfRoundReport()).toBe(undefined)
  })
})

export {}

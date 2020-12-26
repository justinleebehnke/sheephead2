import BellePlaineRulesCardRanker from '../../../Entities/BellePlaineRulesCardRanker'
import Card from '../../../Entities/Card'
import CardPlayedByData from '../../../Entities/DataStructures/CardPlayedByData'
import GamePresenter from '../GamePresenter'
import ICommandInterface from '../../ICommandInterface'
import ICommandObject from '../../ICommandObject'
import IReadOnlyGameModel from '../../../Entities/ReadOnlyEntities/IReadOnlyGameModel'
import IReadOnlyRound from '../../../Entities/ReadOnlyEntities/IReadOnlyRound'
import IReadOnlyTrick from '../../../Entities/ReadOnlyEntities/IReadOnlyTrick'
import ISubscriber from '../../../Entities/ISubscriber'
import Player from '../../../Entities/Player'
import PlayerLayoutData from '../PlayerLayoutData'
import TrickData from '../../../Entities/DataStructures/TrickData'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

const cardRanker = new BellePlaineRulesCardRanker()

describe('Game Presenter', () => {
  let mockCommandInterface: ICommandInterface
  let localPlayerId: UniqueIdentifier
  let mockGameView: ISubscriber
  let mockReadOnlyGameModel: IReadOnlyGameModel
  let presenter: GamePresenter
  let round: IReadOnlyRound
  let trick: IReadOnlyTrick
  let trickData: TrickData
  let cardPlayedByDataP2: CardPlayedByData
  let cardPlayedByDataP4: CardPlayedByData

  let player2Id: UniqueIdentifier
  let player3Id: UniqueIdentifier
  let player4Id: UniqueIdentifier

  let localPlayer: Player
  let mockPlayer2: Player
  let mockPlayer3: Player
  let mockPlayer4: Player

  beforeEach(() => {
    localPlayerId = new UniqueIdentifier()
    mockCommandInterface = { giveCommand: jest.fn() }
    mockGameView = { update: jest.fn() }

    player2Id = new UniqueIdentifier()
    player3Id = new UniqueIdentifier()
    player4Id = new UniqueIdentifier()

    localPlayer = new Player('Justin', localPlayerId)
    localPlayer.giveCard(new Card('qc', cardRanker))
    localPlayer.giveCard(new Card('qs', cardRanker))
    localPlayer.giveCard(new Card('7d', cardRanker))
    localPlayer.giveCard(new Card('qh', cardRanker))
    localPlayer.giveCard(new Card('jc', cardRanker))
    localPlayer.giveCard(new Card('qd', cardRanker))

    mockPlayer2 = new Player('Carly', player2Id)
    mockPlayer3 = new Player('Jake', player3Id)
    mockPlayer4 = new Player('John', player4Id)

    cardPlayedByDataP2 = {
      playedByPlayerId: player3Id.getId(),
      cardId: 'ac',
      pointValue: 1,
    }

    cardPlayedByDataP4 = {
      playedByPlayerId: player4Id.getId(),
      cardId: 'jd',
      pointValue: 1,
    }

    trickData = {
      cards: [cardPlayedByDataP2, cardPlayedByDataP4],
      winningCardIndex: 0,
    }

    trick = {
      getTrickData: jest.fn().mockReturnValue(trickData),
    }

    round = {
      getIndexOfCurrentTurn: jest.fn().mockReturnValue(1),
      getIndexOfDealer: jest.fn().mockReturnValue(2),
      getIndexOfPicker: jest.fn().mockReturnValue(2),
      getCurrentTrick: jest.fn().mockReturnValue(trick),
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
      updateSubscribers: jest.fn().mockImplementation(() => presenter.update()),
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

    presenter = new GamePresenter(
      mockCommandInterface,
      localPlayerId,
      mockGameView,
      mockReadOnlyGameModel
    )
  })

  it('Should send a pass command if someone clicks the pass button', () => {
    expect(presenter.isLoading()).toBe(false)
    presenter.pass()
    const passCommand: ICommandObject = {
      name: 'pass',
      params: null,
    }
    expect(mockCommandInterface.giveCommand).toHaveBeenCalledWith(passCommand)
    expect(presenter.isLoading()).toBe(true)
  })

  it('Should update the view whenever something interesting happens', () => {
    presenter.pick()
    expect(mockReadOnlyGameModel.pick).toHaveBeenCalled()
    expect(mockGameView.update).toHaveBeenCalled()
    expect(presenter.isLoading()).toBe(false)
  })

  it("Should have the ability to get the local player's hand", () => {
    const cardsInHand: string[] = presenter.getHand()
    expect(cardsInHand).toEqual(['qc', '7d', 'qs', 'qh', 'qd', 'jc'])
  })

  it('Should send a command when the player buries', () => {
    expect(presenter.isLoading()).toBe(false)
    presenter.pick()
    presenter.bury(['qc', '7d'])
    const buryCommand: ICommandObject = {
      name: 'bury',
      params: {
        cards: ['qc', '7d'],
      },
    }
    expect(mockCommandInterface.giveCommand).toHaveBeenCalledWith(buryCommand)
    expect(presenter.isLoading()).toBe(true)
  })

  it('Should update the view whenever the model updates the presenter', () => {
    expect(mockReadOnlyGameModel.addSubscriber).toHaveBeenCalledTimes(1)
    mockReadOnlyGameModel.updateSubscribers()
    mockReadOnlyGameModel.updateSubscribers()
    mockReadOnlyGameModel.updateSubscribers()
    expect(mockGameView.update).toHaveBeenCalledTimes(3)
  })

  it('Should send a play command when the user plays a card', () => {
    expect(presenter.isLoading()).toBe(false)
    presenter.play('qc')
    const playCommand: ICommandObject = {
      name: 'play',
      params: {
        card: 'qc',
      },
    }
    expect(mockCommandInterface.giveCommand).toHaveBeenCalledWith(playCommand)
    expect(presenter.isLoading()).toBe(true)
  })

  it('Should send a playAgain command for the local player if the decide to do so', () => {
    expect(presenter.isLoading()).toBe(false)
    presenter.playAgain()
    const playAgain: ICommandObject = {
      name: 'playAgain',
      params: {
        playerId: localPlayerId,
      },
    }
    expect(mockCommandInterface.giveCommand).toHaveBeenCalledWith(playAgain)
    expect(presenter.isLoading()).toBe(true)
  })

  it('Should figure out what to display for the player across from the local player', () => {
    const expectedAcross: PlayerLayoutData = {
      name: mockPlayer3.getName(),
      isTurn: false,
      isDealer: true,
      isPicker: true,
      cardPlayed: 'ac',
    }
    expect(presenter.getDataForPlayerAcross()).toEqual(expectedAcross)

    const expectedToLeft: PlayerLayoutData = {
      name: mockPlayer2.getName(),
      isTurn: true,
      isDealer: false,
      isPicker: false,
      cardPlayed: 'turn',
    }
    expect(presenter.getDataForPlayerToLeft()).toEqual(expectedToLeft)

    const expectedToRight: PlayerLayoutData = {
      name: mockPlayer4.getName(),
      isTurn: false,
      isDealer: false,
      isPicker: false,
      cardPlayed: 'jd',
    }
    expect(presenter.getDataForPlayerToRight()).toEqual(expectedToRight)

    expect(true).toBe(false) // next test is to get the local player data
  })
})

export {}

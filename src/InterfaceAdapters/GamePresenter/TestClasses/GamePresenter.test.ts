import ISubscriber from '../../../Entities/ISubscriber'
import Player from '../../../Entities/Player'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'
import Card from '../../../Entities/Card'
import IReadOnlyGameModel from '../../../Entities/IReadOnlyGameModel'
import ICommandInterface from '../../ICommandInterface'
import ICommandObject from '../../ICommandObject'
import GamePresenter from '../GamePresenter'
import BellePlaineRulesCardRanker from '../../../Entities/BellePlaineRulesCardRanker'

const cardRanker = new BellePlaineRulesCardRanker()

describe('Game Presenter', () => {
  let mockCommandInterface: ICommandInterface
  let localPlayerId: UniqueIdentifier
  let mockGameView: ISubscriber
  let mockReadOnlyGameModel: IReadOnlyGameModel
  let presenter: GamePresenter

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

  // the game view needs to know what it should be showing in each of the places on the trick
  // and it should know which of the playable cards it can display for the user when it's the user's turn
})

export {}

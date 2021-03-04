import CPUPlayer from '../CPUPlayer'
import ICardRanker from '../../Entities/ICardRanker'
import ICommandInterface from '../../InterfaceAdapters/ICommandInterface'
import IReadOnlyGameModel from '../../Entities/ReadOnlyEntities/IReadOnlyGameModel'
import IReadOnlyRound from '../../Entities/ReadOnlyEntities/IReadOnlyRound'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

describe('CPU Player', () => {
  let name: string
  let id: UniqueIdentifier
  let round: IReadOnlyRound
  let gameModel: IReadOnlyGameModel
  let cardRanker: ICardRanker
  let commandInterface: ICommandInterface
  let cpuPlayer: CPUPlayer

  beforeEach(() => {
    name = 'Random Name'
    id = new UniqueIdentifier()
    round = {
      getCurrentTrick: jest.fn(),
      getCurrentTurnPlayer: jest.fn(),
      getEndOfRoundReport: jest.fn(),
      getIndexOfDealer: jest.fn(),
      getIndexOfPicker: jest.fn(),
      getIndexOfCurrentTurn: jest.fn(),
      isOver: jest.fn().mockReturnValue(true),
      isFindingPickerState: jest.fn(),
      isPickerHasNotBuriedState: jest.fn(),
    }
    gameModel = {
      addSubscriber: jest.fn(),
      removeSubscriber: jest.fn(),
      getIndexOfPlayerById: jest.fn(),
      getNextIndex: jest.fn(),
      getPlayerById: jest.fn(),
      getPlayerByIndex: jest.fn(),
      getCurrentRound: jest.fn().mockReturnValue(round),
      pick: jest.fn(),
      updateSubscribers: jest.fn(),
    }
    commandInterface = {
      giveCommand: jest.fn(),
    }
    cpuPlayer = new CPUPlayer(name, id, gameModel, cardRanker, commandInterface)
  })

  it('Should report readiness once when the game has ended', () => {
    cpuPlayer.update()
    cpuPlayer.update()
    cpuPlayer.update()
    cpuPlayer.update()
    expect(commandInterface.giveCommand).toHaveBeenCalledTimes(1)
    expect(commandInterface.giveCommand).toHaveBeenCalledWith({
      name: 'playAgain',
      params: {
        playerId: id.getId(),
      },
    })
  })
})

export {}
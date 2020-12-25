import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'
import ICommandInterface from '../../ICommandInterface'
import ICommandObject from '../../ICommandObject'
import GamePresenter from '../GamePresenter'

describe('Game Presenter', () => {
  let mockCommandInterface: ICommandInterface
  let localPlayerId: UniqueIdentifier
  beforeEach(() => {
    localPlayerId = new UniqueIdentifier()
    mockCommandInterface = { giveCommand: jest.fn() }
  })
  it('Should send a pass command if someone clicks the pass button', () => {
    const presenter = new GamePresenter(mockCommandInterface, localPlayerId)
    presenter.pass()
    const passCommand: ICommandObject = {
      name: 'pass',
      params: {
        playerId: localPlayerId.getId(),
      },
    }
    expect(mockCommandInterface.giveCommand).toHaveBeenCalledWith(passCommand)
  })
  it('Should add the blind to the local players hand if they pick', () => {
    expect(true).toBe(false)
  })
})

export {}

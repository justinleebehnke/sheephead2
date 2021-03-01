import IGameManager from '../../../../Entities/GameManager/IGameManager'
import UniqueIdentifier from '../../../../Utilities/UniqueIdentifier'
import UnStartGameCommand from '../UnStartGameCommand'

describe('UnStart Game Command', () => {
  let gameManager: IGameManager
  let hostId: string

  beforeEach(() => {
    hostId = new UniqueIdentifier().getId()
    gameManager = {
      addPlayerToGame: jest.fn(),
      createGame: jest.fn(),
      removePlayerFromGame: jest.fn(),
      setGameConfig: jest.fn(),
      startGame: jest.fn(),
      unStartGame: jest.fn(),
    }
  })

  it('Should tell the game manager to unStart the game', () => {
    new UnStartGameCommand(gameManager, hostId).execute()
    expect(gameManager.unStartGame).toHaveBeenCalledWith(new UniqueIdentifier(hostId))
  })
})

export {}

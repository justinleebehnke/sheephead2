import HostNewGameCommand from '../HostNewGameCommand'
import IGameManager from '../../../../Entities/GameManager/IGameManager'
import UniqueIdentifier from '../../../../Utilities/UniqueIdentifier'

describe('Host New Game Command', () => {
  let gameManager: IGameManager

  beforeEach(() => {
    gameManager = {
      addPlayerToGame: jest.fn(),
      createGame: jest.fn(),
      removePlayerFromGame: jest.fn(),
      setGameConfig: jest.fn(),
      startGame: jest.fn(),
      unStartGame: jest.fn(),
      getGameByPlayerId: jest.fn(),
      subscribe: jest.fn(),
    }
  })

  it("Should tell the game manager to create a new game with the host's information", () => {
    const hostNewGameCommand = new HostNewGameCommand(
      gameManager,
      'James',
      'c568788e-7e5b-47ad-a0e0-375e1f3996a4'
    )
    hostNewGameCommand.execute()
    expect(gameManager.createGame).toHaveBeenCalledWith({
      name: 'James',
      id: new UniqueIdentifier('c568788e-7e5b-47ad-a0e0-375e1f3996a4'),
    })
  })
})

export {}

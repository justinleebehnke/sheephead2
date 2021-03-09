import GameConfigurationDTO from '../../../../Entities/GameManager/GameConfigurationDTO'
import IGameManager from '../../../../Entities/GameManager/IGameManager'
import StartGameCommand from '../StartGameCommand'
import UniqueIdentifier from '../../../../Utilities/UniqueIdentifier'

describe('Start Game Command', () => {
  let gameManager: IGameManager
  let hostId: string
  let gameConfig: GameConfigurationDTO
  beforeEach(() => {
    hostId = new UniqueIdentifier().getId()
    gameConfig = {
      firstDealerIndex: 0,
      shuffleSeed: 12451235,
    }
    gameManager = {
      addPlayerToGame: jest.fn(),
      createGame: jest.fn(),
      removePlayerFromGame: jest.fn(),
      setGameConfig: jest.fn(),
      startGame: jest.fn(),
      unStartGame: jest.fn(),
      subscribe: jest.fn(),
      getGameByPlayerId: jest.fn(),
    }
  })

  it('Should tell the game manager to start the game', () => {
    new StartGameCommand(gameManager, hostId, gameConfig).execute()
    expect(gameManager.setGameConfig).toHaveBeenCalledWith(new UniqueIdentifier(hostId), gameConfig)
    expect(gameManager.startGame).toHaveBeenCalledWith(new UniqueIdentifier(hostId))
  })
})

export {}

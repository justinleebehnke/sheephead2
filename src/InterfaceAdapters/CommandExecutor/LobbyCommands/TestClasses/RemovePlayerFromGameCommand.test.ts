import IGameManager from '../../../../Entities/GameManager/IGameManager'
import RemovePlayerFromGameCommand from '../RemovePlayerFromGameCommand'
import UniqueIdentifier from '../../../../Utilities/UniqueIdentifier'

describe('Remove Player From Game Command', () => {
  let gameManager: IGameManager
  let playerToRemoveId: string
  let hostId: string

  beforeEach(() => {
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
    playerToRemoveId = new UniqueIdentifier().getId()
    hostId = new UniqueIdentifier().getId()
  })

  it('Should call the remove player from game method on the gameManager correctly', () => {
    new RemovePlayerFromGameCommand(gameManager, { playerToRemoveId, hostId }).execute()
    expect(gameManager.removePlayerFromGame).toHaveBeenCalledWith(
      new UniqueIdentifier(playerToRemoveId),
      new UniqueIdentifier(hostId)
    )
  })
})

export {}

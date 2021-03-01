import AddPlayerToGameCommand from '../AddPlayerToGameCommand'
import IGameManager from '../../../../Entities/GameManager/IGameManager'
import UniqueIdentifier from '../../../../Utilities/UniqueIdentifier'

describe('Add Player To Game Command', () => {
  let gameManager: IGameManager
  let hostId: string
  let newPlayerId: string
  let newPlayerName: string

  beforeEach(() => {
    hostId = new UniqueIdentifier().getId()
    newPlayerId = new UniqueIdentifier().getId()
    newPlayerName = 'Max'
    gameManager = {
      addPlayerToGame: jest.fn(),
      createGame: jest.fn(),
      removePlayerFromGame: jest.fn(),
      setGameConfig: jest.fn(),
      startGame: jest.fn(),
      unStartGame: jest.fn(),
    }
  })

  it('Should add the player to the game when execute is called', () => {
    new AddPlayerToGameCommand(gameManager, { hostId, newPlayerId, newPlayerName }).execute()
    expect(gameManager.addPlayerToGame).toHaveBeenCalledWith(new UniqueIdentifier(hostId), {
      name: newPlayerName,
      id: new UniqueIdentifier(newPlayerId),
    })
  })
})

export {}

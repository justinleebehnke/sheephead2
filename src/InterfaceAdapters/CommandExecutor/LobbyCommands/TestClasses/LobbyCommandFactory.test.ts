import ICommandFactory from '../../ICommandFactory'
import HostNewGameCommand from '../HostNewGameCommand'
import IGameManager from '../../../../Entities/GameManager/IGameManager'
import LobbyCommandFactory from '../LobbyCommandFactory'

describe('Lobby Command Factory', () => {
  let gameManager: IGameManager
  let factory: ICommandFactory

  beforeEach(() => {
    gameManager = {
      addPlayerToGame: jest.fn(),
      createGame: jest.fn(),
      removePlayerFromGame: jest.fn(),
      setGameConfig: jest.fn(),
      startGame: jest.fn(),
      unStartGame: jest.fn(),
    }
    factory = new LobbyCommandFactory(gameManager)
  })

  it('Should build a host game command when given a host game command dto', () => {
    expect(
      factory.getCommand({
        name: 'hostNewGame',
        params: {
          hostId: 'c568788e-7e5b-47ad-a0e0-375e1f3996a4',
          hostName: 'Justin',
        },
      })
    ).toEqual(new HostNewGameCommand(gameManager, 'Justin', 'c568788e-7e5b-47ad-a0e0-375e1f3996a4'))
  })
})

export {}

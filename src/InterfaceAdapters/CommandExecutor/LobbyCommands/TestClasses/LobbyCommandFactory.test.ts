import AddPlayerToGameCommand from '../AddPlayerToGameCommand'
import GameConfigurationDTO from '../../../../Entities/GameManager/GameConfigurationDTO'
import HostNewGameCommand from '../HostNewGameCommand'
import ICommandFactory from '../../ICommandFactory'
import IGameManager from '../../../../Entities/GameManager/IGameManager'
import LobbyCommandFactory from '../LobbyCommandFactory'
import RemovePlayerFromGameCommand from '../RemovePlayerFromGameCommand'
import StartGameCommand from '../StartGameCommand'
import UniqueIdentifier from '../../../../Utilities/UniqueIdentifier'
import UnStartGameCommand from '../UnStartGameCommand'

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

  it('Should build an add player to game command when given an add player game dto', () => {
    const hostId = new UniqueIdentifier().getId()
    const playerId = new UniqueIdentifier().getId()

    expect(
      factory.getCommand({
        name: 'addPlayer',
        params: {
          hostId,
          playerId,
          playerName: 'Random Name',
        },
      })
    ).toEqual(
      new AddPlayerToGameCommand(gameManager, {
        hostId,
        newPlayerId: playerId,
        newPlayerName: 'Random Name',
      })
    )
  })

  it('Should build a remove player from game command when given that DTO', () => {
    const hostId = new UniqueIdentifier().getId()
    const playerId = new UniqueIdentifier().getId()

    expect(
      factory.getCommand({
        name: 'removePlayer',
        params: {
          hostId,
          playerId,
        },
      })
    ).toEqual(
      new RemovePlayerFromGameCommand(gameManager, {
        hostId,
        playerToRemoveId: playerId,
      })
    )
  })

  it('Should build a start game command when given that DTO', () => {
    const hostId = new UniqueIdentifier().getId()

    const gameConfig: GameConfigurationDTO = {
      firstDealerIndex: 2,
      shuffleSeed: 124512452323,
    }

    expect(
      factory.getCommand({
        name: 'startGame',
        params: {
          hostId,
          firstDealerIndex: gameConfig.firstDealerIndex,
          shuffleSeed: gameConfig.shuffleSeed,
        },
      })
    ).toEqual(new StartGameCommand(gameManager, hostId, gameConfig))
  })

  it('Should build an un start game command when given that DTO', () => {
    const hostId = new UniqueIdentifier().getId()

    expect(
      factory.getCommand({
        name: 'unStartGame',
        params: {
          hostId,
        },
      })
    ).toEqual(new UnStartGameCommand(gameManager, hostId))
  })
})

export {}

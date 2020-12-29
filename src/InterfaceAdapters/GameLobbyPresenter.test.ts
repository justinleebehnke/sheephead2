import ICommandInterface from './ICommandInterface'
import GameLobbyPresenter from './GameLobbyPresenter'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import HostNewGameCommand from './HostNewGameCommand'
import IGameLobbyDataProvider from '../UseCase/IGameLobbyDataProvider'

describe('Game Lobby Presenter', () => {
  let lobbyPresenter: GameLobbyPresenter
  let mockLobbyInterface: ICommandInterface
  let localPlayerId: UniqueIdentifier
  let gameLobbyDataProvider: IGameLobbyDataProvider

  beforeEach(() => {
    localPlayerId = new UniqueIdentifier()
    mockLobbyInterface = {
      giveCommand: jest.fn(),
    }
    gameLobbyDataProvider = {
      getJoinableGames: jest.fn().mockReturnValue([]),
    }
    lobbyPresenter = new GameLobbyPresenter(
      localPlayerId,
      mockLobbyInterface,
      gameLobbyDataProvider
    )
  })

  it('Should send a game created by host command when the host creates a game', () => {
    lobbyPresenter.hostNewGame()
    const expectedCommand: HostNewGameCommand = {
      name: 'hostNewGame',
      params: {
        playerId: localPlayerId.getId(),
      },
    }
    expect(mockLobbyInterface.giveCommand).toHaveBeenCalledWith(expectedCommand)
  })

  it('Should load any joinable games when it first renders', () => {
    expect(lobbyPresenter.getJoinableGames()).toEqual([])
  })
})

export {}

import ICommandInterface from './ICommandInterface'
import GameLobbyPresenter from './GameLobbyPresenter'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import HostNewGameCommand from './CommandTypes/HostNewGameCommand'
import IGameLobbyDataProvider from '../UseCase/IGameLobbyDataProvider'
import PlayerDTO from '../UseCase/PlayerDTO'

const localPlayer: PlayerDTO = {
  getId: () => new UniqueIdentifier('035e0e59-0b47-429c-ab91-6b112426e4c3'),
  getName: () => 'Hello',
}

describe('Game Lobby Presenter', () => {
  let lobbyPresenter: GameLobbyPresenter
  let mockLobbyInterface: ICommandInterface
  let gameLobbyDataProvider: IGameLobbyDataProvider

  beforeEach(() => {
    mockLobbyInterface = {
      giveCommand: jest.fn(),
      watchForCommands: jest.fn(),
      stopWatchingForCommands: jest.fn(),
    }
    gameLobbyDataProvider = {
      getJoinableGames: jest.fn().mockReturnValue([]),
      addSubscriber: jest.fn(),
      removeSubscriber: jest.fn(),
    }
    lobbyPresenter = new GameLobbyPresenter(localPlayer, mockLobbyInterface, gameLobbyDataProvider)
  })

  it('Should send a game created by host command when the host creates a game', () => {
    lobbyPresenter.hostNewGame()
    const expectedCommand: HostNewGameCommand = {
      name: 'hostNewGame',
      params: {
        hostId: localPlayer.getId().getId(),
        hostName: 'Hello',
      },
    }
    expect(mockLobbyInterface.giveCommand).toHaveBeenCalledWith(expectedCommand)
  })

  it('Should load any joinable games when it first renders', () => {
    expect(lobbyPresenter.getJoinableGames()).toEqual([])
  })
})

export {}

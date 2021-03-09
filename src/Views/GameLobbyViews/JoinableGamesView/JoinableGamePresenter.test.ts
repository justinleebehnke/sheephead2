import AddPlayerToGameCommandDTO from '../../../InterfaceAdapters/CommandExecutor/LobbyCommands/LobbyCommandDTOs/AddPlayerToGameCommandDTO'
import GameData from '../../../Entities/GameManager/GameData'
import ICommandInterface from '../../../InterfaceAdapters/ICommandInterface'
import IGameManager from '../../../Entities/GameManager/IGameManager'
import ILocalPlayerInfoManager from '../LobbyEntranceView/ILocalPlayerInfoManager'
import INotifier from '../LobbyEntranceView/INotifier'
import ISubscriber from '../../../Entities/ISubscriber'
import JoinableGameData from './JoinableGameData'
import JoinableGamesPresenter from './JoinableGamesPresenter'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

describe('Joinable Games Presenter', () => {
  let presenter: JoinableGamesPresenter
  let joinableGames: JoinableGameData[]
  let gameList: IGameManager
  let commandInterface: ICommandInterface
  let view: ISubscriber
  let allGames: GameData[]
  let hostId3: UniqueIdentifier
  let localPlayerInfo: {
    name: string
    id: UniqueIdentifier
  }
  let localPlayerInfoManager: ILocalPlayerInfoManager
  let notifier: INotifier

  beforeEach(() => {
    notifier = {
      notify: jest.fn(),
    }
    const hostId = new UniqueIdentifier()
    const hostId2 = new UniqueIdentifier()
    localPlayerInfo = {
      id: new UniqueIdentifier(),
      name: 'Winston "The Wolf" Wolf',
    }
    localPlayerInfoManager = {
      getPlayerId: () => localPlayerInfo.id.getId(),
      getPlayerName: () => localPlayerInfo.name,
      setPlayerId: () => {},
      setPlayerName: () => {},
    }
    hostId3 = new UniqueIdentifier()
    allGames = [
      {
        hostId,
        config: { shuffleSeed: 1234, firstDealerIndex: 3 },
        isStarted: false,
        players: [
          {
            name: 'Player 1',
            id: hostId,
          },
          {
            name: 'Player 2',
            id: new UniqueIdentifier(),
          },
          {
            name: 'Player 3',
            id: new UniqueIdentifier(),
          },
          {
            name: 'Player 4',
            id: new UniqueIdentifier(),
          },
        ],
      },
      {
        hostId: hostId2,
        config: { shuffleSeed: 1234, firstDealerIndex: 3 },
        isStarted: true,
        players: [
          {
            name: 'Player 1',
            id: hostId2,
          },
          {
            name: 'Player 2',
            id: new UniqueIdentifier(),
          },
          {
            name: 'Player 3',
            id: new UniqueIdentifier(),
          },
        ],
      },
      {
        hostId: hostId3,
        config: { shuffleSeed: 1234, firstDealerIndex: 3 },
        isStarted: false,
        players: [
          {
            name: 'George',
            id: hostId3,
          },
          {
            name: 'Lucas',
            id: new UniqueIdentifier(),
          },
          {
            name: 'Oswald',
            id: new UniqueIdentifier(),
          },
        ],
      },
    ]
    gameList = {
      subscribe: jest.fn(),
      getAllGames: jest.fn().mockReturnValue(allGames),
      getGameByHostId: jest.fn(),
      getGameByPlayerId: jest.fn(),
      addPlayerToGame: jest.fn(),
      createGame: jest.fn(),
      removePlayerFromGame: jest.fn(),
      setGameConfig: jest.fn(),
      startGame: jest.fn(),
      unStartGame: jest.fn(),
    }
    commandInterface = {
      giveCommand: jest.fn(),
    }
    view = {
      update: jest.fn(),
    }
    joinableGames = [{ hostId: hostId3, playerNames: ['George', 'Lucas', 'Oswald'] }]
    presenter = new JoinableGamesPresenter(
      commandInterface,
      gameList,
      localPlayerInfoManager,
      notifier
    )
    presenter.setView(view)
  })

  it('Should show only the games that are not started AND have fewer than four players', () => {
    expect(presenter.getJoinableGameData()).toEqual(joinableGames)
  })
  it('Should send a join game command with the host id and everything that is needed', () => {
    presenter.joinGame(hostId3.getId())
    const addPlayerCommand: AddPlayerToGameCommandDTO = {
      name: 'addPlayer',
      params: {
        hostId: hostId3.getId(),
        playerId: localPlayerInfo.id.getId(),
        playerName: localPlayerInfo.name,
      },
    }
    expect(commandInterface.giveCommand).toHaveBeenCalledWith(addPlayerCommand)
  })
  it('Should observe the game manager and update the view whenever the game manager says that it has changed', () => {
    expect(gameList.subscribe).toHaveBeenCalledWith(presenter)
    presenter.gameUpdated()
    expect(view.update).toHaveBeenCalled()
  })
  it('Should throw an error if the local player id is not something that can be made into a valid unique id (this should have been handled elsewhere)', () => {
    localPlayerInfoManager.getPlayerId = () => 'I will not become an Id'
    presenter = new JoinableGamesPresenter(
      commandInterface,
      gameList,
      localPlayerInfoManager,
      notifier
    )
    expect(() => presenter.joinGame(hostId3.getId())).toThrow(
      'Cannot join game because local player id is not valid'
    )
  })
  it('Should alert the user to enter their name saying that you cannot join a game unless you have entered your name', () => {
    localPlayerInfoManager.getPlayerName = () => ''
    presenter = new JoinableGamesPresenter(
      commandInterface,
      gameList,
      localPlayerInfoManager,
      notifier
    )
    presenter.joinGame(hostId3.getId())
    expect(notifier.notify).toHaveBeenCalledWith('Please enter your name before joining a game')
  })
  it('Should throw an error if the host id is not a valid Unique Id', () => {
    localPlayerInfoManager.getPlayerName = () => ''
    presenter = new JoinableGamesPresenter(
      commandInterface,
      gameList,
      localPlayerInfoManager,
      notifier
    )
    expect(() => presenter.joinGame('i am not a valid host id')).toThrow(
      'Cannot join game because host id was invalid'
    )
  })
  it('Should throw an error the host id received is not the host of a joinable game', () => {
    localPlayerInfoManager.getPlayerName = () => ''
    presenter = new JoinableGamesPresenter(
      commandInterface,
      gameList,
      localPlayerInfoManager,
      notifier
    )
    expect(() => presenter.joinGame(localPlayerInfo.id.getId())).toThrow(
      'The game for that host id either is not joinable or does not exist'
    )
  })
})

export {}

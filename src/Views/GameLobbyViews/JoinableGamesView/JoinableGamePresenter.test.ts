import GameData from '../../../Entities/GameManager/GameData'
import ISubscriber from '../../../Entities/ISubscriber'
import ICommandInterface from '../../../InterfaceAdapters/ICommandInterface'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'
import IGameList from './IGameList'
import JoinableGameData from './JoinableGameData'
import JoinableGamesPresenter from './JoinableGamesPresenter'

describe('Joinable Games Presenter', () => {
  let presenter: JoinableGamesPresenter
  let joinableGames: JoinableGameData[]
  let gameList: IGameList
  let commandInterface: ICommandInterface
  let view: ISubscriber
  let allGames: GameData[]

  beforeEach(() => {
    const hostId = new UniqueIdentifier()
    const hostId2 = new UniqueIdentifier()
    const hostId3 = new UniqueIdentifier()
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
    }
    commandInterface = {
      giveCommand: jest.fn(),
    }
    view = {
      update: jest.fn(),
    }
    joinableGames = [{ hostId: hostId3, playerNames: ['George', 'Lucas', 'Oswald'] }]
    presenter = new JoinableGamesPresenter(commandInterface, gameList)
    presenter.setView(view)
  })

  it('Should show only the games that are not started AND have fewer than four players', () => {
    expect(presenter.getJoinableGameData()).toEqual(joinableGames)
  })
  it('Should send a join game command with the host id and everything that is needed', () => {})
  it('Should observe the game manager and update the view whenever the game manager says that it has changed', () => {
    expect(gameList.subscribe).toHaveBeenCalledWith(presenter)
    presenter.gameListUpdated()
    expect(view.update).toHaveBeenCalled()
  })
})

export {}

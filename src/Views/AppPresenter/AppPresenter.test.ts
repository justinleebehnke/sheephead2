import AppPresenter from './AppPresenter'
import GameData from '../../Entities/GameManager/GameData'
import IGameManager from './IGameManager'
import ILocalPlayerInfoManager from '../GameLobbyViews/LobbyEntranceView/ILocalPlayerInfoManager'
import ISubscriber from '../../Entities/ISubscriber'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

describe('App Presenter', () => {
  let view: ISubscriber
  let appPresenter: AppPresenter
  let gameManager: IGameManager
  let localPlayerInfoManager: ILocalPlayerInfoManager
  let localPlayerId: UniqueIdentifier

  beforeEach(() => {
    localPlayerId = new UniqueIdentifier()
    view = {
      update: jest.fn(),
    }
    gameManager = {
      subscribe: jest.fn(),
      getGameByPlayerId: jest.fn(),
    }
    localPlayerInfoManager = {
      getPlayerId: jest.fn().mockReturnValue(localPlayerId.getId()),
      setPlayerId: jest.fn(),
      getPlayerName: jest.fn().mockReturnValue('123123'),
      setPlayerName: jest.fn(),
    }
    appPresenter = new AppPresenter(gameManager, localPlayerInfoManager)
    appPresenter.setView(view)
  })

  it('Should notify the view when it gets notified by the game list', () => {
    appPresenter.gameUpdated()
    expect(view.update).toHaveBeenCalled()
  })

  it('Should say that it is showing the game when the game is started', () => {
    const game: GameData = {
      isStarted: true,
      config: {
        shuffleSeed: 1234,
        firstDealerIndex: 2,
      },
      hostId: localPlayerId,
      players: [],
    }
    gameManager.getGameByPlayerId = jest.fn().mockReturnValue(game)
    appPresenter = new AppPresenter(gameManager, localPlayerInfoManager)
    expect(appPresenter.isShowingGame).toBe(true)
    expect(appPresenter.isShowingLobby).toBe(false)
    expect(appPresenter.isShowingPreGameAsHost).toBe(false)
    expect(appPresenter.isShowingPreGameAsNonHost).toBe(false)
  })

  it('Should show the pregame as host', () => {
    const game: GameData = {
      isStarted: false,
      config: {
        shuffleSeed: 1234,
        firstDealerIndex: 2,
      },
      hostId: localPlayerId,
      players: [],
    }
    gameManager.getGameByPlayerId = jest.fn().mockReturnValue(game)
    appPresenter = new AppPresenter(gameManager, localPlayerInfoManager)
    expect(appPresenter.isShowingGame).toBe(false)
    expect(appPresenter.isShowingLobby).toBe(false)
    expect(appPresenter.isShowingPreGameAsHost).toBe(true)
    expect(appPresenter.isShowingPreGameAsNonHost).toBe(false)
  })

  it('Should show the pregame as non host', () => {
    const game: GameData = {
      isStarted: false,
      config: {
        shuffleSeed: 1234,
        firstDealerIndex: 2,
      },
      hostId: new UniqueIdentifier(),
      players: [],
    }
    gameManager.getGameByPlayerId = jest.fn().mockReturnValue(game)
    appPresenter = new AppPresenter(gameManager, localPlayerInfoManager)
    expect(appPresenter.isShowingGame).toBe(false)
    expect(appPresenter.isShowingLobby).toBe(false)
    expect(appPresenter.isShowingPreGameAsHost).toBe(false)
    expect(appPresenter.isShowingPreGameAsNonHost).toBe(true)
  })

  it('Should show the lobby if the game is undefined', () => {
    gameManager.getGameByPlayerId = jest.fn()
    appPresenter = new AppPresenter(gameManager, localPlayerInfoManager)
    expect(appPresenter.isShowingGame).toBe(false)
    expect(appPresenter.isShowingLobby).toBe(true)
    expect(appPresenter.isShowingPreGameAsHost).toBe(false)
    expect(appPresenter.isShowingPreGameAsNonHost).toBe(false)
  })
})

export {}

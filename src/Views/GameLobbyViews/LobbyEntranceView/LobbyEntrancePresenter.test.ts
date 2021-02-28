import ISubscriber from '../../../Entities/ISubscriber'
import ILocalPlayerInfoManager from './ILocalPlayerInfoManager'
import INotifier from './INotifier'
import LobbyEntrancePresenter from './LobbyEntrancePresenter'

describe('Lobby Entrance Presenter', () => {
  let playerInfoManager: ILocalPlayerInfoManager
  let view: ISubscriber
  let userNotifier: INotifier

  beforeEach(() => {
    view = {
      update: jest.fn(),
    }
    playerInfoManager = {
      getPlayerName: jest.fn().mockReturnValue('James'),
      getPlayerId: jest.fn(),
      setPlayerId: jest.fn(),
      setPlayerName: jest.fn(),
    }
    userNotifier = {
      notify: jest.fn(),
    }
  })

  it('Should provide the users name', () => {
    expect(
      new LobbyEntrancePresenter(playerInfoManager, userNotifier).getLocalPlayerName()
    ).toEqual('James')
    expect(playerInfoManager.getPlayerName).toHaveBeenCalled()
  })

  it('Should update the users name on change and then persist it on blur', () => {
    const presenter = new LobbyEntrancePresenter(playerInfoManager, userNotifier)
    presenter.setView(view)
    presenter.setLocalPlayerName('Janice')
    expect(view.update).toHaveBeenCalled()
    expect(presenter.getLocalPlayerName()).toEqual('Janice')
    expect(playerInfoManager.setPlayerName).not.toHaveBeenCalled()
    presenter.nameInputBlurred()
    expect(playerInfoManager.setPlayerName).toHaveBeenCalledWith('Janice')
  })

  describe("Managing the player's unique id", () => {
    beforeEach(() => {
      playerInfoManager = {
        getPlayerId: jest.fn().mockReturnValue('c568788e-7e5b-47ad-a0e0-375e1f3996a4'),
        getPlayerName: jest.fn(),
        setPlayerId: jest.fn(),
        setPlayerName: jest.fn(),
      }
    })

    it('Should use the players id if the manager has a valid one', () => {
      new LobbyEntrancePresenter(playerInfoManager, userNotifier)
      expect(playerInfoManager.getPlayerId).toHaveBeenCalled()
    })

    it("Should create a new one of the player doesn't have a valid one", () => {
      playerInfoManager.getPlayerId = jest.fn()
      new LobbyEntrancePresenter(playerInfoManager, userNotifier)
      expect(playerInfoManager.setPlayerId).toHaveBeenCalled()
    })
  })

  describe('Hosting a New Game', () => {
    it('Should notify the user that they cannot host a game without first entering their name', () => {
      const presenter = new LobbyEntrancePresenter(playerInfoManager, userNotifier)
      presenter.setLocalPlayerName('')
      presenter.hostNewGame()
      expect(userNotifier.notify).toHaveBeenCalledWith(
        'Please enter your name before hosting a game'
      )
    })

    it('Should create a host game command and give it to the Lobby Command Manager', () => {})
  })
  // it should allow players to join a game from the list
  // it should display the joinable game data
})

export {}

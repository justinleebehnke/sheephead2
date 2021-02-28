import ICommandInterface from '../../../InterfaceAdapters/ICommandInterface'
import ILobbyEntrancePresenter from './ILobbyEntrancePresenter'
import ILocalPlayerInfoManager from './ILocalPlayerInfoManager'
import INotifier from './INotifier'
import ISubscriber from '../../../Entities/ISubscriber'
import LobbyEntrancePresenter from './LobbyEntrancePresenter'

describe('Lobby Entrance Presenter', () => {
  let playerInfoManager: ILocalPlayerInfoManager
  let view: ISubscriber
  let userNotifier: INotifier
  let lobbyCommandInterface: ICommandInterface
  let presenter: ILobbyEntrancePresenter

  beforeEach(() => {
    view = {
      update: jest.fn(),
    }
    playerInfoManager = {
      getPlayerId: jest.fn().mockReturnValue('c568788e-7e5b-47ad-a0e0-375e1f3996a4'),
      getPlayerName: jest.fn().mockReturnValue('James'),
      setPlayerId: jest.fn(),
      setPlayerName: jest.fn(),
    }
    userNotifier = {
      notify: jest.fn(),
    }
    lobbyCommandInterface = {
      giveCommand: jest.fn(),
    }
    presenter = new LobbyEntrancePresenter(playerInfoManager, userNotifier, lobbyCommandInterface)
  })

  it('Should provide the users name', () => {
    expect(presenter.getLocalPlayerName()).toEqual('James')
    expect(playerInfoManager.getPlayerName).toHaveBeenCalled()
  })

  it('Should update the users name on change and then persist it on blur', () => {
    presenter.setView(view)
    presenter.setLocalPlayerName('Janice')
    expect(view.update).toHaveBeenCalled()
    expect(presenter.getLocalPlayerName()).toEqual('Janice')
    expect(playerInfoManager.setPlayerName).not.toHaveBeenCalled()
    presenter.nameInputBlurred()
    expect(playerInfoManager.setPlayerName).toHaveBeenCalledWith('Janice')
  })

  describe("Managing the player's unique id", () => {
    it('Should use the players id if the manager has a valid one', () => {
      expect(playerInfoManager.getPlayerId).toHaveBeenCalled()
    })

    it("Should create a new one of the player doesn't have a valid one", () => {
      playerInfoManager.getPlayerId = jest.fn()
      presenter = new LobbyEntrancePresenter(playerInfoManager, userNotifier, lobbyCommandInterface)
      expect(playerInfoManager.setPlayerId).toHaveBeenCalled()
    })
  })

  describe('Hosting a New Game', () => {
    it('Should notify the user that they cannot host a game without first entering their name', () => {
      presenter.setLocalPlayerName('')
      presenter.hostNewGame()
      expect(userNotifier.notify).toHaveBeenCalledWith(
        'Please enter your name before hosting a game'
      )
    })

    it('Should create a host game command and give it to the Lobby Command Manager', () => {
      presenter.hostNewGame()
      expect(lobbyCommandInterface.giveCommand).toHaveBeenCalledWith({
        name: 'hostNewGame',
        params: {
          hostId: 'c568788e-7e5b-47ad-a0e0-375e1f3996a4',
          hostName: 'James',
        },
      })
    })
  })
})

export {}

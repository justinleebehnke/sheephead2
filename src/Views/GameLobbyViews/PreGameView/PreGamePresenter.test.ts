import GameData from '../../../Entities/GameManager/GameData'
import ICommandInterface from '../../../InterfaceAdapters/ICommandInterface'
import IGameManager from '../../../Entities/GameManager/IGameManager'
import ILocalPlayerInfoManager from '../LobbyEntranceView/ILocalPlayerInfoManager'
import ISubscriber from '../../../Entities/ISubscriber'
import PreGamePresenter from './PreGamePresenter'
import RemovePlayerFromGameCommandDTO from '../../../InterfaceAdapters/CommandExecutor/LobbyCommands/LobbyCommandDTOs/RemovePlayerFromGameCommandDTO'
import StartGameCommandDTO from '../../../InterfaceAdapters/CommandExecutor/LobbyCommands/LobbyCommandDTOs/StartGameCommandDTO'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

describe('PreGamePresenter', () => {
  let presenter: PreGamePresenter
  let view: ISubscriber
  let gameList: IGameManager
  let hostId: UniqueIdentifier
  let game: GameData
  let localPlayerInfoManager: ILocalPlayerInfoManager
  let localPlayerId: UniqueIdentifier
  let otherPlayerId: UniqueIdentifier
  let commandInterface: ICommandInterface

  beforeEach(() => {
    commandInterface = {
      giveCommand: jest.fn(),
    }
    localPlayerId = new UniqueIdentifier()
    localPlayerInfoManager = {
      getPlayerId: () => localPlayerId.getId(),
      getPlayerName: () => 'Butch Coolidge',
      setPlayerId: () => {},
      setPlayerName: () => {},
    }
    otherPlayerId = new UniqueIdentifier()
    hostId = new UniqueIdentifier()
    game = {
      isStarted: false,
      hostId,
      config: {
        firstDealerIndex: 0,
        shuffleSeed: 1234543,
      },
      players: [{ id: hostId, name: 'Marsellus Wallace' }],
    }
    view = {
      update: jest.fn(),
    }
    gameList = {
      addPlayerToGame: jest.fn(),
      removePlayerFromGame: jest.fn(),
      createGame: jest.fn(),
      setGameConfig: jest.fn(),
      startGame: jest.fn(),
      unStartGame: jest.fn(),
      subscribe: jest.fn(),
      getGameByPlayerId: jest.fn(),
      getGameByHostId: jest.fn().mockReturnValue(game),
    }
    presenter = new PreGamePresenter(gameList, hostId, localPlayerInfoManager, commandInterface)
  })

  describe('setView', () => {
    it('Should subscribe to the game list, and notify the view if the game list updates', () => {
      presenter.setView(view)
      expect(gameList.subscribe).toHaveBeenCalledWith(presenter)
      presenter.gameUpdated()
      expect(view.update).toHaveBeenCalled()
    })
  })

  describe('isHosting', () => {
    it('Should return true if the local player is the host', () => {
      presenter = new PreGamePresenter(
        gameList,
        localPlayerId,
        localPlayerInfoManager,
        commandInterface
      )
      expect(presenter.isHosting).toBe(true)
    })
    it('Should return false if the local player is not the host', () => {
      presenter = new PreGamePresenter(gameList, hostId, localPlayerInfoManager, commandInterface)
      expect(presenter.isHosting).toBe(false)
    })
  })

  describe('Get Dealer Select Values', () => {
    it('Should return the appropriate values in the appropriate order', () => {
      expect(presenter.getDealerSelectDropDownData()).toEqual([
        { value: 0, displayedValue: 'Host (You)' },
        { value: 1, displayedValue: 'Player 2' },
        { value: 2, displayedValue: 'Player 3' },
        { value: 3, displayedValue: 'Player 4' },
      ])
    })
  })

  describe('getPlayers', () => {
    it('Should return the player data for the game that is being viewed', () => {
      expect(presenter.getPlayers()).toEqual([{ id: hostId.getId(), name: 'Marsellus Wallace' }])
    })
  })

  describe('setFirstDealerIndex', () => {
    it('Should throw an error if someone other than the host tries to do this', () => {
      expect(() => presenter.setFirstDealerIndex(2)).toThrow(
        'Only the host may set the dealer index'
      )
    })
    it('Should update immediately and notify the view that the value has changed', () => {
      presenter = new PreGamePresenter(
        gameList,
        localPlayerId,
        localPlayerInfoManager,
        commandInterface
      )
      presenter.setView(view)
      presenter.setFirstDealerIndex(2)
      expect(view.update).toHaveBeenCalled()
      expect(presenter.getFirstDealerIndex()).toBe(2)
    })
    it('Should throw an error if the value is too big or too small', () => {
      presenter = new PreGamePresenter(
        gameList,
        localPlayerId,
        localPlayerInfoManager,
        commandInterface
      )
      expect(() => presenter.setFirstDealerIndex(-1)).toThrow('Value must be between 0 and 3')
      expect(() => presenter.setFirstDealerIndex(4)).toThrow('Value must be between 0 and 3')
    })
  })

  describe('getFirstDealerIndex', () => {
    it('Should throw an error if someone other than the host is asking', () => {
      expect(presenter.isHosting).toBe(false)
      expect(() => presenter.getFirstDealerIndex()).toThrow(
        'Only the host may read the index of the first dealer'
      ) // this will likely be changed in the future when a 'configUpdate' lobby command is made
    })
  })

  describe('removePlayerFromGame', () => {
    it('Should throw an error if the local player is not the host', () => {
      expect(() => presenter.removePlayer(otherPlayerId.getId())).toThrow(
        'Only the host may remove a player'
      )
    })
    it('Should send a remove player from game command', () => {
      const removePlayerCommand: RemovePlayerFromGameCommandDTO = {
        name: 'removePlayer',
        params: {
          hostId: localPlayerId.getId(),
          playerId: otherPlayerId.getId(),
        },
      }

      presenter = new PreGamePresenter(
        gameList,
        localPlayerId,
        localPlayerInfoManager,
        commandInterface
      )

      presenter.removePlayer(otherPlayerId.getId())
      expect(commandInterface.giveCommand).toHaveBeenCalledWith(removePlayerCommand)
    })
  })

  describe('leaveGame', () => {
    it('Should create a remove player from game command with the local players info', () => {
      const removePlayerCommand: RemovePlayerFromGameCommandDTO = {
        name: 'removePlayer',
        params: {
          hostId: hostId.getId(),
          playerId: localPlayerId.getId(),
        },
      }
      presenter.leaveGame()
      expect(commandInterface.giveCommand).toHaveBeenCalledWith(removePlayerCommand)
    })
  })

  describe('startGame', () => {
    it('Should throw an error not hosting', () => {
      expect(() => presenter.startGame()).toThrow('Only the host may start the game')
    })

    it('Should choose correctly build a start game command based on who started', () => {
      presenter = new PreGamePresenter(
        gameList,
        localPlayerId,
        localPlayerInfoManager,
        commandInterface
      )
      presenter.setFirstDealerIndex(1)
      presenter.startGame()
      const startGameCommand: StartGameCommandDTO = {
        name: 'startGame',
        params: {
          shuffleSeed: new Date(Date.now()).getTime(),
          firstDealerIndex: 1,
          hostId: localPlayerId.getId(),
        },
      }
      expect(commandInterface.giveCommand).toHaveBeenCalledWith(startGameCommand)
    })
  })
})

export {}

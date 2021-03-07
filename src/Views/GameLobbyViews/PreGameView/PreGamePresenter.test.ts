import GameData from '../../../Entities/GameManager/GameData'
import ISubscriber from '../../../Entities/ISubscriber'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'
import IGameList from '../JoinableGamesView/IGameList'
import PreGamePresenter from './PreGamePresenter'

describe('PreGamePresenter', () => {
  let presenter: PreGamePresenter
  let view: ISubscriber
  let gameList: IGameList
  let hostId: UniqueIdentifier
  let game: GameData
  beforeEach(() => {
    hostId = new UniqueIdentifier()
    game = {
      isStarted: false,
      hostId,
      config: {
        firstDealerIndex: -1,
        shuffleSeed: 1234543,
      },
      players: [{ id: hostId, name: 'Marsellus Wallace' }],
    }
    view = {
      update: jest.fn(),
    }
    gameList = {
      subscribe: jest.fn(),
      getAllGames: jest.fn(),
      getGameByHostId: jest.fn().mockReturnValue(game),
    }
    presenter = new PreGamePresenter(gameList, hostId)
  })
  describe('setView', () => {
    it('Should subscribe to the game list, and notify the view if the game list updates', () => {
      presenter.setView(view)
      expect(gameList.subscribe).toHaveBeenCalledWith(presenter)
      presenter.gameListUpdated()
      expect(view.update).toHaveBeenCalled()
    })
  })
  describe('isHosting', () => {
    // if the local player is the host, then the local player is hosting
    // otherwise they are not
    // when you are hosting you can remove players
    // when you are hosting you can set the first dealer index
    // when you are hosting you can start the game
  })
  describe('getFirstDealerIndex', () => {})
  describe('getPlayers', () => {
    it('Should return the player data for the game that is being viewed', () => {
      expect(presenter.getPlayers()).toEqual([{ id: hostId.getId(), name: 'Marsellus Wallace' }])
    })
  })

  describe('setFirstDealerIndex', () => {
    // -1 is a code word for random, when the game is actually created
  })
  // throw error if not host
  describe('removePlayerFromGame', () => {
    // throw error if not host
  })
  describe('leaveGame', () => {
    // send a leave game ocmmand
  })

  describe('startGame', () => {
    // throw error if not host
    // throw error if there are not 4 players
    // if the current index is -1 choose a random index before sending the command (do not send -1) everyone else needs to know who the real first dealer is
  })
})

export {}

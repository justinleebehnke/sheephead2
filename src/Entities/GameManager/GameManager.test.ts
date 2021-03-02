import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import GameManager from './GameManager'

describe('Game Manager', () => {
  const realDate = Date.now
  let gameManager: GameManager
  let hostInfo: PlayerDTO
  let firstJoinerInfo: PlayerDTO

  beforeEach(() => {
    gameManager = new GameManager()
    global.Date.now = () => new Date('2020-10-01').getTime()
    hostInfo = {
      id: new UniqueIdentifier(),
      name: 'Jules Winnefield',
    }
    firstJoinerInfo = {
      id: new UniqueIdentifier(),
      name: 'Vincent Vega',
    }
  })

  afterEach(() => {
    global.Date.now = realDate
  })

  describe('Create Game', () => {
    it('Should be able to give back a game that game has been created', () => {
      gameManager.createGame(hostInfo)
      expect(gameManager.getGameDataByHostId(hostInfo.id)).toEqual({
        hostId: hostInfo.id,
        config: {
          shuffleSeed: new Date('2020-10-01').getTime(),
          firstDealerIndex: 0,
        },
        players: [hostInfo],
      })
    })

    it('Should throw an error of the same host tries to create a second game', () => {
      gameManager.createGame(hostInfo)
      expect(() => gameManager.createGame(hostInfo)).toThrow(
        'Same person cannot host two games at once'
      )
    })
  })

  describe('Join Game', () => {
    it('Should allow someone else to join a game', () => {
      gameManager.createGame(hostInfo)
      gameManager.addPlayerToGame(hostInfo.id, firstJoinerInfo)
      expect(gameManager.getGameDataByHostId(hostInfo.id)?.players).toEqual([
        hostInfo,
        firstJoinerInfo,
      ])
    })
  })

  describe('Remove Player From Game', () => {
    it('Should allow someone who has joined to leave the game', () => {
      gameManager.createGame(hostInfo)
      gameManager.addPlayerToGame(hostInfo.id, firstJoinerInfo)
      gameManager.removePlayerFromGame(firstJoinerInfo.id, hostInfo.id)
      expect(gameManager.getGameDataByHostId(hostInfo.id)?.players).toEqual([hostInfo])
    })

    it("Should throw an error if someone the host id doesn't lead to a game", () => {
      expect(() => gameManager.removePlayerFromGame(firstJoinerInfo.id, hostInfo.id)).toThrow(
        'Cannot remove player from game because hostId did not produce a game'
      )
    })

    it("Should throw an error if the person you are removing isn't even in the game associated with that host", () => {
      gameManager.createGame(hostInfo)
      expect(() => gameManager.removePlayerFromGame(firstJoinerInfo.id, hostInfo.id)).toThrow(
        "Cannot remove player from game because that player is not in the host's game"
      )
    })
  })

  // if the host leaves a game, that game should not be found
  // if the host leaves a game they should be able to create a new game
  // if a person is in a game, they should not be able to host a game
})

export {}

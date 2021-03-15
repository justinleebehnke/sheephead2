import GameManager from './GameManager'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

describe('Game Manager', () => {
  const realDate = Date.now
  let gameManager: GameManager
  let hostInfo: PlayerDTO
  let firstJoinerInfo: PlayerDTO
  let secondJoinerInfo: PlayerDTO

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
    secondJoinerInfo = {
      id: new UniqueIdentifier(),
      name: 'Mia Wallace',
    }
  })

  afterEach(() => {
    global.Date.now = realDate
  })

  describe('Create Game', () => {
    it('Should be able to give back a game that game has been created', () => {
      gameManager.createGame(hostInfo)
      expect(gameManager.getGameByHostId(hostInfo.id)).toEqual({
        hostId: hostInfo.id,
        isStarted: false,
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

    it('Should allow the host to create a new game even if they just left a game', () => {
      gameManager.createGame(hostInfo)
      gameManager.removePlayerFromGame(hostInfo.id, hostInfo.id)
      gameManager.createGame(hostInfo)
      expect(gameManager.getGameByHostId(hostInfo.id)).toBeDefined()
    })

    it('Should throw an error if a person is a player in a game and they try to host a game', () => {
      gameManager.createGame(hostInfo)
      gameManager.addPlayerToGame(hostInfo.id, firstJoinerInfo)
      expect(() => gameManager.createGame(firstJoinerInfo)).toThrow(
        'A player cannot be in two games, player cannot create a new game without leaving the first'
      )
    })
  })

  describe('Join Game', () => {
    it('Should allow someone else to join a game', () => {
      gameManager.createGame(hostInfo)
      gameManager.addPlayerToGame(hostInfo.id, firstJoinerInfo)
      expect(gameManager.getGameByHostId(hostInfo.id)?.players).toEqual([hostInfo, firstJoinerInfo])
    })
    it('Should throw an error if the same person tries to join a second game', () => {
      gameManager.createGame(hostInfo)
      gameManager.createGame(secondJoinerInfo)
      gameManager.addPlayerToGame(hostInfo.id, firstJoinerInfo)
      expect(() => {
        gameManager.addPlayerToGame(secondJoinerInfo.id, firstJoinerInfo)
      }).toThrow('A player cannot be in two games')
    })
    it('Should throw an error if the same person tries to join a the same game', () => {
      gameManager.createGame(hostInfo)
      gameManager.addPlayerToGame(hostInfo.id, firstJoinerInfo)
      expect(() => {
        gameManager.addPlayerToGame(hostInfo.id, firstJoinerInfo)
      }).toThrow('A player cannot be in two games')
    })
    it('Should throw an error if the host tries to join their own game', () => {
      gameManager.createGame(hostInfo)
      expect(() => {
        gameManager.addPlayerToGame(hostInfo.id, hostInfo)
      }).toThrow('A player cannot be in two games')
    })
    it('Should throw an error if the host of one game tries to join another', () => {
      gameManager.createGame(hostInfo)
      gameManager.createGame(secondJoinerInfo)
      expect(() => {
        gameManager.addPlayerToGame(secondJoinerInfo.id, hostInfo)
      }).toThrow('A player cannot be in two games')
    })
  })

  describe('Remove Player From Game', () => {
    it('Should allow someone who has joined to leave the game', () => {
      gameManager.createGame(hostInfo)
      gameManager.addPlayerToGame(hostInfo.id, firstJoinerInfo)
      gameManager.removePlayerFromGame(firstJoinerInfo.id, hostInfo.id)
      expect(gameManager.getGameByHostId(hostInfo.id)?.players).toEqual([hostInfo])
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
    it('Should destroy the game if the host leaves the game', () => {
      gameManager.createGame(hostInfo)
      gameManager.removePlayerFromGame(hostInfo.id, hostInfo.id)
      expect(gameManager.getGameByHostId(hostInfo.id)).toBeUndefined()
    })
    it('Should allow all players to join new games if the host of the original game left', () => {
      gameManager.createGame(hostInfo)
      gameManager.addPlayerToGame(hostInfo.id, firstJoinerInfo)
      gameManager.removePlayerFromGame(hostInfo.id, hostInfo.id)
      gameManager.createGame(firstJoinerInfo)
      expect(gameManager.getGameByHostId(firstJoinerInfo.id)).toBeDefined()
    })
    it("Should throw an error if you try to join a game that doesn't exist", () => {
      expect(() => gameManager.addPlayerToGame(hostInfo.id, firstJoinerInfo)).toThrow(
        'Cannot add player to nonexistent game'
      )
    })
  })

  describe('Setting The Game Config', () => {
    it('Should update the game config to what it was set to', () => {
      const config1 = { shuffleSeed: 123456789, firstDealerIndex: 3 }
      const config2 = { shuffleSeed: 65345232, firstDealerIndex: 2 }

      gameManager.createGame(hostInfo)
      gameManager.setGameConfig(hostInfo.id, config1)
      const serializedConfig1 = JSON.stringify(gameManager.getGameByHostId(hostInfo.id)?.config)

      gameManager.setGameConfig(hostInfo.id, config2)
      expect(JSON.stringify(gameManager.getGameByHostId(hostInfo.id)?.config)).not.toEqual(
        serializedConfig1
      )

      gameManager.setGameConfig(hostInfo.id, config1)
      expect(serializedConfig1).toEqual(
        JSON.stringify(gameManager.getGameByHostId(hostInfo.id)?.config)
      )
    })
    it('Should throw an error if trying to set the config of a non-existent game', () => {
      const config1 = { shuffleSeed: 123456789, firstDealerIndex: 3 }
      expect(() => gameManager.setGameConfig(hostInfo.id, config1)).toThrow(
        'Cannot set config of non-existent game'
      )
    })
  })

  describe('Start Game', () => {
    it('Should mark the game as started', () => {
      gameManager.createGame(hostInfo)
      gameManager.startGame(hostInfo.id)
      expect(gameManager.getGameByHostId(hostInfo.id)?.isStarted).toBe(true)
    })
    it('Should throw an error if trying to start an already started game', () => {
      gameManager.createGame(hostInfo)
      gameManager.startGame(hostInfo.id)
      expect(() => gameManager.startGame(hostInfo.id)).toThrow(
        'The requested game is already started'
      )
    })
    it('Should throw an error if the game is non-existent', () => {
      expect(() => gameManager.startGame(hostInfo.id)).toThrow('Cannot start non-existent game')
    })
  })

  describe('Un Start Game', () => {
    it('Should mark the game as not started', () => {
      gameManager.createGame(hostInfo)
      gameManager.startGame(hostInfo.id)
      gameManager.unStartGame(hostInfo.id)
      expect(gameManager.getGameByHostId(hostInfo.id)?.isStarted).toBe(false)
    })
    it('Should throw an error if trying to un start a not started game', () => {
      gameManager.createGame(hostInfo)
      expect(() => gameManager.unStartGame(hostInfo.id)).toThrow(
        'The requested game is already not started'
      )
    })
    it('Should throw an error if the game is non-existent', () => {
      expect(() => gameManager.unStartGame(hostInfo.id)).toThrow(
        'Cannot un start non-existent game'
      )
    })
  })
})

export {}

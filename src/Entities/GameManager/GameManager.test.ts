import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import GameManager from './GameManager'

describe('Game Manager', () => {
  const realDate = Date.now
  let gameManager: GameManager
  let hostInfo: PlayerDTO

  beforeEach(() => {
    gameManager = new GameManager()
    global.Date.now = () => new Date('2020-10-01').getTime()
    hostInfo = {
      id: new UniqueIdentifier(),
      name: 'Jules Winnefield',
    }
  })

  afterEach(() => {
    global.Date.now = realDate
  })

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

export {}

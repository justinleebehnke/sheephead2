import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import GameLobby from '../GameLobby'

describe('Game Lobby', () => {
  let hostId: UniqueIdentifier
  let playerId: UniqueIdentifier
  beforeEach(() => {
    hostId = new UniqueIdentifier()
    playerId = new UniqueIdentifier()
  })

  afterEach(() => {
    GameLobby.getGameLobby().removePlayerFromGame(hostId)
    GameLobby.getGameLobby().removePlayerFromGame(playerId)
  })

  it('Should be the one and only Game Lobby', () => {
    expect(GameLobby.getGameLobby()).toBe(GameLobby.getGameLobby())
  })

  it('Should allow us to create a game and see that the game is created', () => {
    GameLobby.getGameLobby().addNewGame({ getName: () => 'Test Name', getId: () => hostId })
    const allGames = GameLobby.getGameLobby().getAllGames()
    expect(allGames.some((game) => game.getPlayerById(hostId))).toBeTruthy()
  })

  it('Should remove the game if the host leaves', () => {
    GameLobby.getGameLobby().addNewGame({ getName: () => 'Test Name', getId: () => hostId })
    GameLobby.getGameLobby().removePlayerFromGame(hostId)
    const allGames = GameLobby.getGameLobby().getAllGames()
    expect(allGames.length).toBe(0)
  })

  it('Should not remove the game if player other than the host leaves', () => {
    GameLobby.getGameLobby().addNewGame({ getName: () => 'Test Name', getId: () => hostId })
    const games = GameLobby.getGameLobby().getAllGames()
    games[0].addPlayer({ getName: () => 'Test Name 2', getId: () => playerId })
    GameLobby.getGameLobby().removePlayerFromGame(playerId)
    const allGames = GameLobby.getGameLobby().getAllGames()
    expect(allGames.length).toBe(1)
  })

  describe('Managing an already started game', () => {
    // a game is identified by it's host
    // if a host leaves, the game is destroyed and everyone goes back to the lobby
    // so we have the list of pregames
    // and the pregame knows the real game
    // so you
  })
})

export {}

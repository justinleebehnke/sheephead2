import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import GameLobby from '../GameLobby'

describe('Game Lobby', () => {
  let hostId: UniqueIdentifier
  let playerId: UniqueIdentifier
  let lobby: GameLobby
  beforeEach(() => {
    hostId = new UniqueIdentifier()
    playerId = new UniqueIdentifier()
    lobby = new GameLobby()
  })

  it('Should allow us to create a game and see that the game is created', () => {
    lobby.addNewGame({ getName: () => 'Test Name', getId: () => hostId })
    const allGames = lobby.getAllGames()
    expect(allGames.some((game) => game.getPlayerById(hostId))).toBeTruthy()
  })

  it('Should remove the game if the host leaves', () => {
    lobby.addNewGame({ getName: () => 'Test Name', getId: () => hostId })
    lobby.removePlayerFromGame(hostId)
    const allGames = lobby.getAllGames()
    expect(allGames.length).toBe(0)
  })

  it('Should not remove the game if player other than the host leaves', () => {
    lobby.addNewGame({ getName: () => 'Test Name', getId: () => hostId })
    const games = lobby.getAllGames()
    games[0].addPlayer({ getName: () => 'Test Name 2', getId: () => playerId })
    lobby.removePlayerFromGame(playerId)
    const allGames = lobby.getAllGames()
    expect(allGames.length).toBe(1)
  })

  describe('Managing an already started game', () => {
    it('Should remove the game from the lobby if the host leaves', () => {
      lobby.addNewGame({ getName: () => 'Test Name', getId: () => hostId })
      const games = lobby.getAllGames()
      games[0].addPlayer({ getName: () => 'Test Name 2', getId: () => playerId })
      lobby.removePlayerFromGame(hostId)
      const allGames = lobby.getAllGames()
      expect(allGames.length).toBe(0)
    })
  })
})

export {}

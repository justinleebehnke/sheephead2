import Game from '../Game'
import Player from '../Player'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

describe('Game', () => {
  let players: Player[]
  let shuffleSeed: number
  let game: Game

  beforeEach(() => {
    players = [
      new Player('Player 1', new UniqueIdentifier()),
      new Player('Player 2', new UniqueIdentifier()),
      new Player('Player 3', new UniqueIdentifier()),
      new Player('Player 4', new UniqueIdentifier()),
    ]
    shuffleSeed = 12345
    game = new Game(players, 0, shuffleSeed)
  })
  it('Should accept a seed when the game is created', () => {
    expect(() => new Game([], 0, shuffleSeed)).not.toThrow()
  })
  it('should only play again after all players have reported that they are ready', () => {
    const currentRound = game.getCurrentRound()
    game.playAgain(new UniqueIdentifier(players[0].getId()))
    game.playAgain(new UniqueIdentifier(players[1].getId()))
    game.playAgain(new UniqueIdentifier(players[2].getId()))
    game.playAgain(new UniqueIdentifier(players[0].getId()))
    expect(currentRound).toEqual(game.getCurrentRound())
    game.playAgain(new UniqueIdentifier(players[3].getId()))
    expect(currentRound).not.toEqual(game.getCurrentRound())
  })
})

export {}

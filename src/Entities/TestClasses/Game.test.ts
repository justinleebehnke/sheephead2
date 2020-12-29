import Game from '../Game'

describe('Game', () => {
  it('Should accept a seed when the game is created', () => {
    const shuffleSeed = 12345
    expect(() => new Game([], 0, shuffleSeed)).not.toThrow()
  })
})

export {}

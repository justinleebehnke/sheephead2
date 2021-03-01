import IGame from '../Interfaces/IGame'
import PlayAgainCommand from '../PlayAgainCommand'

describe('Play Again Command', () => {
  let game: IGame

  beforeEach(() => {
    game = {
      getCurrentRound: jest.fn(),
      playAgain: jest.fn(),
    }
  })

  it('Should call play again on the game', () => {
    new PlayAgainCommand(game).execute()
    expect(game.playAgain).toHaveBeenCalled()
  })
})

export {}

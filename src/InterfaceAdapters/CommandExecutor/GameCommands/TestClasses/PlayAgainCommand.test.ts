import IGame from '../../../../GameEntityInterfaces/IGame'
import PlayAgainCommand from '../PlayAgainCommand'
import UniqueIdentifier from '../../../../Utilities/UniqueIdentifier'

describe('Play Again Command', () => {
  let game: IGame
  let playerId: UniqueIdentifier

  beforeEach(() => {
    playerId = new UniqueIdentifier()
    game = {
      getCurrentRound: jest.fn(),
      playAgain: jest.fn(),
    }
  })

  it('Should call play again on the game', () => {
    new PlayAgainCommand(game, playerId.getId()).execute()
    expect(game.playAgain).toHaveBeenCalledWith(playerId)
  })
})

export {}

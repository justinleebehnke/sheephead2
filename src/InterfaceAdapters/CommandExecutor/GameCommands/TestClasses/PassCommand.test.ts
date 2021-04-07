import ICommand from '../../ICommand'
import IGame from '../../../../GameEntityInterfaces/IGame'
import IRound from '../../../../GameEntityInterfaces/IRound'
import PassCommand from '../PassCommand'

describe('Pass Command', () => {
  let passCommand: ICommand
  let round: IRound
  let game: IGame

  beforeEach(() => {
    round = {
      oldBury: jest.fn(),
      pass: jest.fn(),
      play: jest.fn(),
      pick: jest.fn(),
      getCurrentTurnPlayer: jest.fn(),
    }
    game = {
      getCurrentRound: jest.fn().mockReturnValue(round),
      playAgain: jest.fn(),
    }
    passCommand = new PassCommand(game)
  })

  it('Should correctly execute the pass command', () => {
    passCommand.execute()
    expect(round.pass).toHaveBeenCalled()
  })

  it('Should throw an exception if there is not current round', () => {
    game = {
      getCurrentRound: jest.fn().mockReturnValue(undefined),
      playAgain: jest.fn(),
    }
    passCommand = new PassCommand(game)
    expect(() => passCommand.execute()).toThrow('Cannot pass because there is no current round')
  })
})
export {}

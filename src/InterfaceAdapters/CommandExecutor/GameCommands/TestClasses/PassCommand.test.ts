import ICommand from '../ICommand'
import IGame from '../../Interfaces/IGame'
import IRound from '../../Interfaces/IRound'
import PassCommand from '../PassCommand'

describe('Pass Command', () => {
  let passCommand: ICommand
  let round: IRound
  let game: IGame

  beforeEach(() => {
    round = {
      bury: jest.fn(),
      pass: jest.fn(),
      play: jest.fn(),
      getCurrentTurnPlayer: jest.fn(),
    }
    game = {
      getCurrentRound: jest.fn().mockReturnValue(round),
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
    }
    passCommand = new PassCommand(game)
    expect(() => passCommand.execute()).toThrow('Cannot pass because there is no current round')
  })
})
export {}

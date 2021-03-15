import ICommand from '../../ICommand'
import IGame from '../Interfaces/IGame'
import IRound from '../Interfaces/IRound'
import PickCommand from '../PickCommand'

describe('Pick Command', () => {
  let pickCommand: ICommand
  let round: IRound
  let game: IGame

  beforeEach(() => {
    round = {
      bury: jest.fn(),
      pass: jest.fn(),
      play: jest.fn(),
      pick: jest.fn(),
      getCurrentTurnPlayer: jest.fn(),
    }
    game = {
      getCurrentRound: jest.fn().mockReturnValue(round),
      playAgain: jest.fn(),
    }
    pickCommand = new PickCommand(game)
  })

  it('Should correctly execute the pick command', () => {
    pickCommand.execute()
    expect(round.pick).toHaveBeenCalled()
  })

  it('Should throw an exception if there is not current round', () => {
    game = {
      getCurrentRound: jest.fn().mockReturnValue(undefined),
      playAgain: jest.fn(),
    }
    pickCommand = new PickCommand(game)
    expect(() => pickCommand.execute()).toThrow('Cannot pick because there is no current round')
  })
})
export {}

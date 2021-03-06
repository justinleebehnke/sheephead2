import IGame from '../../../../GameEntityInterfaces/IGame'
import IPlayer from '../../../../GameEntityInterfaces/IPlayer'
import IRound from '../../../../GameEntityInterfaces/IRound'
import ICommand from '../../ICommand'
import PlayCommand from '../PlayCommand'

describe('Play Command', () => {
  let game: IGame
  let round: IRound
  let player: IPlayer
  let playCommand: ICommand

  beforeEach(() => {
    player = {
      removeCardFromHand: jest.fn().mockReturnValue({ name: 'crazyCard' }),
    }
    round = {
      pick: jest.fn(),
      bury: jest.fn(),
      pass: jest.fn(),
      play: jest.fn(),
      getCurrentTurnPlayer: jest.fn().mockReturnValue(player),
    }
    game = {
      getCurrentRound: jest.fn().mockReturnValue(round),
      playAgain: jest.fn(),
    }
    playCommand = new PlayCommand(game, 'ac')
  })

  it('Should correctly execute the play command', () => {
    playCommand.execute()
    expect(player.removeCardFromHand).toHaveBeenCalledWith('ac')
    expect(round.play).toHaveBeenCalledWith({ name: 'crazyCard' })
  })

  it('Should throw an exception if there is no current turn player', () => {
    round.getCurrentTurnPlayer = jest.fn().mockReturnValue(undefined)
    game = {
      getCurrentRound: jest.fn().mockReturnValue(round),
      playAgain: jest.fn(),
    }
    playCommand = new PlayCommand(game, 'ac')
    expect(() => playCommand.execute()).toThrow(
      'Cannot play because there is no current turn player'
    )
  })

  it('Should throw an exception if there is no current round', () => {
    game = {
      getCurrentRound: jest.fn().mockReturnValue(undefined),
      playAgain: jest.fn(),
    }
    playCommand = new PlayCommand(game, 'ac')
    expect(() => playCommand.execute()).toThrow('Cannot play because there is no current round')
  })
})

export {}

import IGame from '../../Interfaces/IGame'
import IPlayer from '../../Interfaces/IPlayer'
import IRound from '../../Interfaces/IRound'
import ICommand from '../ICommand'
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
      pass: jest.fn(),
      play: jest.fn(),
      getCurrentTurnPlayer: jest.fn().mockReturnValue(player),
    }
    game = {
      getCurrentRound: jest.fn().mockReturnValue(round),
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
    }
    playCommand = new PlayCommand(game, 'ac')
    expect(() => playCommand.execute()).toThrow("Cannot play because it is not anyone's turn")
  })

  it('Should throw an exception if there is no current round', () => {
    game = {
      getCurrentRound: jest.fn().mockReturnValue(undefined),
    }
    playCommand = new PlayCommand(game, 'ac')
    expect(() => playCommand.execute()).toThrow('Cannot play because there is no round')
  })
})

export {}

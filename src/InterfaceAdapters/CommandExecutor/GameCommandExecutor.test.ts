import GameCommandExecutor from './GameCommandExecutor'
import ICommandExecutor from './ICommandExecutor'
import IGame from './Interfaces/IGame'
import IPlayer from './Interfaces/IPlayer'
import IRound from './Interfaces/IRound'
import PlayCommand from '../CommandTypes/PlayCommand'

describe('Game Command Executor', () => {
  let game: IGame
  let round: IRound
  let player: IPlayer
  let commandExecutor: ICommandExecutor

  beforeEach(() => {
    player = {
      removeCardFromHand: jest.fn().mockReturnValue({}),
    }
    round = {
      play: jest.fn(),
      getCurrentTurnPlayer: jest.fn().mockReturnValue(player),
    }
    game = {
      getCurrentRound: jest.fn().mockReturnValue(round),
    }
    commandExecutor = new GameCommandExecutor(game)
  })

  it('Should throw an error if the command is not recognized', () => {
    const invalidCommand = { name: 'unrecognizedName', params: null }
    expect(() => commandExecutor.execute(invalidCommand)).toThrow(
      `Game command is not recognized: ${JSON.stringify(invalidCommand)}`
    )
  })

  describe('Play Command', () => {
    let playCommand: PlayCommand
    beforeEach(() => {
      playCommand = { name: 'play', params: { card: 'ac' } }
    })

    it('Should correctly execute the play command', () => {
      commandExecutor.execute(playCommand)
      expect(player.removeCardFromHand).toHaveBeenCalledWith('ac')
      expect(round.play).toHaveBeenCalledWith({})
    })

    it('Should throw an exception if there is no current turn player', () => {
      round.getCurrentTurnPlayer = jest.fn().mockReturnValue(undefined)
      game = {
        getCurrentRound: jest.fn().mockReturnValue(round),
      }
      commandExecutor = new GameCommandExecutor(game)
      expect(() => commandExecutor.execute(playCommand)).toThrow(
        "Cannot play because it is not anyone's turn"
      )
    })

    it('Should throw an exception if there is no current round', () => {
      game = {
        getCurrentRound: jest.fn().mockReturnValue(undefined),
      }
      commandExecutor = new GameCommandExecutor(game)
      expect(() => commandExecutor.execute(playCommand)).toThrow(
        'Cannot play because there is no current round'
      )
    })
  })
})

export {}

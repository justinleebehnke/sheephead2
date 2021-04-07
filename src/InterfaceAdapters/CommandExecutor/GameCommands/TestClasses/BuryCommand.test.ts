import BuryCommand from '../BuryCommand'
import IGame from '../../../../GameEntityInterfaces/IGame'
import IPlayer from '../../../../GameEntityInterfaces/IPlayer'
import IRound from '../../../../GameEntityInterfaces/IRound'

describe('Bury Command', () => {
  let game: IGame
  let cardIds: string[]
  let round: IRound
  let currentTurnPlayer: IPlayer

  beforeEach(() => {
    cardIds = ['ac', 'as']
    currentTurnPlayer = {
      removeCardFromHand: jest
        .fn()
        .mockReturnValueOnce({ name: 'cardA' })
        .mockReturnValueOnce({ name: 'cardB' }),
    }

    round = {
      pick: jest.fn(),
      oldBury: jest.fn(),
      getCurrentTurnPlayer: jest.fn().mockReturnValue(currentTurnPlayer),
      pass: jest.fn(),
      play: jest.fn(),
    }

    game = {
      getCurrentRound: jest.fn().mockReturnValue(round),
      playAgain: jest.fn(),
    }
  })

  it("Should remove the cards from the current turn player's hand", () => {
    const buryCommand = new BuryCommand(game, cardIds)
    buryCommand.execute()
    expect(currentTurnPlayer.removeCardFromHand).toHaveBeenCalledWith('ac')
    expect(currentTurnPlayer.removeCardFromHand).toHaveBeenCalledWith('as')
    expect(currentTurnPlayer.removeCardFromHand).toHaveBeenCalledTimes(2)
    expect(round.oldBury).toHaveBeenCalledWith({ name: 'cardA' }, { name: 'cardB' })
  })

  it('Should throw an error if the card ids is not the right length', () => {
    expect(() => new BuryCommand(game, ['ac'])).toThrow(
      'The bury must contain two card ids to bury'
    )
  })

  it('Should throw an error if there is no current round', () => {
    game.getCurrentRound = jest.fn()
    const buryCommand = new BuryCommand(game, cardIds)
    expect(() => buryCommand.execute()).toThrow('Cannot bury because there is no current round')
  })

  it('Should throw an error if there is no current turn player', () => {
    round.getCurrentTurnPlayer = jest.fn()
    game = {
      getCurrentRound: jest.fn().mockReturnValue(round),
      playAgain: jest.fn(),
    }
    const buryCommand = new BuryCommand(game, cardIds)
    expect(() => buryCommand.execute()).toThrow(
      'Cannot bury because there is no current turn player'
    )
  })
})

export {}

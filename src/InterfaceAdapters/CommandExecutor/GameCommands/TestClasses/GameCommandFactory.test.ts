import BuryCommand from '../BuryCommand'
import GameCommandFactory from '../GameCommandFactory'
import IGame from '../../../../GameEntityInterfaces/IGame'
import PassCommand from '../PassCommand'
import PlayAgainCommand from '../PlayAgainCommand'
import PlayCommand from '../PlayCommand'
import UniqueIdentifier from '../../../../Utilities/UniqueIdentifier'
import PickCommand from '../PickCommand'

describe('Game Command Factory', () => {
  let gameCommandFactory: GameCommandFactory
  let game: IGame
  let playerId: UniqueIdentifier
  beforeEach(() => {
    playerId = new UniqueIdentifier()
    gameCommandFactory = new GameCommandFactory(game)
  })

  it('Should create a Play Command when given a PlayCommandDTO', () => {
    const playCommand = { name: 'play', params: { card: 'ac' } }
    expect(gameCommandFactory.getCommand(playCommand)).toEqual(new PlayCommand(game, 'ac'))
  })

  it('Should create a Pass Command when given a PassCommandDTO', () => {
    expect(gameCommandFactory.getCommand({ name: 'pass', params: null })).toEqual(
      new PassCommand(game)
    )
  })

  it('Should create a Bury Command when given a BuryCommandDTO', () => {
    expect(
      gameCommandFactory.getCommand({ name: 'bury', params: { cards: ['ac', 'as'] } })
    ).toEqual(new BuryCommand(game, ['ac', 'as']))
  })

  it('Should create a Play Again Command when given a PlayAgainCommandDTO', () => {
    expect(
      gameCommandFactory.getCommand({ name: 'playAgain', params: { playerId: playerId.getId() } })
    ).toEqual(new PlayAgainCommand(game, playerId.getId()))
  })

  it('Should create a Pick Command when given a pick command dto', () => {
    expect(gameCommandFactory.getCommand({ name: 'pick', params: null })).toEqual(
      new PickCommand(game)
    )
  })
})

export {}

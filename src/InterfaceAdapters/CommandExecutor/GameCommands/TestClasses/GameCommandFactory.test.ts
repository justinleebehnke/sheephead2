import GameCommandFactory from '../GameCommandFactory'
import IGame from '../../Interfaces/IGame'
import PassCommand from '../PassCommand'
import PlayCommand from '../PlayCommand'

describe('Game Command Factory', () => {
  let gameCommandFactory: GameCommandFactory
  let game: IGame
  beforeEach(() => {
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
})

export {}

import GameCommandFactory from '../GameCommandFactory'
import IGame from '../../Interfaces/IGame'
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
})

export {}

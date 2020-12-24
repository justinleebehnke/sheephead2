import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import PreGame from '../PreGame'

describe('PreGame', () => {
  let hostId: UniqueIdentifier
  beforeEach(() => {
    hostId = new UniqueIdentifier()
  })
  it('Should not allow two players with the same id to be added', () => {
    const game = new PreGame({ getId: () => hostId, getName: () => 'Host Name' })
    expect(() => {
      game.addPlayer({ getId: () => hostId, getName: () => 'Player Name' })
    }).toThrow('Cannot have two players with same id in game')
  })
})

export {}

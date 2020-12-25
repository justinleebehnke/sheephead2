import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import GameManager from '../GameManager'

describe('PreGame', () => {
  let hostId: UniqueIdentifier
  beforeEach(() => {
    hostId = new UniqueIdentifier()
  })
  it('Should not allow two players with the same id to be added', () => {
    const game = new GameManager({ getId: () => hostId, getName: () => 'Host Name' })
    expect(() => {
      game.addPlayer({ getId: () => hostId, getName: () => 'Player Name' })
    }).toThrow('Cannot have two players with same id in game')
  })
  it('Should allow the index of the dealer to be set', () => {
    const game = new GameManager({ getId: () => hostId, getName: () => 'Host Name' })
    game.setFirstDealerIndex(0)
    expect(game.getFirstDealerIndex()).toBe(0)
    game.setFirstDealerIndex(1)
    expect(game.getFirstDealerIndex()).toBe(1)
    game.setFirstDealerIndex(2)
    expect(game.getFirstDealerIndex()).toBe(2)
    game.setFirstDealerIndex(3)
    expect(game.getFirstDealerIndex()).toBe(3)
    expect(() => {
      game.setFirstDealerIndex(-1)
    }).toThrow('First dealer index must be between 0 and 3')
    expect(() => {
      game.setFirstDealerIndex(4)
    }).toThrow('First dealer index must be between 0 and 3')
    expect(() => {
      game.setFirstDealerIndex(100000000)
    }).toThrow('First dealer index must be between 0 and 3')
    expect(() => {
      game.setFirstDealerIndex(-10000000)
    }).toThrow('First dealer index must be between 0 and 3')
  })
  it('Should allow a game to be started', () => {})
  it("Should start the game with CPU players if there aren't enough", () => {})
  it('Should not allow a player to be addeed to a started game', () => {})
  it('Should allow a player to be removed from a started game, and bring that game back into a not started state', () => {})
  it('Should allow the host to leave and in that case it should destroy the created game and the pre game', () => {})

  // if a player is removed, it should pull the Game out of the live games and back into pregame state and show up in the lobby
  // it a the host leaves while the game is live, it should
})

export {}

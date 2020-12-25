import Game from '../../Entities/Game'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import GameManager from '../GameManager'

describe('PreGame', () => {
  let hostId: UniqueIdentifier
  beforeEach(() => {
    hostId = new UniqueIdentifier()
  })
  it('Should not allow two players with the same id to be added', () => {
    const gameManager = new GameManager({ getId: () => hostId, getName: () => 'Host Name' })
    expect(() => {
      gameManager.addPlayer({ getId: () => hostId, getName: () => 'Player Name' })
    }).toThrow('Cannot have two players with same id in game')
  })
  it('Should allow the index of the dealer to be set', () => {
    const gameManager = new GameManager({ getId: () => hostId, getName: () => 'Host Name' })
    gameManager.setFirstDealerIndex(0)
    expect(gameManager.getFirstDealerIndex()).toBe(0)
    gameManager.setFirstDealerIndex(1)
    expect(gameManager.getFirstDealerIndex()).toBe(1)
    gameManager.setFirstDealerIndex(2)
    expect(gameManager.getFirstDealerIndex()).toBe(2)
    gameManager.setFirstDealerIndex(3)
    expect(gameManager.getFirstDealerIndex()).toBe(3)
    expect(() => {
      gameManager.setFirstDealerIndex(-1)
    }).toThrow('First dealer index must be between 0 and 3')
    expect(() => {
      gameManager.setFirstDealerIndex(4)
    }).toThrow('First dealer index must be between 0 and 3')
    expect(() => {
      gameManager.setFirstDealerIndex(100000000)
    }).toThrow('First dealer index must be between 0 and 3')
    expect(() => {
      gameManager.setFirstDealerIndex(-10000000)
    }).toThrow('First dealer index must be between 0 and 3')
  })
  it('Should allow a game to be started', () => {
    const gameManager = new GameManager({ getId: () => hostId, getName: () => 'Host Name' })
    gameManager.startGame()
  })
  it('Should be able to get the game object from a game manager if the game has started', () => {
    const gameManager = new GameManager({ getId: () => hostId, getName: () => 'Host Name' })
    expect(gameManager.getGame()).toBe(undefined)
    gameManager.startGame()
    expect(gameManager.getGame()).not.toBe(undefined)
    expect(gameManager.getGame() instanceof Game).toBe(true)
    expect(gameManager.getGame()?.getPlayerById(hostId).getId()).toEqual(hostId.getId())
  })
  it("Should start the game with CPU players if there aren't enough", () => {})
  it('Should not allow a player to be addeed to a started game', () => {})
  it('Should allow a player to be removed from a started game, and bring that game back into a not started state', () => {})
  it('Should allow the host to leave and in that case it should destroy the created game and the pre game', () => {})

  // if a player is removed, it should pull the Game out of the live games and back into pregame state and show up in the lobby
  // it a the host leaves while the game is live, it should
})

export {}

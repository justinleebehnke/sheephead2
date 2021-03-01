import GameManager from '../GameManager'
import PlayerDTO from '../../../UseCase/PlayerDTO'

interface GameInfoDTO {
  hostId: string
  hostName: string
  players: PlayerDTO[] // then joinable games would require all Human Players...
  // what do I NEED to be able to ship that?
}

// basically we need host game to be live
// we need a button on the main screen that says, (play against computer)
// we need the GameListView/Presenter that allows you to view and join games
// we need the HostGamePresenter to only start game when there are 4 players joined otherwise the button is disabled
// we don't need the remove player stuff.

describe('Game Manager', () => {
  let gameManager: GameManager
  it('Should allow new games to be created', () => {
    expect(gameManager.getJoinableGames()).toEqual([{}])
  })
})

export {}

import IJoinableGamesPresenter from './IJoinableGamesPresenter'
import JoinableGameData from './JoinableGameData'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'
import ISubscriber from '../../../Entities/ISubscriber'
import ICommandInterface from '../../../InterfaceAdapters/ICommandInterface'
import IGameList from './IGameList'
import IGameListSubscriber from './IGameListSubscriber'
import GameData from '../../../Entities/GameManager/GameData'
import PlayerDTO from '../../../UseCase/PlayerDTO'

const NUM_PLAYERS = 4

class JoinableGamesPresenter implements IJoinableGamesPresenter, IGameListSubscriber {
  private view: ISubscriber | undefined

  constructor(
    private readonly lobbyCommand: ICommandInterface,
    private readonly gameList: IGameList
  ) {
    this.gameList.subscribe(this)
  }

  public gameListUpdated(): void {
    this.view?.update()
  }

  public setView(view: ISubscriber): void {
    this.view = view
  }

  public getJoinableGameData(): JoinableGameData[] {
    return this.gameList
      .getAllGames()
      .filter((game: GameData) => !game.isStarted && game.players.length < NUM_PLAYERS)
      .map((game: GameData) => {
        return {
          hostId: game.hostId,
          playerNames: game.players.map((player: PlayerDTO) => player.name),
        }
      })
  }

  public joinGame(hostId: UniqueIdentifier): void {
    throw new Error('Method not implemented.')
  }
}

export default JoinableGamesPresenter

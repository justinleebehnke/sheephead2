import IAppPresenter from './IAppPresenter'
import IGameManager from './IGameManager'
import IGameManagerSubscriber from './IGameManagerSubscriber'
import ILocalPlayerInfoManager from '../GameLobbyViews/LobbyEntranceView/ILocalPlayerInfoManager'
import ISubscriber from '../../Entities/ISubscriber'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

class AppPresenter implements IAppPresenter, IGameManagerSubscriber {
  private view: ISubscriber | undefined

  constructor(
    private readonly gameManager: IGameManager,
    private readonly localPlayerInfoManager: ILocalPlayerInfoManager
  ) {
    this.gameManager.subscribe(this)
  }

  public gameUpdated(): void {
    this.view?.update()
  }

  public setView(view: ISubscriber): void {
    this.view = view
  }

  public get isShowingLobby(): boolean {
    return !this.gameManager.getGameByPlayerId(
      new UniqueIdentifier(this.localPlayerInfoManager.getPlayerId())
    )
  }

  public get isShowingPreGameAsHost(): boolean {
    const game = this.gameManager.getGameByPlayerId(
      new UniqueIdentifier(this.localPlayerInfoManager.getPlayerId())
    )
    return (
      !!game &&
      game.hostId.equals(new UniqueIdentifier(this.localPlayerInfoManager.getPlayerId())) &&
      !game.isStarted
    )
  }

  public get isShowingPreGameAsNonHost(): boolean {
    const game = this.gameManager.getGameByPlayerId(
      new UniqueIdentifier(this.localPlayerInfoManager.getPlayerId())
    )
    return (
      !!game &&
      !game.hostId.equals(new UniqueIdentifier(this.localPlayerInfoManager.getPlayerId())) &&
      !game.isStarted
    )
  }

  public get isShowingGame(): boolean {
    const game = this.gameManager.getGameByPlayerId(
      new UniqueIdentifier(this.localPlayerInfoManager.getPlayerId())
    )
    return !!game && game.isStarted
  }
}

export default AppPresenter

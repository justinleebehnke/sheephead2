import IGameList from '../JoinableGamesView/IGameList'
import IGameListSubscriber from '../JoinableGamesView/IGameListSubscriber'
import ILocalPlayerInfoManager from '../LobbyEntranceView/ILocalPlayerInfoManager'
import ISubscriber from '../../../Entities/ISubscriber'
import PlayerData from '../../GamePlayViews/EndOfRoundReport/PlayerData'
import PlayerDTO from '../../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

class PreGamePresenter implements IGameListSubscriber {
  private view: ISubscriber | undefined

  constructor(
    private readonly gameList: IGameList,
    private readonly hostId: UniqueIdentifier,
    private readonly localPlayerInfoManager: ILocalPlayerInfoManager
  ) {
    this.gameList.subscribe(this)
  }

  public gameListUpdated(): void {
    this.view?.update()
  }

  public setView(view: ISubscriber): void {
    this.view = view
  }

  public getPlayers(): PlayerData[] {
    return this.gameList.getGameByHostId(this.hostId).players.map((playerData: PlayerDTO) => {
      return { id: playerData.id.getId(), name: playerData.name }
    })
  }

  public isHosting(): boolean {
    return this.hostId.equals(new UniqueIdentifier(this.localPlayerInfoManager.getPlayerId()))
  }
}

export default PreGamePresenter

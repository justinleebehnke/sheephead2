import ISubscriber from '../../../Entities/ISubscriber'
import PlayerDTO from '../../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'
import PlayerData from '../../GamePlayViews/EndOfRoundReport/PlayerData'
import IGameList from '../JoinableGamesView/IGameList'
import IGameListSubscriber from '../JoinableGamesView/IGameListSubscriber'

class PreGamePresenter implements IGameListSubscriber {
  private view: ISubscriber | undefined

  constructor(private readonly gameList: IGameList, private readonly hostId: UniqueIdentifier) {
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
}

export default PreGamePresenter

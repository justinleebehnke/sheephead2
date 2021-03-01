import ICommandInterface from '../../../InterfaceAdapters/ICommandInterface'
import ILobbyEntrancePresenter from './ILobbyEntrancePresenter'
import ILocalPlayerInfoManager from './ILocalPlayerInfoManager'
import INotifier from './INotifier'
import ISubscriber from '../../../Entities/ISubscriber'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

class LobbyEntrancePresenter implements ILobbyEntrancePresenter {
  private view: ISubscriber | undefined
  private localPlayerName: string
  private readonly localPlayerId: UniqueIdentifier

  constructor(
    private readonly playerInfoManager: ILocalPlayerInfoManager,
    private readonly userNotifier: INotifier,
    private readonly lobbyCommandInterface: ICommandInterface
  ) {
    this.localPlayerName = this.playerInfoManager.getPlayerName()

    const id = this.playerInfoManager.getPlayerId()
    if (this.isValidId(id)) {
      this.localPlayerId = new UniqueIdentifier(id)
    } else {
      this.localPlayerId = new UniqueIdentifier()
      this.playerInfoManager.setPlayerId(this.localPlayerId.getId())
    }
  }

  private isValidId(id: string): boolean {
    if (id) {
      try {
        new UniqueIdentifier(id)
      } catch (err) {
        return false
      }
      return true
    }
    return false
  }

  public getLocalPlayerName(): string {
    return this.localPlayerName
  }

  hostNewGame(): void {
    if (!this.localPlayerName) {
      this.userNotifier.notify('Please enter your name before hosting a game')
    } else {
      this.lobbyCommandInterface.giveCommand({
        name: 'hostNewGame',
        params: {
          hostId: this.localPlayerId.getId(),
          hostName: this.localPlayerName,
        },
      })
    }
  }

  public nameInputBlurred(): void {
    this.playerInfoManager.setPlayerName(this.localPlayerName)
  }

  public setLocalPlayerName(name: string): void {
    this.localPlayerName = name
    this.updateView()
  }

  private updateView(): void {
    if (this.view) {
      this.view.update()
    }
  }

  public setView(view: ISubscriber): void {
    this.view = view
  }
}

export default LobbyEntrancePresenter

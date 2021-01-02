import ICommandInterface from './ICommandInterface'
import HostNewGameCommand from './CommandTypes/HostNewGameCommand'
import IGameLobbyDataProvider from '../UseCase/IGameLobbyDataProvider'
import IGameData from '../UseCase/IGameData'
import ISubscriber from '../Entities/ISubscriber'
import PlayerDTO from '../UseCase/PlayerDTO'
import IGameLobbyPresenter from './IGameLobbyPresenter'
import RemovePlayerCommand from './CommandTypes/RemovePlayerCommand'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class GameLobbyPresenter implements IGameLobbyPresenter, ISubscriber {
  private commandInterface: ICommandInterface
  private localPlayer!: PlayerDTO
  private gameLobbyDataProvider: IGameLobbyDataProvider
  private view: ISubscriber | undefined

  constructor(commandInterface: ICommandInterface, gameLobbyDataProvider: IGameLobbyDataProvider) {
    this.commandInterface = commandInterface
    this.gameLobbyDataProvider = gameLobbyDataProvider
    this.commandInterface.watchForCommands()
    this.gameLobbyDataProvider.addSubscriber(this)
    this.createLocalPlayerFromLocalStorage()
  }

  private createLocalPlayerFromLocalStorage(): void {
    if (!localStorage.getItem('localPlayerId')) {
      localStorage.setItem('localPlayerId', new UniqueIdentifier().getId())
    }
    const id: string | null = localStorage.getItem('localPlayerId')

    if (id) {
      this.localPlayer = {
        getId: () => new UniqueIdentifier(id),
        getName: () => localStorage.getItem('localPlayerName') || '',
      }
    }
  }

  public getLocalPlayerName(): string {
    return this.localPlayer.getName()
  }

  public getLocalPlayerId(): UniqueIdentifier {
    return this.localPlayer.getId()
  }

  public setLocalPlayerName(newName: string): void {
    localStorage.setItem('localPlayerName', newName)
    this.createLocalPlayerFromLocalStorage()
  }

  isHostingGame(): boolean {
    return !!this.gameLobbyDataProvider.getGameByHostId(this.localPlayer.getId())
  }

  setView(gameLobbyView: ISubscriber): void {
    this.view = gameLobbyView
  }

  unSetView(): void {
    this.view = undefined
  }

  update(): void {
    this.view?.update()
  }

  public getJoinableGames(): IGameData[] {
    return this.gameLobbyDataProvider.getJoinableGames()
  }

  public leaveGame(): void {
    const command: RemovePlayerCommand = {
      name: 'removePlayer',
      params: {
        playerId: this.localPlayer.getId().getId(),
      },
    }
    this.commandInterface.giveCommand(command)
  }

  public hostNewGame(): void {
    const command: HostNewGameCommand = {
      name: 'hostNewGame',
      params: {
        hostId: this.localPlayer.getId().getId(),
        hostName: this.localPlayer.getName(),
      },
    }
    this.commandInterface.giveCommand(command)
  }
}

export default GameLobbyPresenter

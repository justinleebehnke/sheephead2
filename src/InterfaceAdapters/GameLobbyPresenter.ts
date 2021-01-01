import ICommandInterface from './ICommandInterface'
import HostNewGameCommand from './CommandTypes/HostNewGameCommand'
import IGameLobbyDataProvider from '../UseCase/IGameLobbyDataProvider'
import IGameData from '../UseCase/IGameData'
import ISubscriber from '../Entities/ISubscriber'
import PlayerDTO from '../UseCase/PlayerDTO'

class GameLobbyPresenter implements ISubscriber {
  private commandInterface: ICommandInterface
  private localPlayer: PlayerDTO
  private gameLobbyDataProvider: IGameLobbyDataProvider
  private view: ISubscriber | undefined

  constructor(
    localPlayer: PlayerDTO,
    commandInterface: ICommandInterface,
    gameLobbyDataProvider: IGameLobbyDataProvider
  ) {
    this.commandInterface = commandInterface
    this.localPlayer = localPlayer
    this.gameLobbyDataProvider = gameLobbyDataProvider
    this.commandInterface.watchForCommands()
    this.gameLobbyDataProvider.addSubscriber(this)
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

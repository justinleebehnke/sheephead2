import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import ICommandInterface from './ICommandInterface'
import HostNewGameCommand from './HostNewGameCommand'
import IGameLobbyDataProvider from '../UseCase/IGameLobbyDataProvider'
import IGameData from '../UseCase/IGameData'

class GameLobbyPresenter {
  private commandInterface: ICommandInterface
  private localPlayerId: UniqueIdentifier
  private gameLobbyDataProvider: IGameLobbyDataProvider

  constructor(
    localPlayerId: UniqueIdentifier,
    commandInterface: ICommandInterface,
    gameLobbyDataProvider: IGameLobbyDataProvider
  ) {
    this.commandInterface = commandInterface
    this.localPlayerId = localPlayerId
    this.gameLobbyDataProvider = gameLobbyDataProvider
  }

  public getJoinableGames(): IGameData[] {
    return this.gameLobbyDataProvider.getJoinableGames()
  }

  public hostNewGame(): void {
    const command: HostNewGameCommand = {
      name: 'hostNewGame',
      params: {
        playerId: this.localPlayerId.getId(),
      },
    }
    this.commandInterface.giveCommand(command)
  }
}

export default GameLobbyPresenter

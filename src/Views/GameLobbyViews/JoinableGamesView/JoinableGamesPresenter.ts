import AddPlayerToGameCommandDTO from '../../../InterfaceAdapters/CommandExecutor/LobbyCommands/LobbyCommandDTOs/AddPlayerToGameCommandDTO'
import GameData from '../../../Entities/GameManager/GameData'
import ICommandInterface from '../../../InterfaceAdapters/ICommandInterface'
import IGameList from './IGameList'
import IGameListSubscriber from './IGameListSubscriber'
import IJoinableGamesPresenter from './IJoinableGamesPresenter'
import ILocalPlayerInfoManager from '../LobbyEntranceView/ILocalPlayerInfoManager'
import ISubscriber from '../../../Entities/ISubscriber'
import JoinableGameData from './JoinableGameData'
import PlayerDTO from '../../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

const NUM_PLAYERS = 4

class JoinableGamesPresenter implements IJoinableGamesPresenter, IGameListSubscriber {
  private view: ISubscriber | undefined

  constructor(
    private readonly lobbyCommand: ICommandInterface,
    private readonly gameList: IGameList,
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
    const localPlayerId = this.localPlayerInfoManager.getPlayerId()
    const localPlayerName = this.localPlayerInfoManager.getPlayerName()

    const addPlayerCommand: AddPlayerToGameCommandDTO = {
      name: 'addPlayer',
      params: {
        hostId: hostId.getId(),
        playerId: localPlayerId,
        playerName: localPlayerName,
      },
    }

    this.lobbyCommand.giveCommand(addPlayerCommand)
  }
}

export default JoinableGamesPresenter

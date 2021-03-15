import AddPlayerToGameCommandDTO from '../../../InterfaceAdapters/CommandExecutor/LobbyCommands/LobbyCommandDTOs/AddPlayerToGameCommandDTO'
import GameData from '../../../Entities/GameManager/GameData'
import ICommandInterface from '../../../InterfaceAdapters/ICommandInterface'
import IGameManager from '../../../Entities/GameManager/IGameManager'
import IGameManagerSubscriber from '../../AppPresenter/IGameManagerSubscriber'
import IJoinableGamesPresenter from './IJoinableGamesPresenter'
import ILocalPlayerInfoManager from '../LobbyEntranceView/ILocalPlayerInfoManager'
import INotifier from '../LobbyEntranceView/INotifier'
import ISubscriber from '../../../Entities/ISubscriber'
import JoinableGameData from './JoinableGameData'
import PlayerDTO from '../../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

const NUM_PLAYERS = 4

class JoinableGamesPresenter implements IJoinableGamesPresenter, IGameManagerSubscriber {
  private view: ISubscriber | undefined

  constructor(
    private readonly lobbyCommand: ICommandInterface,
    private readonly gameList: IGameManager,
    private readonly localPlayerInfoManager: ILocalPlayerInfoManager,
    private readonly userNotifier: INotifier
  ) {
    this.gameList.subscribe(this)
  }

  public gameUpdated(): void {
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

  public joinGame(hostId: string): void {
    if (!UniqueIdentifier.isValidIdString(hostId)) {
      throw Error('Cannot join game because host id was invalid')
    }

    const hostIdAsId = new UniqueIdentifier(hostId)
    if (
      !this.getJoinableGameData().some((joinableGame: JoinableGameData) =>
        joinableGame.hostId.equals(hostIdAsId)
      )
    ) {
      throw Error('The game for that host id either is not joinable or does not exist')
    }

    const localPlayerId = this.localPlayerInfoManager.getPlayerId()
    if (!UniqueIdentifier.isValidIdString(localPlayerId)) {
      throw Error('Cannot join game because local player id is not valid')
    }
    const localPlayerName = this.localPlayerInfoManager.getPlayerName()
    if (!localPlayerName) {
      this.userNotifier.notify('Please enter your name before joining a game')
      return
    }

    const addPlayerCommand: AddPlayerToGameCommandDTO = {
      name: 'addPlayer',
      params: {
        hostId: hostId,
        playerId: localPlayerId,
        playerName: localPlayerName,
      },
    }

    this.lobbyCommand.giveCommand(addPlayerCommand)
  }
}

export default JoinableGamesPresenter

import { serverName } from '../../constants'
import CommandExecutor from '../../InterfaceAdapters/CommandExecutor/CommandExecutor'
import Fetcher from '../../Drivers/Fetcher'
import Game from '../../Entities/Game'
import GameCommandFactory from '../../InterfaceAdapters/CommandExecutor/GameCommands/GameCommandFactory'
import GameBoardModel from '../../InterfaceAdapters/GamePresenter/GameBoardModel'
import GameBoardPresenter from '../../InterfaceAdapters/GameBoardPresenter/GameBoardPresenter'
import IAppPresenter from './IAppPresenter'
import IGameBoardPresenter from '../GamePlayViews/IGameBoardPresenter'
import IGameManager from '../../Entities/GameManager/IGameManager'
import IGameManagerSubscriber from './IGameManagerSubscriber'
import ILocalPlayerInfoManager from '../GameLobbyViews/LobbyEntranceView/ILocalPlayerInfoManager'
import ISubscriber from '../../Entities/ISubscriber'
import OnlineMultiplayerGameCommandInterface from '../../InterfaceAdapters/OnlineMultiplayerGameCommandInterface/OnlineMultiplayerGameCommandInterface'
import Player from '../../Entities/Player'
import PlayerDTO from '../../UseCase/PlayerDTO'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

const PAUSE_DURATION_FOR_END_OF_TRICK = 4000
const POLLING_INTERVAL = 1000

const GAME_PATH = `${serverName}/game`

class AppPresenter implements IAppPresenter, IGameManagerSubscriber {
  private view: ISubscriber | undefined

  constructor(
    private readonly gameManager: IGameManager,
    private readonly localPlayerInfoManager: ILocalPlayerInfoManager
  ) {
    this.gameManager.subscribe(this)
  }

  public getGamePresenter(): IGameBoardPresenter {
    const gameData = this.gameManager.getGameByPlayerId(
      new UniqueIdentifier(this.localPlayerInfoManager.getPlayerId())
    )
    if (!gameData) {
      throw Error('hello')
    }
    const game: Game = new Game(
      gameData.players.map((player: PlayerDTO) => new Player(player.name, player.id)),
      gameData.config.firstDealerIndex,
      gameData.config.shuffleSeed
    )
    const commandInterface = new OnlineMultiplayerGameCommandInterface(
      POLLING_INTERVAL,
      new Fetcher(),
      GAME_PATH,
      gameData.hostId.getId(),
      new CommandExecutor(new GameCommandFactory(game))
    )
    return new GameBoardPresenter(
      commandInterface,
      new GameBoardModel(new UniqueIdentifier(this.localPlayerInfoManager.getPlayerId()), game),
      PAUSE_DURATION_FOR_END_OF_TRICK
    )
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

import ICommandInterface from './ICommandInterface'
import HostNewGameCommand from './CommandTypes/HostNewGameCommand'
import IGameLobbyDataProvider from '../UseCase/IGameLobbyDataProvider'
import IGameData from '../UseCase/IGameData'
import ISubscriber from '../Entities/ISubscriber'
import PlayerDTO from '../UseCase/PlayerDTO'
import IGameLobbyPresenter from './IGameLobbyPresenter'
import RemovePlayerCommand from './CommandTypes/RemovePlayerCommand'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import StartGameCommand from './CommandTypes/StartGameCommand'
import GamePresenter from './GamePresenter/GamePresenter'
import Game from '../Entities/Game'
import CPUPlayer from '../UseCase/CPUPlayer'
import LocalGameCommandInterface from './LocalGameCommandInterface'
import AddPlayerCommand from './CommandTypes/AddPlayerCommand'

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

  public getGamePresenter(): GamePresenter {
    const game = this.gameLobbyDataProvider.getGameByPlayerId(this.getLocalPlayerId())?.getGame()
    if (game) {
      const commandInterface: ICommandInterface = this.getGameCommandInterface(game)
      return new GamePresenter(
        commandInterface,
        this.getLocalPlayerId(),
        game,
        this.commandInterface
      )
    }
    throw Error('Game not found')
  }

  public joinGame(hostId: UniqueIdentifier): void {
    const command: AddPlayerCommand = {
      name: 'addPlayer',
      params: {
        playerId: this.getLocalPlayerId().getId(),
        playerName: this.getLocalPlayerName(),
        hostId: hostId.getId(),
      },
    }
    this.commandInterface.giveCommand(command)
  }

  private getGameCommandInterface(game: Game): ICommandInterface {
    const players = game.getPlayers()
    if (
      players.every(
        (player) =>
          player instanceof CPUPlayer || player.getId() === this.getLocalPlayerId().getId()
      )
    ) {
      return new LocalGameCommandInterface(game)
    }
    throw Error('Cannot start game with non CPU Players yet')
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
    this.update()
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

  isInStartedGame(): boolean {
    const game = this.gameLobbyDataProvider.getGameByPlayerId(this.localPlayer.getId())
    return game?.gameIsStarted() || false
  }

  isNotHostInGamePlayerThatHasNotYetStarted(): boolean {
    if (this.isInStartedGame()) {
      return false
    }
    if (this.isHostingGame()) {
      return false
    }
    return !!this.gameLobbyDataProvider.getGameByPlayerId(this.localPlayer.getId())
  }

  shouldRenderLobby(): boolean {
    return (
      !this.isHostingGame() &&
      !this.isInStartedGame() &&
      !this.isNotHostInGamePlayerThatHasNotYetStarted()
    )
  }

  shouldRenderHostGameSetupView(): boolean {
    return !this.isInStartedGame() && this.isHostingGame()
  }

  shouldRenderPlayerGameSetupView(): boolean {
    return this.isNotHostInGamePlayerThatHasNotYetStarted()
  }

  shouldRenderGameBoardView(): boolean {
    return this.isInStartedGame()
  }

  getJoinedGamePlayers(): PlayerDTO[] {
    const game = this.gameLobbyDataProvider.getGameByPlayerId(this.getLocalPlayerId())
    if (game) {
      return game.getPlayers()
    }
    return []
  }

  getJoinedGameNumber(): number {
    const game = this.gameLobbyDataProvider.getGameByPlayerId(this.getLocalPlayerId())
    if (game) {
      return game.getGameId()
    }
    return 0
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

  private getRandomNumberBetweenZeroAndMax(max: number): number {
    return Math.floor(Math.random() * max)
  }

  public startGame(firstDealerIndex: number): void {
    const command: StartGameCommand = {
      name: 'startGame',
      params: {
        firstDealerIndex:
          firstDealerIndex === -1 ? this.getRandomNumberBetweenZeroAndMax(4) : firstDealerIndex,
        hostId: this.localPlayer.getId().getId(),
        shuffleSeed: Date.now(),
      },
    }
    this.commandInterface.giveCommand(command)
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

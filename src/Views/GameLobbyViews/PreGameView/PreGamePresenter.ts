import ICommandInterface from '../../../InterfaceAdapters/ICommandInterface'
import IGameList from '../JoinableGamesView/IGameList'
import IGameListSubscriber from '../JoinableGamesView/IGameListSubscriber'
import ILocalPlayerInfoManager from '../LobbyEntranceView/ILocalPlayerInfoManager'
import ISubscriber from '../../../Entities/ISubscriber'
import PlayerData from '../../GamePlayViews/EndOfRoundReport/PlayerData'
import PlayerDTO from '../../../UseCase/PlayerDTO'
import RemovePlayerFromGameCommandDTO from '../../../InterfaceAdapters/CommandExecutor/LobbyCommands/LobbyCommandDTOs/RemovePlayerFromGameCommandDTO'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'
import StartGameCommandDTO from '../../../InterfaceAdapters/CommandExecutor/LobbyCommands/LobbyCommandDTOs/StartGameCommandDTO'
import IPreGamePresenter from './IPreGamePresenter'

class PreGamePresenter implements IGameListSubscriber, IPreGamePresenter {
  private view: ISubscriber | undefined
  private firstDealerIndex: number

  constructor(
    private readonly gameList: IGameList,
    private readonly hostId: UniqueIdentifier,
    private readonly localPlayerInfoManager: ILocalPlayerInfoManager,
    private readonly commandInterface: ICommandInterface
  ) {
    this.gameList.subscribe(this)
    this.firstDealerIndex = 0
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

  public get isHosting(): boolean {
    return this.hostId.equals(new UniqueIdentifier(this.localPlayerInfoManager.getPlayerId()))
  }

  public getDealerSelectDropDownData(): { value: number; displayedValue: string }[] {
    return [
      { value: 0, displayedValue: 'Host (You)' },
      { value: 1, displayedValue: 'Player 2' },
      { value: 2, displayedValue: 'Player 3' },
      { value: 3, displayedValue: 'Player 4' },
    ]
  }

  public setFirstDealerIndex(index: number): void {
    if (!this.isHosting) {
      throw Error('Only the host may set the dealer index')
    }
    if (index < 0 || index > 3) {
      throw Error('Value must be between 0 and 3')
    }
    this.firstDealerIndex = index
    this.view?.update()
  }

  public getFirstDealerIndex(): number {
    if (!this.isHosting) {
      throw Error('Only the host may read the index of the first dealer')
    }
    return this.firstDealerIndex
  }

  public removePlayer(playerId: string): any {
    if (!this.isHosting) {
      throw new Error('Only the host may remove a player')
    }

    const removePlayerCommand: RemovePlayerFromGameCommandDTO = {
      name: 'removePlayer',
      params: {
        hostId: this.hostId.getId(),
        playerId,
      },
    }
    this.commandInterface.giveCommand(removePlayerCommand)
  }

  public leaveGame(): void {
    const removePlayerCommand: RemovePlayerFromGameCommandDTO = {
      name: 'removePlayer',
      params: {
        hostId: this.hostId.getId(),
        playerId: this.localPlayerInfoManager.getPlayerId(),
      },
    }
    this.commandInterface.giveCommand(removePlayerCommand)
  }

  public startGame(): void {
    if (!this.isHosting) {
      throw new Error('Only the host may start the game')
    }
    const startGameCommand: StartGameCommandDTO = {
      name: 'startGame',
      params: {
        hostId: this.hostId.getId(),
        shuffleSeed: new Date(Date.now()).getTime(),
        firstDealerIndex: this.firstDealerIndex,
      },
    }
    this.commandInterface.giveCommand(startGameCommand)
  }
}

export default PreGamePresenter

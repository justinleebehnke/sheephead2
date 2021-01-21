import Card from '../../Entities/Card'
import EndOfRoundData from '../../Entities/Round/EndOfRoundReportData'
import ICommandInterface from '../ICommandInterface'
import IReadOnlyGameModel from '../../Entities/ReadOnlyEntities/IReadOnlyGameModel'
import IReadOnlyRound from '../../Entities/ReadOnlyEntities/IReadOnlyRound'
import ISubscriber from '../../Entities/ISubscriber'
import Player from '../../Entities/Player'
import PlayerLayoutData from './PlayerLayoutData'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import RemovePlayerCommand from '../CommandTypes/RemovePlayerCommand'

class GamePresenter implements ISubscriber {
  private commandInterface: ICommandInterface
  private localPlayerId: UniqueIdentifier
  private view: ISubscriber | undefined
  private game: IReadOnlyGameModel
  private _isLoading: boolean
  private lobbyInterface: ICommandInterface

  constructor(
    commandInterface: ICommandInterface,
    localPlayerId: UniqueIdentifier,
    game: IReadOnlyGameModel,
    lobbyInterface: ICommandInterface
  ) {
    this.lobbyInterface = lobbyInterface
    this.commandInterface = commandInterface
    this.localPlayerId = localPlayerId
    this.game = game
    this.game.addSubscriber(this)
    this._isLoading = false
  }

  public leaveGame(): void {
    const removePlayer: RemovePlayerCommand = {
      name: 'removePlayer',
      params: {
        playerId: this.localPlayerId.getId(),
      },
    }
    this.lobbyInterface.giveCommand(removePlayer)
  }

  public setView(view: ISubscriber): void {
    this.view = view
    this.commandInterface.start()
  }

  public unsetView(): void {
    this.view = undefined
  }

  public isLoading(): boolean {
    return this._isLoading
  }

  public update(): void {
    this._isLoading = false
    this.view?.update()
  }

  public pass(): void {
    this._isLoading = true
    this.commandInterface.giveCommand({
      name: 'pass',
      params: {
        date: Date.now(),
      },
    })
  }

  public pick(): void {
    this.game.pick()
    this.view?.update()
  }

  public bury(cards: string[]): void {
    this._isLoading = true
    this.commandInterface.giveCommand({
      name: 'bury',
      params: {
        cards,
      },
    })
  }

  public play(card: string): void {
    this._isLoading = true
    this.commandInterface.giveCommand({
      name: 'play',
      params: {
        card,
      },
    })
  }

  public playAgain(): void {
    this._isLoading = true
    this.commandInterface.giveCommand({
      name: 'playAgain',
      params: {
        playerId: this.localPlayerId,
      },
    })
  }

  public getHand(): string[] {
    const localPlayer: Player | undefined = this.game.getPlayerById(this.localPlayerId)
    if (localPlayer) {
      return localPlayer.getPlayableCardIds()
    }
    return []
  }

  public getPlayableCardIds(): Set<string> {
    const localPlayer: Player | undefined = this.game.getPlayerById(this.localPlayerId)
    const leadCard: Card | undefined = this.game.getCurrentRound()?.getCurrentTrick().getLeadCard()
    if (localPlayer) {
      return new Set(localPlayer.getPlayableCardIds(leadCard))
    }
    let res: Set<string> = new Set()
    return res
  }

  public getDataForPlayerToLeft(): PlayerLayoutData {
    const localPlayerIndex = this.game.getIndexOfPlayerById(this.localPlayerId)
    return this.getDataForPlayer(this.game.getNextIndex(localPlayerIndex))
  }

  public getDataForPlayerToRight(): PlayerLayoutData {
    const localPlayerIndex = this.game.getIndexOfPlayerById(this.localPlayerId)
    const indexOfPlayerToTheLeft = this.game.getNextIndex(localPlayerIndex)
    const indexOfPlayerAcross = this.game.getNextIndex(indexOfPlayerToTheLeft)
    return this.getDataForPlayer(this.game.getNextIndex(indexOfPlayerAcross))
  }

  public getDataForPlayerAcross(): PlayerLayoutData {
    const localPlayerIndex = this.game.getIndexOfPlayerById(this.localPlayerId)
    const indexOfPlayerToTheLeft = this.game.getNextIndex(localPlayerIndex)
    return this.getDataForPlayer(this.game.getNextIndex(indexOfPlayerToTheLeft))
  }

  public getPickerIndex(): number | undefined {
    return this.game.getCurrentRound()?.getIndexOfPicker()
  }

  public getPlayers(): Player[] {
    return [
      this.game.getPlayerByIndex(0),
      this.game.getPlayerByIndex(1),
      this.game.getPlayerByIndex(2),
      this.game.getPlayerByIndex(3),
    ]
  }

  public getEndOfRoundReport(): EndOfRoundData | undefined {
    return this.game.getCurrentRound()?.getEndOfRoundReport()
  }

  public getDataForLocalPlayer(): PlayerLayoutData {
    return this.getDataForPlayer(this.game.getIndexOfPlayerById(this.localPlayerId))
  }

  public isShowingPassOrPickForm(): boolean {
    return this.isChoosingWhetherToPassOrPick()
  }

  private isChoosingWhetherToPassOrPick(): boolean {
    const round = this.game.getCurrentRound()
    if (round) {
      return (
        this.isLocalPlayersTurn() &&
        (round.isFindingPickerState() || round.isPickerHasNotBuriedState())
      )
    }
    return false
  }

  public isPicking(): boolean {
    return (
      (this.isLocalPlayersTurn() && this.game.getCurrentRound()?.isPickerHasNotBuriedState()) ||
      false
    )
  }

  public isShowEndOfRoundReport(): boolean {
    const round = this.game.getCurrentRound()
    return round?.isOver() || false
  }

  private isLocalPlayersTurn(): boolean {
    return (
      this.localPlayerId.getId() === this.game.getCurrentRound()?.getCurrentTurnPlayer()?.getId()
    )
  }

  private getDataForPlayer(index: number): PlayerLayoutData {
    const player = this.game.getPlayerByIndex(index)
    const round: IReadOnlyRound | null = this.game.getCurrentRound()

    if (round) {
      const chosenCard = round
        .getCurrentTrick()
        .getTrickData()
        .cards.find((card) => card.playedByPlayerId === player.getId())?.cardId

      return {
        name: player.getName(),
        isTurn: round.getIndexOfCurrentTurn() === index,
        isDealer: round.getIndexOfDealer() === index,
        isPicker: round.getIndexOfPicker() === index,
        cardPlayed: chosenCard
          ? chosenCard
          : round.getIndexOfCurrentTurn() === index
          ? 'turn'
          : 'none',
      }
    }
    return {
      name: player.getName(),
      isTurn: false,
      isDealer: false,
      isPicker: false,
      cardPlayed: 'none',
    }
  }
}

export default GamePresenter

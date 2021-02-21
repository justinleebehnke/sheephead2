import Card from '../../Entities/Card'
import EndOfRoundData from '../../Entities/Round/EndOfRoundReportData'
import GameBoardViewData from '../../Views/GamePlayViews/GameBoardViewData'
import ICommandInterface from '../ICommandInterface'
import IGameBoardPresenter from '../../Views/GamePlayViews/IGameBoardPresenter'
import IReadOnlyGameModel from '../../Entities/ReadOnlyEntities/IReadOnlyGameModel'
import IReadOnlyRound from '../../Entities/ReadOnlyEntities/IReadOnlyRound'
import ISubscriber from '../../Entities/ISubscriber'
import Player from '../../Entities/Player'
import PlayerData from '../../Views/GamePlayViews/EndOfRoundReport/PlayerData'
import PlayerLayoutData from './PlayerLayoutData'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'

class GamePresenter implements ISubscriber, IGameBoardPresenter {
  private commandInterface: ICommandInterface
  private localPlayerId: UniqueIdentifier
  private view: ISubscriber | undefined
  private game: IReadOnlyGameModel
  private _isLoading: boolean

  constructor(
    commandInterface: ICommandInterface,
    localPlayerId: UniqueIdentifier,
    game: IReadOnlyGameModel
  ) {
    this.commandInterface = commandInterface
    this.localPlayerId = localPlayerId
    this.game = game
    this.game.addSubscriber(this)
    this._isLoading = false
  }

  public setView(view: ISubscriber): void {
    this.view = view
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

  public getGameBoardViewData(): GameBoardViewData {
    return {
      allPlayerData: {
        dataForLocalPlayer: this.getDataForLocalPlayer(),
        dataForPlayerAcross: this.getDataForPlayerAcross(),
        dataForPlayerToLeft: this.getDataForPlayerToLeft(),
        dataForPlayerToRight: this.getDataForPlayerToRight(),
      },
      passOrPickViewData: {
        isPicking: this.isPicking(),
        isShowingPassOrPickForm: this.isShowingPassOrPickForm(),
        hand: this.getHand(),
      },
      handViewData: {
        isTurn: this.getDataForLocalPlayer().isTurn,
        playableCardIds: Array.from(this.getPlayableCardIds()),
        hand: this.getHand(),
      },
      endOfRoundViewData: {
        players: this.getPlayersData(),
        pickerIndex: this.getPickerIndex(),
        endOfRoundReport: this.getEndOfRoundReport(),
      },
    }
  }

  public pass(): void {
    this._isLoading = true
    this.commandInterface.giveCommand({
      name: 'pass',
      params: null,
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

  public getPlayersData(): PlayerData[] {
    return this.getPlayers().map((player: Player) => {
      return {
        name: player.getName(),
        id: player.getId(),
      }
    })
  }

  public getEndOfRoundReport(): EndOfRoundData | undefined {
    return this.isShowEndOfRoundReport()
      ? this.game.getCurrentRound()?.getEndOfRoundReport()
      : undefined
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

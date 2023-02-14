import Card from '../../Entities/Card'
import EndOfRoundData from '../../Entities/Round/EndOfRoundReportData'
import IReadOnlyGameModel from '../../GameEntityInterfaces/ReadOnlyEntities/IReadOnlyGameModel'
import IReadOnlyRound from '../../GameEntityInterfaces/ReadOnlyEntities/IReadOnlyRound'
import ISubscriber from '../../Entities/ISubscriber'
import Player from '../../Entities/Player'
import PlayerDataWithWinnings from '../../Views/GamePlayViews/EndOfRoundReport/PlayerDataWithWinnings'
import PlayerLayoutData from './PlayerLayoutData'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import IGameBoardModel from '../IGameBoardModel'

class GameBoardModel implements ISubscriber, IGameBoardModel {
  private localPlayerId: UniqueIdentifier
  private subscriber: ISubscriber | undefined
  private game: IReadOnlyGameModel

  constructor(localPlayerId: UniqueIdentifier, game: IReadOnlyGameModel) {
    this.localPlayerId = localPlayerId
    this.game = game
    this.game.addSubscriber(this)
  }

  public getPlayersNotReady(): string[] {
    return this.game.getPlayersNotReady()
  }
  public getNumHandsCompleted(): number {
    return this.game.getNumHandsCompleted()
  }
  public isHandOfDoubles(): boolean {
    return this.game.isHandOfDoubles()
  }

  public addSubscriber(subscriber: ISubscriber): void {
    this.subscriber = subscriber
  }

  public removeSubscriber(): void {
    this.subscriber = undefined
  }

  public update(): void {
    this.subscriber?.update()
  }

  public getHand(): string[] {
    const localPlayer: Player | undefined = this.game.getPlayerById(this.localPlayerId)
    if (localPlayer) {
      return localPlayer.getPlayableCardIds()
    }
    return []
  }

  public getPlayableCardIds(): string[] {
    const localPlayer: Player | undefined = this.game.getPlayerById(this.localPlayerId)
    const leadCard: Card | undefined = this.game.getCurrentRound()?.getCurrentTrick().getLeadCard()
    if (localPlayer) {
      return localPlayer.getPlayableCardIds(leadCard)
    }
    return []
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

  public getPlayersData(): PlayerDataWithWinnings[] {
    return this.getPlayers().map((player: Player) => {
      return {
        name: player.getName(),
        id: player.getId(),
        totalCentsWon: player.totalCentsWon,
        currentHandCentsWon: player.currentHandCentsWon,
      }
    })
  }

  public getEndOfRoundReport(): EndOfRoundData | undefined {
    return this.isShowEndOfRoundReport()
      ? this.game.getCurrentRound()?.getEndOfRoundReport()
      : undefined
  }

  public getDataForLocalPlayer(): PlayerLayoutData {
    const localPlayer = this.getDataForPlayer(this.game.getIndexOfPlayerById(this.localPlayerId))
    localPlayer.name += ' (You)'
    return localPlayer
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

      const lastCard = round
        .getPreviousTrickCardData()
        .find((card) => card.playedByPlayerId === player.getId())?.cardId

      return {
        lastCardPlayed: lastCard ?? null,
        name: player.getName(),
        isTurn: round.getIndexOfCurrentTurn() === index,
        isDealer: round.getIndexOfDealer() === index,
        isPicker: round.getIndexOfPicker() === index,
        isGoingAlone: round.getIndexOfPicker() === index && round.pickerIsGoingAlone,
        cardPlayed: chosenCard
          ? chosenCard
          : round.getIndexOfCurrentTurn() === index
          ? 'turn'
          : 'none',
      }
    }
    return {
      lastCardPlayed: null,
      name: player.getName(),
      isTurn: false,
      isDealer: false,
      isPicker: false,
      cardPlayed: 'none',
      isGoingAlone: false,
    }
  }
}

export default GameBoardModel

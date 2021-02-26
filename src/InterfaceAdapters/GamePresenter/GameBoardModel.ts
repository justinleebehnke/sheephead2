import Card from '../../Entities/Card'
import EndOfRoundData from '../../Entities/Round/EndOfRoundReportData'
import IReadOnlyGameModel from '../../Entities/ReadOnlyEntities/IReadOnlyGameModel'
import IReadOnlyRound from '../../Entities/ReadOnlyEntities/IReadOnlyRound'
import ISubscriber from '../../Entities/ISubscriber'
import Player from '../../Entities/Player'
import PlayerData from '../../Views/GamePlayViews/EndOfRoundReport/PlayerData'
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

  public addSubscriber(subscriber: ISubscriber): void {
    this.subscriber = subscriber
  }

  public removeSubscriber(): void {
    this.subscriber = undefined
  }

  public update(): void {
    this.subscriber?.update()
  }

  public pick(): void {
    this.game.pick()
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

export default GameBoardModel
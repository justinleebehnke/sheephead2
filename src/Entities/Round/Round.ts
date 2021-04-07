import Card from '../Card'
import Deck from '../Deck'
import EndOfRoundData from './EndOfRoundReportData'
import FindingPickerState from './FindingPickerState'
import ICardRanker from '../ICardRanker'
import IObservable from '../IObservable'
import IReadOnlyRound from '../../GameEntityInterfaces/ReadOnlyEntities/IReadOnlyRound'
import IRound from '../../GameEntityInterfaces/IRound'
import IRoundState from './IRoundState'
import IShuffleSeedManager from './IShuffleSeedManager'
import ISubscriber from '../ISubscriber'
import PickerHasNotBuriedState from './PickerHasNotBuriedState'
import Player from '../Player'
import Trick from '../Trick'

class Round implements IRoundState, IRound, IObservable, IReadOnlyRound {
  private players: Player[]
  private indexOfDealer: number
  private indexOfCurrentTurn: number
  private blind: Card[]
  private context: IRoundState
  private _bury: Card[]
  private cardRanker: ICardRanker
  private currentTrick: Trick
  private pickerIndex: number
  private _isOver: boolean
  private subscribers: ISubscriber[]

  constructor(
    players: Player[],
    indexOfDealer: number,
    private readonly shuffleSeedManager: IShuffleSeedManager,
    cardRanker: ICardRanker
  ) {
    this.players = players
    this.indexOfDealer = indexOfDealer
    this.indexOfCurrentTurn = this.getIndexOfNextPlayer(this.indexOfDealer)
    this.blind = []
    this.pickerIndex = -1
    this._bury = []
    this.cardRanker = cardRanker
    this.context = new FindingPickerState(this)
    this.currentTrick = new Trick(-1)
    this._isOver = false
    this.subscribers = []
    this.deal()
  }

  public getIndexOfPicker(): number {
    return this.getPickerIndex()
  }

  public isPickerHasNotBuriedState(): boolean {
    return this.context instanceof PickerHasNotBuriedState
  }

  public isFindingPickerState(): boolean {
    return this.context instanceof FindingPickerState
  }

  public addSubscriber(newSubscriber: ISubscriber): void {
    this.subscribers.push(newSubscriber)
  }

  public removeSubscriber(subscriberToRemove: ISubscriber): void {
    this.subscribers = this.subscribers.filter((subscriber) => subscriber !== subscriberToRemove)
  }

  public notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => subscriber.update())
  }

  pass(): void {
    this.context.pass()
  }

  pick(): void {
    this.context.pick()
  }

  bury(cardA: Card, cardB: Card): void {
    this.context.bury(cardA, cardB)
  }

  play(card: Card): void {
    this.context.play(card)
  }

  public getIndexOfPlayerById(id: string): number {
    return this.players.findIndex((player) => player.getId() === id)
  }

  getEndOfRoundReport(): EndOfRoundData {
    return this.context.getEndOfRoundReport()
  }

  public getCurrentTrick(): Trick {
    return this.currentTrick
  }

  public setCurrentTrick(trick: Trick): void {
    this.currentTrick = trick
  }

  public getIndexOfDealer(): number {
    return this.indexOfDealer
  }

  public getIndexOfCurrentTurn(): number {
    return this.indexOfCurrentTurn
  }

  public getPickerIndex(): number {
    return this.pickerIndex
  }

  public setPickerIndex(index: number): void {
    this.pickerIndex = index
  }

  public setIndexOfCurrentTurn(index: number): void {
    this.indexOfCurrentTurn = index
  }

  public getPlayers(): Player[] {
    return this.players
  }

  public getNumPlayers(): number {
    return this.players.length
  }

  public getCurrentTurnPlayer(): Player {
    return this.players[this.getIndexOfCurrentTurn()] || null
  }

  public isOver(): boolean {
    return this._isOver
  }

  public markAsOver(): void {
    this._isOver = true
  }

  public setBury(bury: Card[]): void {
    this._bury = bury
  }

  public getBury(): Card[] {
    return this._bury
  }

  public getBlind(): Card[] {
    return this.blind
  }

  public setBlind(cards: Card[]): void {
    this.blind = cards
  }

  public setContext(state: IRoundState): void {
    this.context = state
  }

  public nextTurn(): void {
    this.indexOfCurrentTurn = this.getIndexOfNextPlayer(this.indexOfCurrentTurn)
    this.notifySubscribers()
  }

  public reDeal(): void {
    this.shuffleSeedManager.changeShuffleSeed()
    this.removeAllCards()
    this.deal()
  }

  private removeAllCards(): void {
    this.players.forEach((player) => player.clearCards())
    this.blind = []
    this._bury = []
  }

  private deal(): void {
    const deck = new Deck(this.cardRanker)
    deck.shuffle(this.shuffleSeedManager.getShuffleSeed())

    this.giveEachPlayerThreeCards(deck)
    this.blind.push(deck.getNextCard())
    this.blind.push(deck.getNextCard())
    this.giveEachPlayerThreeCards(deck)
    this.indexOfCurrentTurn = this.getIndexOfNextPlayer(this.indexOfDealer)
    this.context = new FindingPickerState(this)
    this.notifySubscribers()
  }

  private giveEachPlayerThreeCards(deck: Deck): void {
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i]
      player.giveCard(deck.getNextCard())
      player.giveCard(deck.getNextCard())
      player.giveCard(deck.getNextCard())
    }
  }

  public getIndexOfNextPlayer(playerIndex: number): number {
    if (playerIndex === this.players.length - 1) {
      return 0
    }
    return playerIndex + 1
  }
}

export default Round

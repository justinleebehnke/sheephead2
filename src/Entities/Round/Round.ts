import Card from '../Card'
import Deck from '../Deck'
import EndOfRoundData from './EndOfRoundReportData'
import FindingPickerState from './FindingPickerState'
import ICardRanker from '../ICardRanker'
import IRoundState from './IRoundState'
import Player from '../Player'
import Trick from '../Trick'

class Round implements IRoundState {
  private players: Player[]
  private indexOfDealer: number
  private indexOfCurrentTurn: number
  private blind: Card[]
  private shuffleSeed: number
  private context: IRoundState
  private _bury: Card[]
  private cardRanker: ICardRanker
  private currentTrick: Trick
  private pickerIndex: number
  private _isOver: boolean

  constructor(
    players: Player[],
    indexOfDealer: number,
    shuffleSeed: number,
    cardRanker: ICardRanker
  ) {
    this.players = players
    this.indexOfDealer = indexOfDealer
    this.indexOfCurrentTurn = this.getIndexOfNextPlayer(this.indexOfDealer)
    this.blind = []
    this.pickerIndex = -1
    this._bury = []
    this.shuffleSeed = shuffleSeed
    this.cardRanker = cardRanker
    this.context = new FindingPickerState(this)
    this.currentTrick = new Trick(-1)
    this._isOver = false
    this.deal()
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
  }

  public reDeal(): void {
    this.shuffleSeed++
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
    deck.shuffle(this.shuffleSeed)

    this.giveEachPlayerThreeCards(deck)
    this.blind.push(deck.getNextCard())
    this.blind.push(deck.getNextCard())
    this.giveEachPlayerThreeCards(deck)
    this.indexOfCurrentTurn = this.getIndexOfNextPlayer(this.indexOfDealer)
    this.context = new FindingPickerState(this)
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

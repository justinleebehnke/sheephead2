import BellePlaineRulesCardRanker from './BellePlaineRulesCardRanker'
import IReadOnlyGameModel from '../GameEntityInterfaces/ReadOnlyEntities/IReadOnlyGameModel'
import IShuffleSeedManager from './Round/IShuffleSeedManager'
import ISubscriber from './ISubscriber'
import Player from './Player'
import QuartersPlayerPayer from '../Payment/QuartersPlayerPayer'
import Round from './Round/Round'
import RoundTeamOutcomeGetter from '../RoundOutcomeDeterminer/RoundTeamOutcomeGetter'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class Game implements ISubscriber, IReadOnlyGameModel, IShuffleSeedManager {
  private players: Player[]
  private currentDealer: number
  private currentRound: Round | null
  private subscribers: ISubscriber[]
  private shuffleSeed: number
  private readonly idsOfPlayersThatAreReadyToPlayAgain: Set<string>

  public constructor(players: Player[], dealerIndex: number, shuffleSeed: number) {
    this.players = players
    this.currentDealer = dealerIndex
    this.currentRound = null
    this.subscribers = []
    this.shuffleSeed = shuffleSeed
    this.idsOfPlayersThatAreReadyToPlayAgain = new Set()
    if (players.length === 4) {
      this.playRound()
    }
  }

  public changeShuffleSeed(): void {
    this.shuffleSeed++
  }

  public getShuffleSeed(): number {
    return this.shuffleSeed
  }

  public addSubscriber(newSubscriber: ISubscriber): void {
    this.subscribers.push(newSubscriber)
  }

  public removeSubscriber(subscriberToRemove: ISubscriber): void {
    this.subscribers = this.subscribers.filter((subscriber) => subscriber !== subscriberToRemove)
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => subscriber.update())
  }

  public update(): void {
    this.notifySubscribers()
  }

  public getIndexOfPlayerById(id: UniqueIdentifier): number {
    return this.players.findIndex((player) => player.getId() === id.getId())
  }

  public getNextIndex(index: number): number {
    if (index === 3) {
      return 0
    }
    return index + 1
  }

  public getPlayerByIndex(index: number): Player {
    return this.players[index]
  }

  public updateSubscribers(): void {
    this.notifySubscribers()
  }

  public addPlayer(player: Player): void {
    this.players.push(player)
    if (this.players.length === 4) {
      this.playRound()
    }
  }

  public getPlayerById(id: UniqueIdentifier): Player {
    const playerWithMatchingId: Player | undefined = this.players.find(
      (player) => player.getId() === id.getId()
    )
    if (playerWithMatchingId === undefined) {
      throw Error(`Could not find a player with Id: ${id.getId()}`)
    }
    return playerWithMatchingId
  }

  private playRound(): void {
    this.players.forEach((player) => {
      player.clearCards()
      player.transferRoundWinningsToTotalWinnings()
    })
    this.changeShuffleSeed()
    this.currentRound = new Round(
      this.players,
      this.currentDealer,
      this,
      new BellePlaineRulesCardRanker(),
      new QuartersPlayerPayer(new RoundTeamOutcomeGetter())
    )
    this.currentRound.addSubscriber(this)
    this.notifySubscribers()
  }

  public playAgain(playerId: UniqueIdentifier): void {
    this.idsOfPlayersThatAreReadyToPlayAgain.add(playerId.getId())
    if (this.idsOfPlayersThatAreReadyToPlayAgain.size === this.players.length) {
      this.idsOfPlayersThatAreReadyToPlayAgain.clear()
      this.currentRound?.removeSubscriber(this)
      this.setNextDealer()
      this.playRound()
    }
  }

  private setNextDealer(): void {
    if (this.currentDealer === this.players.length - 1) {
      this.currentDealer = 0
    } else {
      this.currentDealer++
    }
  }

  public getCurrentRound(): Round | null {
    return this.currentRound
  }
}

export default Game

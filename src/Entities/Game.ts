import BellePlaineRulesCardRanker from './BellePlaineRulesCardRanker'
import Player from './Player'
import Round from './Round/Round'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import ISubscriber from '../UseCase/ISubscriber'

class Game implements ISubscriber {
  private players: Player[]
  private currentDealer: number
  private currentRound: Round | null
  private subscribers: ISubscriber[]
  private shuffleSeed: number

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

  public constructor(players: Player[], dealerIndex: number, shuffleSeed: number) {
    this.players = players
    this.currentDealer = dealerIndex
    this.currentRound = null
    this.subscribers = []
    this.shuffleSeed = shuffleSeed
    if (players.length === 4) {
      this.playRound()
    }
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
    this.players.forEach((player) => player.clearCards())
    this.currentRound = new Round(
      this.players,
      this.currentDealer,
      this.shuffleSeed++,
      new BellePlaineRulesCardRanker()
    )
    this.currentRound.addSubscriber(this)
    this.notifySubscribers()
  }

  public playAnotherRound(): void {
    this.currentRound?.removeSubscriber(this)
    this.setNextDealer()
    this.playRound()
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

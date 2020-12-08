import BellePlaineRulesCardRanker from './BellePlaineRulesCardRanker'
import Player from './Player'
import Round from './Round/Round'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

class Game {
  private players: Player[]
  private currentDealer: number
  private currentRound: Round | null

  public constructor(players: Player[], dealerIndex: number) {
    this.players = players
    this.currentDealer = dealerIndex
    this.currentRound = null
  }

  public addPlayer(name: string, id: UniqueIdentifier) {
    this.players.push(new Player(name, id))
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
      Date.now(),
      new BellePlaineRulesCardRanker()
    )
  }

  public playAnotherRound(): void {
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

import Game from '../Entities/Game'
import ICardRanker from '../Entities/ICardRanker'
import Player from '../Entities/Player'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import ISubscriber from './ISubscriber'
import Round from '../Entities/Round/Round'

/*
Some ideas:
When deciding whether to pick:
-> The two high Queens and are leading or on the end.
-> Any two Queens plus another trump, plus some points to bury.
-> Any Queen plus another 3 trump, plus some points to bury.
-> Any 5 trump.

When deciding what to bury:
  -> Bury as many points as possible

Are you leading?
Are you the picker/partner? -> Lead With Trump
ELSE -> Lead with lowest point cards 

When deciding what to play:
1. Has anyone from my team played yet? Yes / No / Not Sure
  Yes -> Go to 1a
  No or Not Sure -> go to 2.
  1a. Will my any of my team probably win the trick? Yes / No
    Yes -> Play the highest point value card you can
    No -> Continue
  1b. Will my team probably lose the trick? Yes / No
    Yes -> Play the lowest point value card you can
    No -> Continue

4. Can I probably win the trick? Yes / No
  Yes -> Play the highest ranking card
  No -> Continue

6. Will I probably lose the trick? Yes / No
  Yes -> Play the lowest point value card that you can
  No -> Continue

7. Schmeer, 60% of the time it's the right move

*/
class CPUPlayer extends Player implements ISubscriber {
  private game: Game
  private cardRanker: ICardRanker
  constructor(name: string, id: UniqueIdentifier, game: Game, cardRanker: ICardRanker) {
    super(name, id)
    this.game = game
    this.game.addSubscriber(this)
    this.cardRanker = cardRanker
  }

  public update(): void {
    if (this.isTurn()) {
      this.takeTurn()
    }
  }

  private isTurn(): boolean {
    return this.game.getCurrentRound()?.getCurrentTurnPlayer()?.getId() === this.getId()
  }

  private takeTurn(): void {
    if (this.isPickerState()) {
      this.shouldPick() ? this.pick() : this.pass()
    } else {
      this.play()
    }
  }

  private isPickerState(): boolean {
    return this.game.getCurrentRound()?.isFindingPickerState() || false
  }

  private shouldPick(): boolean {
    return true
  }

  private pick(): void {
    const round = this.game.getCurrentRound()
    if (round) {
      round.pick()
      this.bury(round)
    }
  }

  private bury(round: Round): void {
    const player = round.getCurrentTurnPlayer()
    const playableCards = player.getPlayableCardIds()
    const highestValueCardId = this.getHighestValueCardId(playableCards)
    const secondHighestValueCardId = this.getHighestValueCardId(
      playableCards.filter((cardId: string) => cardId !== highestValueCardId)
    )
    round.bury(
      player.removeCardFromHand(highestValueCardId),
      player.removeCardFromHand(secondHighestValueCardId)
    )
  }

  private pass(): void {
    const round = this.game.getCurrentRound()
    if (round) {
      round.pass()
    }
  }

  private play(): void {
    const round = this.game.getCurrentRound()
    if (round) {
      const player = round.getCurrentTurnPlayer()
      if (player) {
        const playableCards = player.getPlayableCardIds()
        round.play(player.removeCardFromHand(playableCards[0]))
      }
    }
  }

  private getHighestValueCardId(cardIds: string[]): string {
    const highestPointValue = Math.max(
      ...cardIds.map((cardId) => this.cardRanker.getPointValue(cardId))
    )
    const result = cardIds.find(
      (cardId) => this.cardRanker.getPointValue(cardId) === highestPointValue
    )
    if (result) {
      return result
    }
    throw Error(`Could not find card with value: "${highestPointValue}"`)
  }
}

export default CPUPlayer

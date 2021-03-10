import BuryCommandDTO from '../InterfaceAdapters/CommandExecutor/GameCommands/GameCommandDTOs/BuryCommandDTO'
import IReadOnlyGameModel from '../Entities/ReadOnlyEntities/IReadOnlyGameModel'
import IReadOnlyRound from '../Entities/ReadOnlyEntities/IReadOnlyRound'
import ICardRanker from '../Entities/ICardRanker'
import ICommandInterface from '../InterfaceAdapters/ICommandInterface'
import PlayCommandDTO from '../InterfaceAdapters/CommandExecutor/GameCommands/GameCommandDTOs/PlayCommandDTO'
import Player from '../Entities/Player'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'
import ISubscriber from '../Entities/ISubscriber'

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
  private game: IReadOnlyGameModel
  private cardRanker: ICardRanker
  private commandInterface: ICommandInterface
  private alreadyReportedReadiness: boolean

  constructor(
    name: string,
    id: UniqueIdentifier,
    game: IReadOnlyGameModel,
    cardRanker: ICardRanker,
    commandInterface: ICommandInterface
  ) {
    super(name, id)
    this.game = game
    this.game.addSubscriber(this)
    this.cardRanker = cardRanker
    this.commandInterface = commandInterface
    this.alreadyReportedReadiness = false
  }

  public update(): void {
    if (this.isRoundOver()) {
      this.reportReadiness()
    }
    if (this.isTurn()) {
      this.alreadyReportedReadiness = false
      // this is a hack to solve a problem I don't understand
      // without this fake pause, the CPU players will all try to play out of turn
      // somehow the update is being triggered during someone's turn and then immediately being triggered again making it someone elses turn
      new Promise((r) => setTimeout(r, 0)).then(() => {
        if (this.isTurn()) {
          this.takeTurn()
        } else {
          console.log('NOT MY TURN ANYMORE', this.getName())
        }
      })
    }
  }

  private isRoundOver(): boolean {
    return this.game.getCurrentRound()?.isOver() || false
  }

  private reportReadiness(): void {
    if (!this.alreadyReportedReadiness) {
      this.commandInterface.giveCommand({
        name: 'playAgain',
        params: {
          playerId: this.getId(),
        },
      })
      this.alreadyReportedReadiness = true
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
    const round = this.game.getCurrentRound()
    if (round) {
      const player = round.getCurrentTurnPlayer()
      const playableCards = player?.getPlayableCardIds()
      if (playableCards) {
        const pointsForHavingCardsInTop3 = playableCards.filter(
          // worth 3 each
          (cardId) => this.cardRanker.getRank(cardId) <= 3
        ).length
        const pointsForHavingCardsInTop6 = playableCards.filter(
          // worth 2 each
          (cardId) => this.cardRanker.getRank(cardId) <= 6
        ).length
        const pointsForHavingTrumpCards = playableCards.filter((cardId) =>
          this.cardRanker.isTrump(cardId)
        ).length // worth 1 each

        const pointsForHighValueCards = // worth 0.5 each
          playableCards.filter((cardId) => this.cardRanker.getPointValue(cardId) >= 10).length * 0.5

        const scoreForHand =
          pointsForHavingCardsInTop3 +
          pointsForHavingCardsInTop6 +
          pointsForHavingTrumpCards +
          (pointsForHighValueCards > 1 ? 1 : pointsForHighValueCards)
        return scoreForHand >= 7.5
      }
    }
    return false
  }

  private pick(): void {
    const round = this.game.getCurrentRound()
    if (round) {
      throw Error('Cannot pick & Bury because we changed the way that works')
      // send a pick command
      // TODO wait for the round to update and then bury
      // because you cannot bury until it's time to do it
      // this.bury(round)
    }
  }

  private bury(round: IReadOnlyRound): void {
    const player = round.getCurrentTurnPlayer()
    if (!player) return
    const playableCards = player.getPlayableCardIds()
    const highestValueCardId = this.getHighestValueCardId(playableCards)
    const secondHighestValueCardId = this.getHighestValueCardId(
      playableCards.filter((cardId: string) => cardId !== highestValueCardId)
    )
    const buryCommand: BuryCommandDTO = {
      name: 'bury',
      params: {
        cards: [highestValueCardId, secondHighestValueCardId],
      },
    }
    this.commandInterface.giveCommand(buryCommand)
  }

  private pass(): void {
    this.commandInterface.giveCommand({ name: 'pass', params: null })
  }

  private play(): void {
    const round = this.game.getCurrentRound()
    if (round) {
      const player = round.getCurrentTurnPlayer()
      if (player) {
        const leadCard = round.getCurrentTrick().getLeadCard()
        const playCommand: PlayCommandDTO = {
          name: 'play',
          params: {
            card: leadCard
              ? this.getHighestValueCardId(player.getPlayableCardIds(leadCard))
              : player.getPlayableCardIds()[0],
          },
        }
        this.commandInterface.giveCommand(playCommand)
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

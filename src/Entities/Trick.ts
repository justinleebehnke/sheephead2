import Card from './Card'
import CardPlayedByData from './DataStructures/CardPlayedByData'
import IReadOnlyTrick from '../GameEntityInterfaces/ReadOnlyEntities/IReadOnlyTrick'
import Player from './Player'
import Suit from './Suit'
import TrickData from './DataStructures/TrickData'

class Trick implements IReadOnlyTrick {
  private cardsInTrick: Card[]
  private playerOfCard: Player[]
  private trickOrder: number

  constructor(trickOrder: number) {
    this.trickOrder = trickOrder
    this.cardsInTrick = []
    this.playerOfCard = []
  }

  public addCardToTrick(card: Card, player: Player): void {
    this.cardsInTrick.push(card)
    this.playerOfCard.push(player)
  }

  public getNumCardsPlayed(): number {
    return this.cardsInTrick.length
  }

  public getTrickOrder(): number {
    return this.trickOrder
  }

  public getLeadCard(): Card | undefined {
    if (this.cardsInTrick.length === 0) {
      return undefined
    } else {
      return this.cardsInTrick[0]
    }
  }

  public getTrickData(): TrickData {
    return {
      cards: this.getCardPlayedByData(),
      winningCardIndex: this.playerOfCard.findIndex(
        (player) => player.getId() === this.getWinnerOfTrick().getId()
      ),
    }
  }

  private getCardPlayedByData(): CardPlayedByData[] {
    const result: CardPlayedByData[] = []
    for (let i = 0; i < this.cardsInTrick.length; i++) {
      result.push({
        cardId: this.cardsInTrick[i].getCardId(),
        pointValue: this.cardsInTrick[i].getPointValue(),
        playedByPlayerId: this.playerOfCard[i].getId(),
      })
    }
    return result
  }

  public giveToHighestRankingCardPlayer(): void {
    this.getWinnerOfTrick().giveTrick(this)
  }

  public getWinnerOfTrick(): Player {
    if (!this.cardsInTrick.some((card) => card.isTrump())) {
      return this.playerOfCard[
        this.getIndexOfHighestRankingCardOfSuit(this.getLeadCard()?.getSuit())
      ]
    }
    return this.playerOfCard[this.getIndexOfHighestRankingCardInTrick()]
  }

  private getIndexOfHighestRankingCardInTrick(): number {
    return this.cardsInTrick.findIndex(
      (card) => card.getRank() === this.getHighestRankFromArray(this.cardsInTrick)
    )
  }

  private getIndexOfHighestRankingCardOfSuit(suit: Suit | undefined) {
    return this.cardsInTrick.findIndex(
      (card) =>
        card.getRank() ===
        this.getHighestRankFromArray(this.cardsInTrick.filter((card) => card.getSuit() === suit))
    )
  }

  private getHighestRankFromArray(cards: Card[]): number {
    return Math.min(...cards.map((card) => card.getRank()))
  }
}

export default Trick

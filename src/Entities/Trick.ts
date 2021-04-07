import Card from './Card'
import CardPlayedByData from './DataStructures/CardPlayedByData'
import IReadOnlyTrick from '../GameEntityInterfaces/ReadOnlyEntities/IReadOnlyTrick'
import Player from './Player'
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
      winningCardIndex: this.getIndexOfHighestRankingCardInTrick(),
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
    return this.playerOfCard[this.getIndexOfHighestRankingCardInTrick()]
  }

  private getIndexOfHighestRankingCardInTrick(): number {
    return this.cardsInTrick.findIndex((card) => card.getRank() === this.getHighestRankInTrick())
  }

  private getHighestRankInTrick(): number {
    return Math.min(...this.getRankOfCardsInTrick())
  }

  private getRankOfCardsInTrick(): number[] {
    return this.cardsInTrick.map((card) => card.getRank())
  }
}

export default Trick

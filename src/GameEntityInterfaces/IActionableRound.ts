import ICard from './ICard'

interface IActionableRound {
  bury(cardA: ICard, cardB: ICard): void
  pass(): void
  pick(): void
  play(card: ICard): void
}

export default IActionableRound

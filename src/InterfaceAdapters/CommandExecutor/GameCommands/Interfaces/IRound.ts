import ICard from './ICard'
import IPlayer from './IPlayer'

interface IRound {
  bury(cardA: ICard, cardB: ICard): void
  getCurrentTurnPlayer(): IPlayer | undefined
  pass(): void
  pick(): void
  play(card: ICard): void
}

export default IRound

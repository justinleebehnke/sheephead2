import ICard from './ICard'
import IPlayer from './IPlayer'

interface IRound {
  getCurrentTurnPlayer(): IPlayer | undefined
  pass(): void
  play(card: ICard): void
}

export default IRound

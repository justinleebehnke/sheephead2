import ICard from './ICard'
import IPlayer from './IPlayer'

interface IRound {
  getCurrentTurnPlayer(): IPlayer | undefined
  play(card: ICard): void
}

export default IRound

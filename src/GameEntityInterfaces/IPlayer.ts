import ICard from './ICard'

interface IPlayer {
  removeCardFromHand(cardId: string): ICard
}

export default IPlayer

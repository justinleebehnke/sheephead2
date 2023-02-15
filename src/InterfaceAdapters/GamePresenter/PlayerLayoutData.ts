interface PlayerLayoutData {
  lastCardPlayed: null | string
  cardPlayed: string
  isDealer: boolean
  isGoingAlone: boolean
  isPicker: boolean
  isTurn: boolean
  name: string
  cardsInHand: string[]
}

export default PlayerLayoutData

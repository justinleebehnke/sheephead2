import CommandDTO from '../../CommandDTO'

interface BuryCommandDTO extends CommandDTO {
  name: 'bury'
  params: {
    cards: string[]
    isGoingAlone: boolean
  }
}
export default BuryCommandDTO

import CommandDTO from '../../CommandDTO'

interface BuryCommandDTO extends CommandDTO {
  name: 'bury'
  params: {
    cards: string[]
  }
}
export default BuryCommandDTO

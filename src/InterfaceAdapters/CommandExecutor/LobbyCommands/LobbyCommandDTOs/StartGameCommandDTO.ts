import CommandDTO from '../../CommandDTO'

interface StartGameCommandDTO extends CommandDTO {
  name: 'startGame'
  params: {
    firstDealerIndex: number
    hostId: string
    shuffleSeed: number
  }
}
export default StartGameCommandDTO

import CommandDTO from '../../CommandDTO'

interface StartGameCommandDTO extends CommandDTO {
  name: 'startGame'
  params: {
    firstDealerIndex: number
    shuffleSeed: number
  }
}
export default StartGameCommandDTO

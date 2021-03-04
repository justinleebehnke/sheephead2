import CommandDTO from '../../CommandDTO'

interface ReadyToPlayAgainCommandDTO extends CommandDTO {
  name: 'playAgain'
  params: {
    playerId: string
  }
}

export default ReadyToPlayAgainCommandDTO

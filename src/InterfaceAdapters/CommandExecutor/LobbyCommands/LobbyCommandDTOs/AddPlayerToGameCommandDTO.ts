import CommandDTO from '../../CommandDTO'

interface AddPlayerToGameCommandDTO extends CommandDTO {
  name: 'addPlayer'
  params: {
    hostId: string
    playerId: string
    playerName: string
  }
}

export default AddPlayerToGameCommandDTO

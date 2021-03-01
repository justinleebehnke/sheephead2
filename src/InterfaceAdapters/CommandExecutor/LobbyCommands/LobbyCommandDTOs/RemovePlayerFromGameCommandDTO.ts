import CommandDTO from '../../CommandDTO'

interface RemovePlayerFromGameCommandDTO extends CommandDTO {
  name: 'removePlayer'
  params: {
    hostId: string
    playerId: string
  }
}

export default RemovePlayerFromGameCommandDTO

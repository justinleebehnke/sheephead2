import CommandDTO from '../../CommandDTO'

interface HostNewGameCommandDTO extends CommandDTO {
  name: 'hostNewGame'
  params: {
    hostId: string
    hostName: string
  }
}

export default HostNewGameCommandDTO

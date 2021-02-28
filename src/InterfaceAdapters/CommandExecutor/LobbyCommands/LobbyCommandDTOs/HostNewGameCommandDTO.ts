import CommandDTO from '../../GameCommandDTOs/CommandDTO'

interface HostNewGameCommandDTO extends CommandDTO {
  name: 'hostNewGame'
  params: {
    hostId: string
    hostName: string
  }
}

export default HostNewGameCommandDTO

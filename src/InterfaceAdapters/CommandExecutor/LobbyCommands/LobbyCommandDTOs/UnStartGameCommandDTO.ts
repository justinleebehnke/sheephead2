import CommandDTO from '../../CommandDTO'

interface UnStartGameCommandDTO extends CommandDTO {
  name: 'unStartGame'
  params: {
    hostId: string
  }
}

export default UnStartGameCommandDTO

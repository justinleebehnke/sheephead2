import CommandDTO from '../../CommandDTO'

interface PlayCommandDTO extends CommandDTO {
  name: 'play'
  params: {
    card: string
  }
}

export default PlayCommandDTO

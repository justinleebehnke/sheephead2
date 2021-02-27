import ICommandObject from '../ICommandObject'

interface PlayCommandDTO extends ICommandObject {
  name: 'play'
  params: {
    card: string
  }
}

export default PlayCommandDTO

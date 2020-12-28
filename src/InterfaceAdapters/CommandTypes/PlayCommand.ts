import ICommandObject from '../ICommandObject'

interface PlayCommand extends ICommandObject {
  name: 'play'
  params: {
    card: string
  }
}

export default PlayCommand

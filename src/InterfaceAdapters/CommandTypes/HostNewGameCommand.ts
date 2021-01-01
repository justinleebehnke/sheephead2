import ICommandObject from '../ICommandObject'

interface HostNewGameCommand extends ICommandObject {
  name: 'hostNewGame'
  params: {
    hostId: string
    hostName: string
  }
}

export default HostNewGameCommand

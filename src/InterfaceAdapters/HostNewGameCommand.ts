import ICommandObject from './ICommandObject'

interface HostNewGameCommand extends ICommandObject {
  name: 'hostNewGame'
  params: {
    playerId: string
  }
}

export default HostNewGameCommand

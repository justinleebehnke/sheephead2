import ICommandObject from '../ICommandObject'

interface RemovePlayerCommand extends ICommandObject {
  name: 'removePlayer'
  params: {
    playerId: string
  }
}

export default RemovePlayerCommand

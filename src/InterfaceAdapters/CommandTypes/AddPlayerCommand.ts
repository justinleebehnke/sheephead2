import ICommandObject from '../ICommandObject'

interface AddPlayerCommand extends ICommandObject {
  name: 'addPlayer'
  params: {
    hostId: string
    playerId: string
    playerName: string
  }
}

export default AddPlayerCommand

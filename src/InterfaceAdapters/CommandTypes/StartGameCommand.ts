import ICommandObject from '../ICommandObject'

interface StartGameCommand extends ICommandObject {
  name: 'startGame'
  params: {
    hostId: string
    firstDealerIndex: number
    shuffleSeed: number
  }
}

export default StartGameCommand

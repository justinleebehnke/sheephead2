import ICommandObject from './ICommandObject'

interface ICommandCommunicatorRequest {
  indexOfNextCommand: number
  newCommand: ICommandObject
}

export default ICommandCommunicatorRequest

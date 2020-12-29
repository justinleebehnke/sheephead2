import ICommandObject from './ICommandObject'

interface ICommandCommunicatorResponse {
  indexOfNextCommand: number
  newCommands: ICommandObject[]
}

export default ICommandCommunicatorResponse

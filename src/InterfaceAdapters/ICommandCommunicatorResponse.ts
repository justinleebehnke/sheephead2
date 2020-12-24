import ICommandObjectDTO from './ICommandObjectDTO'

interface ICommandCommunicatorResponse {
  indexOfNextCommand: number
  newCommands: ICommandObjectDTO[]
}

export default ICommandCommunicatorResponse

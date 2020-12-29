import ICommandCommunicatorResponse from './ICommandCommunicatorResponse'
import ICommandObject from './ICommandObject'

interface ICommandCommunicator {
  giveCommand(command: ICommandObject): Promise<ICommandCommunicatorResponse>
  getCommands(indexOfNextCommand: number): Promise<ICommandCommunicatorResponse>
}

export default ICommandCommunicator

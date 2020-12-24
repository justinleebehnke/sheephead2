import ICommandCommunicatorResponse from './ICommandCommunicatorResponse'
import ICommandObjectDTO from './ICommandObjectDTO'

interface ICommandCommunicator {
  giveCommand(command: ICommandObjectDTO): Promise<ICommandCommunicatorResponse>
  getCommands(indexOfNextCommand: number): Promise<ICommandCommunicatorResponse>
}

export default ICommandCommunicator

import CommandDTO from './CommandExecutor/GameCommandDTOs/CommandDTO'
import ICommandCommunicatorResponse from './ICommandCommunicatorResponse'

interface ICommandCommunicator {
  getCommands(indexOfNextCommand: number): Promise<ICommandCommunicatorResponse>
  giveCommand(command: CommandDTO): Promise<ICommandCommunicatorResponse>
}

export default ICommandCommunicator

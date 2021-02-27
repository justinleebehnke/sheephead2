import CommandDTO from './CommandExecutor/GameCommandDTOs/CommandDTO'

interface ICommandCommunicatorResponse {
  indexOfNextCommand: number
  newCommands: CommandDTO[]
}

export default ICommandCommunicatorResponse

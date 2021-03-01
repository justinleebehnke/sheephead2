import CommandDTO from './CommandExecutor/CommandDTO'

interface ICommandCommunicatorResponse {
  indexOfNextCommand: number
  newCommands: CommandDTO[]
}

export default ICommandCommunicatorResponse

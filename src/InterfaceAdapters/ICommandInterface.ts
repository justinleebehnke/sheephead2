import CommandDTO from './CommandExecutor/CommandDTO'

interface ICommandInterface {
  giveCommand(command: CommandDTO): Promise<void>
}

export default ICommandInterface

import CommandDTO from './CommandExecutor/GameCommandDTOs/CommandDTO'

interface ICommandInterface {
  giveCommand(command: CommandDTO): Promise<void>
}

export default ICommandInterface

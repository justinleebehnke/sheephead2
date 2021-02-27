import CommandDTO from './GameCommandDTOs/CommandDTO'

interface ICommandExecutor {
  execute(command: CommandDTO): void
}

export default ICommandExecutor

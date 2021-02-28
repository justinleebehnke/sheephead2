import CommandDTO from './CommandDTO'

interface ICommandExecutor {
  execute(command: CommandDTO): void
}

export default ICommandExecutor

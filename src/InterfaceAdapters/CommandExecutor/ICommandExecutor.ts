import ICommandObject from '../ICommandObject'

interface ICommandExecutor {
  execute(command: ICommandObject): void
}

export default ICommandExecutor

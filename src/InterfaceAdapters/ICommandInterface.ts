import ICommandObject from './ICommandObject'

interface ICommandInterface {
  giveCommand(command: ICommandObject): Promise<void>
  start(): void
}

export default ICommandInterface

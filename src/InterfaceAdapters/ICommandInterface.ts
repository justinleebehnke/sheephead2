import ICommandObject from './ICommandObject'

interface ICommandInterface {
  giveCommand(command: ICommandObject): Promise<void>
}

export default ICommandInterface

import ICommandObject from './ICommandObject'

interface ICommandCommunicator {
  giveCommand(command: ICommandObject): Promise<void>
}

export default ICommandCommunicator

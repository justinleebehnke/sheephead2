import ICommandObject from './ICommandObject'

interface ICommandInterface {
  giveCommand(command: ICommandObject): Promise<void>
  stopWatchingForCommands(): void
  watchForCommands(): void
}

export default ICommandInterface

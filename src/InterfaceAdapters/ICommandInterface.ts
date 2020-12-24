interface ICommandInterface {
  giveCommand(command: ICommandInterface): Promise<void>
}

export default ICommandInterface

import ICommandCommunicatorResponse from '../ICommandCommunicatorResponse'
import ICommandExecutor from '../CommandExecutor/ICommandExecutor'
import ICommandInterface from '../ICommandInterface'
import ICommandObject from '../ICommandObject'
import IFetch from '../IFetch'

class OnlineMultiplayerGameCommandInterface implements ICommandInterface {
  private readonly pollingFrequency: number
  private readonly fetcher: IFetch
  private readonly baseRoute: string
  private readonly hostId: string
  private readonly commandExecutor: ICommandExecutor
  private indexOfNextCommand: number

  constructor(
    pollingFrequency: number,
    fetcher: IFetch,
    baseRoute: string,
    hostId: string,
    commandExecutor: ICommandExecutor
  ) {
    this.pollingFrequency = pollingFrequency
    this.fetcher = fetcher
    this.baseRoute = baseRoute
    this.hostId = hostId
    this.indexOfNextCommand = 0
    this.getCommands()
    this.commandExecutor = commandExecutor
  }

  private async getCommands(): Promise<void> {
    const response = await this.fetcher.get(
      `${this.baseRoute}/${this.hostId}/${this.indexOfNextCommand}`
    )
    if (this.isCommandCommunicatorResponse(response)) {
      if (response.indexOfNextCommand > this.indexOfNextCommand) {
        this.indexOfNextCommand = response.indexOfNextCommand
      }
      response.newCommands.forEach((newCommand: ICommandObject) =>
        this.commandExecutor.execute(newCommand)
      )
    }
    setTimeout(() => this.getCommands(), this.pollingFrequency)
  }

  private isCommandCommunicatorResponse(
    response: object
  ): response is ICommandCommunicatorResponse {
    return (
      response &&
      Object.prototype.hasOwnProperty.call(response, 'indexOfNextCommand') &&
      Object.prototype.hasOwnProperty.call(response, 'newCommands')
    )
  }

  public async giveCommand(command: ICommandObject): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

export default OnlineMultiplayerGameCommandInterface

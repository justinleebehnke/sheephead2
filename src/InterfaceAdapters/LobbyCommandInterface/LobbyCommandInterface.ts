import CommandDTO from '../CommandExecutor/CommandDTO'
import ICommandCommunicatorResponse from '../ICommandCommunicatorResponse'
import ICommandExecutor from '../CommandExecutor/ICommandExecutor'
import ICommandInterface from '../ICommandInterface'
import IFetch from '../IFetch'

class LobbyCommandInterface implements ICommandInterface {
  private indexOfNextCommand: number
  constructor(
    private readonly pollingFrequency: number,
    private readonly fetcher: IFetch,
    private readonly baseRoute: string,
    private readonly commandExecutor: ICommandExecutor
  ) {
    this.indexOfNextCommand = 0
    this.getCommands()
  }

  private async getCommands(): Promise<void> {
    const response = await this.fetcher.get(`${this.baseRoute}/${this.indexOfNextCommand}`)
    this.handleResponse(response)
    setTimeout(() => this.getCommands(), this.pollingFrequency)
  }

  public async giveCommand(command: CommandDTO): Promise<void> {
    this.fetcher.post(`${this.baseRoute}`, command)
  }

  private handleResponse(response: object): void {
    if (this.isCommandCommunicatorResponse(response)) {
      if (this.indexOfNextCommand > response.indexOfNextCommand) {
        window.location.reload() // TODO abstract this to an interface, if we know about more commands than the server, the server must have reset
      }
      if (response.indexOfNextCommand > this.indexOfNextCommand) {
        this.indexOfNextCommand = response.indexOfNextCommand
      }
      response.newCommands.forEach((newCommand: CommandDTO) =>
        this.commandExecutor.execute(newCommand)
      )
    }
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
}

export default LobbyCommandInterface

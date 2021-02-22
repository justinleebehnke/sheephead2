import ICommandInterface from '../ICommandInterface'
import ICommandObject from '../ICommandObject'
import IFetch from '../IFetch'

class OnlineMultiplayerGameCommandInterface implements ICommandInterface {
  private readonly pollingFrequency: number
  private readonly fetcher: IFetch
  private timeout: NodeJS.Timeout | undefined

  constructor(pollingFrequency: number, fetcher: IFetch) {
    this.pollingFrequency = pollingFrequency
    this.fetcher = fetcher
    this.getCommands()
  }

  private async getCommands(): Promise<void> {
    this.timeout = undefined
    await this.fetcher.get('')
    this.timeout = setTimeout(() => this.getCommands(), this.pollingFrequency)
  }

  public async giveCommand(command: ICommandObject): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

export default OnlineMultiplayerGameCommandInterface

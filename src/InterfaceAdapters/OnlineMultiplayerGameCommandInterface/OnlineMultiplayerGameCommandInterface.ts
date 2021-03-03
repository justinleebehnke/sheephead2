import ICommandExecutor from '../CommandExecutor/ICommandExecutor'
import IFetch from '../IFetch'
import LobbyCommandInterface from '../LobbyCommandInterface/LobbyCommandInterface'

class OnlineMultiplayerGameCommandInterface extends LobbyCommandInterface {
  constructor(
    pollingFrequency: number,
    fetcher: IFetch,
    baseRoute: string,
    hostId: string,
    commandExecutor: ICommandExecutor
  ) {
    super(pollingFrequency, fetcher, `${baseRoute}/${hostId}`, commandExecutor)
  }
}

export default OnlineMultiplayerGameCommandInterface

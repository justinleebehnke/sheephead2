import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'
import ICommand from '../GameCommands/ICommand'
import IGameManager from './IGameManager'

class HostNewGameCommand implements ICommand {
  private readonly hostId: UniqueIdentifier

  constructor(
    private readonly gameManager: IGameManager,
    private readonly hostName: string,
    hostId: string
  ) {
    this.hostId = new UniqueIdentifier(hostId)
  }

  public execute(): void {
    this.gameManager.createGame(this.hostName, this.hostId)
  }
}

export default HostNewGameCommand

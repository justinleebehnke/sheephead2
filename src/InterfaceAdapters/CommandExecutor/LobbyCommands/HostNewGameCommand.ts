import ICommand from '../ICommand'
import IGameManager from '../../../Entities/GameManager/IGameManager'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

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
    this.gameManager.createGame({ name: this.hostName, id: this.hostId })
  }
}

export default HostNewGameCommand

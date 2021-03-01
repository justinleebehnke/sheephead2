import ICommand from '../ICommand'
import IGameManager from '../../../Entities/GameManager/IGameManager'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

class UnStartGameCommand implements ICommand {
  constructor(private readonly gameManager: IGameManager, private readonly hostId: string) {}

  public execute(): void {
    this.gameManager.unStartGame(new UniqueIdentifier(this.hostId))
  }
}

export default UnStartGameCommand

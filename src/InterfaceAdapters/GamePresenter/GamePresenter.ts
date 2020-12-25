import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import ICommandInterface from '../ICommandInterface'

class GamePresenter {
  private commandInterface: ICommandInterface
  private localPlayerId: UniqueIdentifier
  constructor(commandInterface: ICommandInterface, localPlayerId: UniqueIdentifier) {
    this.commandInterface = commandInterface
    this.localPlayerId = localPlayerId
  }

  public pass(): void {
    this.commandInterface.giveCommand({
      name: 'pass',
      params: { playerId: this.localPlayerId.getId() },
    })
  }
}

export default GamePresenter

import ICommand from '../ICommand'
import IGameManager from '../../../Entities/GameManager/IGameManager'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

interface RemovePlayerCommandParams {
  hostId: string
  playerToRemoveId: string
}

class RemovePlayerFromGameCommand implements ICommand {
  constructor(
    private readonly gameManager: IGameManager,
    private readonly removePlayerParams: RemovePlayerCommandParams
  ) {}

  execute(): void {
    const { hostId, playerToRemoveId } = this.removePlayerParams
    this.gameManager.removePlayerFromGame(
      new UniqueIdentifier(playerToRemoveId),
      new UniqueIdentifier(hostId)
    )
  }
}

export default RemovePlayerFromGameCommand

import ICommand from '../ICommand'
import IGameManager from '../../../Entities/GameManager/IGameManager'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

interface AddPlayerToGameParams {
  hostId: string
  newPlayerId: string
  newPlayerName: string
}

class AddPlayerToGameCommand implements ICommand {
  constructor(
    private readonly gameManager: IGameManager,
    private readonly addPlayerParams: AddPlayerToGameParams
  ) {}

  public execute(): void {
    const { hostId, newPlayerId, newPlayerName } = this.addPlayerParams
    this.gameManager.addPlayerToGame(new UniqueIdentifier(hostId), {
      name: newPlayerName,
      id: new UniqueIdentifier(newPlayerId),
    })
  }
}

export default AddPlayerToGameCommand

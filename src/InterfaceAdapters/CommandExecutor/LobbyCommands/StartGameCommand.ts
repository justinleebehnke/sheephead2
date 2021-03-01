import GameConfigurationDTO from '../../../Entities/GameManager/GameConfigurationDTO'
import ICommand from '../ICommand'
import IGameManager from '../../../Entities/GameManager/IGameManager'
import UniqueIdentifier from '../../../Utilities/UniqueIdentifier'

class StartGameCommand implements ICommand {
  constructor(
    private readonly gameManager: IGameManager,
    private readonly hostId: string,
    private readonly gameConfig: GameConfigurationDTO
  ) {}

  public execute(): void {
    this.gameManager.setGameConfig(new UniqueIdentifier(this.hostId), this.gameConfig)
    this.gameManager.startGame(new UniqueIdentifier(this.hostId))
  }
}
export default StartGameCommand

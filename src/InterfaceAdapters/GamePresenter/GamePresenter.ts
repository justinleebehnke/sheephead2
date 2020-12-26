import ISubscriber from '../../Entities/ISubscriber'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import ICommandInterface from '../ICommandInterface'
import IReadOnlyGameModel from '../../Entities/IReadOnlyGameModel'
import Player from '../../Entities/Player'

class GamePresenter {
  private commandInterface: ICommandInterface
  private localPlayerId: UniqueIdentifier
  private view: ISubscriber
  private game: IReadOnlyGameModel

  constructor(
    commandInterface: ICommandInterface,
    localPlayerId: UniqueIdentifier,
    view: ISubscriber,
    game: IReadOnlyGameModel
  ) {
    this.commandInterface = commandInterface
    this.localPlayerId = localPlayerId
    this.view = view
    this.game = game
  }

  public pass(): void {
    this.commandInterface.giveCommand({
      name: 'pass',
      params: { playerId: this.localPlayerId.getId() },
    })
  }

  public pick(): void {
    this.game.pick()
    this.view.update()
  }

  public getHand(): string[] {
    const localPlayer: Player | undefined = this.game.getPlayerById(this.localPlayerId)
    if (localPlayer) {
      return localPlayer.getPlayableCardIds()
    }
    return []
  }
}

export default GamePresenter

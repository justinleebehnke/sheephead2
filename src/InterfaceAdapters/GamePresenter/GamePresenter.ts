import ISubscriber from '../../Entities/ISubscriber'
import UniqueIdentifier from '../../Utilities/UniqueIdentifier'
import ICommandInterface from '../ICommandInterface'
import IReadOnlyGameModel from '../../Entities/IReadOnlyGameModel'
import Player from '../../Entities/Player'

class GamePresenter implements ISubscriber {
  private commandInterface: ICommandInterface
  private localPlayerId: UniqueIdentifier
  private view: ISubscriber
  private game: IReadOnlyGameModel

  private _isLoading: boolean

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
    this.game.addSubscriber(this)
    this._isLoading = false
  }

  public isLoading(): boolean {
    return this._isLoading
  }

  public update(): void {
    this._isLoading = false
    this.view.update()
  }

  public pass(): void {
    this._isLoading = true
    this.commandInterface.giveCommand({
      name: 'pass',
      params: null,
    })
  }

  public pick(): void {
    this.game.pick()
    this.view.update()
  }

  public bury(cards: string[]): void {
    this._isLoading = true
    this.commandInterface.giveCommand({
      name: 'bury',
      params: {
        cards,
      },
    })
  }

  public play(card: string): void {
    this._isLoading = true
    this.commandInterface.giveCommand({
      name: 'play',
      params: {
        card,
      },
    })
  }

  public playAgain(): void {
    this._isLoading = true
    this.commandInterface.giveCommand({
      name: 'playAgain',
      params: {
        playerId: this.localPlayerId,
      },
    })
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

import IGameBoardPresenter from '../../Views/GamePlayViews/IGameBoardPresenter'
import ISubscriber from '../../Entities/ISubscriber'
import EndOfRoundData from '../../Entities/Round/EndOfRoundReportData'
import PlayerData from '../../Views/GamePlayViews/EndOfRoundReport/PlayerData'
import GameBoardViewData from '../../Views/GamePlayViews/GameBoardViewData'
import IObservable from '../../Entities/IObservable'

class GameBoardPresenter implements IGameBoardPresenter, ISubscriber {
  private view: ISubscriber | undefined
  private model: IObservable

  constructor(model: IObservable) {
    this.model = model
    this.model.addSubscriber(this)
  }

  public update(): void {
    throw new Error('Method not implemented.')
  }

  public setView(view: ISubscriber): void {
    this.view = view
    this.view.update()
  }
  public unsetView(): void {
    throw new Error('Method not implemented.')
  }

  public getEndOfRoundReport(): EndOfRoundData | undefined {
    throw new Error('Method not implemented.')
  }
  public getGameBoardViewData(): GameBoardViewData {
    throw new Error('Method not implemented.')
  }
  public getPickerIndex(): number | undefined {
    throw new Error('Method not implemented.')
  }
  public getPlayersData(): PlayerData[] {
    throw new Error('Method not implemented.')
  }
  public isShowingPassOrPickForm(): boolean {
    throw new Error('Method not implemented.')
  }
  public bury(cardIds: string[]): void {
    throw new Error('Method not implemented.')
  }
  public pass(): void {
    throw new Error('Method not implemented.')
  }
  public pick(): void {
    throw new Error('Method not implemented.')
  }
  public play(cardId: string): void {
    throw new Error('Method not implemented.')
  }
  public playAgain(): void {
    throw new Error('Method not implemented.')
  }
}

export default GameBoardPresenter

import GameBoardViewData from '../../Views/GamePlayViews/GameBoardViewData'
import ICommandInterface from '../ICommandInterface'
import IGameBoardModel from '../IGameBoardModel'
import IGameBoardPresenter from '../../Views/GamePlayViews/IGameBoardPresenter'
import ISubscriber from '../../Entities/ISubscriber'

class GameBoardPresenter implements IGameBoardPresenter, ISubscriber {
  private readonly commandInterface: ICommandInterface
  private view: ISubscriber | undefined
  private readonly model: IGameBoardModel

  constructor(commandInterface: ICommandInterface, model: IGameBoardModel) {
    this.commandInterface = commandInterface
    this.model = model
    this.model.addSubscriber(this)
  }

  public update(): void {
    if (this.view) {
      this.view.update()
    }
    // when I call update
    // then I should ask my model for everything that I need to build a GameBoardViewData
    // then I should compare it to the most recent one in the queue
    // if they are different, then I should update it to the new one
    // otherwise I should just throw it away
    // throw new Error('Method not implemented.')
  }

  public setView(view: ISubscriber): void {
    this.view = view
    this.view.update()
  }

  public unsetView(): void {
    throw new Error('Method not implemented.')
  }

  public getGameBoardViewData(): GameBoardViewData {
    const dataForLocalPlayer = this.model.getDataForLocalPlayer()
    const hand = this.model.getHand()
    return {
      allPlayerData: {
        dataForLocalPlayer,
        dataForPlayerAcross: this.model.getDataForPlayerAcross(),
        dataForPlayerToLeft: this.model.getDataForPlayerToLeft(),
        dataForPlayerToRight: this.model.getDataForPlayerToRight(),
      },
      passOrPickViewData: {
        isPicking: this.model.isPicking(),
        isShowingPassOrPickForm: this.model.isShowingPassOrPickForm(),
        hand,
      },
      handViewData: {
        isTurn: dataForLocalPlayer.isTurn,
        playableCardIds: Array.from(this.model.getPlayableCardIds()),
        hand,
      },
      endOfRoundViewData: {
        players: this.model.getPlayersData(),
        pickerIndex: this.model.getPickerIndex(),
        endOfRoundReport: this.model.getEndOfRoundReport(),
      },
    }
  }

  public bury(cards: string[]): void {
    this.commandInterface.giveCommand({
      name: 'bury',
      params: {
        cards,
      },
    })
  }

  public pass(): void {
    this.commandInterface.giveCommand({
      name: 'pass',
      params: null,
    })
  }

  public pick(): void {
    this.model.pick()
  }

  public play(card: string): void {
    this.commandInterface.giveCommand({
      name: 'play',
      params: {
        card,
      },
    })
  }

  public playAgain(): void {
    this.commandInterface.giveCommand({
      name: 'playAgain',
      params: null,
    })
  }
}

export default GameBoardPresenter

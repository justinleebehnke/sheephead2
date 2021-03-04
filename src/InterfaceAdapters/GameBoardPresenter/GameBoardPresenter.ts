import DelayedUpdateQueue from '../../Utilities/DelayedUpdateQueue/DelayedUpdateQueue'
import GameBoardViewData from '../../Views/GamePlayViews/GameBoardViewData'
import ICommandInterface from '../ICommandInterface'
import IGameBoardModel from '../IGameBoardModel'
import IGameBoardPresenter from '../../Views/GamePlayViews/IGameBoardPresenter'
import ISubscriber from '../../Entities/ISubscriber'
import PlayerData from '../../Views/GamePlayViews/EndOfRoundReport/PlayerData'

class GameBoardPresenter implements IGameBoardPresenter, ISubscriber {
  private readonly commandInterface: ICommandInterface
  private readonly model: IGameBoardModel
  private readonly gameStateDelayedUpdater: DelayedUpdateQueue<GameBoardViewData>

  constructor(commandInterface: ICommandInterface, model: IGameBoardModel, delayToUse: number) {
    this.commandInterface = commandInterface
    this.model = model
    this.model.addSubscriber(this)
    this.gameStateDelayedUpdater = new DelayedUpdateQueue(delayToUse)
    this.gameStateDelayedUpdater.push(this.getLiveGameBoardViewData())
  }

  public update(): void {
    const liveState: GameBoardViewData = this.getLiveGameBoardViewData()
    const mostRecentState: GameBoardViewData = this.gameStateDelayedUpdater.peekLastEnqueued()
    if (JSON.stringify(liveState) !== JSON.stringify(mostRecentState)) {
      this.gameStateDelayedUpdater.push(liveState)
    }
  }

  public setView(view: ISubscriber): void {
    this.gameStateDelayedUpdater.addSubscriber(view)
  }

  public unsetView(): void {
    throw new Error('Method not implemented.')
  }

  private getLiveGameBoardViewData(): GameBoardViewData {
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

  public getGameBoardViewData(): GameBoardViewData {
    return this.gameStateDelayedUpdater.peek()
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
    const localPlayerData = this.model.getDataForLocalPlayer()
    const localPlayerInfo = this.model
      .getPlayersData()
      .find((player: PlayerData) => player.name === localPlayerData.name)
    this.commandInterface.giveCommand({
      name: 'playAgain',
      params: {
        playerId: localPlayerInfo?.id,
      },
    })
  }
}

export default GameBoardPresenter

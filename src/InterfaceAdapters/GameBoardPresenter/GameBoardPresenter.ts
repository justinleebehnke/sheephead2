import GameBoardViewData from '../../Views/GamePlayViews/GameBoardViewData'
import ICommandInterface from '../ICommandInterface'
import IGameBoardModel from '../IGameBoardModel'
import IGameBoardPresenter from '../../Views/GamePlayViews/IGameBoardPresenter'
import ISubscriber from '../../Entities/ISubscriber'
import PlayerData from '../../Views/GamePlayViews/EndOfRoundReport/PlayerData'

class GameBoardPresenter implements IGameBoardPresenter, ISubscriber {
  private readonly commandInterface: ICommandInterface
  private readonly model: IGameBoardModel
  private isLoading: boolean
  private view: ISubscriber | undefined

  constructor(commandInterface: ICommandInterface, model: IGameBoardModel) {
    this.commandInterface = commandInterface
    this.model = model
    this.model.addSubscriber(this)
    this.isLoading = false
  }

  public update(): void {
    this.isLoading = false
    this.view?.update()
  }

  public setView(view: ISubscriber): void {
    this.view = view
  }

  public unsetView(): void {
    this.view = undefined
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
        isLoading: this.isLoading,
        isPicking: this.model.isPicking(),
        isShowingPassOrPickForm: this.model.isShowingPassOrPickForm(),
        hand,
      },
      handViewData: {
        isLoading: this.isLoading,
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
    return this.getLiveGameBoardViewData()
  }

  public bury(cards: string[]): void {
    this.isLoading = true
    this.view?.update()
    this.commandInterface.giveCommand({
      name: 'bury',
      params: {
        cards,
      },
    })
  }

  public pass(): void {
    this.isLoading = true
    this.view?.update()
    this.commandInterface.giveCommand({
      name: 'pass',
      params: null,
    })
  }

  public pick(): void {
    this.isLoading = true
    this.view?.update()
    this.commandInterface.giveCommand({
      name: 'pick',
      params: null,
    })
  }

  public play(card: string): void {
    this.isLoading = true
    this.view?.update()
    this.commandInterface.giveCommand({
      name: 'play',
      params: {
        card,
      },
    })
  }

  public playAgain(): void {
    this.isLoading = true
    this.view?.update()
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

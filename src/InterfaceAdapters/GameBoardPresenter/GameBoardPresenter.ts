import GameBoardViewData from '../../Views/GamePlayViews/GameBoardViewData'
import ICommandInterface from '../ICommandInterface'
import IGameBoardModel from '../IGameBoardModel'
import IGameBoardPresenter from '../../Views/GamePlayViews/IGameBoardPresenter'
import ISubscriber from '../../Entities/ISubscriber'
import PlayerData from '../../Views/GamePlayViews/EndOfRoundReport/PlayerData'
import PlayerLayoutDisplayData from '../../Views/GamePlayViews/PlayerLayout/PlayerLayoutDisplayData'

class GameBoardPresenter implements IGameBoardPresenter, ISubscriber {
  private isLoading: boolean
  private view: ISubscriber | undefined
  private playerDataToServe: PlayerLayoutDisplayData | undefined

  constructor(
    private readonly commandInterface: ICommandInterface,
    private readonly model: IGameBoardModel,
    private readonly endOfTrickPauseDuration: number
  ) {
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
    const res = {
      allPlayerData:
        this.playerDataToServe === undefined
          ? {
              dataForLocalPlayer,
              dataForPlayerAcross: this.model.getDataForPlayerAcross(),
              dataForPlayerToLeft: this.model.getDataForPlayerToLeft(),
              dataForPlayerToRight: this.model.getDataForPlayerToRight(),
            }
          : this.playerDataToServe,
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

    if (
      this.playerDataToServe === undefined &&
      res.allPlayerData.dataForLocalPlayer.cardPlayed.length === 2 &&
      res.allPlayerData.dataForPlayerAcross.cardPlayed.length === 2 &&
      res.allPlayerData.dataForPlayerToLeft.cardPlayed.length === 2 &&
      res.allPlayerData.dataForPlayerToRight.cardPlayed.length === 2
    ) {
      this.playerDataToServe = res.allPlayerData
      setTimeout(() => {
        this.playerDataToServe = undefined
        this.view?.update()
      }, this.endOfTrickPauseDuration)
    }

    return res
  }

  public getGameBoardViewData(): GameBoardViewData {
    return this.getLiveGameBoardViewData()
  }

  public bury(cards: string[], isGoingAlone: boolean): void {
    this.isLoading = true
    this.view?.update()
    this.commandInterface.giveCommand({
      name: 'bury',
      params: {
        cards,
        isGoingAlone,
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

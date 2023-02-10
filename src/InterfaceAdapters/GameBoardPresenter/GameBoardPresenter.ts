import GameBoardViewData from '../../Views/GamePlayViews/GameBoardViewData'
import ICommandInterface from '../ICommandInterface'
import IGameBoardModel from '../IGameBoardModel'
import IGameBoardPresenter from '../../Views/GamePlayViews/IGameBoardPresenter'
import ISubscriber from '../../Entities/ISubscriber'
import PlayerData from '../../Views/GamePlayViews/EndOfRoundReport/PlayerData'
import PlayerLayoutData from '../GamePresenter/PlayerLayoutData'

class GameBoardPresenter implements IGameBoardPresenter, ISubscriber {
  private isLoading: boolean
  private view: ISubscriber | undefined
  private playerDataToServe: GameBoardViewData | undefined

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
    let res: GameBoardViewData
    if (this.playerDataToServe === undefined) {
      res = {
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
          pickerWentAlone: this.pickerIsGoingAlone(),
          players: this.model.getPlayersData(),
          pickerIndex: this.model.getPickerIndex(),
          endOfRoundReport: this.model.getEndOfRoundReport(),
          isDoubleRound: this.model.isHandOfDoubles(),
        },
        shouldShowDoublesBadge: this.model.isHandOfDoubles(),
      }
      if (
        this.playerDataToServe === undefined &&
        res.allPlayerData.dataForLocalPlayer.cardPlayed.length === 2 &&
        res.allPlayerData.dataForPlayerAcross.cardPlayed.length === 2 &&
        res.allPlayerData.dataForPlayerToLeft.cardPlayed.length === 2 &&
        res.allPlayerData.dataForPlayerToRight.cardPlayed.length === 2
      ) {
        res.handViewData = {
          isLoading: this.isLoading,
          isTurn: false,
          playableCardIds: [],
          hand,
        }
        this.playerDataToServe = res
        setTimeout(() => {
          this.playerDataToServe = undefined
          this.view?.update()
        }, this.endOfTrickPauseDuration)
      }
    } else {
      res = this.playerDataToServe
    }
    return res
  }

  private getAllPlayerLayoutData(): PlayerLayoutData[] {
    return [
      this.model.getDataForLocalPlayer(),
      this.model.getDataForPlayerAcross(),
      this.model.getDataForPlayerToLeft(),
      this.model.getDataForPlayerToRight(),
    ]
  }

  private pickerIsGoingAlone(): boolean {
    return this.getAllPlayerLayoutData().some((player) => player.isGoingAlone)
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
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    this.view?.update()
    this.commandInterface.giveCommand({
      name: 'play',
      params: {
        card,
      },
    })
  }

  private oxford(arr: string[], conjunction: string): string {
    let l = arr.length
    if (!l) return ''
    if (l < 2) return arr[0]
    if (l < 3) return arr.join(` ${conjunction} `)
    arr = arr.slice()
    arr[l - 1] = `${conjunction} ${arr[l - 1]}`
    return arr.join(', ')
  }

  public getWaitingOnString(): string {
    const players = this.model.getPlayersNotReady()
    return players.length === 4 ? '' : `We are waiting on ${this.oxford(players, 'and')}.`
  }

  public playAgain(): void {
    this.isLoading = true
    this.view?.update()
    const localPlayerData = this.model.getDataForLocalPlayer()
    const localPlayerInfo = this.model
      .getPlayersData()
      .find((player: PlayerData) => `${player.name} (You)` === localPlayerData.name)

    this.commandInterface.giveCommand({
      name: 'playAgain',
      params: {
        playerId: localPlayerInfo?.id,
      },
    })
  }
}

export default GameBoardPresenter

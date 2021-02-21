import { Component, ReactElement } from 'react'
import EndOfRoundReport from './EndOfRoundReport/EndOfRoundReport'
import EndOfRoundViewData from './EndOfRoundReport/EndOfRoundViewData'
import GamePresenter from '../../InterfaceAdapters/GamePresenter/GamePresenter'
import Hand from './Hand'
import ISubscriber from '../../Entities/ISubscriber'
import PassOrPick from './PassOrPick'
import PlayerLayout from './PlayerLayout/PlayerLayout'
import PlayerLayoutDisplayData from './PlayerLayout/PlayerLayoutDisplayData'

type Props = {
  presenter: GamePresenter
}

class GameBoard extends Component<Props> implements ISubscriber {
  componentWillMount(): void {
    this.props.presenter.setView(this)
  }

  componentWillUnmount(): void {
    this.props.presenter.unsetView()
  }

  render() {
    const allPlayerData: PlayerLayoutDisplayData = {
      dataForLocalPlayer: this.props.presenter.getDataForLocalPlayer(),
      dataForPlayerAcross: this.props.presenter.getDataForPlayerAcross(),
      dataForPlayerToLeft: this.props.presenter.getDataForPlayerToLeft(),
      dataForPlayerToRight: this.props.presenter.getDataForPlayerToRight(),
    }

    return (
      this.props.presenter && (
        <div>
          {this.props.presenter.isShowingPassOrPickForm() && (
            <PassOrPick
              presenter={this.props.presenter}
              data={{
                isPicking: this.props.presenter.isPicking(),
                isShowingPassOrPickForm: this.props.presenter.isShowingPassOrPickForm(),
                hand: this.props.presenter.getHand(),
              }}
            />
          )}
          <PlayerLayout allPlayerData={allPlayerData} />
          <Hand
            presenter={this.props.presenter}
            data={{
              isTurn: this.props.presenter.getDataForLocalPlayer().isTurn,
              playableCardIds: Array.from(this.props.presenter.getPlayableCardIds()),
              hand: this.props.presenter.getHand(),
            }}
          />
          {this.props.presenter.isShowEndOfRoundReport() && this.renderEndOfRoundReport()}
        </div>
      )
    )
  }

  private renderEndOfRoundReport(): ReactElement {
    const endOfRoundReport = this.props.presenter.getEndOfRoundReport()
    if (!endOfRoundReport) {
      throw Error('Cannot render when there is no end of round report')
    }
    const pickerIndex = this.props.presenter.getPickerIndex()
    if (pickerIndex === undefined) {
      throw Error('Cannot render when there is no picker')
    }

    const endOfRoundViewData: EndOfRoundViewData = {
      players: this.props.presenter.getPlayers().map((player) => {
        return {
          id: player.getId(),
          name: player.getName(),
        }
      }),
      endOfRoundReport,
      pickerIndex,
    }

    return (
      <EndOfRoundReport
        endOfGamePresenter={this.props.presenter}
        endOfRoundData={endOfRoundViewData}
      />
    )
  }

  update = (): void => {
    this.setState({})
  }
}

export default GameBoard

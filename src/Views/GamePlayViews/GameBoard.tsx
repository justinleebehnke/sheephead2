import { Component, ReactElement } from 'react'
import EndOfRoundReport from './EndOfRoundReport/EndOfRoundReport'
import Hand from './Hand'
import IGameBoardPresenter from './IGameBoardPresenter'
import ISubscriber from '../../Entities/ISubscriber'
import PassOrPick from './PassOrPick'
import PlayerLayout from './PlayerLayout/PlayerLayout'

type Props = {
  presenter: IGameBoardPresenter
}

class GameBoard extends Component<Props> implements ISubscriber {
  componentWillMount(): void {
    this.props.presenter.setView(this)
  }

  componentWillUnmount(): void {
    this.props.presenter.unsetView()
  }

  render() {
    return this.props.presenter && this.renderBoard()
  }

  private renderBoard(): ReactElement {
    return (
      <div>
        {this.props.presenter.getGameBoardViewData().passOrPickViewData.isShowingPassOrPickForm && (
          <PassOrPick
            presenter={this.props.presenter}
            data={this.props.presenter.getGameBoardViewData().passOrPickViewData}
          />
        )}
        <PlayerLayout allPlayerData={this.props.presenter.getGameBoardViewData().allPlayerData} />
        <Hand
          presenter={this.props.presenter}
          data={this.props.presenter.getGameBoardViewData().handViewData}
        />
        {this.props.presenter.getGameBoardViewData().endOfRoundViewData.endOfRoundReport !==
          undefined && this.renderEndOfRoundReport()}
      </div>
    )
  }

  private renderEndOfRoundReport(): ReactElement {
    const endOfRoundReport = this.props.presenter.getGameBoardViewData().endOfRoundViewData
      .endOfRoundReport
    if (!endOfRoundReport) {
      throw Error('Cannot render when there is no end of round report')
    }
    const pickerIndex = this.props.presenter.getGameBoardViewData().endOfRoundViewData.pickerIndex
    if (pickerIndex === undefined) {
      throw Error('Cannot render when there is no picker')
    }

    return (
      <EndOfRoundReport
        endOfGamePresenter={this.props.presenter}
        endOfRoundData={this.props.presenter.getGameBoardViewData().endOfRoundViewData}
      />
    )
  }

  update = (): void => {
    this.setState({})
  }
}

export default GameBoard

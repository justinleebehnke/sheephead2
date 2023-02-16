import { Component, ReactElement } from 'react'
import Badge from 'react-bootstrap/esm/Badge'
import EndOfRoundReport from './EndOfRoundReport/EndOfRoundReport'
import Hand from './Hand'
import IGameBoardPresenter from './IGameBoardPresenter'
import ISubscriber from '../../Entities/ISubscriber'
import PassOrPick from './PassOrPick'
import PlayerLayout from './PlayerLayout/PlayerLayout'
import PreviousTrickLayout from './PreviousTrickLayout/PreviousTrickLayout'
import OtherPlayerHandsLayout from './OtherPlayerHandsLayout/OtherPlayerHandsLayout'

const enableFaceUpMode = true

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
      <div id='game-board'>
        {this.props.presenter.getGameBoardViewData().passOrPickViewData.isShowingPassOrPickForm && (
          <PassOrPick
            presenter={this.props.presenter}
            data={this.props.presenter.getGameBoardViewData().passOrPickViewData}
          />
        )}
        {this.props.presenter.getGameBoardViewData().shouldShowDoublesBadge && (
          <h4 className='doubles-badge'>
            <Badge variant='danger'>
              <strong>DOUBLES</strong>
            </Badge>
          </h4>
        )}
        <PlayerLayout allPlayerData={this.props.presenter.getGameBoardViewData().allPlayerData} />
        <PreviousTrickLayout
          allPlayerData={this.props.presenter.getGameBoardViewData().allPlayerData}
        />
        {enableFaceUpMode && <OtherPlayerHandsLayout
          allPlayerData={this.props.presenter.getGameBoardViewData().allPlayerData}
          buryCards={this.props.presenter.getBuryCards()}
        />}
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
    const endOfRoundReport =
      this.props.presenter.getGameBoardViewData().endOfRoundViewData.endOfRoundReport
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

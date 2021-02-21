import { Component, ReactElement } from 'react'
import EndOfRoundReport from './EndOfRoundReport/EndOfRoundReport'
import EndOfRoundViewData from './EndOfRoundReport/EndOfRoundViewData'
import GamePresenter from '../../InterfaceAdapters/GamePresenter/GamePresenter'
import Hand from './Hand'
import ISubscriber from '../../Entities/ISubscriber'
import PassOrPick from './PassOrPick'
import PlayerLayout from './PlayerLayout/PlayerLayout'

// what this guy does
// is he gives me everything that I need to do this stuff...
// a delayed update queue is not going to work...
// I actually need the game presenter to return this on command
// and also to update me when it changes
// but I also need it to be able to give me this information
// and THEN
// I will modify the game presenter
// so that it uses a queue to delay updating this information and update me as it changes
// and then finally I can remove the pausing from the system to try and make this work correctly
// so is does this mean I need a new kind of presenter??

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
    return (
      this.props.presenter && (
        <div>
          {this.props.presenter.isShowingPassOrPickForm() && (
            <PassOrPick
              presenter={this.props.presenter}
              data={this.props.presenter.getGameBoardViewData().passOrPickViewData}
            />
          )}
          <PlayerLayout allPlayerData={this.props.presenter.getGameBoardViewData().allPlayerData} />
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

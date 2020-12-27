import { Component } from 'react'
import EndOfRoundReport from './EndOfRoundReport'
import GamePresenter from '../../InterfaceAdapters/GamePresenter/GamePresenter'
import Hand from './Hand'
import ISubscriber from '../../Entities/ISubscriber'
import PassOrPick from './PassOrPick'
import PlayerLayout from './PlayerLayout'

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
            <PassOrPick presenter={this.props.presenter} />
          )}
          <PlayerLayout presenter={this.props.presenter} />
          <Hand presenter={this.props.presenter} />
          {this.props.presenter.isShowEndOfRoundReport() && (
            <EndOfRoundReport presenter={this.props.presenter} />
          )}
        </div>
      )
    )
  }

  update = (): void => {
    this.setState({})
  }
}

export default GameBoard
